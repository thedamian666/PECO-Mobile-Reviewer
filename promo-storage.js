(function (global) {
  "use strict";

  const DATABASE_NAME = "peco-promo-studio";
  const DATABASE_VERSION = 1;
  const PROJECT_STORE = "projects";
  const META_STORE = "meta";
  const LAST_KEY = "last-promo-project";

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Promo Studio storage request failed.")), { once: true });
    });
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Promo Studio storage was aborted.")), { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Promo Studio storage failed.")), { once: true });
    });
  }

  function openDatabase() {
    if (!("indexedDB" in global)) return Promise.reject(new Error("This browser does not provide IndexedDB storage."));
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.addEventListener("upgradeneeded", () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(PROJECT_STORE)) database.createObjectStore(PROJECT_STORE, { keyPath: "projectId" });
        if (!database.objectStoreNames.contains(META_STORE)) database.createObjectStore(META_STORE, { keyPath: "key" });
      });
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Could not open Promo Studio storage.")), { once: true });
      request.addEventListener("blocked", () => reject(new Error("Promo Studio storage is blocked by another tab.")), { once: true });
    });
  }

  function storedAssets(project, mediaByAssetId) {
    return (project.assets || []).map(asset => {
      const media = mediaByAssetId.get(asset.asset_id);
      return {
        asset: JSON.parse(JSON.stringify(asset)),
        media: media instanceof Blob ? {
          blob: media,
          name: media.name || asset.name || `${asset.asset_id}.webm`,
          type: media.type || "video/webm",
          lastModified: Number(media.lastModified || Date.now()),
          relativePath: String(media.pecoRelativePath || asset.package_path || "")
        } : null
      };
    });
  }

  function restoredMedia(row) {
    if (!(row?.blob instanceof Blob)) return null;
    const file = new File([row.blob], row.name || "promo-take.webm", {
      type: row.type || row.blob.type || "video/webm",
      lastModified: Number(row.lastModified || Date.now())
    });
    if (row.relativePath) Object.defineProperty(file, "pecoRelativePath", { value: String(row.relativePath), enumerable: true });
    return file;
  }

  function restoreRecord(record) {
    if (!record) return null;
    const mediaByAssetId = new Map();
    const assets = [];
    for (const row of record.assets || []) {
      if (!row?.asset?.asset_id) continue;
      assets.push(row.asset);
      const media = restoredMedia(row.media);
      if (media) mediaByAssetId.set(row.asset.asset_id, media);
    }
    return {
      project: { ...record.project, assets },
      mediaByAssetId,
      savedAt: String(record.savedAt || "")
    };
  }

  async function saveProject(project, mediaByAssetId) {
    const projectId = String(project?.project_id || "").trim();
    if (!projectId) throw new Error("Cannot save a promo without project_id.");
    try {
      if (navigator.storage?.persist) await navigator.storage.persist();
    } catch {
      // Persistent storage is best effort. IndexedDB still provides recovery.
    }
    const record = {
      projectId,
      project: { ...JSON.parse(JSON.stringify(project)), assets: undefined },
      assets: storedAssets(project, mediaByAssetId),
      savedAt: new Date().toISOString()
    };
    const database = await openDatabase();
    try {
      const transaction = database.transaction([PROJECT_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      transaction.objectStore(PROJECT_STORE).put(record);
      transaction.objectStore(META_STORE).put({ key: LAST_KEY, projectId });
      await done;
    } finally {
      database.close();
    }
    return record.savedAt;
  }

  async function loadProject(projectId) {
    const database = await openDatabase();
    try {
      const transaction = database.transaction([PROJECT_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      const record = await requestResult(transaction.objectStore(PROJECT_STORE).get(String(projectId || "")));
      if (record) transaction.objectStore(META_STORE).put({ key: LAST_KEY, projectId: record.projectId });
      await done;
      return restoreRecord(record);
    } finally {
      database.close();
    }
  }

  async function loadLastProject() {
    const database = await openDatabase();
    let projectId = "";
    try {
      const transaction = database.transaction(META_STORE, "readonly");
      const done = transactionDone(transaction);
      const meta = await requestResult(transaction.objectStore(META_STORE).get(LAST_KEY));
      await done;
      projectId = String(meta?.projectId || "");
    } finally {
      database.close();
    }
    return projectId ? loadProject(projectId) : null;
  }

  async function listProjects() {
    const database = await openDatabase();
    try {
      const transaction = database.transaction(PROJECT_STORE, "readonly");
      const done = transactionDone(transaction);
      const records = await requestResult(transaction.objectStore(PROJECT_STORE).getAll());
      await done;
      return (records || []).map(record => ({
        projectId: record.projectId,
        name: String(record.project?.project_name || "Untitled Wrestling Promo"),
        takeCount: Array.isArray(record.assets) ? record.assets.length : 0,
        clipCount: Array.isArray(record.project?.clips) ? record.project.clips.length : 0,
        savedAt: String(record.savedAt || "")
      })).sort((left, right) => right.savedAt.localeCompare(left.savedAt));
    } finally {
      database.close();
    }
  }

  global.PecoPromoStorage = Object.freeze({ saveProject, loadProject, loadLastProject, listProjects });
})(window);
