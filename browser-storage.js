(function (global) {
  "use strict";

  const DATABASE_NAME = "peco-mobile-reviewer";
  const DATABASE_VERSION = 1;
  const PACKAGE_STORE = "packages";
  const META_STORE = "meta";
  const LAST_PACKAGE_KEY = "last-package";

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Browser storage request failed.")), { once: true });
    });
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Browser storage transaction was aborted.")), { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Browser storage transaction failed.")), { once: true });
    });
  }

  function openDatabase() {
    if (!("indexedDB" in global)) {
      return Promise.reject(new Error("This browser does not provide IndexedDB storage."));
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.addEventListener("upgradeneeded", () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(PACKAGE_STORE)) {
          database.createObjectStore(PACKAGE_STORE, { keyPath: "projectId" });
        }
        if (!database.objectStoreNames.contains(META_STORE)) {
          database.createObjectStore(META_STORE, { keyPath: "key" });
        }
      });
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Could not open browser storage.")), { once: true });
      request.addEventListener("blocked", () => reject(new Error("Browser storage is blocked by another PECO tab.")), { once: true });
    });
  }

  function projectIdentity(project) {
    return String(project?.project_id || project?.id || "").trim();
  }

  function proxyPath(file) {
    return String(file?.pecoRelativePath || file?.webkitRelativePath || file?.name || "").replace(/\\/g, "/");
  }

  function proxyRows(files) {
    const seen = new Set();
    const rows = [];
    for (const file of files || []) {
      const path = proxyPath(file);
      if (!(file instanceof Blob) || !path || seen.has(path.toLowerCase())) {
        continue;
      }
      seen.add(path.toLowerCase());
      rows.push({
        path,
        name: file.name || path.split("/").pop(),
        type: file.type || "application/octet-stream",
        lastModified: Number(file.lastModified || Date.now()),
        blob: file
      });
    }
    return rows;
  }

  async function requestPersistentStorage() {
    try {
      if (navigator.storage?.persist) {
        return Boolean(await navigator.storage.persist());
      }
    } catch {
      // Persistence is a browser policy decision. The package can still be stored normally.
    }
    return false;
  }

  async function savePackage(project, files, options = {}) {
    const projectId = projectIdentity(project);
    if (!projectId) {
      throw new Error("Cannot save a package without project_id.");
    }
    const proxies = proxyRows(files);
    if (proxies.length < 2) {
      throw new Error("Cannot save the package until both proxy files are loaded.");
    }
    const persistent = await requestPersistentStorage();
    const record = {
      projectId,
      project,
      proxies,
      sourceName: String(options.sourceName || ""),
      savedAt: new Date().toISOString(),
      sizeBytes: proxies.reduce((total, row) => total + row.blob.size, 0)
    };
    const database = await openDatabase();
    try {
      const transaction = database.transaction([PACKAGE_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      transaction.objectStore(PACKAGE_STORE).clear();
      transaction.objectStore(PACKAGE_STORE).put(record);
      transaction.objectStore(META_STORE).put({ key: LAST_PACKAGE_KEY, projectId });
      await done;
    } finally {
      database.close();
    }
    return { projectId, persistent, sizeBytes: record.sizeBytes };
  }

  function restoreProxyFile(row) {
    const file = new File([row.blob], row.name || row.path.split("/").pop(), {
      type: row.type || row.blob.type || "application/octet-stream",
      lastModified: Number(row.lastModified || Date.now())
    });
    Object.defineProperty(file, "pecoRelativePath", {
      value: row.path,
      configurable: false,
      enumerable: true,
      writable: false
    });
    return file;
  }

  async function loadLastPackage() {
    const database = await openDatabase();
    try {
      const metaTransaction = database.transaction(META_STORE, "readonly");
      const metaDone = transactionDone(metaTransaction);
      const meta = await requestResult(metaTransaction.objectStore(META_STORE).get(LAST_PACKAGE_KEY));
      await metaDone;
      if (!meta?.projectId) {
        return null;
      }
      const packageTransaction = database.transaction(PACKAGE_STORE, "readonly");
      const packageDone = transactionDone(packageTransaction);
      const record = await requestResult(packageTransaction.objectStore(PACKAGE_STORE).get(meta.projectId));
      await packageDone;
      if (!record) {
        return null;
      }
      return {
        project: record.project,
        proxyFiles: (record.proxies || []).map(restoreProxyFile),
        sourceName: record.sourceName || "",
        savedAt: record.savedAt || "",
        sizeBytes: Number(record.sizeBytes || 0)
      };
    } finally {
      database.close();
    }
  }

  async function removePackage(projectId) {
    const database = await openDatabase();
    try {
      const transaction = database.transaction([PACKAGE_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      if (projectId) {
        transaction.objectStore(PACKAGE_STORE).delete(String(projectId));
      } else {
        transaction.objectStore(PACKAGE_STORE).clear();
      }
      transaction.objectStore(META_STORE).delete(LAST_PACKAGE_KEY);
      await done;
    } finally {
      database.close();
    }
  }

  global.PecoBrowserStorage = Object.freeze({
    savePackage,
    loadLastPackage,
    removePackage
  });
})(window);
