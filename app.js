const PROJECT_SCHEMA = "peco.mobile_multicam_project.v1";
const CUTS_SCHEMA = "peco.mobile_multicam_decisions.v1";
const NOTES_SCHEMA = "peco.mobile_review_notes.v1";
const APP_VERSION = "0.1.15";
const APP_VERSION_CODE = 16;
const APP_BUILD_ID = `${APP_VERSION}-${APP_VERSION_CODE}`;
const APP_BUILD_STORAGE_KEY = "peco_mobile_reviewer_app_build";
const APP_CACHE_PREFIX = "peco-mobile-multicam-shell-";
const PROJECT_STATE_STORAGE_PREFIX = "peco_mobile_reviewer_project_state:";
const PROJECT_RETURN_STORAGE_PREFIX = "peco_mobile_reviewer_return_sent:";
const DOUBLE_TAP_MS = 320;
const EDGE_TAP_RATIO = 0.35;
const EDGE_SEEK_SECONDS = 5;
const VIDEO_SYNC_INTERVAL_MS = 250;
const PROGRAM_SOFT_SYNC_TOLERANCE_SECONDS = 0.055;
const PROGRAM_HARD_SYNC_TOLERANCE_SECONDS = 0.45;
const PREVIEW_SOFT_SYNC_TOLERANCE_SECONDS = 0.1;
const PREVIEW_HARD_SYNC_TOLERANCE_SECONDS = 0.7;
const SYNC_RATE_ADJUSTMENT = 0.035;
const ANGLE_SWIPE_MIN_PX = 72;
const ANGLE_SWIPE_MAX_VERTICAL_PX = 54;
const JOG_MAX_DRAG_PX = 180;
const JOG_CENTER_DEADZONE_PX = 10;
const JOG_FRAME_SCRUB_PX = 72;
const JOG_SHUTTLE_SPEEDS = [2, 4, 8];
const MARKER_CATEGORIES = [
  { id: "note", label: "Edit Note", color: "#38bdf8" },
  { id: "tighten", label: "Cut / Tighten", color: "#f59e0b" },
  { id: "audio", label: "Audio", color: "#22d3ee" },
  { id: "graphic", label: "Graphic / Text", color: "#f472b6" },
  { id: "short", label: "Short / Thumbnail", color: "#fb7185" },
  { id: "keep", label: "Keep", color: "#4ade80" }
];
const WRESTLING_MARKER_CATEGORIES = [
  { id: "bad_floater", label: "Bad Floater", color: "#ef4444" },
  { id: "hardcam_safer", label: "Hard Cam Safer", color: "#facc15" }
];

const elements = {
  projectLine: document.getElementById("projectLine"),
  loadPackageButton: document.getElementById("loadPackageButton"),
  reviewLibraryButton: document.getElementById("reviewLibraryButton"),
  saveStateButton: document.getElementById("saveStateButton"),
  removePackageButton: document.getElementById("removePackageButton"),
  exportButton: document.getElementById("exportButton"),
  saveServerButton: document.getElementById("saveServerButton"),
  reviewerInput: document.getElementById("reviewerInput"),
  packageInput: document.getElementById("packageInput"),
  viewerFrame: document.getElementById("viewerFrame"),
  emptyOpenReviewButton: document.getElementById("emptyOpenReviewButton"),
  emptyReviewLibraryButton: document.getElementById("emptyReviewLibraryButton"),
  programVideoStack: document.getElementById("programVideoStack"),
  mainVideo: document.getElementById("mainVideo"),
  audioMaster: document.getElementById("audioMaster"),
  viewerEmpty: document.getElementById("viewerEmpty"),
  skipFeedback: document.getElementById("skipFeedback"),
  addNoteButton: document.getElementById("addNoteButton"),
  activeAngleLabel: document.getElementById("activeAngleLabel"),
  timecodeLabel: document.getElementById("timecodeLabel"),
  timelineSlider: document.getElementById("timelineSlider"),
  gridToggle: document.getElementById("gridToggle"),
  angleGrid: document.getElementById("angleGrid"),
  mobileAnglePreviewGrid: document.getElementById("mobileAnglePreviewGrid"),
  decisionList: document.getElementById("decisionList"),
  mobileDecisionList: document.getElementById("mobileDecisionList"),
  markerList: document.getElementById("markerList"),
  mobileMarkerList: document.getElementById("mobileMarkerList"),
  markerCount: document.getElementById("markerCount"),
  decisionSelectionMenu: document.getElementById("decisionSelectionMenu"),
  selectionSummary: document.getElementById("selectionSummary"),
  deleteSelectedDecisionsButton: document.getElementById("deleteSelectedDecisionsButton"),
  clearDecisionSelectionButton: document.getElementById("clearDecisionSelectionButton"),
  markerSelectionMenu: document.getElementById("markerSelectionMenu"),
  markerSelectionSummary: document.getElementById("markerSelectionSummary"),
  deleteSelectedMarkersButton: document.getElementById("deleteSelectedMarkersButton"),
  clearMarkerSelectionButton: document.getElementById("clearMarkerSelectionButton"),
  previewActionMenu: document.getElementById("previewActionMenu"),
  previewActionSummary: document.getElementById("previewActionSummary"),
  markerCategoryButtons: document.getElementById("markerCategoryButtons"),
  markerNoteInput: document.getElementById("markerNoteInput"),
  saveMarkerButton: document.getElementById("saveMarkerButton"),
  closePreviewActionMenuButton: document.getElementById("closePreviewActionMenuButton"),
  undoDecisionButton: document.getElementById("undoDecisionButton"),
  redoDecisionButton: document.getElementById("redoDecisionButton"),
  mobileLoadPackageButton: document.getElementById("mobileLoadPackageButton"),
  mobileReviewLibraryButton: document.getElementById("mobileReviewLibraryButton"),
  mobileSaveStateButton: document.getElementById("mobileSaveStateButton"),
  mobileRemovePackageButton: document.getElementById("mobileRemovePackageButton"),
  mobileUndoDecisionButton: document.getElementById("mobileUndoDecisionButton"),
  mobileRedoDecisionButton: document.getElementById("mobileRedoDecisionButton"),
  mobileSaveServerButton: document.getElementById("mobileSaveServerButton"),
  mobileExportButton: document.getElementById("mobileExportButton"),
  jumpStartButton: document.getElementById("jumpStartButton"),
  backTenButton: document.getElementById("backTenButton"),
  backOneButton: document.getElementById("backOneButton"),
  playButton: document.getElementById("playButton"),
  forwardOneButton: document.getElementById("forwardOneButton"),
  forwardTenButton: document.getElementById("forwardTenButton"),
  jumpEndButton: document.getElementById("jumpEndButton"),
  previousDecisionButton: document.getElementById("previousDecisionButton"),
  nudgeLeftFiveButton: document.getElementById("nudgeLeftFiveButton"),
  nudgeLeftOneButton: document.getElementById("nudgeLeftOneButton"),
  boundaryReadout: document.getElementById("boundaryReadout"),
  nudgeRightOneButton: document.getElementById("nudgeRightOneButton"),
  nudgeRightFiveButton: document.getElementById("nudgeRightFiveButton"),
  nextDecisionButton: document.getElementById("nextDecisionButton"),
  angleButtons: document.getElementById("angleButtons"),
  jogReadout: document.getElementById("jogReadout"),
  jogWheel: document.getElementById("jogWheel"),
  jogKnob: document.getElementById("jogKnob"),
  mobileTimecodeLabel: document.getElementById("mobileTimecodeLabel"),
  mobileTimelineSlider: document.getElementById("mobileTimelineSlider"),
  statusLine: document.getElementById("statusLine"),
  statusContainer: document.getElementById("statusContainer"),
  appVersionLabel: document.getElementById("appVersionLabel"),
  reviewLibraryMenu: document.getElementById("reviewLibraryMenu"),
  reviewLibraryList: document.getElementById("reviewLibraryList"),
  reviewLibraryEmpty: document.getElementById("reviewLibraryEmpty"),
  closeReviewLibraryButton: document.getElementById("closeReviewLibraryButton"),
  libraryOpenReviewButton: document.getElementById("libraryOpenReviewButton")
};

const state = {
  project: null,
  sourceManifest: null,
  proxyFiles: new Map(),
  proxyUrls: new Map(),
  remoteProxyUrls: new Map(),
  activeAngleId: "",
  visibleAngleId: "",
  timelineFrame: 0,
  selectedDecisionFrame: null,
  decisionSelectionMode: false,
  selectedDecisionFrames: new Set(),
  decisionLongPress: null,
  suppressDecisionClickFrame: null,
  decisionListAutoFollow: true,
  decisionListProgrammaticScroll: false,
  decisionListScrollTimer: 0,
  lastFollowedDecisionFrame: null,
  isPlaying: false,
  decisions: [],
  undoStack: [],
  redoStack: [],
  markers: [],
  markerSelectionMode: false,
  selectedMarkerIds: new Set(),
  markerLongPress: null,
  suppressMarkerClickId: null,
  markerListAutoFollow: true,
  markerListProgrammaticScroll: false,
  markerListScrollTimer: 0,
  lastFollowedMarkerId: null,
  selectedMarkerCategory: "note",
  previewActionFrame: null,
  programVideos: new Map(),
  audioMasterAngleId: "",
  lastProgramSyncMs: 0,
  reviewPlaybackRate: 1,
  gridVideos: new Map(),
  stateSaveTimer: 0,
  tapGesture: {
    timer: 0,
    lastTap: null
  },
  skipFeedbackTimer: 0,
  viewerLongPress: null,
  suppressViewerTap: false,
  angleSwipeGesture: null,
  suppressAnglePreviewClickUntil: 0,
  playbackRaf: 0,
  shuttleRaf: 0,
  lastShuttleTs: 0,
  shuttleSpeed: 0,
  jogDrag: null,
  pendingMainVideoSwap: false,
  browserPackageStored: false,
  reviewLibraryRows: [],
  server: {
    available: false,
    outputDir: "",
    statusUrl: ""
  }
};

elements.loadPackageButton.addEventListener("click", openPackageImport);
elements.emptyOpenReviewButton.addEventListener("pointerdown", event => event.stopPropagation());
elements.emptyOpenReviewButton.addEventListener("click", event => {
  event.stopPropagation();
  openPackageImport();
});
elements.emptyReviewLibraryButton.addEventListener("pointerdown", event => event.stopPropagation());
elements.emptyReviewLibraryButton.addEventListener("click", event => {
  event.stopPropagation();
  openReviewLibrary();
});
elements.reviewLibraryButton.addEventListener("click", openReviewLibrary);
elements.saveStateButton.addEventListener("click", () => saveProjectState({ manual: true }));
elements.removePackageButton.addEventListener("click", removeDownloadedMatch);
elements.exportButton.addEventListener("click", exportCuts);
elements.saveServerButton.addEventListener("click", saveCutsToServer);
elements.mobileLoadPackageButton.addEventListener("click", openPackageImport);
elements.mobileReviewLibraryButton.addEventListener("click", openReviewLibrary);
elements.mobileSaveStateButton.addEventListener("click", () => saveProjectState({ manual: true }));
elements.mobileRemovePackageButton.addEventListener("click", removeDownloadedMatch);
elements.mobileUndoDecisionButton.addEventListener("click", undoDecision);
elements.mobileRedoDecisionButton.addEventListener("click", redoDecision);
elements.mobileSaveServerButton.addEventListener("click", saveCutsToServer);
elements.mobileExportButton.addEventListener("click", exportCuts);
elements.deleteSelectedDecisionsButton.addEventListener("click", deleteSelectedDecisionFrames);
elements.clearDecisionSelectionButton.addEventListener("click", () => exitDecisionSelection({ status: "Selection cleared." }));
elements.deleteSelectedMarkersButton.addEventListener("click", deleteSelectedMarkers);
elements.clearMarkerSelectionButton.addEventListener("click", () => exitMarkerSelection({ status: "Note selection closed." }));
elements.saveMarkerButton.addEventListener("click", savePreviewMarker);
elements.addNoteButton.addEventListener("pointerdown", event => event.stopPropagation());
elements.addNoteButton.addEventListener("click", event => {
  event.stopPropagation();
  if (isReady()) {
    openPreviewActionMenu(state.timelineFrame);
  }
});
elements.closePreviewActionMenuButton.addEventListener("click", () => closePreviewActionMenu({ status: "Marker menu closed." }));
elements.closeReviewLibraryButton.addEventListener("click", closeReviewLibrary);
elements.libraryOpenReviewButton.addEventListener("click", () => {
  closeReviewLibrary();
  openPackageImport();
});
elements.reviewerInput.addEventListener("change", saveReviewer);
elements.packageInput.addEventListener("change", event => loadPackageFiles([...event.target.files]));
elements.gridToggle.addEventListener("change", renderAngles);
elements.timelineSlider.addEventListener("input", event => {
  pausePlayback();
  setTimelineFrame(Number(event.target.value), { syncVideos: true, persist: true });
});
elements.mobileTimelineSlider.addEventListener("input", event => {
  pausePlayback();
  setTimelineFrame(Number(event.target.value), { syncVideos: true, persist: true });
});
elements.playButton.addEventListener("click", togglePlayback);
elements.jumpStartButton.addEventListener("click", () => {
  pausePlayback();
  setTimelineFrame(0, { syncVideos: true, persist: true });
});
elements.jumpEndButton.addEventListener("click", () => {
  pausePlayback();
  setTimelineFrame(maxFrame(), { syncVideos: true, persist: true });
});
elements.backTenButton.addEventListener("click", () => stepFrames(-10));
elements.backOneButton.addEventListener("click", () => stepFrames(-1));
elements.forwardOneButton.addEventListener("click", () => stepFrames(1));
elements.forwardTenButton.addEventListener("click", () => stepFrames(10));
elements.undoDecisionButton.addEventListener("click", undoDecision);
elements.redoDecisionButton.addEventListener("click", redoDecision);
elements.previousDecisionButton.addEventListener("click", () => selectAdjacentDecision(-1));
elements.nextDecisionButton.addEventListener("click", () => selectAdjacentDecision(1));
elements.nudgeLeftFiveButton.addEventListener("click", () => nudgeSelectedDecision(-5));
elements.nudgeLeftOneButton.addEventListener("click", () => nudgeSelectedDecision(-1));
elements.nudgeRightOneButton.addEventListener("click", () => nudgeSelectedDecision(1));
elements.nudgeRightFiveButton.addEventListener("click", () => nudgeSelectedDecision(5));
elements.audioMaster.addEventListener("ended", () => pausePlayback());
elements.viewerFrame.addEventListener("click", handleViewerTap);
elements.viewerFrame.addEventListener("pointerdown", startViewerLongPress);
elements.mobileAnglePreviewGrid.addEventListener("pointerdown", startAnglePreviewSwipe);
elements.jogWheel.addEventListener("pointerdown", startJog);
for (const list of [elements.decisionList, elements.mobileDecisionList]) {
  list.addEventListener("scroll", handleDecisionListManualScroll, { passive: true });
  list.addEventListener("wheel", disableDecisionListAutoFollow, { passive: true });
  list.addEventListener("touchstart", disableDecisionListAutoFollow, { passive: true });
  list.addEventListener("pointerdown", disableDecisionListAutoFollow, { passive: true });
}
for (const list of [elements.markerList, elements.mobileMarkerList]) {
  list.addEventListener("scroll", handleMarkerListManualScroll, { passive: true });
  list.addEventListener("wheel", disableMarkerListAutoFollow, { passive: true });
  list.addEventListener("touchstart", disableMarkerListAutoFollow, { passive: true });
  list.addEventListener("pointerdown", disableMarkerListAutoFollow, { passive: true });
}
window.addEventListener("keydown", handleKeydown);

