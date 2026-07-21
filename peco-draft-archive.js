(function (global) {
  "use strict";

  const LOCAL_SIGNATURE = 0x04034b50;
  const CENTRAL_SIGNATURE = 0x02014b50;
  const END_SIGNATURE = 0x06054b50;
  const UTF8_FLAG = 0x0800;
  const STORED_METHOD = 0;
  const DEFLATE_METHOD = 8;
  const MAX_ENTRY_BYTES = 0xffffffff;
  const MAX_ENTRIES = 0xffff;
  const MAX_MANIFEST_BYTES = 10 * 1024 * 1024;
  const CRC_TABLE = buildCrcTable();

  function buildCrcTable() {
    const table = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) {
        value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
      }
      table[index] = value >>> 0;
    }
    return table;
  }

  function normalizedPath(value) {
    const parts = String(value || "").replace(/\\/g, "/").split("/").filter(part => part && part !== ".");
    if (!parts.length || parts.some(part => part === "..")) {
      throw new Error(`Unsafe .pecodraft path: ${value}`);
    }
    return parts.join("/");
  }

  function safeFilename(value) {
    const name = String(value || "media.bin").replace(/\\/g, "/").split("/").pop();
    return name.replace(/[^A-Za-z0-9._ -]+/g, "_").replace(/^[ .]+|[ .]+$/g, "") || "media.bin";
  }

  function mediaType(name) {
    const lower = String(name || "").toLowerCase();
    if (/\.(mp4|m4v)$/.test(lower)) return "video/mp4";
    if (lower.endsWith(".webm")) return "video/webm";
    if (lower.endsWith(".mov")) return "video/quicktime";
    if (lower.endsWith(".mp3")) return "audio/mpeg";
    if (lower.endsWith(".wav")) return "audio/wav";
    if (lower.endsWith(".png")) return "image/png";
    if (/\.(jpe?g)$/.test(lower)) return "image/jpeg";
    return "application/octet-stream";
  }

  function dosDateTime(dateValue = new Date()) {
    const date = dateValue instanceof Date && !Number.isNaN(dateValue.valueOf()) ? dateValue : new Date();
    const year = Math.max(1980, date.getFullYear());
    return {
      time: ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | (Math.floor(date.getSeconds() / 2) & 31),
      date: (((year - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31)
    };
  }

  async function blobCrc32(blob) {
    let crc = 0xffffffff;
    const reader = blob.stream().getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        for (const byte of value) {
          crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
        }
      }
    } finally {
      reader.releaseLock();
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function localHeader(entry) {
    const name = entry.nameBytes;
    const bytes = new Uint8Array(30 + name.length);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, LOCAL_SIGNATURE, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, UTF8_FLAG, true);
    view.setUint16(8, STORED_METHOD, true);
    view.setUint16(10, entry.dos.time, true);
    view.setUint16(12, entry.dos.date, true);
    view.setUint32(14, entry.crc, true);
    view.setUint32(18, entry.size, true);
    view.setUint32(22, entry.size, true);
    view.setUint16(26, name.length, true);
    view.setUint16(28, 0, true);
    bytes.set(name, 30);
    return bytes;
  }

  function centralHeader(entry) {
    const name = entry.nameBytes;
    const bytes = new Uint8Array(46 + name.length);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, CENTRAL_SIGNATURE, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, UTF8_FLAG, true);
    view.setUint16(10, STORED_METHOD, true);
    view.setUint16(12, entry.dos.time, true);
    view.setUint16(14, entry.dos.date, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.size, true);
    view.setUint32(24, entry.size, true);
    view.setUint16(28, name.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, entry.offset, true);
    bytes.set(name, 46);
    return bytes;
  }

  function endRecord(entryCount, directorySize, directoryOffset) {
    const bytes = new Uint8Array(22);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, END_SIGNATURE, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, entryCount, true);
    view.setUint16(10, entryCount, true);
    view.setUint32(12, directorySize, true);
    view.setUint32(16, directoryOffset, true);
    view.setUint16(20, 0, true);
    return bytes;
  }

  async function writePackage(manifest, mediaByAssetId, options = {}) {
    const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};
    const payload = JSON.parse(JSON.stringify(manifest || {}));
    const media = mediaByAssetId instanceof Map ? mediaByAssetId : new Map();
    const entries = [];
    const usedPaths = new Set();
    for (const asset of payload.assets || []) {
      const assetId = String(asset?.asset_id || "").trim();
      const blob = media.get(assetId);
      if (!(blob instanceof Blob)) {
        if (!String(asset?.source_asset_id || "").trim()) {
          throw new Error(`Browser-created media is missing: ${asset?.name || assetId}`);
        }
        continue;
      }
      const base = `${safeFilename(assetId)}_${safeFilename(blob.name || asset.name)}`;
      let path = `media/${base}`;
      let suffix = 2;
      while (usedPaths.has(path.toLowerCase())) {
        const extensionIndex = base.lastIndexOf(".");
        path = extensionIndex > 0
          ? `media/${base.slice(0, extensionIndex)}_${suffix}${base.slice(extensionIndex)}`
          : `media/${base}_${suffix}`;
        suffix += 1;
      }
      usedPaths.add(path.toLowerCase());
      asset.package_path = path;
      asset.proxy_filename = path;
      entries.push({ name: path, blob, modified: new Date(Number(blob.lastModified || Date.now())) });
    }
    payload.package_metadata = { ...(payload.package_metadata || {}), packaged_media_count: entries.length };
    const manifestBlob = new Blob([JSON.stringify(payload, null, 2) + "\n"], { type: "application/json" });
    entries.unshift({ name: "manifest.json", blob: manifestBlob, modified: new Date() });
    entries.push({
      name: "README.txt",
      blob: new Blob([
        "PECO Anywhere Draft\n\nOpen in PECO Mobile Reviewer > Draft, or import into PECO NLE. " +
        "Desktop imports create a new timeline and preserve the original.\n"
      ], { type: "text/plain" }),
      modified: new Date()
    });
    if (entries.length >= MAX_ENTRIES) {
      throw new Error("This draft contains too many files for the portable ZIP format.");
    }
    const encoder = new TextEncoder();
    let offset = 0;
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      if (entry.blob.size > MAX_ENTRY_BYTES) {
        throw new Error(`${entry.name} is larger than the current 4 GB portable draft limit.`);
      }
      onProgress(`Preparing ${index + 1} of ${entries.length}: ${entry.name}`);
      entry.name = normalizedPath(entry.name);
      entry.nameBytes = encoder.encode(entry.name);
      entry.size = entry.blob.size;
      entry.crc = await blobCrc32(entry.blob);
      entry.dos = dosDateTime(entry.modified);
      entry.offset = offset;
      entry.header = localHeader(entry);
      offset += entry.header.byteLength + entry.size;
      if (offset > MAX_ENTRY_BYTES) {
        throw new Error("This draft is larger than the current 4 GB portable archive limit.");
      }
    }
    const directoryOffset = offset;
    const directory = entries.map(centralHeader);
    const directorySize = directory.reduce((total, bytes) => total + bytes.byteLength, 0);
    const parts = [];
    for (const entry of entries) {
      parts.push(entry.header, entry.blob);
    }
    parts.push(...directory, endRecord(entries.length, directorySize, directoryOffset));
    return new Blob(parts, { type: "application/zip" });
  }

  async function readBytes(blob) {
    return new Uint8Array(await blob.arrayBuffer());
  }

  function findEndRecord(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
      if (view.getUint32(offset, true) === END_SIGNATURE && offset + 22 + view.getUint16(offset + 20, true) === bytes.length) {
        return offset;
      }
    }
    throw new Error("This is not a readable .pecodraft ZIP archive.");
  }

  async function readDirectory(file) {
    if (!(file instanceof Blob) || file.size < 22) {
      throw new Error("The selected .pecodraft is empty or invalid.");
    }
    const tailStart = Math.max(0, file.size - 65_557);
    const tail = await readBytes(file.slice(tailStart));
    const endOffset = findEndRecord(tail);
    const end = new DataView(tail.buffer, tail.byteOffset, tail.byteLength);
    const count = end.getUint16(endOffset + 10, true);
    const directorySize = end.getUint32(endOffset + 12, true);
    const directoryOffset = end.getUint32(endOffset + 16, true);
    if (count === MAX_ENTRIES || directorySize === MAX_ENTRY_BYTES || directoryOffset === MAX_ENTRY_BYTES) {
      throw new Error("ZIP64 .pecodraft archives are not supported yet.");
    }
    const bytes = await readBytes(file.slice(directoryOffset, directoryOffset + directorySize));
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const decoder = new TextDecoder("utf-8");
    const entries = [];
    let offset = 0;
    while (entries.length < count) {
      if (offset + 46 > bytes.length || view.getUint32(offset, true) !== CENTRAL_SIGNATURE) {
        throw new Error("The .pecodraft directory is damaged.");
      }
      const flags = view.getUint16(offset + 8, true);
      const method = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const uncompressedSize = view.getUint32(offset + 24, true);
      const nameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localOffset = view.getUint32(offset + 42, true);
      const name = normalizedPath(decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength)));
      entries.push({ name, flags, method, compressedSize, uncompressedSize, localOffset });
      offset += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
  }

  async function entryBlob(file, entry, type) {
    const header = await readBytes(file.slice(entry.localOffset, entry.localOffset + 30));
    const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
    if (header.length !== 30 || view.getUint32(0, true) !== LOCAL_SIGNATURE) {
      throw new Error(`Invalid local header for ${entry.name}.`);
    }
    const nameLength = view.getUint16(26, true);
    const extraLength = view.getUint16(28, true);
    const start = entry.localOffset + 30 + nameLength + extraLength;
    const compressed = file.slice(start, start + entry.compressedSize, type || "application/octet-stream");
    if (entry.method === STORED_METHOD) {
      return compressed;
    }
    if (entry.method !== DEFLATE_METHOD || typeof DecompressionStream !== "function") {
      throw new Error(`${entry.name} uses an unsupported ZIP compression method.`);
    }
    const stream = compressed.stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const output = await new Response(stream).blob();
    if (output.size !== entry.uncompressedSize) {
      throw new Error(`${entry.name} unpacked to the wrong size.`);
    }
    return output.slice(0, output.size, type || "application/octet-stream");
  }

  async function readPackage(file, options = {}) {
    const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};
    onProgress("Reading .pecodraft directory...");
    const entries = await readDirectory(file);
    const manifestEntry = entries.find(entry => /(^|\/)(manifest|draft)\.json$/i.test(entry.name));
    if (!manifestEntry || manifestEntry.uncompressedSize > MAX_MANIFEST_BYTES) {
      throw new Error("The .pecodraft package is missing a readable manifest.json.");
    }
    const manifestBlob = await entryBlob(file, manifestEntry, "application/json");
    const manifest = JSON.parse(await manifestBlob.text());
    if (!["peco.browser_edit_project.v1", "peco.browser_edit_return.v1"].includes(String(manifest?.schema || ""))) {
      throw new Error(`Unsupported PECO Anywhere Draft schema: ${manifest?.schema || "missing"}`);
    }
    const byPath = new Map(entries.map(entry => [entry.name.toLowerCase(), entry]));
    const mediaByAssetId = new Map();
    const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
    for (let index = 0; index < assets.length; index += 1) {
      const asset = assets[index];
      const path = String(asset?.package_path || asset?.proxy_filename || "").trim();
      if (!path) continue;
      const entry = byPath.get(normalizedPath(path).toLowerCase());
      if (!entry) {
        if (!String(asset?.source_asset_id || "").trim()) {
          throw new Error(`The package is missing browser-created media: ${asset?.name || asset?.asset_id}`);
        }
        continue;
      }
      onProgress(`Opening media ${index + 1} of ${assets.length}...`);
      const blob = await entryBlob(file, entry, mediaType(path));
      const media = new File([blob], safeFilename(asset.name || path), {
        type: mediaType(path),
        lastModified: Number(file.lastModified || Date.now())
      });
      Object.defineProperty(media, "pecoRelativePath", { value: normalizedPath(path), enumerable: true });
      mediaByAssetId.set(String(asset.asset_id), media);
    }
    return { manifest, mediaByAssetId, sourceName: file.name };
  }

  global.PecoDraftArchive = Object.freeze({ writePackage, readPackage, readDirectory });
})(window);
