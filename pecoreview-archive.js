(function (global) {
  "use strict";

  const END_SIGNATURE = 0x06054b50;
  const CENTRAL_SIGNATURE = 0x02014b50;
  const LOCAL_SIGNATURE = 0x04034b50;
  const MAX_END_RECORD_BYTES = 65_557;
  const MAX_MANIFEST_BYTES = 10 * 1024 * 1024;
  const UTF8_FLAG = 0x0800;
  const ENCRYPTED_FLAG = 0x0001;
  const STORED_METHOD = 0;
  const DEFLATE_METHOD = 8;

  function dataView(bytes) {
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  async function readBytes(blob) {
    return new Uint8Array(await blob.arrayBuffer());
  }

  function normalizedPath(value) {
    const parts = String(value || "")
      .replace(/\\/g, "/")
      .split("/")
      .filter(part => part && part !== ".");
    if (!parts.length || parts.some(part => part === "..")) {
      throw new Error(`Unsafe archive path: ${value}`);
    }
    return parts.join("/");
  }

  function basename(value) {
    return normalizedPath(value).split("/").pop();
  }

  function decodeFilename(bytes, flags) {
    const encoding = flags & UTF8_FLAG ? "utf-8" : "windows-1252";
    return normalizedPath(new TextDecoder(encoding).decode(bytes));
  }

  function findEndRecord(bytes) {
    const view = dataView(bytes);
    for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
      if (view.getUint32(offset, true) !== END_SIGNATURE) {
        continue;
      }
      const commentLength = view.getUint16(offset + 20, true);
      if (offset + 22 + commentLength === bytes.length) {
        return offset;
      }
    }
    throw new Error("This is not a readable .pecoreview ZIP archive.");
  }

  async function readDirectory(file) {
    if (!(file instanceof Blob) || file.size < 22) {
      throw new Error("The selected .pecoreview file is empty or invalid.");
    }
    const tailStart = Math.max(0, file.size - MAX_END_RECORD_BYTES);
    const tail = await readBytes(file.slice(tailStart));
    const endOffset = findEndRecord(tail);
    const end = dataView(tail);
    const diskNumber = end.getUint16(endOffset + 4, true);
    const directoryDisk = end.getUint16(endOffset + 6, true);
    const entriesOnDisk = end.getUint16(endOffset + 8, true);
    const entryCount = end.getUint16(endOffset + 10, true);
    const directorySize = end.getUint32(endOffset + 12, true);
    const directoryOffset = end.getUint32(endOffset + 16, true);
    if (diskNumber !== 0 || directoryDisk !== 0 || entriesOnDisk !== entryCount) {
      throw new Error("Multi-part .pecoreview archives are not supported.");
    }
    if (
      entryCount === 0xffff
      || directorySize === 0xffffffff
      || directoryOffset === 0xffffffff
    ) {
      throw new Error("ZIP64 .pecoreview archives are not supported yet. Export one match per package.");
    }
    if (directoryOffset + directorySize > file.size) {
      throw new Error("The .pecoreview directory is outside the selected file.");
    }

    const bytes = await readBytes(file.slice(directoryOffset, directoryOffset + directorySize));
    const view = dataView(bytes);
    const entries = [];
    let offset = 0;
    while (offset < bytes.length && entries.length < entryCount) {
      if (offset + 46 > bytes.length || view.getUint32(offset, true) !== CENTRAL_SIGNATURE) {
        throw new Error("The .pecoreview directory is damaged.");
      }
      const flags = view.getUint16(offset + 8, true);
      const method = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const uncompressedSize = view.getUint32(offset + 24, true);
      const filenameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localHeaderOffset = view.getUint32(offset + 42, true);
      const nextOffset = offset + 46 + filenameLength + extraLength + commentLength;
      if (nextOffset > bytes.length) {
        throw new Error("A .pecoreview directory entry is truncated.");
      }
      const name = decodeFilename(bytes.subarray(offset + 46, offset + 46 + filenameLength), flags);
      if (!name.endsWith("/")) {
        entries.push({
          name,
          flags,
          method,
          compressedSize,
          uncompressedSize,
          localHeaderOffset
        });
      }
      offset = nextOffset;
    }
    if (entries.length !== entryCount) {
      throw new Error(`Expected ${entryCount} archive entries but found ${entries.length}.`);
    }
    return entries;
  }

  async function entryDataBlob(file, entry, type = "application/octet-stream") {
    if (entry.flags & ENCRYPTED_FLAG) {
      throw new Error(`${entry.name} is encrypted. PECO review packages cannot be password protected.`);
    }
    const headerBytes = await readBytes(file.slice(entry.localHeaderOffset, entry.localHeaderOffset + 30));
    if (headerBytes.length !== 30 || dataView(headerBytes).getUint32(0, true) !== LOCAL_SIGNATURE) {
      throw new Error(`The local ZIP header for ${entry.name} is invalid.`);
    }
    const header = dataView(headerBytes);
    const filenameLength = header.getUint16(26, true);
    const extraLength = header.getUint16(28, true);
    const dataOffset = entry.localHeaderOffset + 30 + filenameLength + extraLength;
    const dataEnd = dataOffset + entry.compressedSize;
    if (dataEnd > file.size) {
      throw new Error(`${entry.name} extends past the end of the package.`);
    }
    const source = file.slice(dataOffset, dataEnd, type);
    if (entry.method === STORED_METHOD) {
      if (entry.compressedSize !== entry.uncompressedSize) {
        throw new Error(`${entry.name} has inconsistent stored sizes.`);
      }
      return source;
    }
    if (entry.method !== DEFLATE_METHOD) {
      throw new Error(`${entry.name} uses unsupported ZIP compression method ${entry.method}.`);
    }
    if (typeof DecompressionStream !== "function") {
      throw new Error("This browser cannot unpack compressed review packages. Update the browser or rebuild the package with the current PECO package builder.");
    }
    let output;
    try {
      const stream = source.stream().pipeThrough(new DecompressionStream("deflate-raw"));
      output = await new Response(stream).blob();
    } catch (error) {
      throw new Error(`Could not decompress ${entry.name}: ${error.message}`);
    }
    if (output.size !== entry.uncompressedSize) {
      throw new Error(`${entry.name} unpacked to ${output.size} bytes; expected ${entry.uncompressedSize}.`);
    }
    return output.slice(0, output.size, type);
  }

  function mediaType(name) {
    const lower = String(name).toLowerCase();
    if (lower.endsWith(".mp4") || lower.endsWith(".m4v")) {
      return "video/mp4";
    }
    if (lower.endsWith(".webm")) {
      return "video/webm";
    }
    if (lower.endsWith(".mov")) {
      return "video/quicktime";
    }
    if (lower.endsWith(".mkv")) {
      return "video/x-matroska";
    }
    return "application/octet-stream";
  }

  function findEntry(entries, requestedPath) {
    const requested = normalizedPath(requestedPath).toLowerCase();
    const exact = entries.find(entry => entry.name.toLowerCase() === requested);
    if (exact) {
      return exact;
    }
    const requestedBase = basename(requested).toLowerCase();
    const matches = entries.filter(entry => basename(entry.name).toLowerCase() === requestedBase);
    return matches.length === 1 ? matches[0] : null;
  }

  function proxyNames(project) {
    const rows = Array.isArray(project.angles)
      ? project.angles
      : Array.isArray(project.source_clip_mapping)
        ? project.source_clip_mapping
        : Array.isArray(project.cameras)
          ? project.cameras
          : [];
    return rows
      .map(row => String(row?.proxy_filename || row?.proxy || row?.proxy_path || "").trim())
      .filter(Boolean);
  }

  function makeProxyFile(blob, proxyPath, packageFile) {
    const file = new File([blob], basename(proxyPath), {
      type: mediaType(proxyPath),
      lastModified: packageFile.lastModified || Date.now()
    });
    Object.defineProperty(file, "pecoRelativePath", {
      value: normalizedPath(proxyPath),
      configurable: false,
      enumerable: true,
      writable: false
    });
    return file;
  }

  async function readPackage(file, options = {}) {
    const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};
    onProgress("Reading package directory...");
    const entries = await readDirectory(file);
    const manifestEntry = entries.find(entry => /(^|\/)(project|manifest)\.json$/i.test(entry.name));
    if (!manifestEntry) {
      throw new Error("The .pecoreview package does not contain project.json.");
    }
    if (manifestEntry.uncompressedSize > MAX_MANIFEST_BYTES) {
      throw new Error("The package manifest is unexpectedly large.");
    }
    const manifestBlob = await entryDataBlob(file, manifestEntry, "application/json");
    let project;
    try {
      project = JSON.parse(await manifestBlob.text());
    } catch (error) {
      throw new Error(`Could not read ${manifestEntry.name}: ${error.message}`);
    }
    const requestedProxies = proxyNames(project);
    const reviewMode = String(project?.package_metadata?.review_mode || "").trim().toLowerCase();
    const minimumProxyCount = reviewMode === "notes_only" ? 1 : 2;
    if (requestedProxies.length < minimumProxyCount) {
      throw new Error(reviewMode === "notes_only"
        ? "The notes package manifest needs one proxy video."
        : "The multicam package manifest needs at least two proxy angles.");
    }

    const proxyFiles = [];
    const warnings = [];
    for (let index = 0; index < requestedProxies.length; index += 1) {
      const proxyPath = requestedProxies[index];
      const entry = findEntry(entries, proxyPath);
      if (!entry) {
        throw new Error(`The package is missing proxy media: ${proxyPath}`);
      }
      onProgress(`Opening proxy ${index + 1} of ${requestedProxies.length}...`);
      if (entry.method === DEFLATE_METHOD) {
        warnings.push(`${proxyPath} is compressed and may need extra memory while opening.`);
      }
      const blob = await entryDataBlob(file, entry, mediaType(proxyPath));
      proxyFiles.push(makeProxyFile(blob, proxyPath, file));
    }
    return {
      project,
      proxyFiles,
      sourceName: file.name,
      warnings
    };
  }

  global.PecoReviewArchive = Object.freeze({
    readPackage,
    readDirectory
  });
})(window);