async function openPackageImport() {
  closeReviewLibrary();
  const bridge = nativeBridge();
  if (bridge?.importReviewPackage) {
    try {
      setStatus("Opening package picker...");
      const result = await bridge.importReviewPackage();
      if (!result) {
        setStatus("Import cancelled.");
        return;
      }
      loadNativeProjectResult(result);
      return;
    } catch (error) {
      setStatus(`Native import failed: ${error.message}`, true);
      return;
    }
  }
  elements.packageInput.click();
}

function nativeBridge() {
  return window.PecoMobileNativeBridge || null;
}

function loadNativeProjectResult(result) {
  const project = result.project || result.manifest;
  if (!project) {
    throw new Error("Native package import did not return a project manifest.");
  }
  resetProject();
  loadProjectManifest(project, { proxyUrls: result.proxyUrls || result.proxy_urls || {} });
}

async function loadPackageFiles(files) {
  if (!files.length) {
    return;
  }
  try {
    if (files.length === 1 && /\.pecoreview$/i.test(files[0].name)) {
      const archive = window.PecoReviewArchive;
      if (!archive?.readPackage) {
        throw new Error("The browser package reader did not load. Refresh PECO Mobile and try again.");
      }
      const result = await archive.readPackage(files[0], { onProgress: message => setStatus(message) });
      resetProject();
      addProxyFiles(result.proxyFiles, { quiet: true });
      loadProjectManifest(result.project);
      const storageMessage = await rememberBrowserPackage(result.project, result.proxyFiles, result.sourceName);
      const warning = result.warnings.length ? ` ${result.warnings.join(" ")}` : "";
      setStatus(`Loaded ${state.project.name}.${storageMessage}${warning}`, Boolean(result.warnings.length));
      return;
    }
    const manifestFile = findManifestFile(files);
    if (!manifestFile) {
      throw new Error("Package needs a project.json or manifest.json file.");
    }
    const manifest = await readJsonFile(manifestFile);
    const proxyFiles = files.filter(file => file.type.startsWith("video/") || /\.(mp4|mov|m4v|webm|mkv)$/i.test(file.name));
    resetProject();
    addProxyFiles(proxyFiles, { quiet: true });
    loadProjectManifest(manifest);
    const storageMessage = await rememberBrowserPackage(manifest, proxyFiles, manifestFile.name);
    setStatus(`Loaded ${state.project.name}.${storageMessage}`);
  } catch (error) {
    setStatus(`Could not open review: ${error.message}`, true);
  } finally {
    elements.packageInput.value = "";
  }
}

async function loadManifestFile(file) {
  if (!file) {
    return;
  }
  const manifest = await readJsonFile(file);
  resetProject({ keepProxyFiles: true });
  loadProjectManifest(manifest);
}

function findManifestFile(files) {
  const preferred = files.find(file => /(^|\/)(project|manifest)\.json$/i.test(file.webkitRelativePath || file.name));
  if (preferred) {
    return preferred;
  }
  return files.find(file => /\.json$/i.test(file.name));
}

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result || "{}")));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  }).catch(error => {
    setStatus(`Could not read JSON: ${error.message}`, true);
    throw error;
  });
}

function cloneJsonValue(value) {
  return JSON.parse(JSON.stringify(value));
}

async function rememberBrowserPackage(manifest, proxyFiles, sourceName) {
  if (nativeBridge() || window.Capacitor) {
    return "";
  }
  const storage = window.PecoBrowserStorage;
  if (!storage?.savePackage) {
    return " Browser storage is unavailable; reimport it after closing the app.";
  }
  try {
    setStatus("Saving this match for offline reopening...");
    const result = await storage.savePackage(cloneJsonValue(manifest), proxyFiles, { sourceName });
    state.browserPackageStored = true;
    renderTransport();
    await refreshReviewLibrary();
    return ` Saved on this device (${formatBytes(result.sizeBytes)}).`;
  } catch (error) {
    state.browserPackageStored = false;
    renderTransport();
    return ` The match is open, but its proxies could not be retained: ${error.message}`;
  }
}

async function restoreLastBrowserPackage() {
  if (state.project || nativeBridge() || window.Capacitor || new URLSearchParams(window.location.search).has("project")) {
    return false;
  }
  const storage = window.PecoBrowserStorage;
  if (!storage?.loadLastPackage) {
    return false;
  }
  try {
    const saved = await storage.loadLastPackage();
    if (!saved) {
      return false;
    }
    resetProject();
    addProxyFiles(saved.proxyFiles, { quiet: true });
    loadProjectManifest(saved.project);
    state.browserPackageStored = true;
    renderTransport();
    await refreshReviewLibrary();
    setStatus(`Reopened ${state.project.name} from this device. Saved camera decisions were restored.`);
    return true;
  } catch (error) {
    setStatus(`Could not reopen the saved match: ${error.message}`, true);
    return false;
  }
}

async function removeDownloadedMatch() {
  if (!state.project || !state.browserPackageStored) {
    return;
  }
  await removeStoredReview(state.project.id);
}

function reviewLibraryAvailable() {
  return Boolean(!nativeBridge() && !window.Capacitor && window.PecoBrowserStorage?.listPackages);
}

async function refreshReviewLibrary() {
  if (!reviewLibraryAvailable()) {
    state.reviewLibraryRows = [];
    renderReviewLibrary();
    return [];
  }
  try {
    state.reviewLibraryRows = await window.PecoBrowserStorage.listPackages();
  } catch (error) {
    state.reviewLibraryRows = [];
    if (!elements.reviewLibraryMenu.classList.contains("hidden")) {
      setStatus(`Could not read saved reviews: ${error.message}`, true);
    }
  }
  renderReviewLibrary();
  return state.reviewLibraryRows;
}

async function openReviewLibrary() {
  if (!reviewLibraryAvailable()) {
    setStatus("Saved review library is available in the browser app. Use Open Review in the Android app.");
    return;
  }
  await refreshReviewLibrary();
  elements.reviewLibraryMenu.classList.remove("hidden");
}

function closeReviewLibrary() {
  elements.reviewLibraryMenu.classList.add("hidden");
}

function renderReviewLibrary() {
  elements.reviewLibraryList.innerHTML = "";
  elements.reviewLibraryEmpty.hidden = state.reviewLibraryRows.length > 0;
  for (const review of state.reviewLibraryRows) {
    const row = document.createElement("li");
    row.className = "review-library-item";
    row.dataset.projectId = review.projectId;

    const openButton = document.createElement("button");
    openButton.className = "review-library-open";
    openButton.type = "button";
    const title = document.createElement("strong");
    title.textContent = review.name;
    const details = document.createElement("span");
    const mode = review.reviewMode === "notes_only" ? "Notes" : `${review.angleCount} cameras`;
    details.textContent = `${mode} | ${framesToTimecode(review.durationFrames, review.fps)} | ${formatBytes(review.sizeBytes)}`;
    const status = document.createElement("span");
    status.className = `review-library-status ${reviewProgressStatus(review.projectId).cssClass}`;
    status.textContent = reviewProgressStatus(review.projectId).label;
    openButton.append(title, details, status);
    openButton.addEventListener("click", () => openStoredReview(review.projectId));

    const removeButton = document.createElement("button");
    removeButton.className = "secondary compact review-library-remove";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeStoredReview(review.projectId));
    row.append(openButton, removeButton);
    elements.reviewLibraryList.appendChild(row);
  }
}

function reviewProgressStatus(projectId) {
  try {
    if (localStorage.getItem(`${PROJECT_RETURN_STORAGE_PREFIX}${projectId}`)) {
      return { label: "Sent back", cssClass: "sent" };
    }
    if (localStorage.getItem(`${PROJECT_STATE_STORAGE_PREFIX}${projectId}`)) {
      return { label: "In review", cssClass: "active" };
    }
  } catch {
    // Status is optional when browser preferences are blocked.
  }
  return { label: "Not started", cssClass: "new" };
}

async function openStoredReview(projectId) {
  try {
    if (state.project) {
      saveProjectState();
    }
    const saved = await window.PecoBrowserStorage.loadPackage(projectId);
    if (!saved) {
      throw new Error("The downloaded review was not found.");
    }
    resetProject();
    addProxyFiles(saved.proxyFiles, { quiet: true });
    loadProjectManifest(saved.project);
    state.browserPackageStored = true;
    closeReviewLibrary();
    renderTransport();
    setStatus(`Opened ${state.project.name} from Reviews.`);
  } catch (error) {
    setStatus(`Could not open saved review: ${error.message}`, true);
    await refreshReviewLibrary();
  }
}

async function removeStoredReview(projectId) {
  const review = state.reviewLibraryRows.find(row => row.projectId === projectId);
  const projectName = review?.name || (state.project?.id === projectId ? state.project.name : "this review");
  if (!window.confirm(`Remove ${projectName} and its downloaded proxies from this device? Saved camera choices and notes will remain available if it is opened again.`)) {
    return;
  }
  const removingCurrent = state.project?.id === projectId;
  if (removingCurrent) {
    pausePlayback();
    saveProjectState();
  }
  try {
    await window.PecoBrowserStorage.removePackage(projectId);
    if (removingCurrent) {
      resetProject();
    }
    await refreshReviewLibrary();
    setStatus(`Removed ${projectName} from device storage. Saved choices and notes were kept.`);
  } catch (error) {
    setStatus(`Could not remove the downloaded review: ${error.message}`, true);
  }
}

