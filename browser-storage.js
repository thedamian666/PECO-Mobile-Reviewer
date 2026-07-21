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
    const angleRows = Array.isArray(project?.angles) ? project.angles : [];
    const expectedProxyCount = Math.max(1, new Set(angleRows.map(row => String(row?.proxy_filename || "").toLowerCase()).filter(Boolean)).size);
    if (proxies.length < expectedProxyCount) {
      throw new Error(`Cannot save the review until all ${expectedProxyCount} proxy file${expectedProxyCount === 1 ? " is" : "s are"} loaded.`);
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
      return restoredPackage(record);
    } finally {
      database.close();
    }
  }

  function restoredPackage(record) {
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
  }

  function packageSummary(record) {
    const project = record?.project || {};
    const metadata = project.package_metadata || {};
    const collaboration = project.collaboration || metadata.review_collaboration || {};
    const reviewCloud = project.review_cloud || metadata.review_cloud || {};
    return {
      projectId: String(record?.projectId || ""),
      name: String(project.project_name || project.name || "PECO Review"),
      reviewMode: String(metadata.review_mode || project.review_mode || (project.angles?.length === 1 ? "notes_only" : "multicam_notes")),
      angleCount: Array.isArray(project.angles) ? project.angles.length : 0,
      durationFrames: Number(project.duration_frames || 0),
      fps: Number(project.fps || 30),
      sourceName: String(record?.sourceName || ""),
      savedAt: String(record?.savedAt || ""),
      sizeBytes: Number(record?.sizeBytes || 0),
      workflow: String(metadata.workflow || ""),
      workflowId: String(collaboration.workflow_id || ""),
      assignedTo: String(collaboration.assigned_to || ""),
      requestedBy: String(collaboration.requested_by || ""),
      instructions: String(collaboration.instructions || ""),
      collaboration,
      reviewCloud
    };
  }

  async function listPackages() {
    const database = await openDatabase();
    try {
      const transaction = database.transaction(PACKAGE_STORE, "readonly");
      const done = transactionDone(transaction);
      const records = await requestResult(transaction.objectStore(PACKAGE_STORE).getAll());
      await done;
      return (records || [])
        .map(packageSummary)
        .filter(row => row.projectId)
        .sort((left, right) => right.savedAt.localeCompare(left.savedAt) || left.name.localeCompare(right.name));
    } finally {
      database.close();
    }
  }

  async function loadPackage(projectId) {
    const id = String(projectId || "").trim();
    if (!id) {
      return null;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction([PACKAGE_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      const record = await requestResult(transaction.objectStore(PACKAGE_STORE).get(id));
      if (record) {
        transaction.objectStore(META_STORE).put({ key: LAST_PACKAGE_KEY, projectId: id });
      }
      await done;
      return restoredPackage(record);
    } finally {
      database.close();
    }
  }

  async function removePackage(projectId) {
    const id = String(projectId || "").trim();
    const database = await openDatabase();
    try {
      const transaction = database.transaction([PACKAGE_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      if (id) {
        transaction.objectStore(PACKAGE_STORE).delete(id);
      } else {
        transaction.objectStore(PACKAGE_STORE).clear();
      }
      transaction.objectStore(META_STORE).delete(LAST_PACKAGE_KEY);
      await done;
    } finally {
      database.close();
    }
    if (id) {
      const remaining = await listPackages();
      if (remaining[0]?.projectId) {
        const nextDatabase = await openDatabase();
        try {
          const transaction = nextDatabase.transaction(META_STORE, "readwrite");
          const done = transactionDone(transaction);
          transaction.objectStore(META_STORE).put({ key: LAST_PACKAGE_KEY, projectId: remaining[0].projectId });
          await done;
        } finally {
          nextDatabase.close();
        }
      }
    }
  }

  global.PecoBrowserStorage = Object.freeze({
    savePackage,
    loadLastPackage,
    listPackages,
    loadPackage,
    removePackage
  });
})(window);
