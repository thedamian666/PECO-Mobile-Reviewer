(function (global) {
  "use strict";

  const DATABASE_NAME = "peco-anywhere-drafts";
  const DATABASE_VERSION = 1;
  const DRAFT_STORE = "drafts";
  const META_STORE = "meta";
  const LAST_KEY = "last-draft";

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("PECO Draft storage request failed.")), { once: true });
    });
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("PECO Draft storage was aborted.")), { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("PECO Draft storage failed.")), { once: true });
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
        if (!database.objectStoreNames.contains(DRAFT_STORE)) {
          database.createObjectStore(DRAFT_STORE, { keyPath: "draftId" });
        }
        if (!database.objectStoreNames.contains(META_STORE)) {
          database.createObjectStore(META_STORE, { keyPath: "key" });
        }
      });
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Could not open PECO Draft storage.")), { once: true });
      request.addEventListener("blocked", () => reject(new Error("PECO Draft storage is blocked by another tab.")), { once: true });
    });
  }

  function serializableAssets(assets, mediaByAssetId) {
    return (assets || []).map(asset => {
      const media = mediaByAssetId.get(asset.asset_id);
      return {
        asset: JSON.parse(JSON.stringify(asset)),
        media: media instanceof Blob ? {
          blob: media,
          name: media.name || asset.name || `${asset.asset_id}.bin`,
          type: media.type || "application/octet-stream",
          lastModified: Number(media.lastModified || Date.now()),
          relativePath: String(media.pecoRelativePath || asset.package_path || "")
        } : null
      };
    });
  }

  function restoreMedia(row) {
    if (!(row?.blob instanceof Blob)) {
      return null;
    }
    const file = new File([row.blob], row.name || "draft-media.bin", {
      type: row.type || row.blob.type || "application/octet-stream",
      lastModified: Number(row.lastModified || Date.now())
    });
    if (row.relativePath) {
      Object.defineProperty(file, "pecoRelativePath", {
        value: String(row.relativePath),
        configurable: false,
        enumerable: true,
        writable: false
      });
    }
    return file;
  }

  function restoredRecord(record) {
    if (!record) {
      return null;
    }
    const mediaByAssetId = new Map();
    const assets = [];
    for (const row of record.assets || []) {
      if (!row?.asset?.asset_id) {
        continue;
      }
      assets.push(row.asset);
      const media = restoreMedia(row.media);
      if (media) {
        mediaByAssetId.set(row.asset.asset_id, media);
      }
    }
    return {
      project: { ...record.project, assets },
      mediaByAssetId,
      savedAt: String(record.savedAt || "")
    };
  }

  async function saveDraft(project, mediaByAssetId) {
    const draftId = String(project?.project_id || "").trim();
    if (!draftId) {
      throw new Error("Cannot save a draft without project_id.");
    }
    try {
      if (navigator.storage?.persist) {
        await navigator.storage.persist();
      }
    } catch {
      // Browser persistence is best effort; normal IndexedDB saving still works.
    }
    const record = {
      draftId,
      project: { ...JSON.parse(JSON.stringify(project)), assets: undefined },
      assets: serializableAssets(project.assets, mediaByAssetId),
      savedAt: new Date().toISOString()
    };
    const database = await openDatabase();
    try {
      const transaction = database.transaction([DRAFT_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      transaction.objectStore(DRAFT_STORE).put(record);
      transaction.objectStore(META_STORE).put({ key: LAST_KEY, draftId });
      await done;
    } finally {
      database.close();
    }
    return record.savedAt;
  }

  async function loadDraft(draftId) {
    const database = await openDatabase();
    try {
      const transaction = database.transaction([DRAFT_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      const record = await requestResult(transaction.objectStore(DRAFT_STORE).get(String(draftId || "")));
      if (record) {
        transaction.objectStore(META_STORE).put({ key: LAST_KEY, draftId: record.draftId });
      }
      await done;
      return restoredRecord(record);
    } finally {
      database.close();
    }
  }

  async function loadLastDraft() {
    const database = await openDatabase();
    let draftId = "";
    try {
      const metaTransaction = database.transaction(META_STORE, "readonly");
      const metaDone = transactionDone(metaTransaction);
      const meta = await requestResult(metaTransaction.objectStore(META_STORE).get(LAST_KEY));
      await metaDone;
      draftId = String(meta?.draftId || "");
    } finally {
      database.close();
    }
    if (!draftId) {
      return null;
    }
    const databaseTwo = await openDatabase();
    try {
      const transaction = databaseTwo.transaction(DRAFT_STORE, "readonly");
      const done = transactionDone(transaction);
      const record = await requestResult(transaction.objectStore(DRAFT_STORE).get(draftId));
      await done;
      return restoredRecord(record);
    } finally {
      databaseTwo.close();
    }
  }

  async function listDrafts() {
    const database = await openDatabase();
    try {
      const transaction = database.transaction(DRAFT_STORE, "readonly");
      const done = transactionDone(transaction);
      const records = await requestResult(transaction.objectStore(DRAFT_STORE).getAll());
      await done;
      return (records || []).map(record => ({
        draftId: record.draftId,
        name: String(record.project?.project_name || "Untitled Draft"),
        clipCount: Array.isArray(record.project?.clips) ? record.project.clips.length : 0,
        savedAt: String(record.savedAt || "")
      })).sort((left, right) => right.savedAt.localeCompare(left.savedAt));
    } finally {
      database.close();
    }
  }

  async function removeDraft(draftId) {
    const database = await openDatabase();
    try {
      const transaction = database.transaction([DRAFT_STORE, META_STORE], "readwrite");
      const done = transactionDone(transaction);
      transaction.objectStore(DRAFT_STORE).delete(String(draftId || ""));
      transaction.objectStore(META_STORE).delete(LAST_KEY);
      await done;
    } finally {
      database.close();
    }
  }

  global.PecoDraftStorage = Object.freeze({ saveDraft, loadDraft, loadLastDraft, listDrafts, removeDraft });
})(window);