function formatBytes(bytes) {
  const value = Math.max(0, Number(bytes) || 0);
  if (value < 1024 * 1024) {
    return `${Math.max(1, Math.round(value / 1024))} KB`;
  }
  return `${(value / (1024 * 1024)).toFixed(value >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
}

function resetProject(options = {}) {
  pausePlayback();
  clearTimeout(state.stateSaveTimer);
  clearTimeout(state.tapGesture.timer);
  clearTimeout(state.skipFeedbackTimer);
  state.project = null;
  state.sourceManifest = null;
  state.browserPackageStored = false;
  state.activeAngleId = "";
  state.visibleAngleId = "";
  state.audioMasterAngleId = "";
  state.timelineFrame = 0;
  state.selectedDecisionFrame = null;
  state.decisionSelectionMode = false;
  state.selectedDecisionFrames.clear();
  state.decisionLongPress = null;
  state.suppressDecisionClickFrame = null;
  state.decisionListAutoFollow = true;
  state.lastFollowedDecisionFrame = null;
  state.lastProgramSyncMs = 0;
  state.reviewPlaybackRate = 1;
  clearTimeout(state.decisionListScrollTimer);
  state.decisions = [];
  state.undoStack = [];
  state.redoStack = [];
  state.markers = [];
  state.markerSelectionMode = false;
  state.selectedMarkerIds.clear();
  state.markerLongPress = null;
  state.suppressMarkerClickId = null;
  state.markerListAutoFollow = true;
  state.markerListProgrammaticScroll = false;
  state.lastFollowedMarkerId = null;
  state.selectedMarkerCategory = "note";
  clearTimeout(state.markerListScrollTimer);
  state.previewActionFrame = null;
  state.tapGesture.lastTap = null;
  state.suppressViewerTap = false;
  clearViewerLongPress();
  clearAnglePreviewSwipe();
  elements.previewActionMenu.classList.add("hidden");
  elements.markerSelectionMenu.classList.add("hidden");
  document.body.classList.remove("notes-only-mode");
  clearProgramVideos();
  clearAudioMaster();
  clearPreviewVideos();
  if (!options.keepProxyFiles) {
    for (const url of state.proxyUrls.values()) {
      URL.revokeObjectURL(url);
    }
    state.proxyFiles.clear();
    state.proxyUrls.clear();
  }
  state.remoteProxyUrls.clear();
  elements.viewerEmpty.classList.remove("hidden");
  renderAll();
}

function loadProjectManifest(raw, options = {}) {
  const project = normalizeProject(raw);
  state.sourceManifest = cloneJsonValue(raw);
  state.remoteProxyUrls.clear();
  if (options.projectUrl) {
    for (const angle of project.angles) {
      if (angle.proxyFilename) {
        state.remoteProxyUrls.set(angle.id, new URL(angle.proxyFilename, options.projectUrl).toString());
      }
    }
  }
  if (options.proxyUrls) {
    for (const angle of project.angles) {
      const url = options.proxyUrls[angle.id] || options.proxyUrls[angle.proxyFilename];
      if (url) {
        state.remoteProxyUrls.set(angle.id, String(url));
      }
    }
  }
  const errors = validateProject(project);
  state.project = project;
  state.timelineFrame = 0;
  state.activeAngleId = project.angles[0]?.id || "";
  state.audioMasterAngleId = project.audioMasterAngleId;
  state.visibleAngleId = state.activeAngleId;
  elements.gridToggle.checked = project.angles.length <= 4;
  loadInitialCameraChanges(project);
  loadInitialReviewMarkers(project);
  const restored = restoreProjectState(project);
  ensureProgramVideos();
  ensureAudioMaster();
  wireMainVideo();
  renderAll();
  if (errors.length) {
    setStatus(errors.join(" "), true);
  } else if (restored) {
    setStatus(`Loaded ${project.name}. Restored saved phone edit state.`);
  } else {
    setStatus(`Loaded ${project.name}.`);
  }
}

function normalizeProject(raw) {
  const fps = Number(raw.fps || raw.project_fps || 30);
  const durationFrames = Number.isFinite(Number(raw.duration_frames))
    ? Math.max(1, Math.floor(Number(raw.duration_frames)))
    : Math.max(1, Math.round(Number(raw.duration_seconds || raw.duration || 0) * fps));
  const angleRows = Array.isArray(raw.angles)
    ? raw.angles
    : Array.isArray(raw.source_clip_mapping)
      ? raw.source_clip_mapping
      : Array.isArray(raw.cameras)
        ? raw.cameras
        : [];
  const angles = angleRows.map((row, index) => {
    const angleIndex = Number(row.angle_index || row.index || index + 1);
    const id = String(row.angle_id || row.camera_id || `angle_${angleIndex}`).trim();
    const originalTimecode = String(row.original_source_timecode_start || row.source_timecode_start || "00:00:00:00");
    return {
      id,
      index: angleIndex,
      name: String(row.camera_name || row.name || id || `Angle ${angleIndex}`).trim(),
      proxyFilename: String(row.proxy_filename || row.proxy || "").trim(),
      originalSourceFilename: String(row.original_source_filename || row.source_filename || row.source || "").trim(),
      originalSourceTimecodeStart: originalTimecode,
      originalSourceStartFrame: parseTimecodeToFrames(originalTimecode, fps),
      syncOffsetFrames: Number.isFinite(Number(row.sync_offset_frames))
        ? Math.round(Number(row.sync_offset_frames))
        : Math.round(Number(row.sync_offset_seconds || row.sync_offset || 0) * fps),
      proxySyncOffsetFrames: Number.isFinite(Number(row.proxy_sync_offset_frames))
        ? Math.round(Number(row.proxy_sync_offset_frames))
        : Number.isFinite(Number(row.sync_offset_frames))
          ? Math.round(Number(row.sync_offset_frames))
          : Math.round(Number(row.proxy_sync_offset_seconds || row.sync_offset_seconds || row.sync_offset || 0) * fps)
    };
  });
  const initialCameraChanges = normalizeInitialCameraChanges(raw, angles, durationFrames);
  const initialReviewMarkers = normalizeInitialReviewMarkers(raw, durationFrames);
  const packageMetadata = raw.package_metadata && typeof raw.package_metadata === "object"
    ? cloneJsonValue(raw.package_metadata)
    : {};
  const requestedReviewMode = String(packageMetadata.review_mode || raw.review_mode || "").trim().toLowerCase();
  const reviewMode = requestedReviewMode || (angles.length === 1 ? "notes_only" : "multicam_notes");
  const requestedAudioMasterId = String(
    raw.audio_master_angle_id
      || raw.package_metadata?.audio_master_angle_id
      || ""
  ).trim();
  const fallbackAudioMaster = angles.find(angle => /float/i.test(`${angle.id} ${angle.name}`))
    || angles[1]
    || angles[0]
    || null;
  const audioMasterAngleId = angles.some(angle => angle.id === requestedAudioMasterId)
    ? requestedAudioMasterId
    : fallbackAudioMaster?.id || "";
  return {
    schema: raw.schema || PROJECT_SCHEMA,
    id: String(raw.project_id || raw.id || cryptoRandomId()),
    name: String(raw.project_name || raw.name || "Mobile Multicam Project").trim(),
    fps,
    durationFrames,
    durationSeconds: durationFrames / fps,
    timelineStartTimecode: String(raw.timeline_start_timecode || "00:00:00:00"),
    timelineStartFrame: parseTimecodeToFrames(String(raw.timeline_start_timecode || "00:00:00:00"), fps),
    angles,
    audioMasterAngleId,
    initialCameraChanges,
    initialReviewMarkers,
    packageMetadata,
    reviewMode
  };
}

function normalizeInitialReviewMarkers(raw, durationFrames) {
  const rows = Array.isArray(raw.initial_review_markers)
    ? raw.initial_review_markers
    : Array.isArray(raw.review_markers)
      ? raw.review_markers
      : [];
  const markers = [];
  for (const [index, row] of rows.entries()) {
    if (!row || typeof row !== "object") {
      continue;
    }
    const frame = Math.round(Number(row.timeline_frame ?? row.frame ?? -1));
    if (!Number.isFinite(frame) || frame < 0 || frame >= durationFrames) {
      continue;
    }
    const category = markerCategoryById(row.category)?.id || "note";
    markers.push({
      id: String(row.marker_id || row.id || `initial_marker_${index + 1}`),
      frame,
      category,
      label: String(row.label || "").trim(),
      color: String(row.color || markerCategoryById(category).color),
      note: String(row.note || row.message || row.description || "").trim(),
      createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
      source: String(row.source || "peco_package_marker")
    });
  }
  return markers.sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
}

function normalizeInitialCameraChanges(raw, angles, durationFrames) {
  const rows = Array.isArray(raw.initial_camera_changes)
    ? raw.initial_camera_changes
    : Array.isArray(raw.initial_decisions)
      ? raw.initial_decisions
      : Array.isArray(raw.selected_camera_changes)
        ? raw.selected_camera_changes
        : Array.isArray(raw.decisions)
          ? raw.decisions
          : [];
  const byId = new Map(angles.map(angle => [angle.id, angle]));
  const byIndex = new Map(angles.map(angle => [angle.index, angle]));
  const changes = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") {
      continue;
    }
    const frame = Math.round(Number(row.timeline_frame ?? row.frame ?? -1));
    if (!Number.isFinite(frame) || frame < 0 || frame >= durationFrames) {
      continue;
    }
    const angleId = String(row.angle_id || row.camera_id || "").trim();
    const angleIndex = Math.round(Number(row.angle_index ?? row.index ?? 0));
    const angle = byId.get(angleId) || byIndex.get(angleIndex);
    if (!angle) {
      continue;
    }
    changes.push({
      frame,
      angleId: angle.id,
      angleIndex: angle.index,
      cameraName: angle.name,
      reason: String(row.reason || row.note || row.source || "Initial PECO camera decision")
    });
  }
  const compacted = [];
  for (const row of changes.sort((a, b) => a.frame - b.frame || a.angleIndex - b.angleIndex)) {
    if (compacted.length && compacted[compacted.length - 1].frame === row.frame) {
      compacted[compacted.length - 1] = row;
    } else if (compacted.length && compacted[compacted.length - 1].angleId === row.angleId) {
      continue;
    } else {
      compacted.push(row);
    }
  }
  return compacted;
}

function loadInitialCameraChanges(project) {
  state.decisions = [];
  state.undoStack = [];
  state.redoStack = [];
  if (!supportsCameraDecisions(project)) {
    state.selectedDecisionFrame = null;
    return;
  }
  const rows = Array.isArray(project.initialCameraChanges) ? project.initialCameraChanges : [];
  if (!rows.length && state.activeAngleId) {
    recordDecision(state.activeAngleId, { frame: 0, force: true, skipAutosave: true, trackHistory: false });
    return;
  }
  for (const row of rows) {
    recordDecision(row.angleId, { frame: row.frame, force: true, keepRedo: true, skipAutosave: true, trackHistory: false });
  }
  const compacted = compactDecisions();
  if (compacted[0]) {
    state.activeAngleId = compacted[0].angleId;
    state.selectedDecisionFrame = compacted[0].frame;
  } else if (state.activeAngleId) {
    recordDecision(state.activeAngleId, { frame: 0, force: true, skipAutosave: true, trackHistory: false });
  }
}

function loadInitialReviewMarkers(project) {
  state.markers = (Array.isArray(project.initialReviewMarkers) ? project.initialReviewMarkers : [])
    .map(marker => ({ ...marker }))
    .sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
}

function validateProject(project) {
  const errors = [];
  if (!Number.isFinite(project.fps) || project.fps <= 0) {
    errors.push("Project fps must be positive.");
  }
  if (!Number.isFinite(project.durationFrames) || project.durationFrames <= 0) {
    errors.push("Project duration must be positive.");
  }
  if (!project.angles.length) {
    errors.push("Review package needs at least one proxy video.");
  } else if (project.reviewMode !== "notes_only" && project.angles.length < 2) {
    errors.push("Multicam review packages need at least two angles.");
  }
  for (const angle of project.angles) {
    if (!angle.proxyFilename) {
      errors.push(`${angle.name} is missing proxy_filename.`);
    } else if (!proxyAvailable(angle)) {
      errors.push(`${angle.name} proxy is not loaded: ${angle.proxyFilename}.`);
    }
    if (!angle.originalSourceFilename) {
      errors.push(`${angle.name} is missing original_source_filename.`);
    }
  }
  return errors;
}

function addProxyFiles(files, options = {}) {
  for (const file of files) {
    const names = new Set([file.name, file.pecoRelativePath]);
    if (file.webkitRelativePath) {
      names.add(file.webkitRelativePath);
      names.add(file.webkitRelativePath.split("/").pop());
    }
    for (const name of names) {
      if (name) {
        state.proxyFiles.set(normalizePathKey(name), file);
      }
    }
  }
  if (state.project) {
    ensureProgramVideos();
    wireMainVideo();
    renderAll();
    const errors = validateProject(state.project);
    setStatus(errors.length ? errors.join(" ") : `Loaded ${files.length} proxy file(s).`, Boolean(errors.length));
  } else if (!options.quiet) {
    setStatus(`Loaded ${files.length} proxy file(s).`);
  }
}

function proxyFileFor(angle) {
  const key = normalizePathKey(angle.proxyFilename);
  if (state.proxyFiles.has(key)) {
    return state.proxyFiles.get(key);
  }
  const basename = normalizePathKey(angle.proxyFilename.split(/[\\/]/).pop() || angle.proxyFilename);
  return state.proxyFiles.get(basename) || null;
}

function proxyUrlFor(angle) {
  const file = proxyFileFor(angle);
  if (!file) {
    return state.remoteProxyUrls.get(angle.id) || "";
  }
  const key = normalizePathKey(file.webkitRelativePath || file.name);
  if (!state.proxyUrls.has(key)) {
    state.proxyUrls.set(key, URL.createObjectURL(file));
  }
  return state.proxyUrls.get(key);
}

function normalizePathKey(value) {
  return String(value || "").replace(/\\/g, "/").toLowerCase();
}

function renderAll() {
  renderReviewMode();
  renderProjectLine();
  renderTransport();
  renderBoundaryControls();
  renderAngles();
  renderDecisionList();
  renderMarkerList();
  renderTimeline();
}

function renderDecisionEditState() {
  renderReviewMode();
  renderProjectLine();
  renderTransport();
  renderBoundaryControls();
  renderDecisionList();
  renderMarkerList();
  renderTimeline();
  updateAngleActiveState();
}

function renderReviewMode() {
  const notesOnly = state.project?.reviewMode === "notes_only";
  document.body.classList.toggle("project-empty-mode", !state.project);
  document.body.classList.toggle("notes-only-mode", Boolean(notesOnly));
  elements.exportButton.textContent = "Send Back";
  elements.mobileExportButton.textContent = "Send Back";
}

function renderProjectLine() {
  const project = state.project;
  if (!project) {
    elements.projectLine.textContent = "No package loaded";
    return;
  }
  const reviewKind = project.reviewMode === "notes_only" ? "Notes" : "Camera + Notes";
  elements.projectLine.textContent = `${project.name} | ${reviewKind} | ${framesToTimecode(project.durationFrames, project.fps)}`;
}

function renderTransport() {
  const loaded = isReady();
  const libraryAvailable = reviewLibraryAvailable();
  elements.reviewLibraryButton.hidden = !libraryAvailable;
  elements.mobileReviewLibraryButton.hidden = !libraryAvailable;
  elements.emptyReviewLibraryButton.hidden = !libraryAvailable;
  for (const button of [
    elements.saveStateButton,
    elements.exportButton,
    elements.addNoteButton,
    elements.gridToggle,
    elements.timelineSlider,
    elements.playButton,
    elements.jumpStartButton,
    elements.backTenButton,
    elements.backOneButton,
    elements.forwardOneButton,
    elements.forwardTenButton,
    elements.jumpEndButton
  ]) {
    button.disabled = !loaded;
  }
  elements.mobileTimelineSlider.disabled = !loaded;
  elements.mobileSaveStateButton.disabled = !loaded;
  for (const button of [elements.removePackageButton, elements.mobileRemovePackageButton]) {
    button.hidden = !state.browserPackageStored;
    button.disabled = !state.browserPackageStored;
  }
  for (const button of [
    elements.undoDecisionButton,
    elements.mobileUndoDecisionButton
  ]) {
    button.disabled = !loaded || state.undoStack.length === 0;
  }
  for (const button of [
    elements.redoDecisionButton,
    elements.mobileRedoDecisionButton
  ]) {
    button.disabled = !loaded || state.redoStack.length === 0;
  }
  const serverSaveAvailable = state.server.available && supportsCameraDecisions();
  elements.saveServerButton.hidden = !serverSaveAvailable;
  elements.saveServerButton.disabled = !loaded || !serverSaveAvailable;
  elements.mobileSaveServerButton.hidden = !serverSaveAvailable;
  elements.mobileSaveServerButton.disabled = !loaded || !serverSaveAvailable;
  elements.mobileExportButton.disabled = !loaded;
  renderSelectionMenu();
  elements.playButton.textContent = state.isPlaying ? "Pause" : "Play";
}

function renderBoundaryControls() {
  const loaded = isReady();
  const decisions = compactDecisions();
  const selected = selectedDecision();
  const canNudge = Boolean(loaded && selected && selected.frame > 0);
  for (const button of [
    elements.previousDecisionButton,
    elements.nextDecisionButton
  ]) {
    button.disabled = !loaded || decisions.length <= 1;
  }
  for (const button of [
    elements.nudgeLeftFiveButton,
    elements.nudgeLeftOneButton,
    elements.nudgeRightOneButton,
    elements.nudgeRightFiveButton
  ]) {
    button.disabled = !canNudge;
  }
  if (!loaded) {
    elements.boundaryReadout.textContent = "No cut selected";
    return;
  }
  if (!selected) {
    elements.boundaryReadout.textContent = "Tap a cut";
    return;
  }
  const angle = angleById(selected.angleId);
  const name = angle ? angle.name : selected.angleId;
  elements.boundaryReadout.textContent = `${framesToTimecode(selected.frame, state.project.fps)} ${name}`;
}

function renderAngles() {
  clearPreviewVideos();
  elements.angleButtons.innerHTML = "";
  elements.angleGrid.innerHTML = "";
  elements.mobileAnglePreviewGrid.innerHTML = "";
  if (!state.project) {
    return;
  }
  for (const angle of state.project.angles) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "angle-button";
    button.dataset.angleId = angle.id;
    if (angle.id === state.activeAngleId) {
      button.classList.add("active");
    }
    button.disabled = !proxyAvailable(angle);
    button.innerHTML = `<span class="number">${angle.index}</span><span class="label"></span>`;
    button.querySelector(".label").textContent = angle.name;
    button.addEventListener("click", () => switchAngle(angle.id));
    elements.angleButtons.appendChild(button);

    elements.angleGrid.appendChild(createAnglePreviewTile(angle, {
      keyPrefix: "desktop",
      showVideo: elements.gridToggle.checked,
      compact: false
    }));
    elements.mobileAnglePreviewGrid.appendChild(createAnglePreviewTile(angle, {
      keyPrefix: "mobile",
      showVideo: true,
      compact: true
    }));
  }
}

function createAnglePreviewTile(angle, options = {}) {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = options.compact ? "angle-tile mobile-angle-preview" : "angle-tile";
  tile.dataset.angleId = angle.id;
  if (angle.id === state.activeAngleId) {
    tile.classList.add("active");
  }
  tile.disabled = !proxyAvailable(angle);
  tile.addEventListener("click", event => handleAnglePreviewTap(event, angle.id));
  if (options.showVideo && proxyAvailable(angle)) {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = proxyUrlFor(angle);
    video.addEventListener("loadedmetadata", () => syncVideoElement(video, angle), { once: true });
    tile.appendChild(video);
    state.gridVideos.set(`${options.keyPrefix || "preview"}:${angle.id}`, { angleId: angle.id, video });
    syncVideoElement(video, angle);
    if (state.isPlaying) {
      video.play().catch(() => {});
    }
  }
  const name = document.createElement("div");
  name.className = "angle-name";
  name.textContent = `${angle.index}. ${angle.name}`;
  const source = document.createElement("div");
  source.className = "angle-source";
  source.textContent = angle.originalSourceFilename || angle.proxyFilename;
  tile.append(name, source);
  return tile;
}

function handleAnglePreviewTap(event, angleId) {
  if (performance.now() < state.suppressAnglePreviewClickUntil) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  switchAngle(angleId);
}

function clearPreviewVideos() {
  for (const preview of state.gridVideos.values()) {
    const video = preview.video || preview;
    try {
      video.pause();
      video.removeAttribute("src");
      video.load();
    } catch {
      // Preview cleanup should never block the reviewer UI.
    }
  }
  state.gridVideos.clear();
}

function updateAngleActiveState() {
  for (const node of document.querySelectorAll("[data-angle-id]")) {
    node.classList.toggle("active", node.dataset.angleId === state.activeAngleId);
  }
}

function ensureProgramVideos() {
  if (!state.project) {
    return;
  }
  const availableAngles = state.project.angles.filter(angle => proxyAvailable(angle));
  let needsRebuild = state.programVideos.size !== availableAngles.length;
  for (const angle of availableAngles) {
    const url = proxyUrlFor(angle);
    const entry = state.programVideos.get(angle.id);
    if (!entry || entry.video.dataset.proxyUrl !== url) {
      needsRebuild = true;
      break;
    }
  }
  if (!needsRebuild) {
    updateProgramVideoVisibility();
    return;
  }
  clearProgramVideos();
  let first = true;
  for (const angle of availableAngles) {
    const url = proxyUrlFor(angle);
    const video = first ? elements.mainVideo : document.createElement("video");
    video.className = "program-video";
    video.playsInline = true;
    video.preload = "auto";
    video.controls = false;
    video.muted = true;
    video.defaultMuted = true;
    video.dataset.angleId = angle.id;
    video.dataset.proxyUrl = url;
    video.src = url;
    video.load();
    video.addEventListener("loadedmetadata", () => syncVideoElement(video, angle), { once: true });
    if (!first) {
      elements.programVideoStack.appendChild(video);
    }
    state.programVideos.set(angle.id, { angleId: angle.id, video });
    first = false;
  }
  if (!state.visibleAngleId || !state.programVideos.has(state.visibleAngleId)) {
    state.visibleAngleId = state.activeAngleId;
  }
  updateProgramVideoVisibility();
}

function clearProgramVideos() {
  for (const entry of state.programVideos.values()) {
    const video = entry.video;
    try {
      video.pause();
      video.removeAttribute("src");
      video.removeAttribute("data-angle-id");
      video.removeAttribute("data-proxy-url");
      video.load();
      if (video !== elements.mainVideo) {
        video.remove();
      }
    } catch {
      // Program video cleanup must not block loading another review package.
    }
  }
  state.programVideos.clear();
  elements.mainVideo.className = "program-video active";
  elements.mainVideo.muted = true;
  elements.mainVideo.defaultMuted = true;
  if (!elements.programVideoStack.contains(elements.mainVideo)) {
    elements.programVideoStack.appendChild(elements.mainVideo);
  }
}

function activeProgramVideo() {
  return state.programVideos.get(state.activeAngleId)?.video || null;
}

function updateProgramVideoVisibility() {
  const visibleAngleId = state.visibleAngleId || state.activeAngleId;
  for (const entry of state.programVideos.values()) {
    const visible = entry.angleId === visibleAngleId;
    entry.video.classList.toggle("active", visible);
    entry.video.muted = true;
    entry.video.defaultMuted = true;
  }
  updateAngleActiveState();
}

function audioMasterAngle() {
  return angleById(state.audioMasterAngleId || state.project?.audioMasterAngleId || "");
}

function ensureAudioMaster() {
  const angle = audioMasterAngle();
  if (!angle || !proxyAvailable(angle)) {
    clearAudioMaster();
    return null;
  }
  const url = proxyUrlFor(angle);
  if (elements.audioMaster.dataset.proxyUrl !== url) {
    elements.audioMaster.pause();
    elements.audioMaster.src = url;
    elements.audioMaster.dataset.proxyUrl = url;
    elements.audioMaster.dataset.angleId = angle.id;
    elements.audioMaster.preload = "auto";
    elements.audioMaster.load();
  }
  state.audioMasterAngleId = angle.id;
  return elements.audioMaster;
}

function clearAudioMaster() {
  try {
    elements.audioMaster.pause();
    elements.audioMaster.removeAttribute("src");
    elements.audioMaster.removeAttribute("data-proxy-url");
    elements.audioMaster.removeAttribute("data-angle-id");
    elements.audioMaster.load();
  } catch {
    // Audio cleanup must not block loading another package.
  }
}

function activateProgramVideoWhenReady(options = {}) {
  const targetAngleId = state.activeAngleId;
  const target = activeProgramVideo();
  if (!target) {
    state.visibleAngleId = targetAngleId;
    updateProgramVideoVisibility();
    return;
  }
  const startedAt = options.startedAt || performance.now();
  let settled = false;
  const finish = () => {
    if (settled || state.activeAngleId !== targetAngleId) {
      return;
    }
    settled = true;
    state.visibleAngleId = targetAngleId;
    updateProgramVideoVisibility();
    if (options.reportSwitch) {
      const angle = angleById(targetAngleId);
      const elapsed = Math.round(performance.now() - startedAt);
      setStatus(`Switched to ${angle?.name || targetAngleId} at ${framesToTimecode(state.timelineFrame, state.project.fps)} (${elapsed} ms visual cut).`);
    }
  };
  const timeout = setTimeout(finish, 140);
  const finishWithCleanup = () => {
    clearTimeout(timeout);
    finish();
  };
  const haveCurrentData = window.HTMLMediaElement?.HAVE_CURRENT_DATA ?? 2;
  if (!options.waitForFrame) {
    finishWithCleanup();
  } else if (typeof target.requestVideoFrameCallback === "function") {
    target.requestVideoFrameCallback(finishWithCleanup);
  } else if (target.readyState >= haveCurrentData) {
    finishWithCleanup();
  } else {
    target.addEventListener("loadeddata", finishWithCleanup, { once: true });
    target.addEventListener("canplay", finishWithCleanup, { once: true });
  }
}

function renderDecisionList() {
  renderDecisionListInto(elements.decisionList, { reverse: false });
  renderDecisionListInto(elements.mobileDecisionList, { reverse: false });
}

function renderDecisionListInto(list, options = {}) {
  if (!list) {
    return;
  }
  list.innerHTML = "";
  if (!state.project) {
    return;
  }
  const compacted = compactDecisions();
  const active = activeDecisionAtFrame(state.timelineFrame);
  const rows = options.reverse ? [...compacted].reverse() : compacted;
  for (const decision of rows) {
    const li = document.createElement("li");
    li.dataset.frame = String(decision.frame);
    if (decision.frame === state.selectedDecisionFrame) {
      li.classList.add("selected");
    }
    if (state.selectedDecisionFrames.has(decision.frame)) {
      li.classList.add("multi-selected");
    }
    if (active && decision.frame === active.frame) {
      li.classList.add("current");
    }
    const angle = angleById(decision.angleId);
    const name = angle ? angle.name : decision.angleId;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "decision-button";
    button.innerHTML = `<strong></strong><span></span>`;
    button.querySelector("strong").textContent = framesToTimecode(decision.frame, state.project?.fps || 30);
    button.querySelector("span").textContent = name;
    button.addEventListener("click", event => handleDecisionTap(event, decision.frame));
    button.addEventListener("pointerdown", event => startDecisionLongPress(event, decision.frame));
    button.addEventListener("contextmenu", event => event.preventDefault());
    li.appendChild(button);
    list.appendChild(li);
  }
  updateDecisionListActiveState({ force: true, follow: false });
}

function renderSelectionMenu() {
  const count = state.selectedDecisionFrames.size;
  const visible = state.decisionSelectionMode && count > 0;
  elements.decisionSelectionMenu.classList.toggle("hidden", !visible);
  if (!visible) {
    elements.selectionSummary.textContent = "No cuts selected";
    elements.deleteSelectedDecisionsButton.disabled = true;
    return;
  }
  elements.selectionSummary.textContent = `${count} cut${count === 1 ? "" : "s"} selected`;
  elements.deleteSelectedDecisionsButton.disabled = false;
}

function markerCategoriesForProject() {
  const rows = [...MARKER_CATEGORIES];
  const metadata = state.project?.packageMetadata || {};
  const projectText = `${state.project?.name || ""} ${metadata.workflow || ""} ${metadata.source_multicam_group_name || ""}`;
  if (/wrestl|multicam/i.test(projectText) || supportsCameraDecisions()) {
    rows.push(...WRESTLING_MARKER_CATEGORIES);
  }
  return rows;
}

function markerCategoryById(categoryId) {
  return [...MARKER_CATEGORIES, ...WRESTLING_MARKER_CATEGORIES]
    .find(category => category.id === String(categoryId || "").trim().toLowerCase()) || MARKER_CATEGORIES[0];
}

function renderMarkerCategoryButtons() {
  elements.markerCategoryButtons.innerHTML = "";
  for (const category of markerCategoriesForProject()) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker-category-button";
    button.dataset.category = category.id;
    button.textContent = category.label;
    button.style.setProperty("--marker-color", category.color);
    button.classList.toggle("selected", category.id === state.selectedMarkerCategory);
    button.addEventListener("click", () => {
      state.selectedMarkerCategory = category.id;
      renderMarkerCategoryButtons();
    });
    elements.markerCategoryButtons.appendChild(button);
  }
}

function renderMarkerList() {
  renderMarkerListInto(elements.markerList);
  renderMarkerListInto(elements.mobileMarkerList);
  elements.markerCount.textContent = String(state.markers.length);
  renderMarkerSelectionMenu();
  updateMarkerListActiveState({ force: true, follow: false });
}

function renderMarkerListInto(list) {
  if (!list) {
    return;
  }
  list.innerHTML = "";
  if (!state.project) {
    return;
  }
  for (const marker of state.markers) {
    const category = markerCategoryById(marker.category);
    const li = document.createElement("li");
    li.dataset.markerId = marker.id;
    li.dataset.frame = String(marker.frame);
    li.style.setProperty("--marker-color", marker.color || category.color);
    li.classList.toggle("multi-selected", state.selectedMarkerIds.has(marker.id));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker-button";
    button.innerHTML = "<strong></strong><span class=\"marker-category-label\"></span><span class=\"marker-note-label\"></span>";
    button.querySelector("strong").textContent = framesToTimecode(marker.frame, state.project.fps);
    button.querySelector(".marker-category-label").textContent = category.label;
    button.querySelector(".marker-note-label").textContent = marker.note || marker.label || "No text";
    button.addEventListener("click", event => handleMarkerTap(event, marker.id));
    button.addEventListener("pointerdown", event => startMarkerLongPress(event, marker.id));
    button.addEventListener("contextmenu", event => event.preventDefault());
    li.appendChild(button);
    list.appendChild(li);
  }
}

function renderMarkerSelectionMenu() {
  const count = state.selectedMarkerIds.size;
  const visible = state.markerSelectionMode && count > 0;
  elements.markerSelectionMenu.classList.toggle("hidden", !visible);
  elements.markerSelectionSummary.textContent = visible
    ? `${count} note${count === 1 ? "" : "s"} selected`
    : "No notes selected";
  elements.deleteSelectedMarkersButton.disabled = !visible;
}

function activeMarkerAtFrame(frame = state.timelineFrame) {
  let active = null;
  for (const marker of state.markers) {
    if (marker.frame > frame) {
      break;
    }
    active = marker;
  }
  return active;
}

function handleMarkerTap(event, markerId) {
  if (state.suppressMarkerClickId === markerId) {
    state.suppressMarkerClickId = null;
    event.preventDefault();
    return;
  }
  if (state.markerSelectionMode) {
    event.preventDefault();
    toggleMarkerSelection(markerId);
    return;
  }
  const marker = state.markers.find(item => item.id === markerId);
  if (!marker) {
    return;
  }
  pausePlayback({ silent: true });
  setTimelineFrame(marker.frame, { syncVideos: true, persist: true });
  setStatus(`${markerCategoryById(marker.category).label} at ${framesToTimecode((state.project.timelineStartFrame || 0) + marker.frame, state.project.fps)}.`);
}

function startMarkerLongPress(event, markerId) {
  if (!isReady() || event.button > 0) {
    return;
  }
  clearMarkerLongPress();
  const gesture = {
    pointerId: event.pointerId,
    markerId,
    startX: event.clientX,
    startY: event.clientY,
    fired: false,
    timer: 0
  };
  gesture.timer = setTimeout(() => {
    gesture.fired = true;
    state.suppressMarkerClickId = markerId;
    enterMarkerSelection(markerId);
  }, 560);
  state.markerLongPress = gesture;
  window.addEventListener("pointermove", moveMarkerLongPress);
  window.addEventListener("pointerup", endMarkerLongPress, { once: true });
  window.addEventListener("pointercancel", endMarkerLongPress, { once: true });
}

function moveMarkerLongPress(event) {
  const gesture = state.markerLongPress;
  if (!gesture || event.pointerId !== gesture.pointerId) {
    return;
  }
  if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > 12) {
    clearMarkerLongPress();
  }
}

function endMarkerLongPress(event) {
  const gesture = state.markerLongPress;
  if (gesture && event.pointerId === gesture.pointerId && gesture.fired) {
    state.suppressMarkerClickId = gesture.markerId;
  }
  clearMarkerLongPress();
}

function clearMarkerLongPress() {
  if (state.markerLongPress?.timer) {
    clearTimeout(state.markerLongPress.timer);
  }
  state.markerLongPress = null;
  window.removeEventListener("pointermove", moveMarkerLongPress);
  window.removeEventListener("pointerup", endMarkerLongPress);
  window.removeEventListener("pointercancel", endMarkerLongPress);
}

function enterMarkerSelection(markerId) {
  if (!state.markers.some(marker => marker.id === markerId)) {
    return;
  }
  pausePlayback({ silent: true });
  exitDecisionSelection();
  state.markerSelectionMode = true;
  state.selectedMarkerIds.add(markerId);
  renderAll();
  setStatus("Note selection mode. Tap more notes to select or deselect them.");
}

function toggleMarkerSelection(markerId) {
  if (state.selectedMarkerIds.has(markerId)) {
    state.selectedMarkerIds.delete(markerId);
  } else if (state.markers.some(marker => marker.id === markerId)) {
    state.selectedMarkerIds.add(markerId);
  }
  if (!state.selectedMarkerIds.size) {
    exitMarkerSelection({ status: "Note selection cleared." });
  } else {
    renderAll();
  }
}

function exitMarkerSelection(options = {}) {
  clearMarkerSelectionState();
  renderAll();
  if (options.status) {
    setStatus(options.status);
  }
}

function clearMarkerSelectionState() {
  clearMarkerLongPress();
  state.markerSelectionMode = false;
  state.selectedMarkerIds.clear();
  state.suppressMarkerClickId = null;
}

function deleteSelectedMarkers() {
  const selected = new Set(state.selectedMarkerIds);
  const removedCount = state.markers.filter(marker => selected.has(marker.id)).length;
  state.markers = state.markers.filter(marker => !selected.has(marker.id));
  state.markerSelectionMode = false;
  state.selectedMarkerIds.clear();
  state.suppressMarkerClickId = null;
  renderAll();
  scheduleProjectStateAutosave();
  setStatus(`Deleted ${removedCount} selected note${removedCount === 1 ? "" : "s"}.`);
}

function handleMarkerListManualScroll() {
  if (!state.markerListProgrammaticScroll) {
    state.markerListAutoFollow = false;
  }
}

function disableMarkerListAutoFollow() {
  state.markerListAutoFollow = false;
  state.markerListProgrammaticScroll = false;
  clearTimeout(state.markerListScrollTimer);
}

function enableMarkerListAutoFollow(options = {}) {
  state.markerListAutoFollow = true;
  state.lastFollowedMarkerId = null;
  updateMarkerListActiveState({ force: true, follow: options.center !== false });
}

function updateMarkerListActiveState(options = {}) {
  const active = activeMarkerAtFrame();
  for (const list of [elements.markerList, elements.mobileMarkerList]) {
    for (const item of list.querySelectorAll("li[data-marker-id]")) {
      item.classList.toggle("current", item.dataset.markerId === active?.id);
    }
  }
  if (!options.follow || !active || (!options.force && state.lastFollowedMarkerId === active.id)) {
    return;
  }
  state.lastFollowedMarkerId = active.id;
  state.markerListProgrammaticScroll = true;
  clearTimeout(state.markerListScrollTimer);
  for (const list of [elements.markerList, elements.mobileMarkerList]) {
    const item = [...list.querySelectorAll("li[data-marker-id]")].find(row => row.dataset.markerId === active.id);
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
  state.markerListScrollTimer = setTimeout(() => {
    state.markerListProgrammaticScroll = false;
  }, 450);
}

function handleDecisionListManualScroll() {
  if (state.decisionListProgrammaticScroll) {
    return;
  }
  state.decisionListAutoFollow = false;
}

function disableDecisionListAutoFollow() {
  state.decisionListAutoFollow = false;
  state.decisionListProgrammaticScroll = false;
  clearTimeout(state.decisionListScrollTimer);
}

function enableDecisionListAutoFollow(options = {}) {
  state.decisionListAutoFollow = true;
  state.lastFollowedDecisionFrame = null;
  updateDecisionListActiveState({ force: true, follow: options.center !== false });
}

function updateDecisionListActiveState(options = {}) {
  if (!state.project) {
    return;
  }
  const active = activeDecisionAtFrame(state.timelineFrame);
  const activeFrame = active?.frame ?? null;
  for (const list of [elements.decisionList, elements.mobileDecisionList]) {
    if (!list) {
      continue;
    }
    for (const item of list.querySelectorAll("li[data-frame]")) {
      item.classList.toggle("current", Number(item.dataset.frame) === activeFrame);
    }
  }
  if (!options.follow || activeFrame === null) {
    return;
  }
  if (!options.force && state.lastFollowedDecisionFrame === activeFrame) {
    return;
  }
  state.lastFollowedDecisionFrame = activeFrame;
  centerDecisionFrameInLists(activeFrame);
}

function centerDecisionFrameInLists(frame) {
  state.decisionListProgrammaticScroll = true;
  clearTimeout(state.decisionListScrollTimer);
  for (const list of [elements.decisionList, elements.mobileDecisionList]) {
    if (!list) {
      continue;
    }
    const item = list.querySelector(`li[data-frame="${frame}"]`);
    if (!item) {
      continue;
    }
    item.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }
  state.decisionListScrollTimer = setTimeout(() => {
    state.decisionListProgrammaticScroll = false;
  }, 450);
}

function renderTimeline() {
  const project = state.project;
  if (!project) {
    elements.timecodeLabel.textContent = "00:00:00:00";
    elements.activeAngleLabel.textContent = "No angle";
    elements.timelineSlider.max = "0";
    elements.timelineSlider.value = "0";
    elements.mobileTimecodeLabel.textContent = "00:00:00:00";
    elements.mobileTimelineSlider.max = "0";
    elements.mobileTimelineSlider.value = "0";
    return;
  }
  const timecode = framesToTimecode((project.timelineStartFrame || 0) + state.timelineFrame, project.fps);
  elements.timecodeLabel.textContent = timecode;
  elements.mobileTimecodeLabel.textContent = timecode;
  const angle = activeAngle();
  elements.activeAngleLabel.textContent = angle ? angle.name : "No angle";
  elements.timelineSlider.max = String(maxFrame());
  elements.timelineSlider.value = String(state.timelineFrame);
  elements.mobileTimelineSlider.max = String(maxFrame());
  elements.mobileTimelineSlider.value = String(state.timelineFrame);
  elements.viewerEmpty.classList.toggle("hidden", Boolean(angle && proxyAvailable(angle)));
}

function wireMainVideo(options = {}) {
  ensureProgramVideos();
  ensureAudioMaster();
  const angle = activeAngle();
  if (!angle) {
    return;
  }
  const video = activeProgramVideo();
  if (!video) {
    return;
  }
  const shouldPlay = Boolean(options.playWhenReady && (state.isPlaying || state.shuttleRaf > 0));
  const startedAt = performance.now();
  updateProgramVideoVisibility();
  const syncPromise = seekVideoElementToTimeline(video, angle);
  if (shouldPlay) {
    syncPromise.then(() => {
      if (state.isPlaying && activeAngle()?.id === angle.id && video.paused) {
        video.play().catch(error => setStatus(`Playback blocked: ${error.message}`, true));
      }
    });
    keepProgramVideosPlaying();
  } else {
    syncPromise.catch(() => {});
  }
  syncPromise.finally(() => {
    activateProgramVideoWhenReady({
      waitForFrame: shouldPlay || options.reportSwitch,
      reportSwitch: options.reportSwitch,
      startedAt
    });
  });
}

function switchAngle(angleId) {
  if (!isReady() || angleId === state.activeAngleId) {
    return;
  }
  const wasPlaying = state.isPlaying;
  clearDecisionSelectionState();
  state.activeAngleId = angleId;
  recordDecision(angleId, { frame: state.timelineFrame });
  keepProgramVideosPlaying();
  activateProgramVideoWhenReady({
    waitForFrame: wasPlaying,
    reportSwitch: true,
    startedAt: performance.now()
  });
  renderTransport();
  renderBoundaryControls();
  renderDecisionList();
  renderTimeline();
  updateAngleActiveState();
}

function recordDecision(angleId, options = {}) {
  const frame = clampFrame(Number.isFinite(options.frame) ? options.frame : state.timelineFrame);
  const angle = angleById(angleId);
  if (!angle) {
    return;
  }
  const compacted = compactDecisions();
  const previous = compacted[compacted.length - 1];
  if (!options.force && previous && previous.frame === frame && previous.angleId === angleId) {
    return;
  }
  if (!options.keepRedo) {
    state.redoStack = [];
  }
  clearDecisionSelectionState();
  const replaced = state.decisions.find(item => item.frame === frame);
  const nextDecision = {
    frame,
    angleId,
    angleIndex: angle.index,
    cameraName: angle.name,
    recordedAt: new Date().toISOString()
  };
  if (options.trackHistory !== false) {
    pushDecisionHistory({
      before: replaced ? [replaced] : [],
      after: [nextDecision],
      label: replaced ? "camera switch changed" : "camera switch added"
    });
  }
  state.decisions = state.decisions.filter(item => item.frame !== frame);
  state.decisions.push(nextDecision);
  state.decisions.sort((a, b) => a.frame - b.frame);
  state.selectedDecisionFrame = frame;
  if (!options.skipAutosave) {
    scheduleProjectStateAutosave();
  }
}

function pushDecisionHistory(action) {
  state.undoStack.push({
    before: (action.before || []).map(cloneDecision),
    after: (action.after || []).map(cloneDecision),
    label: action.label || "camera decision edit"
  });
  state.redoStack = [];
}

function cloneDecision(decision) {
  return {
    frame: decision.frame,
    angleId: decision.angleId,
    angleIndex: decision.angleIndex,
    cameraName: decision.cameraName,
    recordedAt: decision.recordedAt
  };
}

function applyDecisionHistory(action, direction) {
  const removeRows = direction === "undo" ? action.after : action.before;
  const addRows = direction === "undo" ? action.before : action.after;
  const changedFrames = new Set([
    ...removeRows.map(decision => decision.frame),
    ...addRows.map(decision => decision.frame)
  ]);
  state.decisions = state.decisions.filter(decision => !changedFrames.has(decision.frame));
  for (const decision of addRows) {
    if (angleById(decision.angleId)) {
      state.decisions.push(cloneDecision(decision));
    }
  }
  state.decisions.sort((a, b) => a.frame - b.frame);
  const selected = addRows[0] || activeDecisionAtFrame(state.timelineFrame) || state.decisions[0];
  state.selectedDecisionFrame = selected?.frame ?? 0;
}

function finishDecisionHistoryChange(status) {
  const active = activeDecisionAtFrame(state.timelineFrame);
  if (active) {
    state.activeAngleId = active.angleId;
    keepProgramVideosPlaying();
    activateProgramVideoWhenReady({ waitForFrame: state.isPlaying });
  }
  renderDecisionEditState();
  scheduleProjectStateAutosave();
  setStatus(status);
}

function compactDecisions() {
  const byFrame = new Map();
  for (const decision of state.decisions) {
    byFrame.set(decision.frame, decision);
  }
  const rows = [...byFrame.values()].sort((a, b) => a.frame - b.frame);
  const compacted = [];
  for (const row of rows) {
    if (compacted.length && compacted[compacted.length - 1].angleId === row.angleId) {
      continue;
    }
    compacted.push(row);
  }
  if (supportsCameraDecisions() && compacted[0]?.frame !== 0 && state.project.angles[0]) {
    const angle = state.project.angles[0];
    compacted.unshift({
      frame: 0,
      angleId: angle.id,
      angleIndex: angle.index,
      cameraName: angle.name,
      recordedAt: new Date().toISOString()
    });
  }
  return compacted;
}

function undoDecision() {
  if (!isReady() || state.undoStack.length === 0) {
    setStatus("No phone edits to undo.", true);
    renderAll();
    return;
  }
  clearDecisionSelectionState();
  const action = state.undoStack.pop();
  applyDecisionHistory(action, "undo");
  state.redoStack.push(action);
  finishDecisionHistoryChange(`Undid ${action.label}.`);
}

function redoDecision() {
  if (!isReady() || state.redoStack.length === 0) {
    return;
  }
  clearDecisionSelectionState();
  const action = state.redoStack.pop();
  applyDecisionHistory(action, "redo");
  state.undoStack.push(action);
  finishDecisionHistoryChange(`Redid ${action.label}.`);
}

function handleDecisionTap(event, frame) {
  if (state.suppressDecisionClickFrame === frame) {
    state.suppressDecisionClickFrame = null;
    event.preventDefault();
    return;
  }
  if (state.decisionSelectionMode) {
    event.preventDefault();
    toggleDecisionSelection(frame);
    return;
  }
  selectDecision(frame, { seek: true });
}

function startDecisionLongPress(event, frame) {
  if (!isReady() || event.button > 0) {
    return;
  }
  clearDecisionLongPress();
  const gesture = {
    pointerId: event.pointerId,
    frame,
    startX: event.clientX,
    startY: event.clientY,
    fired: false,
    timer: 0
  };
  gesture.timer = setTimeout(() => {
    gesture.fired = true;
    state.suppressDecisionClickFrame = frame;
    enterDecisionSelection(frame);
  }, 560);
  state.decisionLongPress = gesture;
  window.addEventListener("pointermove", moveDecisionLongPress);
  window.addEventListener("pointerup", endDecisionLongPress, { once: true });
  window.addEventListener("pointercancel", endDecisionLongPress, { once: true });
}

function moveDecisionLongPress(event) {
  const gesture = state.decisionLongPress;
  if (!gesture || event.pointerId !== gesture.pointerId) {
    return;
  }
  const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
  if (distance > 12) {
    clearDecisionLongPress();
  }
}

function endDecisionLongPress(event) {
  const gesture = state.decisionLongPress;
  if (gesture && event.pointerId === gesture.pointerId && gesture.fired) {
    state.suppressDecisionClickFrame = gesture.frame;
  }
  clearDecisionLongPress();
}

function clearDecisionLongPress() {
  if (state.decisionLongPress?.timer) {
    clearTimeout(state.decisionLongPress.timer);
  }
  state.decisionLongPress = null;
  window.removeEventListener("pointermove", moveDecisionLongPress);
  window.removeEventListener("pointerup", endDecisionLongPress);
  window.removeEventListener("pointercancel", endDecisionLongPress);
}

function enterDecisionSelection(frame) {
  if (!canSelectDecisionForDelete(frame)) {
    setStatus("The starting camera at frame 0 stays fixed.", true);
    return;
  }
  pausePlayback({ silent: true });
  clearMarkerSelectionState();
  state.decisionSelectionMode = true;
  state.selectedDecisionFrames.add(frame);
  state.selectedDecisionFrame = frame;
  renderAll();
  setStatus("Selection mode. Tap more cuts to add or remove them.");
}

function toggleDecisionSelection(frame) {
  if (!canSelectDecisionForDelete(frame)) {
    setStatus("The starting camera at frame 0 stays fixed.", true);
    return;
  }
  if (state.selectedDecisionFrames.has(frame)) {
    state.selectedDecisionFrames.delete(frame);
  } else {
    state.selectedDecisionFrames.add(frame);
    state.selectedDecisionFrame = frame;
  }
  if (state.selectedDecisionFrames.size === 0) {
    exitDecisionSelection({ status: "Selection cleared." });
  } else {
    renderAll();
  }
}

function canSelectDecisionForDelete(frame) {
  const targetFrame = Math.round(Number(frame));
  return Number.isFinite(targetFrame)
    && targetFrame > 0
    && state.decisions.some(decision => decision.frame === targetFrame);
}

function exitDecisionSelection(options = {}) {
  clearDecisionSelectionState();
  renderAll();
  if (options.status) {
    setStatus(options.status);
  }
}

function clearDecisionSelectionState() {
  clearDecisionLongPress();
  state.decisionSelectionMode = false;
  state.selectedDecisionFrames.clear();
  state.suppressDecisionClickFrame = null;
}

function deleteSelectedDecisionFrames() {
  if (!isReady()) {
    return;
  }
  const targetFrames = [...state.selectedDecisionFrames]
    .map(frame => Math.round(Number(frame)))
    .filter(frame => canSelectDecisionForDelete(frame))
    .sort((a, b) => a - b);
  if (!targetFrames.length) {
    exitDecisionSelection({ status: "Selection cleared." });
    return;
  }
  const frameSet = new Set(targetFrames);
  const removed = state.decisions.filter(decision => frameSet.has(decision.frame));
  if (!removed.length) {
    exitDecisionSelection({ status: "Selection cleared." });
    return;
  }
  pushDecisionHistory({
    before: removed,
    after: [],
    label: removed.length === 1 ? "camera switch deletion" : "camera switch deletion batch"
  });
  state.decisions = state.decisions.filter(decision => !frameSet.has(decision.frame));
  state.decisionSelectionMode = false;
  state.selectedDecisionFrames.clear();
  state.suppressDecisionClickFrame = null;
  const active = activeDecisionAtFrame(state.timelineFrame);
  state.selectedDecisionFrame = active?.frame ?? state.decisions[state.decisions.length - 1]?.frame ?? 0;
  if (active) {
    state.activeAngleId = active.angleId;
    keepProgramVideosPlaying();
    activateProgramVideoWhenReady({ waitForFrame: state.isPlaying });
  }
  renderDecisionEditState();
  scheduleProjectStateAutosave();
  setStatus(`Deleted ${removed.length} selected cut${removed.length === 1 ? "" : "s"}.`);
}

function selectedDecision() {
  if (state.selectedDecisionFrame === null) {
    return null;
  }
  return compactDecisions().find(decision => decision.frame === state.selectedDecisionFrame) || null;
}

function selectDecision(frame, options = {}) {
  const decision = compactDecisions().find(item => item.frame === frame);
  if (!decision) {
    return;
  }
  state.selectedDecisionFrame = decision.frame;
  if (options.seek) {
    pausePlayback({ silent: true });
    setTimelineFrame(decision.frame, { syncVideos: true, persist: true });
  }
  scheduleProjectStateAutosave();
  renderAll();
}

function selectAdjacentDecision(direction) {
  if (!isReady()) {
    return;
  }
  const decisions = compactDecisions();
  if (!decisions.length) {
    return;
  }
  const referenceFrame = state.selectedDecisionFrame ?? state.timelineFrame;
  let index = decisions.findIndex(decision => decision.frame === referenceFrame);
  if (index < 0) {
    index = direction > 0
      ? decisions.findIndex(decision => decision.frame > referenceFrame)
      : [...decisions].reverse().findIndex(decision => decision.frame < referenceFrame);
    if (direction < 0 && index >= 0) {
      index = decisions.length - 1 - index;
    }
  } else {
    index += direction;
  }
  index = Math.max(0, Math.min(decisions.length - 1, index));
  selectDecision(decisions[index].frame, { seek: true });
}

function nudgeSelectedDecision(delta) {
  if (!isReady()) {
    return;
  }
  const decisions = compactDecisions();
  const selected = selectedDecision();
  if (!selected || selected.frame <= 0) {
    setStatus("The starting camera at frame 0 stays fixed.", true);
    return;
  }
  const index = decisions.findIndex(decision => decision.frame === selected.frame);
  if (index <= 0) {
    return;
  }
  const previousFrame = decisions[index - 1].frame;
  const nextFrame = index + 1 < decisions.length ? decisions[index + 1].frame : maxFrame() + 1;
  const targetFrame = Math.max(previousFrame + 1, Math.min(nextFrame - 1, selected.frame + delta));
  if (targetFrame === selected.frame) {
    setStatus("Cut boundary cannot cross the neighboring cut.", true);
    return;
  }
  const editable = state.decisions.find(decision => decision.frame === selected.frame && decision.angleId === selected.angleId);
  if (!editable) {
    return;
  }
  const before = cloneDecision(editable);
  clearDecisionSelectionState();
  editable.frame = targetFrame;
  editable.recordedAt = new Date().toISOString();
  pushDecisionHistory({
    before: [before],
    after: [editable],
    label: "camera switch timing change"
  });
  state.decisions.sort((a, b) => a.frame - b.frame);
  state.selectedDecisionFrame = targetFrame;
  pausePlayback({ silent: true });
  setTimelineFrame(targetFrame, { syncVideos: true });
  renderAll();
  scheduleProjectStateAutosave();
  setStatus(`Moved cut to ${framesToTimecode(targetFrame, state.project.fps)}.`);
}

function activeDecisionAtFrame(frame) {
  let active = null;
  for (const decision of compactDecisions()) {
    if (decision.frame <= frame) {
      active = decision;
    }
  }
  return active;
}

function setTimelineFrame(frame, options = {}) {
  state.timelineFrame = clampFrame(Math.round(frame));
  const active = activeDecisionAtFrame(state.timelineFrame);
  if (active && active.angleId !== state.activeAngleId) {
    state.activeAngleId = active.angleId;
    keepProgramVideosPlaying();
    activateProgramVideoWhenReady({ waitForFrame: state.isPlaying || state.shuttleRaf > 0 });
  }
  if (active && options.followActiveDecision) {
    state.selectedDecisionFrame = active.frame;
  }
  if (options.syncVideos) {
    syncAllVideos();
  }
  if (options.persist) {
    scheduleProjectStateAutosave();
  }
  renderTimeline();
  updateDecisionListActiveState({
    follow: Boolean(options.followDecisionList ?? (state.isPlaying && state.decisionListAutoFollow)),
    force: Boolean(options.forceDecisionListFollow)
  });
  updateMarkerListActiveState({
    follow: Boolean(options.followMarkerList ?? (state.isPlaying && state.markerListAutoFollow)),
    force: Boolean(options.forceMarkerListFollow)
  });
}

function syncAllVideos() {
  ensureProgramVideos();
  ensureAudioMaster();
  syncAudioMasterToTimeline();
  for (const entry of state.programVideos.values()) {
    const programAngle = angleById(entry.angleId);
    if (programAngle) {
      syncVideoElement(entry.video, programAngle);
    }
  }
  for (const preview of state.gridVideos.values()) {
    const gridAngle = angleById(preview.angleId);
    if (gridAngle) {
      syncVideoElement(preview.video, gridAngle);
    }
  }
}

function maintainProgramVideoSync() {
  if ((!state.isPlaying && !state.shuttleRaf) || !state.project) {
    return;
  }
  const now = performance.now();
  if (now - state.lastProgramSyncMs < VIDEO_SYNC_INTERVAL_MS) {
    return;
  }
  state.lastProgramSyncMs = now;
  const clockTime = playbackClockTimelineSeconds();
  for (const entry of state.programVideos.values()) {
    const angle = angleById(entry.angleId);
    if (!angle || entry.video.readyState < 1) {
      continue;
    }
    const target = videoTimeForAngleAtTimelineSeconds(angle, clockTime);
    gentlyCorrectMediaDrift(entry.video, target, {
      softTolerance: PROGRAM_SOFT_SYNC_TOLERANCE_SECONDS,
      hardTolerance: PROGRAM_HARD_SYNC_TOLERANCE_SECONDS
    });
  }
  maintainPreviewVideoSync(clockTime);
}

function maintainPreviewVideoSync(clockTime = playbackClockTimelineSeconds()) {
  if (!state.project) {
    return;
  }
  for (const preview of state.gridVideos.values()) {
    const angle = angleById(preview.angleId);
    const video = preview.video;
    if (!angle || !video || video.readyState < 1) {
      continue;
    }
    const target = videoTimeForAngleAtTimelineSeconds(angle, clockTime);
    gentlyCorrectMediaDrift(video, target, {
      softTolerance: PREVIEW_SOFT_SYNC_TOLERANCE_SECONDS,
      hardTolerance: PREVIEW_HARD_SYNC_TOLERANCE_SECONDS
    });
  }
}

function gentlyCorrectMediaDrift(media, target, options) {
  const drift = target - (media.currentTime || 0);
  if (Math.abs(drift) > options.hardTolerance) {
    try {
      media.currentTime = Math.max(0, target);
    } catch {
      // Metadata may not be ready yet; the next sync pass will retry.
    }
    setMediaPlaybackRate(media, state.reviewPlaybackRate);
    return;
  }
  if (Math.abs(drift) <= options.softTolerance) {
    setMediaPlaybackRate(media, state.reviewPlaybackRate);
    return;
  }
  const correction = drift > 0 ? SYNC_RATE_ADJUSTMENT : -SYNC_RATE_ADJUSTMENT;
  setMediaPlaybackRate(media, state.reviewPlaybackRate * (1 + correction));
}

function keepProgramVideosPlaying() {
  if (!state.isPlaying && !state.shuttleRaf) {
    return;
  }
  updateProgramVideoVisibility();
  for (const entry of state.programVideos.values()) {
    if (entry.video.paused) {
      entry.video.play().catch(() => {});
    }
  }
  const audio = ensureAudioMaster();
  if (audio?.paused) {
    audio.play().catch(() => {});
  }
}

function syncAudioMasterToTimeline() {
  const audio = ensureAudioMaster();
  const angle = audioMasterAngle();
  if (!audio || !angle) {
    return;
  }
  syncVideoElement(audio, angle);
}

function playbackClockTimelineSeconds() {
  const audio = ensureAudioMaster();
  const angle = audioMasterAngle();
  if (audio && angle && audio.readyState >= 1) {
    return Math.max(0, (audio.currentTime || 0) - angle.proxySyncOffsetFrames / state.project.fps);
  }
  const active = activeProgramVideo();
  const activeAngleValue = activeAngle();
  if (active && activeAngleValue && active.readyState >= 1) {
    return Math.max(0, (active.currentTime || 0) - activeAngleValue.proxySyncOffsetFrames / state.project.fps);
  }
  return state.timelineFrame / state.project.fps;
}

function syncVideoElement(video, angle) {
  const target = videoTimeForAngle(angle);
  if (!Number.isFinite(video.duration) || target <= video.duration + 0.1) {
    if (Math.abs((video.currentTime || 0) - target) > 0.08) {
      try {
        video.currentTime = Math.max(0, target);
      } catch {
        // Some mobile browsers reject seeks before metadata is ready.
      }
    }
  }
}

function seekVideoElementToTimeline(video, angle) {
  if (video.readyState >= 1) {
    return seekLoadedVideoToTimeline(video, angle);
  }
  return new Promise(resolve => {
    let settled = false;
    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener("loadedmetadata", finish);
      video.removeEventListener("error", failOpen);
    };
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve(seekLoadedVideoToTimeline(video, angle));
    };
    const failOpen = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve();
    };
    const timeout = setTimeout(failOpen, 1500);
    video.addEventListener("loadedmetadata", finish, { once: true });
    video.addEventListener("error", failOpen, { once: true });
  });
}

function seekLoadedVideoToTimeline(video, angle) {
  const target = videoTimeForAngle(angle);
  const boundedTarget = Math.max(0, target);
  if (Number.isFinite(video.duration) && boundedTarget > video.duration + 0.1) {
    return Promise.resolve();
  }
  if (Math.abs((video.currentTime || 0) - boundedTarget) <= 0.08) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    let done = false;
    const finish = () => {
      if (done) {
        return;
      }
      done = true;
      clearTimeout(timeout);
      video.removeEventListener("seeked", finish);
      video.removeEventListener("timeupdate", checkSettled);
      resolve();
    };
    const checkSettled = () => {
      if (Math.abs((video.currentTime || 0) - boundedTarget) <= 0.08) {
        finish();
      }
    };
    const timeout = setTimeout(finish, 900);
    video.addEventListener("seeked", finish);
    video.addEventListener("timeupdate", checkSettled);
    try {
      video.currentTime = boundedTarget;
    } catch {
      finish();
    }
    checkSettled();
  });
}

function videoTimeForAngle(angle) {
  return Math.max(0, (state.timelineFrame + angle.proxySyncOffsetFrames) / state.project.fps);
}

function videoTimeForAngleAtTimelineSeconds(angle, timelineSeconds) {
  return Math.max(0, timelineSeconds + angle.proxySyncOffsetFrames / state.project.fps);
}

function startViewerLongPress(event) {
  if (!isReady() || event.button > 0) {
    return;
  }
  clearViewerLongPress();
  const gesture = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    frame: state.timelineFrame,
    fired: false,
    timer: 0
  };
  gesture.timer = setTimeout(() => {
    gesture.fired = true;
    state.suppressViewerTap = true;
    openPreviewActionMenu(gesture.frame);
  }, 650);
  state.viewerLongPress = gesture;
  window.addEventListener("pointermove", moveViewerLongPress);
  window.addEventListener("pointerup", endViewerLongPress, { once: true });
  window.addEventListener("pointercancel", endViewerLongPress, { once: true });
}

function moveViewerLongPress(event) {
  const gesture = state.viewerLongPress;
  if (!gesture || event.pointerId !== gesture.pointerId) {
    return;
  }
  const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
  if (distance > 14) {
    clearViewerLongPress();
  }
}

function endViewerLongPress(event) {
  const gesture = state.viewerLongPress;
  if (gesture && event.pointerId === gesture.pointerId && gesture.fired) {
    state.suppressViewerTap = true;
  }
  clearViewerLongPress();
}

function clearViewerLongPress() {
  if (state.viewerLongPress?.timer) {
    clearTimeout(state.viewerLongPress.timer);
  }
  state.viewerLongPress = null;
  window.removeEventListener("pointermove", moveViewerLongPress);
  window.removeEventListener("pointerup", endViewerLongPress);
  window.removeEventListener("pointercancel", endViewerLongPress);
}

function startAnglePreviewSwipe(event) {
  if (!isReady() || event.button > 0) {
    return;
  }
  clearAnglePreviewSwipe();
  state.angleSwipeGesture = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    horizontal: false
  };
  window.addEventListener("pointermove", moveAnglePreviewSwipe, { passive: false });
  window.addEventListener("pointerup", endAnglePreviewSwipe, { once: true });
  window.addEventListener("pointercancel", clearAnglePreviewSwipe, { once: true });
}

function moveAnglePreviewSwipe(event) {
  const gesture = state.angleSwipeGesture;
  if (!gesture || event.pointerId !== gesture.pointerId) {
    return;
  }
  const dx = event.clientX - gesture.startX;
  const dy = event.clientY - gesture.startY;
  if (Math.abs(dy) > ANGLE_SWIPE_MAX_VERTICAL_PX && Math.abs(dy) > Math.abs(dx)) {
    clearAnglePreviewSwipe();
    return;
  }
  if (Math.abs(dx) > 16 && Math.abs(dx) > Math.abs(dy) * 1.25) {
    gesture.horizontal = true;
    event.preventDefault();
  }
}

function endAnglePreviewSwipe(event) {
  const gesture = state.angleSwipeGesture;
  if (!gesture || event.pointerId !== gesture.pointerId) {
    clearAnglePreviewSwipe();
    return;
  }
  const dx = event.clientX - gesture.startX;
  const dy = event.clientY - gesture.startY;
  const qualifies = gesture.horizontal
    && Math.abs(dx) >= ANGLE_SWIPE_MIN_PX
    && Math.abs(dy) <= ANGLE_SWIPE_MAX_VERTICAL_PX;
  clearAnglePreviewSwipe();
  if (!qualifies) {
    return;
  }
  state.suppressAnglePreviewClickUntil = performance.now() + 500;
  event.preventDefault();
  removeCurrentCameraCut();
}

function clearAnglePreviewSwipe() {
  state.angleSwipeGesture = null;
  window.removeEventListener("pointermove", moveAnglePreviewSwipe);
  window.removeEventListener("pointerup", endAnglePreviewSwipe);
  window.removeEventListener("pointercancel", clearAnglePreviewSwipe);
}

function removeCurrentCameraCut() {
  if (!isReady()) {
    return false;
  }
  const decisions = compactDecisions();
  const current = activeDecisionAtFrame(state.timelineFrame);
  const currentIndex = decisions.findIndex(decision => decision.frame === current?.frame);
  if (!current || currentIndex <= 0) {
    setStatus("This is the starting camera; there is no previous angle to restore.", true);
    return false;
  }
  const previous = decisions[currentIndex - 1];
  const removed = state.decisions.filter(decision => decision.frame === current.frame);
  if (!removed.length) {
    return false;
  }
  pushDecisionHistory({
    before: removed,
    after: [],
    label: "current camera cut removal"
  });
  state.decisions = state.decisions.filter(decision => decision.frame !== current.frame);
  state.selectedDecisionFrame = previous.frame;
  state.activeAngleId = previous.angleId;
  clearDecisionSelectionState();
  keepProgramVideosPlaying();
  activateProgramVideoWhenReady({ waitForFrame: state.isPlaying || state.shuttleRaf > 0 });
  renderDecisionEditState();
  scheduleProjectStateAutosave();
  showCutCorrectionFeedback(previous.cameraName || previous.angleId);
  if (navigator.vibrate) {
    navigator.vibrate(18);
  }
  return true;
}

function openPreviewActionMenu(frame) {
  pausePlayback({ silent: true });
  exitDecisionSelection();
  if (state.markerSelectionMode) {
    state.markerSelectionMode = false;
    state.selectedMarkerIds.clear();
  }
  const targetFrame = clampFrame(frame);
  state.previewActionFrame = targetFrame;
  state.selectedMarkerCategory = "note";
  elements.previewActionSummary.textContent = `Note at ${framesToTimecode((state.project.timelineStartFrame || 0) + targetFrame, state.project.fps)}`;
  elements.markerNoteInput.value = "";
  renderMarkerCategoryButtons();
  elements.previewActionMenu.classList.remove("hidden");
  elements.markerNoteInput.focus();
  setStatus("Add a note for this moment, then save the marker.");
}

function closePreviewActionMenu(options = {}) {
  state.previewActionFrame = null;
  state.selectedMarkerCategory = "note";
  elements.previewActionMenu.classList.add("hidden");
  elements.markerNoteInput.value = "";
  if (options.status) {
    setStatus(options.status);
  }
}

function savePreviewMarker() {
  if (!isReady() || state.previewActionFrame === null) {
    closePreviewActionMenu();
    return;
  }
  const frame = clampFrame(state.previewActionFrame);
  const note = elements.markerNoteInput.value.trim();
  const category = markerCategoryById(state.selectedMarkerCategory);
  state.markers.push({
    id: `marker_${cryptoRandomId()}`,
    frame,
    category: category.id,
    label: category.label,
    color: category.color,
    note,
    createdAt: new Date().toISOString(),
    source: "peco_mobile_review"
  });
  state.markers.sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
  scheduleProjectStateAutosave();
  closePreviewActionMenu();
  renderMarkerList();
  setStatus(`Saved ${category.label} note at ${framesToTimecode((state.project.timelineStartFrame || 0) + frame, state.project.fps)}.`);
}

function handleViewerTap(event) {
  if (!isReady()) {
    return;
  }
  if (state.suppressViewerTap) {
    state.suppressViewerTap = false;
    event.preventDefault();
    return;
  }
  if (!elements.previewActionMenu.classList.contains("hidden")) {
    return;
  }
  const rect = elements.viewerFrame.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const side = x < rect.width * EDGE_TAP_RATIO
    ? "left"
    : x > rect.width * (1 - EDGE_TAP_RATIO)
      ? "right"
      : "center";
  const now = performance.now();
  const previous = state.tapGesture.lastTap;
  if (previous && side !== "center" && previous.side === side && now - previous.time <= DOUBLE_TAP_MS) {
    clearTimeout(state.tapGesture.timer);
    state.tapGesture.lastTap = null;
    seekRelativeSeconds(side === "left" ? -EDGE_SEEK_SECONDS : EDGE_SEEK_SECONDS);
    showSkipFeedback(side, side === "left" ? `-${EDGE_SEEK_SECONDS}s` : `+${EDGE_SEEK_SECONDS}s`);
    return;
  }
  clearTimeout(state.tapGesture.timer);
  const tap = { side, time: now };
  state.tapGesture.lastTap = tap;
  state.tapGesture.timer = setTimeout(() => {
    if (state.tapGesture.lastTap !== tap) {
      return;
    }
    state.tapGesture.lastTap = null;
    togglePlayback();
  }, DOUBLE_TAP_MS + 30);
}

function seekRelativeSeconds(seconds) {
  if (!isReady()) {
    return;
  }
  const wasPlaying = state.isPlaying;
  if (wasPlaying) {
    pausePlayback({ silent: true });
  }
  const deltaFrames = Math.round(seconds * state.project.fps);
  setTimelineFrame(state.timelineFrame + deltaFrames, {
    syncVideos: true,
    followActiveDecision: true,
    persist: true
  });
  if (wasPlaying) {
    playFromCurrentFrame();
  } else {
    setStatus(`${seconds < 0 ? "Back" : "Forward"} ${Math.abs(seconds)} seconds.`);
  }
}

function showSkipFeedback(side, label) {
  clearTimeout(state.skipFeedbackTimer);
  elements.skipFeedback.textContent = label;
  elements.skipFeedback.classList.remove("hidden", "left", "right", "correction");
  elements.skipFeedback.classList.add(side);
  state.skipFeedbackTimer = setTimeout(() => {
    elements.skipFeedback.classList.add("hidden");
    elements.skipFeedback.classList.remove("left", "right", "correction");
  }, 520);
}

function showCutCorrectionFeedback(cameraName) {
  clearTimeout(state.skipFeedbackTimer);
  elements.skipFeedback.textContent = `Cut removed | Back to ${cameraName}`;
  elements.skipFeedback.classList.remove("hidden", "left", "right");
  elements.skipFeedback.classList.add("correction");
  setStatus(`Removed the current cut. ${cameraName} now continues to the next decision.`);
  state.skipFeedbackTimer = setTimeout(() => {
    elements.skipFeedback.classList.add("hidden");
    elements.skipFeedback.classList.remove("correction");
  }, 900);
}

function togglePlayback() {
  if (state.isPlaying) {
    pausePlayback();
  } else {
    playFromCurrentFrame();
  }
}

function playFromCurrentFrame() {
  if (!isReady()) {
    return;
  }
  const angle = activeAngle();
  if (!angle) {
    return;
  }
  syncAllVideos();
  state.isPlaying = true;
  enableDecisionListAutoFollow({ center: true });
  enableMarkerListAutoFollow({ center: true });
  playSyncedProgramVideos().then(() => {
    for (const preview of state.gridVideos.values()) {
      preview.video.play().catch(() => {});
    }
    startPlaybackLoop();
    renderTransport();
    setStatus("Playing.");
  }).catch(error => {
    state.isPlaying = false;
    state.pendingMainVideoSwap = false;
    pauseReviewVideos();
    renderTransport();
    setStatus(`Playback blocked: ${error.message}`, true);
  });
}

function playSyncedMainVideo() {
  return playSyncedProgramVideos();
}

function playSyncedProgramVideos() {
  ensureProgramVideos();
  const audio = ensureAudioMaster();
  const audioAngle = audioMasterAngle();
  if (!audio || !audioAngle) {
    return Promise.reject(new Error("Floater audio is unavailable in this review package."));
  }
  setReviewPlaybackRate(1);
  state.visibleAngleId = state.activeAngleId;
  updateProgramVideoVisibility();
  state.pendingMainVideoSwap = true;
  const entries = [...state.programVideos.values()];
  const activeEntry = state.programVideos.get(state.activeAngleId);
  const seekPromises = entries.map(entry => {
    const angle = angleById(entry.angleId);
    return angle ? seekVideoElementToTimeline(entry.video, angle) : Promise.resolve();
  });
  seekPromises.push(seekVideoElementToTimeline(audio, audioAngle));
  return Promise.all(seekPromises).then(() => {
    state.pendingMainVideoSwap = false;
    state.visibleAngleId = state.activeAngleId;
    updateProgramVideoVisibility();
    const plays = entries.map(entry => {
      const play = entry.video.play();
      if (entry === activeEntry) {
        return play;
      }
      return play.catch(() => {});
    });
    plays.push(audio.play());
    return Promise.all(plays);
  }).then(() => {
    const activeVideo = activeProgramVideo();
    if (!activeVideo || activeVideo.paused || audio.paused) {
      throw new Error("Floater audio and the active angle could not start together.");
    }
  });
}

function pausePlayback(options = {}) {
  const wasPlaying = state.isPlaying || state.playbackRaf || state.shuttleRaf || !elements.audioMaster.paused;
  if (!wasPlaying) {
    return;
  }
  if (state.shuttleRaf) {
    stopShuttle();
  }
  state.isPlaying = false;
  setReviewPlaybackRate(1);
  elements.audioMaster.pause();
  for (const entry of state.programVideos.values()) {
    entry.video.pause();
  }
  for (const preview of state.gridVideos.values()) {
    preview.video.pause();
  }
  cancelAnimationFrame(state.playbackRaf);
  state.playbackRaf = 0;
  renderTransport();
  if (!options.silent) {
    scheduleProjectStateAutosave();
    setStatus("Paused.");
  }
}

function startPlaybackLoop() {
  cancelAnimationFrame(state.playbackRaf);
  const tick = () => {
    if (!state.isPlaying) {
      return;
    }
    if (state.pendingMainVideoSwap) {
      state.playbackRaf = requestAnimationFrame(tick);
      return;
    }
    const audio = ensureAudioMaster();
    const audioAngle = audioMasterAngle();
    if (audio && audioAngle) {
      const frame = Math.round(audio.currentTime * state.project.fps - audioAngle.proxySyncOffsetFrames);
      const timelineFrame = clampFrame(frame);
      if (timelineFrame >= maxFrame()) {
        pausePlayback();
        setTimelineFrame(maxFrame(), { syncVideos: true });
        return;
      }
      setTimelineFrame(timelineFrame, { syncVideos: false, followActiveDecision: true });
      maintainProgramVideoSync();
    }
    state.playbackRaf = requestAnimationFrame(tick);
  };
  state.playbackRaf = requestAnimationFrame(tick);
}

function stepFrames(delta) {
  pausePlayback();
  setTimelineFrame(state.timelineFrame + delta, { syncVideos: true, persist: true });
}

function startJog(event) {
  if (!isReady()) {
    return;
  }
  pausePlayback({ silent: true });
  elements.jogWheel.setPointerCapture(event.pointerId);
  elements.jogWheel.classList.add("dragging");
  state.jogDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startFrame: state.timelineFrame
  };
  window.addEventListener("pointermove", moveJog);
  window.addEventListener("pointerup", endJog, { once: true });
  window.addEventListener("pointercancel", endJog, { once: true });
}

function moveJog(event) {
  if (!state.jogDrag) {
    return;
  }
  const dx = event.clientX - state.jogDrag.startX;
  const clamped = Math.max(-JOG_MAX_DRAG_PX, Math.min(JOG_MAX_DRAG_PX, dx));
  elements.jogKnob.style.transform = `translateX(${clamped}px)`;
  elements.jogWheel.setAttribute("aria-valuenow", String(Math.round((clamped / JOG_MAX_DRAG_PX) * 100)));
  const abs = Math.abs(dx);
  const sign = Math.sign(dx);
  if (abs < JOG_CENTER_DEADZONE_PX) {
    stopShuttle();
    setTimelineFrame(state.jogDrag.startFrame, { syncVideos: true });
    elements.jogReadout.textContent = "Center stop";
    return;
  }
  if (abs < JOG_FRAME_SCRUB_PX) {
    stopShuttle();
    const delta = Math.round(dx / 9);
    setTimelineFrame(state.jogDrag.startFrame + delta, { syncVideos: true });
    elements.jogReadout.textContent = `${delta >= 0 ? "+" : ""}${delta} frame`;
    return;
  }
  const speedMultiplier = quantizedJogSpeed(abs);
  const speed = sign * state.project.fps * speedMultiplier;
  const audioNote = speed > 0 ? "" : " visual";
  elements.jogReadout.textContent = `${speed > 0 ? "Forward" : "Reverse"} ${speedMultiplier}x${audioNote}`;
  startShuttle(speed);
}

function quantizedJogSpeed(distance) {
  const range = Math.max(1, JOG_MAX_DRAG_PX - JOG_FRAME_SCRUB_PX);
  const normalized = Math.max(0, Math.min(1, (distance - JOG_FRAME_SCRUB_PX) / range));
  if (normalized < 0.34) {
    return JOG_SHUTTLE_SPEEDS[0];
  }
  if (normalized < 0.67) {
    return JOG_SHUTTLE_SPEEDS[1];
  }
  return JOG_SHUTTLE_SPEEDS[2];
}

function endJog() {
  stopShuttle();
  state.jogDrag = null;
  elements.jogWheel.classList.remove("dragging");
  elements.jogKnob.style.transform = "translateX(0)";
  elements.jogWheel.setAttribute("aria-valuenow", "0");
  elements.jogReadout.textContent = "Center stop";
  syncAllVideos();
  window.removeEventListener("pointermove", moveJog);
}

function startShuttle(speed) {
  state.shuttleSpeed = speed;
  const rate = Math.max(1, Math.abs(speed / state.project.fps));
  setReviewPlaybackRate(rate);
  if (speed > 0) {
    playFloaterJogAudio();
  } else {
    pauseReviewVideos();
  }
  if (state.shuttleRaf) {
    return;
  }
  state.lastShuttleTs = performance.now();
  const tick = timestamp => {
    const elapsed = Math.min(0.08, (timestamp - state.lastShuttleTs) / 1000);
    state.lastShuttleTs = timestamp;
    const forwardWithAudio = state.shuttleSpeed > 0 && !elements.audioMaster.paused;
    if (forwardWithAudio) {
      const angle = audioMasterAngle();
      const frame = angle
        ? Math.round(elements.audioMaster.currentTime * state.project.fps - angle.proxySyncOffsetFrames)
        : state.timelineFrame + state.shuttleSpeed * elapsed;
      setTimelineFrame(frame, { syncVideos: false, followActiveDecision: true });
      setReviewPlaybackRate(Math.max(1, Math.abs(state.shuttleSpeed / state.project.fps)));
      playFloaterJogAudio();
      maintainProgramVideoSync();
    } else {
      setTimelineFrame(state.timelineFrame + state.shuttleSpeed * elapsed, {
        syncVideos: true,
        followActiveDecision: true
      });
    }
    if (state.timelineFrame === 0 || state.timelineFrame === maxFrame()) {
      stopShuttle();
      return;
    }
    state.shuttleRaf = requestAnimationFrame(tick);
  };
  state.shuttleRaf = requestAnimationFrame(tick);
}

function stopShuttle() {
  cancelAnimationFrame(state.shuttleRaf);
  state.shuttleRaf = 0;
  state.shuttleSpeed = 0;
  setReviewPlaybackRate(1);
  if (!state.isPlaying) {
    pauseReviewVideos();
  }
}

function playFloaterJogAudio() {
  const angle = audioMasterAngle();
  const audio = ensureAudioMaster();
  if (!angle || !audio) {
    return;
  }
  const target = videoTimeForAngle(angle);
  if (audio.readyState >= 1 && Math.abs((audio.currentTime || 0) - target) > PROGRAM_HARD_SYNC_TOLERANCE_SECONDS) {
    syncVideoElement(audio, angle);
  }
  updateProgramVideoVisibility();
  if (audio.paused) {
    audio.play().catch(() => {});
  }
  for (const entry of state.programVideos.values()) {
    if (entry.video.paused) {
      entry.video.play().catch(() => {});
    }
  }
  for (const preview of state.gridVideos.values()) {
    if (preview.video.paused) {
      preview.video.play().catch(() => {});
    }
  }
}

function pauseReviewVideos() {
  elements.audioMaster.pause();
  for (const entry of state.programVideos.values()) {
    entry.video.pause();
  }
  for (const preview of state.gridVideos.values()) {
    preview.video.pause();
  }
}

function setReviewPlaybackRate(rate) {
  state.reviewPlaybackRate = rate;
  setMediaPlaybackRate(elements.audioMaster, rate);
  for (const entry of state.programVideos.values()) {
    setMediaPlaybackRate(entry.video, rate);
  }
  for (const preview of state.gridVideos.values()) {
    setMediaPlaybackRate(preview.video, rate);
  }
}

function setMediaPlaybackRate(media, rate) {
  try {
    media.playbackRate = rate;
  } catch {
    // Some mobile WebViews reject unsupported media playback rates.
  }
}

function handleKeydown(event) {
  if (!isReady() || event.target.matches("input, textarea")) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    stepFrames(event.shiftKey ? -10 : -1);
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    stepFrames(event.shiftKey ? 10 : 1);
    return;
  }
  const number = Number(event.key);
  if (Number.isInteger(number) && number > 0) {
    const angle = state.project.angles.find(item => item.index === number);
    if (angle) {
      switchAngle(angle.id);
    }
  }
}

async function exportCuts() {
  if (!isReady()) {
    return;
  }
  const payload = buildCutsPayload();
  const notesOnly = state.project.reviewMode === "notes_only";
  const filename = `${safeFilename(state.project.name)}${notesOnly ? ".peconotes.json" : ".pecocuts.json"}`;
  const bridge = nativeBridge();
  if (bridge?.exportCuts) {
    try {
      const result = await bridge.exportCuts({ filename, payload });
      if (result?.cancelled) {
        setStatus("Export cancelled.");
        return;
      }
      markProjectSentBack();
      setStatus(exportStatusMessage(payload, notesOnly));
      return;
    } catch (error) {
      setStatus(`Native export failed: ${error.message}`, true);
      return;
    }
  }
  const delivery = await shareOrDownloadJson(filename, payload);
  if (delivery.cancelled) {
    setStatus("Export cancelled.");
    return;
  }
  markProjectSentBack();
  setStatus(exportStatusMessage(payload, notesOnly));
}

function markProjectSentBack() {
  if (!state.project?.id) {
    return;
  }
  try {
    localStorage.setItem(`${PROJECT_RETURN_STORAGE_PREFIX}${state.project.id}`, new Date().toISOString());
  } catch {
    // Return status is optional when browser preferences are blocked.
  }
  renderReviewLibrary();
}

function exportStatusMessage(payload, notesOnly) {
  const noteCount = payload.review_markers.length;
  if (notesOnly) {
    return `Exported ${noteCount} review note${noteCount === 1 ? "" : "s"}. Send the .peconotes.json file back to PECO.`;
  }
  return `Exported ${payload.selected_camera_changes.length} camera decision(s) and ${noteCount} review note${noteCount === 1 ? "" : "s"}. Send the .pecocuts.json file back to PECO.`;
}

async function saveCutsToServer() {
  if (!isReady() || !state.server.available) {
    return;
  }
  try {
    const payload = buildCutsPayload();
    const response = await fetch("/api/save-cuts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error((result.errors || []).join(" ") || response.statusText);
    }
    markProjectSentBack();
    setStatus(`Saved ${result.decision_count} decision(s) to ${result.path}.`);
  } catch (error) {
    setStatus(`Save to PC failed: ${error.message}`, true);
  }
}

function buildCutsPayload() {
  const project = state.project;
  const changes = compactDecisions();
  const reviewerName = elements.reviewerInput.value.trim();
  const notesOnly = project.reviewMode === "notes_only";
  return {
    schema: notesOnly ? NOTES_SCHEMA : CUTS_SCHEMA,
    project_id: project.id,
    project_name: project.name,
    fps: project.fps,
    duration_frames: project.durationFrames,
    duration_seconds: Number((project.durationFrames / project.fps).toFixed(6)),
    timeline_start_timecode: project.timelineStartTimecode,
    reviewer: {
      name: reviewerName
    },
    review_mode: project.reviewMode,
    package_metadata: cloneJsonValue(project.packageMetadata || {}),
    source_clip_mapping: project.angles.map(angle => ({
      angle_id: angle.id,
      angle_index: angle.index,
      camera_name: angle.name,
      proxy_filename: angle.proxyFilename,
      original_source_filename: angle.originalSourceFilename,
      original_source_timecode_start: angle.originalSourceTimecodeStart,
      sync_offset_frames: angle.syncOffsetFrames,
      proxy_sync_offset_frames: angle.proxySyncOffsetFrames
    })),
    selected_camera_changes: (notesOnly ? [] : changes).map(decision => {
      const angle = angleById(decision.angleId);
      const sourceFrame = decision.frame + angle.syncOffsetFrames;
      return {
        timeline_frame: decision.frame,
        timeline_timecode: framesToTimecode(project.timelineStartFrame + decision.frame, project.fps),
        angle_id: angle.id,
        angle_index: angle.index,
        camera_name: angle.name,
        source_frame: sourceFrame,
        source_timecode: framesToTimecode(angle.originalSourceStartFrame + sourceFrame, project.fps),
        original_source_filename: angle.originalSourceFilename,
        proxy_filename: angle.proxyFilename,
        proxy_sync_offset_frames: angle.proxySyncOffsetFrames,
        recorded_at: decision.recordedAt
      };
    }),
    review_markers: state.markers.map(marker => {
      const sourceAngle = project.angles[0];
      const sourceFrame = marker.frame + Number(sourceAngle?.syncOffsetFrames || 0);
      const category = markerCategoryById(marker.category);
      return {
        marker_id: marker.id,
        timeline_frame: marker.frame,
        timeline_timecode: framesToTimecode(project.timelineStartFrame + marker.frame, project.fps),
        category: category.id,
        label: marker.label || category.label,
        color: marker.color || category.color,
        note: marker.note,
        source_frame: sourceFrame,
        source_timecode: framesToTimecode(Number(sourceAngle?.originalSourceStartFrame || 0) + sourceFrame, project.fps),
        original_source_filename: sourceAngle?.originalSourceFilename || "",
        created_at: marker.createdAt,
        source: marker.source || "peco_mobile_review"
      };
    }),
    exported_at: new Date().toISOString(),
    exported_by: "PECO Mobile Review"
  };
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareOrDownloadJson(filename, payload) {
  const json = JSON.stringify(payload, null, 2);
  const file = new File([json], filename, { type: "application/json" });
  const touchDevice = window.matchMedia?.("(pointer: coarse)")?.matches || navigator.maxTouchPoints > 1;
  if (touchDevice && navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `${state.project.name} PECO review`,
        text: state.project.reviewMode === "notes_only" ? "PECO review notes" : "PECO camera decisions and review notes",
        files: [file]
      });
      return { shared: true, cancelled: false };
    } catch (error) {
      if (error?.name === "AbortError") {
        return { shared: false, cancelled: true };
      }
    }
  }
  downloadJson(filename, payload);
  return { shared: false, cancelled: false };
}

function isReady() {
  if (!state.project || !state.project.angles.length) {
    return false;
  }
  if (state.project.reviewMode !== "notes_only" && state.project.angles.length < 2) {
    return false;
  }
  return state.project.angles.every(angle => proxyAvailable(angle));
}

function supportsCameraDecisions(project = state.project) {
  return Boolean(project && project.reviewMode !== "notes_only" && project.angles.length >= 2);
}

function proxyAvailable(angle) {
  return Boolean(proxyFileFor(angle) || state.remoteProxyUrls.get(angle.id));
}

function activeAngle() {
  return angleById(state.activeAngleId);
}

function angleById(angleId) {
  return state.project?.angles.find(angle => angle.id === angleId) || null;
}

function maxFrame() {
  return Math.max(0, (state.project?.durationFrames || 1) - 1);
}

function clampFrame(frame) {
  return Math.max(0, Math.min(maxFrame(), Math.round(frame)));
}

function framesToTimecode(frame, fps) {
  const rate = Math.max(1, Math.round(Number(fps) || 30));
  const total = Math.max(0, Math.round(frame));
  const frames = total % rate;
  const totalSeconds = Math.floor(total / rate);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

function parseTimecodeToFrames(value, fps) {
  const match = String(value || "00:00:00:00").match(/^(\d{2,}):([0-5]\d):([0-5]\d)[:;](\d{2})$/);
  if (!match) {
    return 0;
  }
  const rate = Math.max(1, Math.round(Number(fps) || 30));
  const [, hh, mm, ss, ff] = match.map(Number);
  if (ff >= rate) {
    return 0;
  }
  return (((hh * 60 + mm) * 60 + ss) * rate) + ff;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function safeFilename(value) {
  return String(value || "mobile_multicam")
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase() || "mobile_multicam";
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `project_${Date.now().toString(36)}`;
}

function setStatus(message, isError = false) {
  elements.statusLine.textContent = message;
  elements.statusContainer.classList.toggle("error", Boolean(isError));
}

async function prepareAppUpdateState() {
  elements.appVersionLabel.textContent = `v${APP_VERSION} (${APP_VERSION_CODE})`;
  let previousBuild = "";
  try {
    previousBuild = localStorage.getItem(APP_BUILD_STORAGE_KEY) || "";
    localStorage.setItem(APP_BUILD_STORAGE_KEY, APP_BUILD_ID);
  } catch {
    // The app remains usable if storage is disabled.
  }
  if (!previousBuild || previousBuild === APP_BUILD_ID) {
    return;
  }
  try {
    if (window.caches?.keys) {
      const keys = await window.caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith(APP_CACHE_PREFIX) && key !== `${APP_CACHE_PREFIX}v${APP_VERSION_CODE}`)
        .map(key => window.caches.delete(key)));
    }
  } catch {
    // Cache cleanup is best effort and must not touch durable project state.
  }
  setStatus(`Updated to PECO Mobile ${APP_VERSION}. Saved projects were kept.`);
}

async function loadProjectFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const projectUrl = params.get("project");
  if (!projectUrl) {
    return false;
  }
  try {
    const resolvedProjectUrl = new URL(projectUrl, window.location.href).toString();
    const response = await fetch(resolvedProjectUrl);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const manifest = await response.json();
    resetProject();
    loadProjectManifest(manifest, { projectUrl: response.url || resolvedProjectUrl });
    return true;
  } catch (error) {
    setStatus(`Could not load project URL: ${error.message}`, true);
    return false;
  }
}

async function detectCompanionServer() {
  try {
    const response = await fetch("/api/status", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const payload = await response.json();
    state.server.available = Boolean(payload.ok);
    state.server.outputDir = String(payload.output_dir || "");
    state.server.statusUrl = "/api/status";
    renderTransport();
    if (state.server.available && state.server.outputDir) {
      setStatus(`Server connected. Save to PC writes to ${state.server.outputDir}.`);
    }
  } catch {
    state.server.available = false;
    renderTransport();
  }
}

function restoreReviewer() {
  try {
    elements.reviewerInput.value = localStorage.getItem("peco_mobile_reviewer") || "";
  } catch {
    elements.reviewerInput.value = "";
  }
}

function saveReviewer() {
  try {
    localStorage.setItem("peco_mobile_reviewer", elements.reviewerInput.value.trim());
  } catch {
    // Review metadata still exports even when browser storage is unavailable.
  }
}

function projectStateStorageKey(project = state.project) {
  if (!project?.id) {
    return "";
  }
  return `${PROJECT_STATE_STORAGE_PREFIX}${project.id}`;
}

function buildProjectStatePayload() {
  const project = state.project;
  return {
    schema: "peco.mobile_reviewer_project_state.v1",
    project_id: project.id,
    project_name: project.name,
    fps: project.fps,
    duration_frames: project.durationFrames,
    timeline_frame: state.timelineFrame,
    selected_decision_frame: state.selectedDecisionFrame,
    active_angle_id: state.activeAngleId,
    reviewer_name: elements.reviewerInput.value.trim(),
    decisions: compactDecisions().map(decision => {
      const angle = angleById(decision.angleId);
      return {
        frame: decision.frame,
        angle_id: decision.angleId,
        angle_index: angle?.index ?? decision.angleIndex,
        camera_name: angle?.name ?? decision.cameraName,
        recorded_at: decision.recordedAt || new Date().toISOString()
      };
    }),
    markers: state.markers.map(marker => ({
      marker_id: marker.id,
      frame: marker.frame,
      category: marker.category,
      label: marker.label,
      color: marker.color,
      note: marker.note,
      created_at: marker.createdAt,
      source: marker.source
    })),
    saved_at: new Date().toISOString()
  };
}

function saveProjectState(options = {}) {
  if (!state.project) {
    return false;
  }
  const key = projectStateStorageKey();
  if (!key) {
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(buildProjectStatePayload()));
    renderReviewLibrary();
    if (options.manual) {
      setStatus(`Saved phone edit state for ${state.project.name}.`);
    }
    return true;
  } catch (error) {
    if (options.manual) {
      setStatus(`Save state failed: ${error.message}`, true);
    }
    return false;
  }
}

function scheduleProjectStateAutosave() {
  if (!state.project) {
    return;
  }
  clearTimeout(state.stateSaveTimer);
  state.stateSaveTimer = setTimeout(() => saveProjectState(), 350);
}

function restoreProjectState(project) {
  const key = projectStateStorageKey(project);
  if (!key) {
    return false;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return false;
    }
    const saved = JSON.parse(raw);
    if (saved.project_id && saved.project_id !== project.id) {
      return false;
    }
    const byId = new Map(project.angles.map(angle => [angle.id, angle]));
    const restored = [];
    for (const row of Array.isArray(saved.decisions) ? saved.decisions : []) {
      const frame = Math.round(Number(row.frame ?? row.timeline_frame));
      const angleId = String(row.angle_id || row.angleId || "").trim();
      const angle = byId.get(angleId);
      if (!angle || !Number.isFinite(frame) || frame < 0 || frame >= project.durationFrames) {
        continue;
      }
      restored.push({
        frame,
        angleId: angle.id,
        angleIndex: angle.index,
        cameraName: angle.name,
        recordedAt: String(row.recorded_at || row.recordedAt || saved.saved_at || new Date().toISOString())
      });
    }
    if (!restored.length && supportsCameraDecisions(project)) {
      return false;
    }
    state.decisions = restored.sort((a, b) => a.frame - b.frame);
    state.undoStack = [];
    state.redoStack = [];
    if (supportsCameraDecisions(project) && !state.decisions.some(decision => decision.frame === 0) && project.angles[0]) {
      const angle = project.angles[0];
      state.decisions.unshift({
        frame: 0,
        angleId: angle.id,
        angleIndex: angle.index,
        cameraName: angle.name,
        recordedAt: saved.saved_at || new Date().toISOString()
      });
    }
    const savedTimelineFrame = Number(saved.timeline_frame ?? 0);
    state.timelineFrame = clampFrame(Number.isFinite(savedTimelineFrame) ? savedTimelineFrame : 0);
    const selectedFrame = Math.round(Number(saved.selected_decision_frame));
    state.selectedDecisionFrame = supportsCameraDecisions(project)
      ? (state.decisions.some(decision => decision.frame === selectedFrame)
        ? selectedFrame
        : activeDecisionAtFrame(state.timelineFrame)?.frame ?? state.decisions[0]?.frame ?? 0)
      : null;
    const active = activeDecisionAtFrame(state.timelineFrame);
    state.activeAngleId = active?.angleId || (byId.has(saved.active_angle_id) ? saved.active_angle_id : state.decisions[0]?.angleId || project.angles[0]?.id || "");
    state.visibleAngleId = state.activeAngleId;
    state.markers = [];
    for (const row of Array.isArray(saved.markers) ? saved.markers : []) {
      const frame = Math.round(Number(row.frame ?? row.timeline_frame));
      if (!Number.isFinite(frame) || frame < 0 || frame >= project.durationFrames) {
        continue;
      }
      state.markers.push({
        id: String(row.marker_id || row.id || `marker_${cryptoRandomId()}`),
        frame,
        category: markerCategoryById(row.category).id,
        label: String(row.label || ""),
        color: String(row.color || markerCategoryById(row.category).color),
        note: String(row.note || ""),
        createdAt: String(row.created_at || row.createdAt || saved.saved_at || new Date().toISOString()),
        source: String(row.source || "peco_mobile_review")
      });
    }
    state.markers.sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
    if (saved.reviewer_name && !elements.reviewerInput.value.trim()) {
      elements.reviewerInput.value = String(saved.reviewer_name);
    }
    return true;
  } catch {
    return false;
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }
  if (window.Capacitor || nativeBridge()) {
    navigator.serviceWorker.getRegistrations?.().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    window.caches?.keys?.().then(keys => Promise.all(
      keys.filter(key => key.startsWith(APP_CACHE_PREFIX)).map(key => caches.delete(key))
    ));
    return;
  }
  navigator.serviceWorker.register("service-worker.js")
    .then(registration => registration.update())
    .catch(() => {});
}

async function bootstrap() {
  restoreReviewer();
  await prepareAppUpdateState();
  renderAll();
  registerServiceWorker();
  detectCompanionServer();
  const loadedFromUrl = await loadProjectFromUrl();
  if (!loadedFromUrl) {
    await restoreLastBrowserPackage();
  }
  await refreshReviewLibrary();
}

bootstrap();
