const PROJECT_SCHEMA = "peco.mobile_multicam_project.v1";
const CUTS_SCHEMA = "peco.mobile_multicam_decisions.v1";
const NOTES_SCHEMA = "peco.mobile_review_notes.v1";
const APP_VERSION = "0.4.4";
const APP_VERSION_CODE = 30;
const APP_PATCH_NOTES = Object.freeze([
  "Mobile JOG now opens in a compact inline row instead of covering notes, decisions, or the timeline.",
  "The shuttle stays collapsible and scales cleanly in phone portrait and landscape."
]);
const APP_BUILD_ID = `${APP_VERSION}-${APP_VERSION_CODE}`;
const APP_BUILD_STORAGE_KEY = "peco_mobile_reviewer_app_build";
const APP_CACHE_PREFIX = "peco-mobile-multicam-shell-";
const PROJECT_STATE_STORAGE_PREFIX = "peco_mobile_reviewer_project_state:";
const PROJECT_RETURN_STORAGE_PREFIX = "peco_mobile_reviewer_return_sent:";
const NOTE_PALETTE_STORAGE_KEY = "peco_mobile_reviewer_note_palette:v1";
const PERFORMANCE_MODE_STORAGE_KEY = "peco_mobile_reviewer_performance_mode:v1";
const GESTURE_COACH_STORAGE_KEY = `peco_mobile_reviewer_gesture_coach:v${APP_VERSION_CODE}`;
const GESTURE_COACH_DURATION_MS = 6500;
const DOUBLE_TAP_MS = 320;
const EDGE_TAP_RATIO = 0.35;
const EDGE_SEEK_SECONDS = 5;
const VIDEO_SYNC_INTERVAL_MS = 250;
const PROGRAM_SOFT_SYNC_TOLERANCE_SECONDS = 0.055;
const PROGRAM_HARD_SYNC_TOLERANCE_SECONDS = 0.45;
const SYNC_RATE_ADJUSTMENT = 0.035;
const PLAYBACK_QUALITY_SAMPLE_INTERVAL_MS = 2000;
const PLAYBACK_QUALITY_MIN_FRAMES = 24;
const PLAYBACK_QUALITY_DROP_RATIO = 0.12;
const MOBILE_PREVIEW_MEDIA_QUERY = "(max-width: 760px), (max-height: 560px) and (pointer: coarse)";
const PERFORMANCE_PROFILES = Object.freeze({
  smooth: Object.freeze({
    label: "Smooth",
    description: "All camera angles stay live with lower-rate preview drawing and relaxed sync checks.",
    syncIntervalMs: 700,
    previewFrameIntervalMs: 100
  }),
  balanced: Object.freeze({
    label: "Balanced",
    description: "All camera angles stay pre-synchronized with responsive preview drawing.",
    syncIntervalMs: 400,
    previewFrameIntervalMs: 50
  }),
  quality: Object.freeze({
    label: "Full previews",
    description: "All camera angles stay pre-synchronized with full-rate preview drawing.",
    syncIntervalMs: VIDEO_SYNC_INTERVAL_MS,
    previewFrameIntervalMs: 1000 / 30
  })
});
const ANGLE_SWIPE_MIN_PX = 72;
const ANGLE_SWIPE_MAX_VERTICAL_PX = 54;
const JOG_CENTER_DEADZONE_PX = 5;
const JOG_MIN_TRAVEL_PX = 32;
const JOG_INNER_PADDING_PX = 10;
const JOG_SHUTTLE_SPEEDS = [2, 4, 8];
const IN_MEMORY_RENDER_MAX_SECONDS = 300;
const CLIP_RENDER_MAX_WIDTH = 1280;
const CLIP_RENDER_MAX_HEIGHT = 720;
const CLIP_RENDER_FPS_CAP = 30;
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
  { id: "hardcam_safer", label: "Hard Cam Safer", color: "#facc15" },
  { id: "missed_action", label: "Missed Action", color: "#f97316" },
  { id: "crowd_reaction", label: "Crowd Reaction", color: "#a3e635" },
  { id: "replay", label: "Replay / Recap", color: "#c084fc" },
  { id: "entrance_promo", label: "Entrance / Promo", color: "#60a5fa" },
  { id: "finish_big_move", label: "Finish / Big Move", color: "#fb7185" }
];
const LETS_PLAY_MARKER_CATEGORIES = [
  { id: "funny_moment", label: "Funny Moment", color: "#4ade80" },
  { id: "dead_air", label: "Dead Air", color: "#f59e0b" },
  { id: "censor", label: "Censor / Privacy", color: "#ef4444" },
  { id: "desync", label: "A/V Desync", color: "#22d3ee" },
  { id: "chapter", label: "Chapter / Beat", color: "#a78bfa" },
  { id: "pickup", label: "Pickup / Re-record", color: "#fb7185" },
  { id: "game_bug", label: "Game Bug / Crash", color: "#f97316" }
];

const elements = {
  projectLine: document.getElementById("projectLine"),
  loadPackageButton: document.getElementById("loadPackageButton"),
  reviewLibraryButton: document.getElementById("reviewLibraryButton"),
  saveStateButton: document.getElementById("saveStateButton"),
  removePackageButton: document.getElementById("removePackageButton"),
  clipToolsButton: document.getElementById("clipToolsButton"),
  exportButton: document.getElementById("exportButton"),
  saveServerButton: document.getElementById("saveServerButton"),
  reviewerInput: document.getElementById("reviewerInput"),
  reviewSetupButton: document.getElementById("reviewSetupButton"),
  collaborationLine: document.getElementById("collaborationLine"),
  packageInput: document.getElementById("packageInput"),
  viewerFrame: document.getElementById("viewerFrame"),
  emptyOpenReviewButton: document.getElementById("emptyOpenReviewButton"),
  emptyReviewLibraryButton: document.getElementById("emptyReviewLibraryButton"),
  programVideoStack: document.getElementById("programVideoStack"),
  mainVideo: document.getElementById("mainVideo"),
  audioMaster: document.getElementById("audioMaster"),
  viewerEmpty: document.getElementById("viewerEmpty"),
  skipFeedback: document.getElementById("skipFeedback"),
  mobileMenuButton: document.getElementById("mobileMenuButton"),
  mobileJogButton: document.getElementById("mobileJogButton"),
  gestureHelpButton: document.getElementById("gestureHelpButton"),
  gestureCoach: document.getElementById("gestureCoach"),
  addClipButton: document.getElementById("addClipButton"),
  addNoteButton: document.getElementById("addNoteButton"),
  clipCaptureBadge: document.getElementById("clipCaptureBadge"),
  clipCaptureLabel: document.getElementById("clipCaptureLabel"),
  cancelClipCaptureButton: document.getElementById("cancelClipCaptureButton"),
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
  editSelectedMarkerButton: document.getElementById("editSelectedMarkerButton"),
  deleteSelectedMarkersButton: document.getElementById("deleteSelectedMarkersButton"),
  clearMarkerSelectionButton: document.getElementById("clearMarkerSelectionButton"),
  previewActionMenu: document.getElementById("previewActionMenu"),
  previewActionSummary: document.getElementById("previewActionSummary"),
  markerCategoryButtons: document.getElementById("markerCategoryButtons"),
  markerTitleInput: document.getElementById("markerTitleInput"),
  markerNoteInput: document.getElementById("markerNoteInput"),
  saveMarkerButton: document.getElementById("saveMarkerButton"),
  previewClipButton: document.getElementById("previewClipButton"),
  closePreviewActionMenuButton: document.getElementById("closePreviewActionMenuButton"),
  contextMenu: document.getElementById("contextMenu"),
  contextMenuTitle: document.getElementById("contextMenuTitle"),
  contextMenuDetail: document.getElementById("contextMenuDetail"),
  contextMenuActions: document.getElementById("contextMenuActions"),
  shortcutsButton: document.getElementById("shortcutsButton"),
  mobileShortcutsButton: document.getElementById("mobileShortcutsButton"),
  shortcutMenu: document.getElementById("shortcutMenu"),
  closeShortcutMenuButton: document.getElementById("closeShortcutMenuButton"),
  quickNotePalette: document.getElementById("quickNotePalette"),
  quickNoteButtons: document.getElementById("quickNoteButtons"),
  customizeNotePaletteButton: document.getElementById("customizeNotePaletteButton"),
  notePaletteMenu: document.getElementById("notePaletteMenu"),
  notePaletteOptions: document.getElementById("notePaletteOptions"),
  closeNotePaletteButton: document.getElementById("closeNotePaletteButton"),
  reviewSetupMenu: document.getElementById("reviewSetupMenu"),
  reviewWorkflowSelect: document.getElementById("reviewWorkflowSelect"),
  reviewAssignedToInput: document.getElementById("reviewAssignedToInput"),
  reviewRequestedByInput: document.getElementById("reviewRequestedByInput"),
  reviewInstructionsInput: document.getElementById("reviewInstructionsInput"),
  reviewSetupSummary: document.getElementById("reviewSetupSummary"),
  playbackPerformanceSelect: document.getElementById("playbackPerformanceSelect"),
  playbackPerformanceSummary: document.getElementById("playbackPerformanceSummary"),
  copyPlaybackDiagnosticsButton: document.getElementById("copyPlaybackDiagnosticsButton"),
  saveReviewSetupButton: document.getElementById("saveReviewSetupButton"),
  closeReviewSetupButton: document.getElementById("closeReviewSetupButton"),
  undoDecisionButton: document.getElementById("undoDecisionButton"),
  redoDecisionButton: document.getElementById("redoDecisionButton"),
  mobileLoadPackageButton: document.getElementById("mobileLoadPackageButton"),
  mobileOptionsRow: document.getElementById("mobileOptionsRow"),
  mobileReviewLibraryButton: document.getElementById("mobileReviewLibraryButton"),
  mobileReviewSetupButton: document.getElementById("mobileReviewSetupButton"),
  mobileSaveStateButton: document.getElementById("mobileSaveStateButton"),
  mobileRemovePackageButton: document.getElementById("mobileRemovePackageButton"),
  mobileUndoDecisionButton: document.getElementById("mobileUndoDecisionButton"),
  mobileRedoDecisionButton: document.getElementById("mobileRedoDecisionButton"),
  usePreviousAngleButton: document.getElementById("usePreviousAngleButton"),
  mobileClipToolsButton: document.getElementById("mobileClipToolsButton"),
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
  clipListSection: document.getElementById("clipListSection"),
  clipList: document.getElementById("clipList"),
  clipCount: document.getElementById("clipCount"),
  clipSelectionMenu: document.getElementById("clipSelectionMenu"),
  clipSelectionSummary: document.getElementById("clipSelectionSummary"),
  renderSelectedClipsButton: document.getElementById("renderSelectedClipsButton"),
  deleteSelectedClipsButton: document.getElementById("deleteSelectedClipsButton"),
  clearClipSelectionButton: document.getElementById("clearClipSelectionButton"),
  renderMenu: document.getElementById("renderMenu"),
  renderMenuSummary: document.getElementById("renderMenuSummary"),
  closeRenderMenuButton: document.getElementById("closeRenderMenuButton"),
  renderFullModeButton: document.getElementById("renderFullModeButton"),
  renderRangeModeButton: document.getElementById("renderRangeModeButton"),
  renderReelModeButton: document.getElementById("renderReelModeButton"),
  renderRangeControls: document.getElementById("renderRangeControls"),
  renderRangeLabel: document.getElementById("renderRangeLabel"),
  setRenderInButton: document.getElementById("setRenderInButton"),
  setRenderOutButton: document.getElementById("setRenderOutButton"),
  renderDestinationLabel: document.getElementById("renderDestinationLabel"),
  renderClipButton: document.getElementById("renderClipButton"),
  cancelClipRenderButton: document.getElementById("cancelClipRenderButton"),
  clipRenderProgress: document.getElementById("clipRenderProgress"),
  mobileTimecodeLabel: document.getElementById("mobileTimecodeLabel"),
  mobileTimelineSlider: document.getElementById("mobileTimelineSlider"),
  statusLine: document.getElementById("statusLine"),
  statusContainer: document.getElementById("statusContainer"),
  appVersionLabel: document.getElementById("appVersionLabel"),
  reviewLibraryMenu: document.getElementById("reviewLibraryMenu"),
  reviewLibraryList: document.getElementById("reviewLibraryList"),
  reviewLibraryEmpty: document.getElementById("reviewLibraryEmpty"),
  reviewLibrarySummary: document.getElementById("reviewLibrarySummary"),
  reviewLibraryFilters: document.getElementById("reviewLibraryFilters"),
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
  selectedMarkerId: null,
  markerLongPress: null,
  suppressMarkerClickId: null,
  markerListAutoFollow: true,
  markerListProgrammaticScroll: false,
  markerListScrollTimer: 0,
  lastFollowedMarkerId: null,
  selectedMarkerCategory: "note",
  notePaletteIds: [],
  previewActionFrame: null,
  previewActionMarkerId: null,
  programVideos: new Map(),
  audioMasterAngleId: "",
  lastProgramSyncMs: 0,
  reviewPlaybackRate: 1,
  performancePreference: loadPerformancePreference(),
  autoPerformanceOverride: "",
  performanceSample: null,
  lastPerformanceSampleMs: 0,
  previewGridKey: "",
  lastPreviewCanvasDrawMs: 0,
  viewportRenderTimer: 0,
  pausedForVisibility: false,
  gridVideos: new Map(),
  stateSaveTimer: 0,
  tapGesture: {
    timer: 0,
    lastTap: null
  },
  skipFeedbackTimer: 0,
  gestureCoachTimer: 0,
  viewerLongPress: null,
  suppressViewerTap: false,
  angleSwipeGesture: null,
  suppressAnglePreviewClickUntil: 0,
  playbackRaf: 0,
  shuttleRaf: 0,
  lastShuttleTs: 0,
  shuttleSpeed: 0,
  jogDrag: null,
  clipCaptureInFrame: null,
  clips: [],
  clipSelectionMode: false,
  selectedClipIds: new Set(),
  selectedClipId: null,
  clipLongPress: null,
  suppressClipClickId: null,
  focusedEditType: "decision",
  contextMenuTarget: null,
  exportInFrame: 0,
  exportOutFrame: null,
  renderMode: "full",
  clipRender: null,
  clipAudioGraph: null,
  pendingMainVideoSwap: false,
  browserPackageStored: false,
  reviewLibraryRows: [],
  reviewInboxFilter: "all",
  reviewSessionId: "",
  returnHeadId: "",
  lastExport: null,
  collaboration: {
    schema: "peco.mobile_review_collaboration.v1",
    workflow_id: "general",
    assigned_to: "",
    requested_by: "",
    instructions: ""
  },
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
elements.reviewSetupButton.addEventListener("click", openReviewSetup);
elements.saveStateButton.addEventListener("click", () => saveProjectState({ manual: true }));
elements.removePackageButton.addEventListener("click", removeDownloadedMatch);
elements.clipToolsButton.addEventListener("click", () => openRenderMenu());
elements.exportButton.addEventListener("click", exportCuts);
elements.saveServerButton.addEventListener("click", saveCutsToServer);
elements.mobileLoadPackageButton.addEventListener("click", openPackageImport);
elements.mobileReviewLibraryButton.addEventListener("click", openReviewLibrary);
elements.mobileReviewSetupButton.addEventListener("click", openReviewSetup);
elements.mobileSaveStateButton.addEventListener("click", () => saveProjectState({ manual: true }));
elements.mobileRemovePackageButton.addEventListener("click", removeDownloadedMatch);
elements.mobileUndoDecisionButton.addEventListener("click", undoDecision);
elements.mobileRedoDecisionButton.addEventListener("click", redoDecision);
elements.usePreviousAngleButton.addEventListener("click", removeCurrentCameraCut);
elements.mobileClipToolsButton.addEventListener("click", () => openRenderMenu());
elements.mobileShortcutsButton.addEventListener("click", openShortcutMenu);
elements.mobileSaveServerButton.addEventListener("click", saveCutsToServer);
elements.mobileExportButton.addEventListener("click", exportCuts);
elements.deleteSelectedDecisionsButton.addEventListener("click", deleteSelectedDecisionFrames);
elements.clearDecisionSelectionButton.addEventListener("click", () => exitDecisionSelection({ status: "Selection cleared." }));
elements.deleteSelectedMarkersButton.addEventListener("click", deleteSelectedMarkers);
elements.editSelectedMarkerButton.addEventListener("click", () => {
  const markerId = [...state.selectedMarkerIds][0];
  if (markerId) {
    editMarker(markerId);
  }
});
elements.clearMarkerSelectionButton.addEventListener("click", () => exitMarkerSelection({ status: "Note selection closed." }));
elements.saveMarkerButton.addEventListener("click", savePreviewMarker);
elements.addNoteButton.addEventListener("pointerdown", event => event.stopPropagation());
elements.addNoteButton.addEventListener("click", event => {
  event.stopPropagation();
  if (isReady()) {
    openPreviewActionMenu(state.timelineFrame);
  }
});
elements.addClipButton.addEventListener("pointerdown", event => event.stopPropagation());
elements.addClipButton.addEventListener("click", event => {
  event.stopPropagation();
  toggleClipCapture();
});
elements.cancelClipCaptureButton.addEventListener("pointerdown", event => event.stopPropagation());
elements.cancelClipCaptureButton.addEventListener("click", event => {
  event.stopPropagation();
  cancelClipCapture({ status: "Clip IN canceled." });
});
elements.closePreviewActionMenuButton.addEventListener("click", () => closePreviewActionMenu({ status: "Marker menu closed." }));
elements.previewClipButton.addEventListener("click", () => {
  const capturing = Number.isInteger(state.clipCaptureInFrame);
  closePreviewActionMenu();
  toggleClipCapture();
  setStatus(capturing ? "Saved clip OUT from the Program gesture menu." : "Clip IN set. Hold Program again to set Clip OUT.");
});
for (const button of [elements.mobileMenuButton, elements.mobileJogButton, elements.gestureHelpButton]) {
  button.addEventListener("pointerdown", event => event.stopPropagation());
}
elements.mobileMenuButton.addEventListener("click", event => {
  event.stopPropagation();
  setMobileMenuOpen(!document.body.classList.contains("mobile-options-open"));
});
elements.mobileJogButton.addEventListener("click", event => {
  event.stopPropagation();
  setMobileJogOpen(!document.body.classList.contains("mobile-jog-open"));
});
elements.gestureHelpButton.addEventListener("click", event => {
  event.stopPropagation();
  showGestureCoach({ force: true, persistent: true });
});
elements.gestureCoach.addEventListener("pointerdown", event => event.stopPropagation());
elements.gestureCoach.addEventListener("click", event => {
  event.stopPropagation();
  hideGestureCoach();
});
elements.mobileOptionsRow.addEventListener("click", event => {
  if (event.target.closest("button, a")) {
    setMobileMenuOpen(false);
  }
});
elements.markerTitleInput.addEventListener("keydown", handleMarkerEditorKeydown);
elements.markerNoteInput.addEventListener("keydown", handleMarkerEditorKeydown);
elements.shortcutsButton.addEventListener("click", openShortcutMenu);
elements.closeShortcutMenuButton.addEventListener("click", closeShortcutMenu);
elements.customizeNotePaletteButton.addEventListener("click", openNotePaletteMenu);
elements.closeNotePaletteButton.addEventListener("click", closeNotePaletteMenu);
elements.saveReviewSetupButton.addEventListener("click", saveReviewSetup);
elements.closeReviewSetupButton.addEventListener("click", closeReviewSetup);
elements.reviewWorkflowSelect.addEventListener("change", renderReviewSetupSummary);
elements.playbackPerformanceSelect.addEventListener("change", renderPlaybackPerformanceSummary);
elements.copyPlaybackDiagnosticsButton.addEventListener("click", copyPlaybackDiagnostics);
elements.closeReviewLibraryButton.addEventListener("click", closeReviewLibrary);
elements.renderClipButton.addEventListener("click", renderProxyClip);
elements.cancelClipRenderButton.addEventListener("click", () => cancelProxyClipRender());
elements.closeRenderMenuButton.addEventListener("click", closeRenderMenu);
elements.setRenderInButton.addEventListener("click", setRenderInAtPlayhead);
elements.setRenderOutButton.addEventListener("click", setRenderOutAtPlayhead);
elements.renderFullModeButton.addEventListener("click", () => setRenderMode("full"));
elements.renderRangeModeButton.addEventListener("click", () => setRenderMode("range"));
elements.renderReelModeButton.addEventListener("click", () => setRenderMode("reel"));
elements.renderSelectedClipsButton.addEventListener("click", () => {
  openRenderMenu("reel");
});
elements.deleteSelectedClipsButton.addEventListener("click", deleteSelectedClips);
elements.clearClipSelectionButton.addEventListener("click", () => exitClipSelection({ status: "Clip selection closed." }));
elements.libraryOpenReviewButton.addEventListener("click", () => {
  closeReviewLibrary();
  openPackageImport();
});
elements.reviewLibraryFilters.addEventListener("click", event => {
  const button = event.target.closest("button[data-review-filter]");
  if (!button) {
    return;
  }
  state.reviewInboxFilter = button.dataset.reviewFilter || "all";
  renderReviewLibrary();
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
window.addEventListener("resize", schedulePreviewGridRefresh, { passive: true });
window.addEventListener("resize", closeContextMenu, { passive: true });
window.addEventListener("scroll", closeContextMenu, { passive: true, capture: true });
document.addEventListener("pointerdown", event => {
  if (!elements.contextMenu.classList.contains("hidden") && !event.target.closest("#contextMenu")) {
    closeContextMenu();
  }
  if (document.body.classList.contains("mobile-options-open")
    && !event.target.closest("#mobileOptionsRow")
    && !event.target.closest("#mobileMenuButton")) {
    setMobileMenuOpen(false);
  }
});
document.addEventListener("visibilitychange", handlePlaybackVisibilityChange);

async function openPackageImport() {
  closeReviewLibrary();
  const bridge = nativeBridge();
  if (bridge?.importReviewPackage) {
    try {
      setStatus("Opening package picker...");
      const result = await bridge.importReviewPackage();
      if (!result || result.cancelled) {
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
  state.browserPackageStored = true;
  refreshReviewLibrary();
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
  if (state.project || new URLSearchParams(window.location.search).has("project")) {
    return false;
  }
  const bridge = nativeBridge();
  if (bridge?.loadLastReviewPackage) {
    try {
      const saved = await bridge.loadLastReviewPackage();
      if (!saved?.found || !saved.project) {
        return false;
      }
      loadNativeProjectResult(saved);
      renderTransport();
      setStatus(`Reopened ${state.project.name} from this device. Saved camera decisions were restored.`);
      return true;
    } catch (error) {
      setStatus(`Could not reopen the saved match: ${error.message}`, true);
      return false;
    }
  }
  if (bridge || window.Capacitor) {
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
  const bridge = nativeBridge();
  return Boolean(bridge?.listReviewPackages || (!bridge && !window.Capacitor && window.PecoBrowserStorage?.listPackages));
}

async function refreshReviewLibrary() {
  if (!reviewLibraryAvailable()) {
    state.reviewLibraryRows = [];
    renderReviewLibrary();
    return [];
  }
  try {
    const bridge = nativeBridge();
    state.reviewLibraryRows = bridge?.listReviewPackages
      ? await bridge.listReviewPackages()
      : await window.PecoBrowserStorage.listPackages();
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
    setStatus("Saved review storage is unavailable. Use Open Review to choose a package.");
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
  const statusOrder = { ready: 0, in_review: 1, new: 2, sent: 3 };
  const rows = state.reviewLibraryRows
    .map(review => {
      const collaboration = reviewCollaborationForPackage(review);
      return {
        ...review,
        inboxStatus: reviewProgressStatus(review.projectId),
        collaboration,
        reviewCloud: reviewWorkflow().normalizeReviewCloud(review.reviewCloud, {
          workflowId: collaboration.workflow_id,
          projectId: review.projectId,
          projectName: review.name
        })
      };
    })
    .sort((left, right) => (
      (statusOrder[left.inboxStatus.id] ?? 9) - (statusOrder[right.inboxStatus.id] ?? 9)
      || reviewAssignmentPriority(left.collaboration) - reviewAssignmentPriority(right.collaboration)
      || right.savedAt.localeCompare(left.savedAt)
      || left.name.localeCompare(right.name)
    ));
  const counts = rows.reduce((result, review) => {
    result[review.inboxStatus.id] = (result[review.inboxStatus.id] || 0) + 1;
    return result;
  }, {});
  const visibleRows = state.reviewInboxFilter === "all"
    ? rows
    : rows.filter(review => review.inboxStatus.id === state.reviewInboxFilter);
  const reviewerName = elements.reviewerInput.value.trim();
  const assignedToReviewer = reviewerName
    ? rows.filter(review => review.collaboration.assigned_to.toLowerCase() === reviewerName.toLowerCase()).length
    : 0;
  const workspaceCounts = rows.reduce((result, review) => {
    const kind = review.reviewCloud.workspace_kind || "general";
    result[kind] = (result[kind] || 0) + 1;
    return result;
  }, {});
  const workspaceSummary = [
    workspaceCounts.lets_play ? `${workspaceCounts.lets_play} Let's Play` : "",
    workspaceCounts.wrestling ? `${workspaceCounts.wrestling} Wrestling` : "",
    workspaceCounts.general ? `${workspaceCounts.general} General` : ""
  ].filter(Boolean).join(", ");
  elements.reviewLibrarySummary.textContent = [
    `${rows.length} review${rows.length === 1 ? "" : "s"}`,
    `${counts.ready || 0} ready to send`,
    workspaceSummary || "No cloud lanes yet",
    reviewerName ? `${assignedToReviewer} assigned to ${reviewerName}` : "Add your reviewer name to prioritize assignments"
  ].join(" | ");
  for (const button of elements.reviewLibraryFilters.querySelectorAll("button[data-review-filter]")) {
    const filter = button.dataset.reviewFilter || "all";
    const count = filter === "all" ? rows.length : counts[filter] || 0;
    button.classList.toggle("selected", filter === state.reviewInboxFilter);
    button.setAttribute("aria-pressed", String(filter === state.reviewInboxFilter));
    const baseLabel = filter === "in_review" ? "In Review" : filter === "ready" ? "Ready" : filter === "sent" ? "Sent" : filter === "new" ? "New" : "All";
    button.textContent = `${baseLabel} ${count}`;
  }
  elements.reviewLibraryEmpty.hidden = visibleRows.length > 0;
  elements.reviewLibraryEmpty.textContent = rows.length
    ? "No reviews match this filter"
    : "No downloaded reviews";
  for (const review of visibleRows) {
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
    const profile = reviewWorkflow().workflowProfile(review.collaboration.workflow_id);
    const assignment = review.collaboration.assigned_to ? ` | Assigned to ${review.collaboration.assigned_to}` : "";
    details.textContent = `${profile.label} | ${mode}${assignment} | ${framesToTimecode(review.durationFrames, review.fps)} | ${formatBytes(review.sizeBytes)}`;
    const cloudLane = document.createElement("span");
    cloudLane.className = "review-library-cloud";
    const organization = review.reviewCloud.workspace_kind === "wrestling" && review.reviewCloud.organization_label
      ? ` / ${review.reviewCloud.organization_label}`
      : "";
    cloudLane.textContent = `On device · ${review.reviewCloud.workspace_label}${organization}`;
    const status = document.createElement("span");
    status.className = `review-library-status ${review.inboxStatus.cssClass}`;
    status.textContent = review.inboxStatus.label;
    openButton.append(title, details, cloudLane, status);
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
    return reviewWorkflow().inboxStatus(
      localStorage.getItem(`${PROJECT_STATE_STORAGE_PREFIX}${projectId}`),
      localStorage.getItem(`${PROJECT_RETURN_STORAGE_PREFIX}${projectId}`)
    );
  } catch {
    // Status is optional when browser preferences are blocked.
  }
  return { id: "new", label: "New", cssClass: "new" };
}

function reviewCollaborationForPackage(review) {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(`${PROJECT_STATE_STORAGE_PREFIX}${review.projectId}`) || "null");
  } catch {
    saved = null;
  }
  return reviewWorkflow().normalizeCollaboration(saved?.collaboration || review.collaboration, {
    workflow: review.workflow,
    workflowId: review.workflowId,
    projectName: review.name,
    sourceName: review.reviewMode,
    assignedTo: review.assignedTo,
    requestedBy: review.requestedBy,
    instructions: review.instructions
  });
}

function reviewAssignmentPriority(collaboration) {
  const reviewerName = elements.reviewerInput.value.trim().toLowerCase();
  const assignedTo = String(collaboration?.assigned_to || "").trim().toLowerCase();
  if (reviewerName && assignedTo === reviewerName) {
    return 0;
  }
  return assignedTo ? 2 : 1;
}

async function openStoredReview(projectId) {
  try {
    if (state.project) {
      saveProjectState();
    }
    const bridge = nativeBridge();
    const saved = bridge?.openReviewPackage
      ? await bridge.openReviewPackage(projectId)
      : await window.PecoBrowserStorage.loadPackage(projectId);
    if (!saved) {
      throw new Error("The downloaded review was not found.");
    }
    if (bridge?.openReviewPackage) {
      loadNativeProjectResult(saved);
    } else {
      resetProject();
      addProxyFiles(saved.proxyFiles, { quiet: true });
      loadProjectManifest(saved.project);
    }
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
    const bridge = nativeBridge();
    if (bridge?.removeReviewPackage) {
      await bridge.removeReviewPackage(projectId);
    } else {
      await window.PecoBrowserStorage.removePackage(projectId);
    }
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
  cancelProxyClipRender({ quiet: true });
  pausePlayback();
  setMobileJogOpen(false);
  clearTimeout(state.stateSaveTimer);
  clearTimeout(state.tapGesture.timer);
  clearTimeout(state.skipFeedbackTimer);
  clearTimeout(state.gestureCoachTimer);
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
  state.autoPerformanceOverride = "";
  state.performanceSample = null;
  state.lastPerformanceSampleMs = 0;
  state.pausedForVisibility = false;
  state.clipCaptureInFrame = null;
  state.clips = [];
  state.clipSelectionMode = false;
  state.selectedClipIds.clear();
  state.selectedClipId = null;
  state.clipLongPress = null;
  state.suppressClipClickId = null;
  state.exportInFrame = 0;
  state.exportOutFrame = null;
  state.renderMode = "full";
  clearTimeout(state.decisionListScrollTimer);
  state.decisions = [];
  state.undoStack = [];
  state.redoStack = [];
  state.markers = [];
  state.markerSelectionMode = false;
  state.selectedMarkerIds.clear();
  state.selectedMarkerId = null;
  state.markerLongPress = null;
  state.suppressMarkerClickId = null;
  state.markerListAutoFollow = true;
  state.markerListProgrammaticScroll = false;
  state.lastFollowedMarkerId = null;
  state.selectedMarkerCategory = "note";
  state.notePaletteIds = [];
  clearTimeout(state.markerListScrollTimer);
  clearTimeout(state.viewportRenderTimer);
  state.previewActionFrame = null;
  state.previewActionMarkerId = null;
  state.focusedEditType = "decision";
  closeContextMenu();
  closeShortcutMenu();
  state.reviewSessionId = "";
  state.returnHeadId = "";
  state.lastExport = null;
  state.collaboration = reviewWorkflow().normalizeCollaboration(null);
  state.tapGesture.lastTap = null;
  state.suppressViewerTap = false;
  setMobileMenuOpen(false);
  hideGestureCoach();
  clearClipLongPress();
  clearViewerLongPress();
  clearAnglePreviewSwipe();
  elements.previewActionMenu.classList.add("hidden");
  elements.notePaletteMenu.classList.add("hidden");
  elements.reviewSetupMenu.classList.add("hidden");
  elements.markerSelectionMenu.classList.add("hidden");
  elements.clipSelectionMenu.classList.add("hidden");
  elements.renderMenu.classList.add("hidden");
  document.body.classList.remove("clip-rendering");
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
  initializeReviewWorkflow(project);
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
  showGestureCoach();
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
  const reviewRoundtrip = packageMetadata.review_roundtrip && typeof packageMetadata.review_roundtrip === "object"
    ? cloneJsonValue(packageMetadata.review_roundtrip)
    : {};
  const projectName = String(raw.project_name || raw.name || "Mobile Multicam Project").trim();
  const sourceCollaboration = (
    raw.collaboration && typeof raw.collaboration === "object"
      ? raw.collaboration
      : packageMetadata.review_collaboration
  );
  const collaboration = reviewWorkflow().normalizeCollaboration(sourceCollaboration, {
    workflow: packageMetadata.workflow || reviewMode,
    projectName
  });
  const reviewCloud = reviewWorkflow().normalizeReviewCloud(packageMetadata.review_cloud || raw.review_cloud, {
    workflowId: collaboration.workflow_id,
    projectId: String(raw.project_id || raw.id || ""),
    projectName
  });
  return {
    schema: raw.schema || PROJECT_SCHEMA,
    id: String(raw.project_id || raw.id || cryptoRandomId()),
    name: projectName,
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
    reviewMode,
    collaboration,
    reviewCloud,
    packageRevisionId: String(reviewRoundtrip.package_revision_id || packageMetadata.package_revision_id || ""),
    packageReturnHeadId: String(reviewRoundtrip.return_head_id || packageMetadata.return_head_id || ""),
    defaultNotePaletteIds: Array.isArray(packageMetadata.fast_note_palette)
      ? packageMetadata.fast_note_palette.map(item => typeof item === "object" ? item.id : item)
      : [],
    baselineReviewFingerprint: reviewWorkflow().reviewFingerprint({
      decisions: (reviewMode === "notes_only" ? [] : initialCameraChanges).map(decision => ({
        frame: decision.frame,
        angle_id: decision.angleId
      })),
      markers: initialReviewMarkers.map(marker => ({
        marker_id: marker.id,
        frame: marker.frame,
        category: marker.category,
        label: marker.label || "",
        note: marker.note || ""
      })),
      clips: [],
      collaboration
    })
  };
}

function reviewWorkflow() {
  if (!window.PecoReviewWorkflow) {
    throw new Error("PECO review workflow support did not load. Refresh the app and try again.");
  }
  return window.PecoReviewWorkflow;
}

function initializeReviewWorkflow(project) {
  state.reviewSessionId = `session_${cryptoRandomId()}`;
  state.returnHeadId = project.packageReturnHeadId || "";
  state.lastExport = null;
  state.collaboration = reviewWorkflow().normalizeCollaboration(project.collaboration, {
    workflow: project.packageMetadata?.workflow,
    projectName: project.name
  });
  restoreNotePalette(project);
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

function loadPerformancePreference() {
  try {
    return normalizePerformancePreference(localStorage.getItem(PERFORMANCE_MODE_STORAGE_KEY));
  } catch {
    return "auto";
  }
}

function normalizePerformancePreference(value) {
  const mode = String(value || "").trim().toLowerCase();
  return ["auto", "smooth", "balanced", "quality"].includes(mode) ? mode : "auto";
}

function devicePlaybackCapabilities() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const cores = Math.max(0, Number(navigator.hardwareConcurrency) || 0);
  const memoryGb = Math.max(0, Number(navigator.deviceMemory) || 0);
  const userAgent = String(navigator.userAgent || "");
  const platform = String(navigator.userAgentData?.platform || navigator.platform || "Unknown");
  const mobile = Boolean(
    navigator.userAgentData?.mobile
      || /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
      || window.matchMedia?.("(pointer: coarse)").matches
  );
  const safari = /Safari/i.test(userAgent) && !/Chrome|Chromium|CriOS|Edg|OPR|Android/i.test(userAgent);
  return {
    cores,
    memoryGb,
    mobile,
    safari,
    platform,
    saveData: Boolean(connection?.saveData),
    effectiveType: String(connection?.effectiveType || "unknown")
  };
}

function automaticPerformanceMode() {
  if (state.autoPerformanceOverride && PERFORMANCE_PROFILES[state.autoPerformanceOverride]) {
    return state.autoPerformanceOverride;
  }
  const capabilities = devicePlaybackCapabilities();
  const angleCount = Math.max(1, state.project?.angles?.length || 1);
  return performanceModeForCapabilities(capabilities, angleCount);
}

function performanceModeForCapabilities(capabilities, angleCount = 1) {
  if (
    capabilities.saveData
      || ["slow-2g", "2g"].includes(capabilities.effectiveType)
      || (capabilities.cores > 0 && capabilities.cores <= 4)
      || (capabilities.memoryGb > 0 && capabilities.memoryGb <= 4)
      || (capabilities.mobile && capabilities.cores > 0 && capabilities.cores <= 6)
      || angleCount >= 5
  ) {
    return "smooth";
  }
  if (
    capabilities.safari
      || capabilities.mobile
      || capabilities.cores === 0
      || capabilities.memoryGb === 0
      || capabilities.cores < 8
      || capabilities.memoryGb < 8
      || angleCount >= 3
  ) {
    return "balanced";
  }
  return "quality";
}

function resolvedPerformanceMode(preference = state.performancePreference) {
  const normalized = normalizePerformancePreference(preference);
  return normalized === "auto" ? automaticPerformanceMode() : normalized;
}

function playbackPerformanceProfile() {
  return PERFORMANCE_PROFILES[resolvedPerformanceMode()] || PERFORMANCE_PROFILES.balanced;
}

function performanceModeDisplay(preference = state.performancePreference) {
  const normalized = normalizePerformancePreference(preference);
  const resolved = resolvedPerformanceMode(normalized);
  const label = PERFORMANCE_PROFILES[resolved]?.label || resolved;
  return normalized === "auto" ? `Auto → ${label}` : label;
}

function preferredPreviewGridKey() {
  try {
    return window.matchMedia?.(MOBILE_PREVIEW_MEDIA_QUERY).matches ? "mobile" : "desktop";
  } catch {
    return "desktop";
  }
}

function programEntriesForPlayback() {
  return [...state.programVideos.values()];
}

function drawAnglePreviewFrames(timestamp = performance.now(), options = {}) {
  if (!state.project || !state.gridVideos.size) {
    return;
  }
  const interval = playbackPerformanceProfile().previewFrameIntervalMs;
  if (!options.force && timestamp - state.lastPreviewCanvasDrawMs < interval) {
    return;
  }
  state.lastPreviewCanvasDrawMs = timestamp;
  for (const preview of state.gridVideos.values()) {
    const source = state.programVideos.get(preview.angleId)?.video;
    if (!source || source.readyState < 2 || source.videoWidth <= 0 || source.videoHeight <= 0) {
      continue;
    }
    try {
      const drawWidth = Math.min(480, source.videoWidth);
      const drawHeight = Math.max(1, Math.round(drawWidth * source.videoHeight / source.videoWidth));
      if (preview.canvas.width !== drawWidth || preview.canvas.height !== drawHeight) {
        preview.canvas.width = drawWidth;
        preview.canvas.height = drawHeight;
        preview.canvas.style.aspectRatio = `${source.videoWidth} / ${source.videoHeight}`;
      }
      preview.context.drawImage(source, 0, 0, preview.canvas.width, preview.canvas.height);
      preview.lastDrawnMediaTime = Number(source.currentTime) || 0;
      preview.canvas.dataset.mediaTime = String(preview.lastDrawnMediaTime);
    } catch {
      // A cross-origin or not-yet-ready frame should not stop multicam playback.
    }
  }
}

function scheduleAnglePreviewRefresh() {
  requestAnimationFrame(() => drawAnglePreviewFrames(performance.now(), { force: true }));
  setTimeout(() => drawAnglePreviewFrames(performance.now(), { force: true }), 90);
}

function applyPlaybackResourcePolicy(options = {}) {
  const programEntries = new Set(programEntriesForPlayback());
  for (const entry of state.programVideos.values()) {
    if (!programEntries.has(entry)) {
      entry.video.pause();
      setMediaPlaybackRate(entry.video, state.reviewPlaybackRate);
    } else if (options.play && entry.video.paused) {
      entry.video.play().catch(() => {});
    }
  }
  for (const preview of state.gridVideos.values()) {
    preview.canvas.closest(".angle-tile")?.classList.remove("static-preview");
  }
  scheduleAnglePreviewRefresh();
  renderPerformanceStatus();
}

function schedulePreviewGridRefresh() {
  clearTimeout(state.viewportRenderTimer);
  state.viewportRenderTimer = setTimeout(() => {
    const nextKey = preferredPreviewGridKey();
    if (nextKey === state.previewGridKey) {
      return;
    }
    state.previewGridKey = nextKey;
    renderAngles();
    syncAllVideos();
    applyPlaybackResourcePolicy({ play: state.isPlaying });
  }, 180);
}

function handlePlaybackVisibilityChange() {
  if (document.hidden && state.isPlaying) {
    state.pausedForVisibility = true;
    pausePlayback({ silent: true });
    setStatus("Paused while PECO was in the background. Tap Program to resume in sync.");
    return;
  }
  if (!document.hidden && state.pausedForVisibility && isReady()) {
    state.pausedForVisibility = false;
    syncAllVideos();
    setStatus("PECO is back in sync. Tap Program when ready.");
  }
}

function renderAll() {
  renderReviewMode();
  renderProjectLine();
  renderTransport();
  renderBoundaryControls();
  renderAngles();
  renderDecisionList();
  renderMarkerList();
  renderQuickNotePalette();
  renderClipList();
  renderTimeline();
  renderClipCapture();
  renderRenderMenu();
}

function renderDecisionEditState() {
  renderReviewMode();
  renderProjectLine();
  renderTransport();
  renderBoundaryControls();
  renderDecisionList();
  renderMarkerList();
  renderQuickNotePalette();
  renderClipList();
  renderTimeline();
  renderClipCapture();
  renderRenderMenu();
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
    elements.collaborationLine.textContent = "";
    elements.collaborationLine.classList.add("hidden");
    return;
  }
  const reviewKind = project.reviewMode === "notes_only" ? "Notes" : "Camera + Notes";
  elements.projectLine.textContent = `${project.name} | ${reviewKind} | ${framesToTimecode(project.durationFrames, project.fps)}`;
  const collaboration = reviewWorkflow().normalizeCollaboration(state.collaboration);
  const profile = activeWorkflowProfile();
  const parts = [profile.label];
  const cloud = project.reviewCloud;
  if (cloud?.workspace_label) {
    const organization = cloud.workspace_kind === "wrestling" && cloud.organization_label
      ? ` / ${cloud.organization_label}`
      : "";
    parts.push(`${cloud.workspace_label}${organization}`);
  }
  if (collaboration.assigned_to) {
    parts.push(`Assigned to ${collaboration.assigned_to}`);
  }
  if (collaboration.requested_by) {
    parts.push(`Requested by ${collaboration.requested_by}`);
  }
  elements.collaborationLine.textContent = parts.join(" | ");
  elements.collaborationLine.title = collaboration.instructions || profile.description;
  elements.collaborationLine.classList.remove("hidden");
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
    elements.clipToolsButton,
    elements.addClipButton,
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
  elements.reviewSetupButton.disabled = !loaded;
  elements.mobileReviewSetupButton.disabled = !loaded;
  elements.mobileClipToolsButton.disabled = !loaded || Boolean(state.clipRender);
  elements.clipToolsButton.disabled = !loaded || Boolean(state.clipRender);
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
  renderUsePreviousAngleButtonState();
  const serverSaveAvailable = state.server.available && supportsCameraDecisions();
  elements.saveServerButton.hidden = !serverSaveAvailable;
  elements.saveServerButton.disabled = !loaded || !serverSaveAvailable;
  elements.mobileSaveServerButton.hidden = !serverSaveAvailable;
  elements.mobileSaveServerButton.disabled = !loaded || !serverSaveAvailable;
  elements.mobileExportButton.disabled = !loaded;
  elements.customizeNotePaletteButton.disabled = !loaded;
  renderSelectionMenu();
  elements.playButton.textContent = state.isPlaying ? "Pause" : "Play";
  elements.mobileMenuButton.disabled = !loaded;
  elements.mobileJogButton.disabled = !loaded;
  renderClipCapture();
  renderRenderMenu();
}

function renderUsePreviousAngleButtonState() {
  const active = isReady() && supportsCameraDecisions()
    ? activeDecisionAtFrame(state.timelineFrame)
    : null;
  elements.usePreviousAngleButton.disabled = !active || active.frame <= 0;
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
  state.previewGridKey = preferredPreviewGridKey();
  elements.angleGrid.style.setProperty("--angle-count", String(Math.max(1, state.project.angles.length)));
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
      showVideo: state.previewGridKey === "desktop",
      compact: false
    }));
    elements.mobileAnglePreviewGrid.appendChild(createAnglePreviewTile(angle, {
      keyPrefix: "mobile",
      showVideo: state.previewGridKey === "mobile",
      compact: true
    }));
  }
  applyPlaybackResourcePolicy({ play: state.isPlaying });
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
  tile.addEventListener("contextmenu", event => openAngleContextMenu(event, angle.id));
  if (options.showVideo && proxyAvailable(angle)) {
    const canvas = document.createElement("canvas");
    canvas.className = "angle-preview-canvas";
    canvas.width = 320;
    canvas.height = 180;
    canvas.setAttribute("aria-hidden", "true");
    const context = canvas.getContext("2d", { alpha: false });
    tile.appendChild(canvas);
    if (context) {
      context.fillStyle = "#050604";
      context.fillRect(0, 0, canvas.width, canvas.height);
      state.gridVideos.set(`${options.keyPrefix || "preview"}:${angle.id}`, {
        angleId: angle.id,
        canvas,
        context,
        lastDrawnMediaTime: -1
      });
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
  state.gridVideos.clear();
  state.lastPreviewCanvasDrawMs = 0;
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
  applyPlaybackResourcePolicy({ play: state.isPlaying });
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

function showActiveProgramAngle(options = {}) {
  const angle = activeAngle();
  const video = activeProgramVideo();
  if (!angle || !video) {
    return;
  }
  const startedAt = options.startedAt || performance.now();
  if (!state.isPlaying && !state.shuttleRaf) {
    syncVideoElement(video, angle);
  }
  state.visibleAngleId = angle.id;
  updateProgramVideoVisibility();
  if (state.isPlaying || state.shuttleRaf) {
    keepProgramVideosPlaying();
  }
  scheduleAnglePreviewRefresh();
  if (options.reportSwitch) {
    const elapsed = Math.round(performance.now() - startedAt);
    setStatus(`Switched to ${angle.name} at ${framesToTimecode(state.timelineFrame, state.project.fps)} (${elapsed} ms visual cut).`);
  }
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
    button.addEventListener("contextmenu", event => openDecisionContextMenu(event, decision.frame));
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
  const workflowId = activeWorkflowProfile().id;
  if (workflowId === "wrestling" || (workflowId === "general" && (/wrestl|multicam/i.test(projectText) || supportsCameraDecisions()))) {
    rows.push(...WRESTLING_MARKER_CATEGORIES);
  }
  if (workflowId === "lets_play") {
    rows.push(...LETS_PLAY_MARKER_CATEGORIES);
  }
  return rows;
}

function activeWorkflowProfile() {
  return reviewWorkflow().workflowProfile(
    state.collaboration?.workflow_id,
    `${state.project?.name || ""} ${state.project?.packageMetadata?.workflow || ""}`
  );
}

function markerCategoryById(categoryId) {
  return markerCategoriesForProject()
    .find(category => category.id === String(categoryId || "").trim().toLowerCase()) || MARKER_CATEGORIES[0];
}

function defaultNotePaletteIds(project = state.project) {
  if (project?.defaultNotePaletteIds?.length && project?.collaboration?.workflow_id === activeWorkflowProfile().id) {
    return project.defaultNotePaletteIds;
  }
  return activeWorkflowProfile().defaultPaletteIds;
}

function notePaletteStorageKey() {
  return `${NOTE_PALETTE_STORAGE_KEY}:${activeWorkflowProfile().id}`;
}

function restoreNotePalette(project = state.project, options = {}) {
  const availableIds = markerCategoriesForProject().map(category => category.id);
  let saved = [];
  try {
    const scoped = localStorage.getItem(notePaletteStorageKey());
    const legacy = options.forceProfileDefaults ? "" : localStorage.getItem(NOTE_PALETTE_STORAGE_KEY);
    saved = JSON.parse(scoped || legacy || "[]");
  } catch {
    saved = [];
  }
  state.notePaletteIds = reviewWorkflow().normalizedPaletteIds(
    saved,
    availableIds,
    defaultNotePaletteIds(project)
  );
}

function saveNotePalette() {
  try {
    localStorage.setItem(notePaletteStorageKey(), JSON.stringify(state.notePaletteIds));
  } catch {
    // Palette customization is optional when local browser storage is blocked.
  }
}

function renderQuickNotePalette() {
  elements.quickNoteButtons.innerHTML = "";
  const loaded = isReady();
  elements.quickNotePalette.classList.toggle("hidden", !loaded);
  if (!loaded) {
    return;
  }
  for (const categoryId of state.notePaletteIds) {
    const category = markerCategoryById(categoryId);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-note-button";
    button.dataset.category = category.id;
    button.textContent = category.label;
    button.style.setProperty("--marker-color", category.color);
    button.addEventListener("click", () => addQuickMarker(category.id));
    elements.quickNoteButtons.appendChild(button);
  }
}

function openNotePaletteMenu() {
  if (!isReady()) {
    return;
  }
  pausePlayback({ silent: true });
  renderNotePaletteOptions();
  elements.notePaletteMenu.classList.remove("hidden");
}

function closeNotePaletteMenu() {
  elements.notePaletteMenu.classList.add("hidden");
  renderQuickNotePalette();
  setStatus("Fast note palette saved.");
}

function openReviewSetup() {
  if (!isReady()) {
    return;
  }
  pausePlayback({ silent: true });
  const collaboration = reviewWorkflow().normalizeCollaboration(state.collaboration);
  elements.reviewWorkflowSelect.value = collaboration.workflow_id;
  elements.reviewAssignedToInput.value = collaboration.assigned_to || elements.reviewerInput.value.trim();
  elements.reviewRequestedByInput.value = collaboration.requested_by;
  elements.reviewInstructionsInput.value = collaboration.instructions;
  elements.playbackPerformanceSelect.value = state.performancePreference;
  renderReviewSetupSummary();
  renderPlaybackPerformanceSummary();
  elements.reviewSetupMenu.classList.remove("hidden");
}

function closeReviewSetup() {
  elements.reviewSetupMenu.classList.add("hidden");
}

function saveReviewSetup() {
  if (!isReady()) {
    return;
  }
  const previousWorkflowId = activeWorkflowProfile().id;
  const previousPerformanceMode = resolvedPerformanceMode();
  state.collaboration = reviewWorkflow().normalizeCollaboration({
    workflow_id: elements.reviewWorkflowSelect.value,
    assigned_to: elements.reviewAssignedToInput.value,
    requested_by: elements.reviewRequestedByInput.value,
    instructions: elements.reviewInstructionsInput.value
  });
  const profile = activeWorkflowProfile();
  if (profile.id !== previousWorkflowId) {
    restoreNotePalette(state.project, { forceProfileDefaults: true });
  }
  state.performancePreference = normalizePerformancePreference(elements.playbackPerformanceSelect.value);
  state.autoPerformanceOverride = "";
  try {
    localStorage.setItem(PERFORMANCE_MODE_STORAGE_KEY, state.performancePreference);
  } catch {
    // Device preferences are best effort when browser storage is unavailable.
  }
  if (resolvedPerformanceMode() !== previousPerformanceMode) {
    clearPreviewVideos();
    clearProgramVideos();
    ensureProgramVideos();
    wireMainVideo();
    renderAngles();
  } else {
    applyPlaybackResourcePolicy();
  }
  closeReviewSetup();
  scheduleProjectStateAutosave();
  renderAll();
  setStatus(`Saved ${profile.label} review setup${state.collaboration.assigned_to ? ` for ${state.collaboration.assigned_to}` : ""}. Playback: ${performanceModeDisplay()}.`);
}

function currentCollaborationSummary(collaboration = state.collaboration) {
  return reviewWorkflow().reviewSummary({
    collaboration,
    reviewerName: elements.reviewerInput.value.trim(),
    decisions: supportsCameraDecisions() ? compactDecisions() : [],
    markers: state.markers,
    clips: state.clips
  });
}

function renderReviewSetupSummary() {
  const collaboration = reviewWorkflow().normalizeCollaboration({
    workflow_id: elements.reviewWorkflowSelect.value,
    assigned_to: elements.reviewAssignedToInput.value,
    requested_by: elements.reviewRequestedByInput.value,
    instructions: elements.reviewInstructionsInput.value
  });
  const summary = currentCollaborationSummary(collaboration);
  const parts = [
    `${summary.workflow_label} profile`,
    `${summary.marker_count} note${summary.marker_count === 1 ? "" : "s"}`,
    `${summary.clip_count} clip${summary.clip_count === 1 ? "" : "s"}`
  ];
  if (supportsCameraDecisions()) {
    parts.push(`${summary.camera_change_count} camera choice${summary.camera_change_count === 1 ? "" : "s"}`);
  }
  elements.reviewSetupSummary.textContent = parts.join(" | ");
}

function renderPlaybackPerformanceSummary() {
  const preference = normalizePerformancePreference(elements.playbackPerformanceSelect?.value || state.performancePreference);
  const resolved = resolvedPerformanceMode(preference);
  const profile = PERFORMANCE_PROFILES[resolved];
  const capabilities = devicePlaybackCapabilities();
  const deviceBits = [
    capabilities.cores ? `${capabilities.cores} logical cores` : "core count unavailable",
    capabilities.memoryGb ? `${capabilities.memoryGb} GB device memory hint` : "memory hint unavailable",
    capabilities.safari ? "Safari/WebKit" : capabilities.mobile ? "mobile browser" : "desktop browser"
  ];
  elements.playbackPerformanceSummary.textContent = `${performanceModeDisplay(preference)}. ${profile.description} Detected: ${deviceBits.join(", ")}.`;
}

function renderPerformanceStatus() {
  if (!elements.appVersionLabel) {
    return;
  }
  elements.appVersionLabel.textContent = `v${APP_VERSION} (${APP_VERSION_CODE}) • ${performanceModeDisplay()}`;
}

function playbackDiagnosticsText() {
  const capabilities = devicePlaybackCapabilities();
  const activeVideo = activeProgramVideo();
  const quality = readPlaybackQuality(activeVideo);
  const lines = [
    `PECO Mobile ${APP_VERSION} (${APP_VERSION_CODE})`,
    `Playback setting: ${state.performancePreference}`,
    `Resolved playback mode: ${resolvedPerformanceMode()}`,
    `Platform: ${capabilities.platform}`,
    `Browser: ${String(navigator.userAgent || "Unavailable")}`,
    `Logical cores: ${capabilities.cores || "Unavailable"}`,
    `Device memory hint: ${capabilities.memoryGb ? `${capabilities.memoryGb} GB` : "Unavailable"}`,
    `Network hint: ${capabilities.effectiveType}${capabilities.saveData ? " (data saver)" : ""}`,
    `Project angles: ${state.project?.angles?.length || 0}`,
    `Active program decoders: ${state.isPlaying ? programEntriesForPlayback().length : 0}`,
    `Active preview decoders: 0 (canvas mirrors: ${state.gridVideos.size})`,
    `Audio master active: ${Boolean(state.isPlaying && !elements.audioMaster.paused)}`,
    `Decoded frames: ${quality?.total ?? "Unavailable"}`,
    `Dropped frames: ${quality?.dropped ?? "Unavailable"}`
  ];
  return lines.join("\n");
}

async function copyPlaybackDiagnostics() {
  const text = playbackDiagnosticsText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setStatus("Copied playback diagnostics. Send that text with the device and browser complaint.");
  } catch (error) {
    setStatus(`Could not copy diagnostics: ${error.message}`, true);
  }
}

function renderNotePaletteOptions() {
  elements.notePaletteOptions.innerHTML = "";
  for (const category of markerCategoriesForProject()) {
    const label = document.createElement("label");
    label.className = "note-palette-option";
    label.style.setProperty("--marker-color", category.color);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.notePaletteIds.includes(category.id);
    input.addEventListener("change", () => {
      if (input.checked) {
        state.notePaletteIds = [...new Set([...state.notePaletteIds, category.id])];
      } else if (state.notePaletteIds.length > 1) {
        state.notePaletteIds = state.notePaletteIds.filter(item => item !== category.id);
      } else {
        input.checked = true;
        setStatus("Keep at least one fast note button.", true);
        return;
      }
      saveNotePalette();
      renderQuickNotePalette();
    });
    const text = document.createElement("span");
    text.textContent = category.label;
    label.append(input, text);
    elements.notePaletteOptions.appendChild(label);
  }
}

function addQuickMarker(categoryId) {
  if (!isReady()) {
    return;
  }
  const category = markerCategoryById(categoryId);
  addReviewMarker(state.timelineFrame, category, "", "peco_mobile_fast_note");
  if (navigator.vibrate) {
    navigator.vibrate(18);
  }
  setStatus(`Added ${category.label} at ${framesToTimecode((state.project.timelineStartFrame || 0) + state.timelineFrame, state.project.fps)}.`);
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
    li.classList.toggle("selected", state.selectedMarkerId === marker.id);
    li.classList.toggle("multi-selected", state.selectedMarkerIds.has(marker.id));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker-button";
    button.innerHTML = "<strong></strong><span class=\"marker-category-label\"></span><span class=\"marker-note-label\"></span>";
    button.querySelector("strong").textContent = framesToTimecode(marker.frame, state.project.fps);
    button.querySelector(".marker-category-label").textContent = marker.label || category.label;
    button.querySelector(".marker-note-label").textContent = marker.note || category.label;
    button.title = `${category.label}: ${marker.label || category.label}${marker.note ? ` — ${marker.note}` : ""}`;
    button.addEventListener("click", event => handleMarkerTap(event, marker.id));
    button.addEventListener("dblclick", event => {
      event.preventDefault();
      editMarker(marker.id);
    });
    button.addEventListener("pointerdown", event => startMarkerLongPress(event, marker.id));
    button.addEventListener("contextmenu", event => openMarkerContextMenu(event, marker.id));
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
  elements.editSelectedMarkerButton.disabled = count !== 1;
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
  state.selectedMarkerId = markerId;
  state.selectedClipId = null;
  state.focusedEditType = "marker";
  pausePlayback({ silent: true });
  setTimelineFrame(marker.frame, { syncVideos: true, persist: true });
  renderMarkerList();
  setStatus(`${marker.label || markerCategoryById(marker.category).label} at ${framesToTimecode((state.project.timelineStartFrame || 0) + marker.frame, state.project.fps)}.`);
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
  clearClipSelectionState();
  state.markerSelectionMode = true;
  state.selectedMarkerId = markerId;
  state.focusedEditType = "marker";
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
  const removed = state.markers.filter(marker => selected.has(marker.id));
  const removedCount = removed.length;
  if (!removedCount) {
    exitMarkerSelection({ status: "Note selection cleared." });
    return;
  }
  pushMarkerHistory({ before: removed, after: [], label: removedCount === 1 ? "marker deletion" : "marker deletion batch" });
  state.markers = state.markers.filter(marker => !selected.has(marker.id));
  state.markerSelectionMode = false;
  state.selectedMarkerIds.clear();
  state.selectedMarkerId = null;
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
  renderUsePreviousAngleButtonState();
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
      applyPlaybackResourcePolicy({ play: state.isPlaying });
    });
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
  const startedAt = performance.now();
  clearDecisionSelectionState();
  state.activeAngleId = angleId;
  recordDecision(angleId, { frame: state.timelineFrame });
  showActiveProgramAngle({ reportSwitch: true, startedAt });
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
  state.selectedMarkerId = null;
  state.selectedClipId = null;
  state.focusedEditType = "decision";
  if (!options.skipAutosave) {
    scheduleProjectStateAutosave();
  }
}

function pushDecisionHistory(action) {
  state.undoStack.push({
    kind: "decision",
    before: (action.before || []).map(cloneDecision),
    after: (action.after || []).map(cloneDecision),
    label: action.label || "camera decision edit"
  });
  state.redoStack = [];
}

function cloneMarker(marker) {
  return {
    id: marker.id,
    frame: marker.frame,
    category: marker.category,
    label: marker.label,
    color: marker.color,
    note: marker.note,
    createdAt: marker.createdAt,
    source: marker.source
  };
}

function cloneClip(clip) {
  return {
    id: clip.id,
    inFrame: clip.inFrame,
    outFrame: clip.outFrame,
    createdAt: clip.createdAt
  };
}

function pushMarkerHistory(action) {
  state.undoStack.push({
    kind: "marker",
    before: (action.before || []).map(cloneMarker),
    after: (action.after || []).map(cloneMarker),
    label: action.label || "marker edit"
  });
  state.redoStack = [];
}

function pushClipHistory(action) {
  state.undoStack.push({
    kind: "clip",
    before: (action.before || []).map(cloneClip),
    after: (action.after || []).map(cloneClip),
    label: action.label || "clip edit"
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

function applyReviewHistory(action, direction) {
  if (!action.kind || action.kind === "decision") {
    applyDecisionHistory(action, direction);
    return;
  }
  const removeRows = direction === "undo" ? action.after : action.before;
  const addRows = direction === "undo" ? action.before : action.after;
  if (action.kind === "marker") {
    const changedIds = new Set([...removeRows, ...addRows].map(marker => marker.id));
    state.markers = state.markers.filter(marker => !changedIds.has(marker.id));
    state.markers.push(...addRows.map(cloneMarker));
    state.markers.sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
    state.selectedMarkerId = addRows[0]?.id || null;
    state.focusedEditType = "marker";
    return;
  }
  if (action.kind === "clip") {
    const changedIds = new Set([...removeRows, ...addRows].map(clip => clip.id));
    state.clips = state.clips.filter(clip => !changedIds.has(clip.id));
    state.clips.push(...addRows.map(cloneClip));
    state.clips.sort((a, b) => a.inFrame - b.inFrame || a.outFrame - b.outFrame || a.id.localeCompare(b.id));
    state.selectedClipId = addRows[0]?.id || null;
    state.focusedEditType = "clip";
  }
}

function finishDecisionHistoryChange(status, action = {}) {
  clearDecisionSelectionState();
  clearMarkerSelectionState();
  clearClipSelectionState();
  if (!action.kind || action.kind === "decision") {
    const active = activeDecisionAtFrame(state.timelineFrame);
    if (active) {
      state.activeAngleId = active.angleId;
      showActiveProgramAngle();
    }
  }
  renderAll();
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
  applyReviewHistory(action, "undo");
  state.redoStack.push(action);
  finishDecisionHistoryChange(`Undid ${action.label}.`, action);
}

function redoDecision() {
  if (!isReady() || state.redoStack.length === 0) {
    return;
  }
  clearDecisionSelectionState();
  const action = state.redoStack.pop();
  applyReviewHistory(action, "redo");
  state.undoStack.push(action);
  finishDecisionHistoryChange(`Redid ${action.label}.`, action);
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
  clearClipSelectionState();
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
    showActiveProgramAngle();
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
  state.selectedMarkerId = null;
  state.selectedClipId = null;
  state.focusedEditType = "decision";
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
    showActiveProgramAngle();
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
  updateClipListActiveState();
}

function syncAllVideos() {
  ensureProgramVideos();
  ensureAudioMaster();
  syncAudioMasterToTimeline();
  const programEntries = state.clipRender
    ? [...state.programVideos.values()]
    : programEntriesForPlayback();
  for (const entry of programEntries) {
    const programAngle = angleById(entry.angleId);
    if (programAngle) {
      syncVideoElement(entry.video, programAngle);
    }
  }
  scheduleAnglePreviewRefresh();
}

function maintainProgramVideoSync() {
  if ((!state.isPlaying && !state.shuttleRaf) || !state.project) {
    return;
  }
  const now = performance.now();
  if (now - state.lastProgramSyncMs < playbackPerformanceProfile().syncIntervalMs) {
    return;
  }
  state.lastProgramSyncMs = now;
  const clockTime = playbackClockTimelineSeconds();
  for (const entry of programEntriesForPlayback()) {
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
  drawAnglePreviewFrames(performance.now());
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
  for (const entry of programEntriesForPlayback()) {
    if (entry.video.paused) {
      entry.video.play().catch(() => {});
    }
  }
  const audio = ensureAudioMaster();
  if (audio?.paused) {
    audio.play().catch(() => {});
  }
  if (state.clipRender?.audio?.paused) {
    state.clipRender.audio.play().catch(() => {});
  }
  applyPlaybackResourcePolicy({ play: true });
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
  const audio = state.clipRender?.audio || ensureAudioMaster();
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
  showActiveProgramAngle();
  renderDecisionEditState();
  scheduleProjectStateAutosave();
  showCutCorrectionFeedback(previous.cameraName || previous.angleId);
  if (navigator.vibrate) {
    navigator.vibrate(18);
  }
  return true;
}

function openPreviewActionMenu(frame, options = {}) {
  pausePlayback({ silent: true });
  exitDecisionSelection();
  if (state.markerSelectionMode) {
    state.markerSelectionMode = false;
    state.selectedMarkerIds.clear();
  }
  const marker = options.markerId
    ? state.markers.find(item => item.id === options.markerId)
    : null;
  const targetFrame = clampFrame(frame);
  state.previewActionFrame = targetFrame;
  state.previewActionMarkerId = marker?.id || null;
  state.selectedMarkerCategory = marker?.category || "note";
  elements.previewActionSummary.textContent = `${marker ? "Edit marker" : "Add marker"} at ${framesToTimecode((state.project.timelineStartFrame || 0) + targetFrame, state.project.fps)}`;
  elements.markerTitleInput.value = marker?.label || "";
  elements.markerNoteInput.value = marker?.note || "";
  elements.saveMarkerButton.textContent = marker ? "Save Marker" : "Add Marker";
  elements.previewClipButton.hidden = Boolean(marker);
  elements.previewClipButton.textContent = Number.isInteger(state.clipCaptureInFrame) ? "Set Clip OUT" : "Start Clip";
  elements.previewClipButton.disabled = !isReady() || Boolean(state.clipRender);
  renderMarkerCategoryButtons();
  elements.previewActionMenu.classList.remove("hidden");
  elements.markerTitleInput.focus();
  elements.markerTitleInput.select();
  setStatus(marker ? "Edit the marker name, category, or details, then save." : "Name this marker in your own words, then save it.");
}

function editMarker(markerId) {
  const marker = state.markers.find(item => item.id === markerId);
  if (!marker) {
    return;
  }
  state.selectedMarkerId = markerId;
  state.focusedEditType = "marker";
  setTimelineFrame(marker.frame, { syncVideos: true, persist: true });
  openPreviewActionMenu(marker.frame, { markerId });
}

function closePreviewActionMenu(options = {}) {
  state.previewActionFrame = null;
  state.previewActionMarkerId = null;
  state.selectedMarkerCategory = "note";
  elements.previewActionMenu.classList.add("hidden");
  elements.markerTitleInput.value = "";
  elements.markerNoteInput.value = "";
  elements.saveMarkerButton.textContent = "Add Marker";
  elements.previewClipButton.hidden = false;
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
  const title = elements.markerTitleInput.value.trim();
  const note = elements.markerNoteInput.value.trim();
  const category = markerCategoryById(state.selectedMarkerCategory);
  const existing = state.previewActionMarkerId
    ? state.markers.find(marker => marker.id === state.previewActionMarkerId)
    : null;
  if (existing) {
    const before = cloneMarker(existing);
    existing.frame = frame;
    existing.category = category.id;
    existing.label = title || category.label;
    existing.color = category.color;
    existing.note = note;
    existing.source = "peco_mobile_review_edit";
    const after = cloneMarker(existing);
    pushMarkerHistory({ before: [before], after: [after], label: "marker edit" });
    state.markers.sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
    state.selectedMarkerId = existing.id;
    state.focusedEditType = "marker";
  } else {
    const marker = addReviewMarker(frame, category, note, "peco_mobile_review", title);
    state.selectedMarkerId = marker.id;
    state.focusedEditType = "marker";
  }
  closePreviewActionMenu();
  scheduleProjectStateAutosave();
  renderMarkerList();
  setStatus(`Saved ${title || category.label} at ${framesToTimecode((state.project.timelineStartFrame || 0) + frame, state.project.fps)}.`);
}

function addReviewMarker(frame, category, note = "", source = "peco_mobile_review", label = "") {
  const marker = {
    id: `marker_${cryptoRandomId()}`,
    frame: clampFrame(frame),
    category: category.id,
    label: String(label || "").trim() || category.label,
    color: category.color,
    note: String(note || "").trim(),
    createdAt: new Date().toISOString(),
    source
  };
  pushMarkerHistory({ before: [], after: [marker], label: "marker addition" });
  state.markers.push(marker);
  state.markers.sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
  scheduleProjectStateAutosave();
  renderMarkerList();
  renderQuickNotePalette();
  return marker;
}

function handleMarkerEditorKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    savePreviewMarker();
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closePreviewActionMenu({ status: "Marker edit canceled." });
  }
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
  if (side === "center") {
    clearTimeout(state.tapGesture.timer);
    state.tapGesture.lastTap = null;
    togglePlayback();
    return;
  }
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

function isMobileReviewLayout() {
  return window.matchMedia(MOBILE_PREVIEW_MEDIA_QUERY).matches;
}

function setMobileJogOpen(open) {
  const next = Boolean(open && isMobileReviewLayout() && isReady());
  if (next) {
    setMobileMenuOpen(false);
    hideGestureCoach();
  } else if (state.jogDrag || state.shuttleRaf) {
    endJog();
  }
  document.body.classList.toggle("mobile-jog-open", next);
  elements.mobileJogButton.setAttribute("aria-expanded", String(next));
  elements.mobileJogButton.setAttribute("aria-label", next ? "Close playback jogger" : "Open playback jogger");
}

function setMobileMenuOpen(open) {
  const next = Boolean(open && isMobileReviewLayout() && isReady());
  if (next) {
    setMobileJogOpen(false);
  }
  document.body.classList.toggle("mobile-options-open", next);
  elements.mobileMenuButton.setAttribute("aria-expanded", String(next));
}

function showGestureCoach(options = {}) {
  if (!isReady() || !isMobileReviewLayout()) {
    return;
  }
  if (!options.force && localStorage.getItem(GESTURE_COACH_STORAGE_KEY) === "shown") {
    return;
  }
  setMobileMenuOpen(false);
  setMobileJogOpen(false);
  clearTimeout(state.gestureCoachTimer);
  elements.gestureCoach.classList.remove("hidden");
  if (!options.force) {
    localStorage.setItem(GESTURE_COACH_STORAGE_KEY, "shown");
  }
  if (!options.persistent) {
    state.gestureCoachTimer = setTimeout(hideGestureCoach, GESTURE_COACH_DURATION_MS);
  }
}

function hideGestureCoach() {
  clearTimeout(state.gestureCoachTimer);
  state.gestureCoachTimer = 0;
  elements.gestureCoach.classList.add("hidden");
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
  const wasPlaying = state.isPlaying;
  if (state.isPlaying) {
    pausePlayback();
  } else {
    playFromCurrentFrame();
  }
  showPlaybackGestureFeedback(wasPlaying ? "Pause" : "Play");
}

function showPlaybackGestureFeedback(label) {
  clearTimeout(state.skipFeedbackTimer);
  elements.skipFeedback.textContent = label;
  elements.skipFeedback.classList.remove("hidden", "left", "right");
  elements.skipFeedback.classList.add("correction");
  if (isMobileReviewLayout() && navigator.vibrate) {
    navigator.vibrate(10);
  }
  state.skipFeedbackTimer = setTimeout(() => {
    elements.skipFeedback.classList.add("hidden");
    elements.skipFeedback.classList.remove("correction");
  }, 420);
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
  resetPlaybackPerformanceSample();
  enableDecisionListAutoFollow({ center: true });
  enableMarkerListAutoFollow({ center: true });
  playSyncedProgramVideos().then(() => {
    applyPlaybackResourcePolicy({ play: true });
    startPlaybackLoop();
    renderTransport();
    setStatus(`Playing (${performanceModeDisplay()}).`);
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
  const entries = programEntriesForPlayback();
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
  drawAnglePreviewFrames(performance.now(), { force: true });
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
  const tick = timestamp => {
    if (!state.isPlaying) {
      return;
    }
    if (state.pendingMainVideoSwap) {
      state.playbackRaf = requestAnimationFrame(tick);
      return;
    }
    const audio = state.clipRender?.audio || ensureAudioMaster();
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
      drawAnglePreviewFrames(timestamp);
      monitorPlaybackPerformance();
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
  if (!isReady() || event.button > 0) {
    return;
  }
  pausePlayback({ silent: true });
  const wheelRect = elements.jogWheel.getBoundingClientRect();
  const knobRect = elements.jogKnob.getBoundingClientRect();
  const maxDrag = Math.max(
    JOG_MIN_TRAVEL_PX,
    wheelRect.width / 2 - knobRect.width / 2 - JOG_INNER_PADDING_PX
  );
  try {
    elements.jogWheel.setPointerCapture(event.pointerId);
  } catch {
    // Window-level pointer listeners still keep the shuttle responsive.
  }
  elements.jogWheel.classList.add("dragging");
  state.jogDrag = {
    pointerId: event.pointerId,
    centerX: wheelRect.left + wheelRect.width / 2,
    maxDrag
  };
  window.addEventListener("pointermove", moveJog);
  window.addEventListener("pointerup", endJog, { once: true });
  window.addEventListener("pointercancel", endJog, { once: true });
  moveJog(event);
}

function moveJog(event) {
  if (!state.jogDrag || event.pointerId !== state.jogDrag.pointerId) {
    return;
  }
  const dx = event.clientX - state.jogDrag.centerX;
  const maxDrag = state.jogDrag.maxDrag;
  const clamped = Math.max(-maxDrag, Math.min(maxDrag, dx));
  elements.jogKnob.style.transform = `translateX(${clamped}px)`;
  elements.jogWheel.setAttribute("aria-valuenow", String(Math.round((clamped / maxDrag) * 100)));
  const abs = Math.abs(clamped);
  const sign = Math.sign(clamped);
  if (abs <= JOG_CENTER_DEADZONE_PX) {
    stopShuttle();
    elements.jogReadout.textContent = "Stop";
    elements.jogWheel.setAttribute("aria-valuetext", "Stopped");
    return;
  }
  const speedMultiplier = quantizedJogSpeed(abs, maxDrag);
  const speed = sign * state.project.fps * speedMultiplier;
  const audioNote = speed > 0 ? "" : " visual";
  elements.jogReadout.textContent = `${speed > 0 ? "Forward" : "Reverse"} ${speedMultiplier}x${audioNote}`;
  elements.jogWheel.setAttribute(
    "aria-valuetext",
    `${speed > 0 ? "Forward" : "Reverse"} ${speedMultiplier} times speed${audioNote}`
  );
  startShuttle(speed);
}

function quantizedJogSpeed(distance, maxDrag) {
  const range = Math.max(1, maxDrag - JOG_CENTER_DEADZONE_PX);
  const normalized = Math.max(0, Math.min(1, (distance - JOG_CENTER_DEADZONE_PX) / range));
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
  elements.jogWheel.setAttribute("aria-valuetext", "Stopped");
  elements.jogReadout.textContent = "Stop";
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
    const angle = audioMasterAngle();
    const audioFrame = angle && elements.audioMaster.readyState >= 1
      ? Math.round(elements.audioMaster.currentTime * state.project.fps - angle.proxySyncOffsetFrames)
      : null;
    const audioAligned = Number.isFinite(audioFrame)
      && Math.abs(audioFrame - state.timelineFrame) <= Math.max(2, state.project.fps * 0.2);
    const forwardWithAudio = state.shuttleSpeed > 0
      && !elements.audioMaster.paused
      && audioAligned;
    if (forwardWithAudio) {
      setTimelineFrame(audioFrame, { syncVideos: false, followActiveDecision: true });
      setReviewPlaybackRate(Math.max(1, Math.abs(state.shuttleSpeed / state.project.fps)));
      playFloaterJogAudio();
      maintainProgramVideoSync();
    } else {
      setTimelineFrame(state.timelineFrame + state.shuttleSpeed * elapsed, {
        syncVideos: true,
        followActiveDecision: true
      });
      if (state.shuttleSpeed > 0) {
        playFloaterJogAudio();
      }
    }
    if (state.timelineFrame === 0 || state.timelineFrame === maxFrame()) {
      stopShuttle();
      return;
    }
    drawAnglePreviewFrames(timestamp);
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
  for (const entry of programEntriesForPlayback()) {
    if (entry.video.paused) {
      entry.video.play().catch(() => {});
    }
  }
}

function pauseReviewVideos() {
  elements.audioMaster.pause();
  state.clipRender?.audio?.pause?.();
  for (const entry of state.programVideos.values()) {
    entry.video.pause();
  }
  drawAnglePreviewFrames(performance.now(), { force: true });
}

function setReviewPlaybackRate(rate) {
  state.reviewPlaybackRate = rate;
  setMediaPlaybackRate(elements.audioMaster, rate);
  if (state.clipRender?.audio) {
    setMediaPlaybackRate(state.clipRender.audio, rate);
  }
  for (const entry of state.programVideos.values()) {
    setMediaPlaybackRate(entry.video, rate);
  }
}

function setMediaPlaybackRate(media, rate) {
  try {
    media.playbackRate = rate;
  } catch {
    // Some mobile WebViews reject unsupported media playback rates.
  }
}

function readPlaybackQuality(video) {
  if (!video) {
    return null;
  }
  try {
    if (typeof video.getVideoPlaybackQuality === "function") {
      const quality = video.getVideoPlaybackQuality();
      return {
        total: Math.max(0, Number(quality.totalVideoFrames) || 0),
        dropped: Math.max(0, Number(quality.droppedVideoFrames) || 0)
      };
    }
    const total = Math.max(0, Number(video.webkitDecodedFrameCount) || 0);
    const dropped = Math.max(0, Number(video.webkitDroppedFrameCount) || 0);
    return total || dropped ? { total, dropped } : null;
  } catch {
    return null;
  }
}

function resetPlaybackPerformanceSample() {
  state.performanceSample = readPlaybackQuality(activeProgramVideo());
  state.lastPerformanceSampleMs = performance.now();
}

function monitorPlaybackPerformance() {
  if (!state.isPlaying || state.performancePreference !== "auto" || state.clipRender) {
    return;
  }
  const now = performance.now();
  if (now - state.lastPerformanceSampleMs < PLAYBACK_QUALITY_SAMPLE_INTERVAL_MS) {
    return;
  }
  const current = readPlaybackQuality(activeProgramVideo());
  const previous = state.performanceSample;
  state.performanceSample = current;
  state.lastPerformanceSampleMs = now;
  if (!current || !previous) {
    return;
  }
  const totalDelta = current.total - previous.total;
  const droppedDelta = current.dropped - previous.dropped;
  if (totalDelta < PLAYBACK_QUALITY_MIN_FRAMES || droppedDelta / Math.max(1, totalDelta) < PLAYBACK_QUALITY_DROP_RATIO) {
    return;
  }
  const currentMode = resolvedPerformanceMode();
  const nextMode = currentMode === "quality" ? "balanced" : "smooth";
  if (nextMode === currentMode) {
    return;
  }
  state.autoPerformanceOverride = nextMode;
  state.lastProgramSyncMs = 0;
  applyPlaybackResourcePolicy({ play: true });
  renderPlaybackPerformanceSummary();
  setStatus(`PECO detected dropped frames and changed Auto playback to ${PERFORMANCE_PROFILES[nextMode].label}.`);
}

function openShortcutMenu() {
  closeContextMenu();
  elements.shortcutMenu.classList.remove("hidden");
  elements.closeShortcutMenuButton.focus();
}

function closeShortcutMenu() {
  elements.shortcutMenu.classList.add("hidden");
}

function closeContextMenu() {
  elements.contextMenu.classList.add("hidden");
  elements.contextMenuActions.innerHTML = "";
  state.contextMenuTarget = null;
}

function openContextMenu(event, options = {}) {
  event.preventDefault();
  event.stopPropagation();
  closeContextMenu();
  state.contextMenuTarget = options.target || null;
  elements.contextMenuTitle.textContent = options.title || "Actions";
  elements.contextMenuDetail.textContent = options.detail || "";
  for (const action of options.actions || []) {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.textContent = action.label;
    button.disabled = Boolean(action.disabled);
    button.className = action.danger ? "context-danger" : "";
    button.addEventListener("click", () => {
      closeContextMenu();
      action.handler?.();
    });
    elements.contextMenuActions.appendChild(button);
  }
  elements.contextMenu.style.left = "0px";
  elements.contextMenu.style.top = "0px";
  elements.contextMenu.classList.remove("hidden");
  const bounds = elements.contextMenu.getBoundingClientRect();
  const left = Math.max(8, Math.min(event.clientX, window.innerWidth - bounds.width - 8));
  const top = Math.max(8, Math.min(event.clientY, window.innerHeight - bounds.height - 8));
  elements.contextMenu.style.left = `${left}px`;
  elements.contextMenu.style.top = `${top}px`;
  elements.contextMenu.querySelector("button:not(:disabled)")?.focus();
}

async function copyContextDetails(text) {
  try {
    await navigator.clipboard?.writeText?.(String(text || ""));
    setStatus("Copied item details.");
  } catch (error) {
    setStatus(`Could not copy details: ${error.message}`, true);
  }
}

function openAngleContextMenu(event, angleId) {
  const angle = angleById(angleId);
  if (!angle) {
    return;
  }
  state.focusedEditType = "angle";
  const detail = `Camera ${angle.index} • ${angle.originalSourceFilename || angle.proxyFilename || "Proxy"}`;
  openContextMenu(event, {
    target: { type: "angle", angleId },
    title: angle.name,
    detail,
    actions: [
      { label: `Cut to Camera ${angle.index}`, disabled: angle.id === state.activeAngleId, handler: () => switchAngle(angle.id) },
      { label: "Copy Camera Details", handler: () => copyContextDetails(`${angle.name}\n${detail}`) }
    ]
  });
}

function openDecisionContextMenu(event, frame) {
  const decision = compactDecisions().find(item => item.frame === frame);
  if (!decision) {
    return;
  }
  state.selectedDecisionFrame = frame;
  state.selectedMarkerId = null;
  state.selectedClipId = null;
  state.focusedEditType = "decision";
  renderDecisionList();
  const angle = angleById(decision.angleId);
  const timecode = framesToTimecode((state.project.timelineStartFrame || 0) + decision.frame, state.project.fps);
  const detail = `${timecode} • ${angle?.name || decision.cameraName || decision.angleId}`;
  openContextMenu(event, {
    target: { type: "decision", frame },
    title: "Camera Cut",
    detail,
    actions: [
      { label: "Go to Cut", handler: () => selectDecision(frame, { seek: true }) },
      {
        label: `Use ${activeAngle()?.name || "Current Camera"}`,
        disabled: decision.angleId === state.activeAngleId,
        handler: () => changeDecisionAngle(frame, state.activeAngleId)
      },
      {
        label: "Move Cut to Playhead",
        disabled: frame === 0 || state.timelineFrame === 0 || state.timelineFrame === frame,
        handler: () => moveDecisionToPlayhead(frame)
      },
      { label: "Copy Cut Details", handler: () => copyContextDetails(detail) },
      { label: "Delete Cut", danger: true, disabled: frame === 0, handler: () => deleteDecisionFrame(frame) }
    ]
  });
}

function changeDecisionAngle(frame, angleId) {
  const current = state.decisions.find(decision => decision.frame === frame);
  const angle = angleById(angleId);
  if (!current || !angle || current.angleId === angle.id) {
    return;
  }
  const next = {
    ...cloneDecision(current),
    angleId: angle.id,
    angleIndex: angle.index,
    cameraName: angle.name,
    recordedAt: new Date().toISOString()
  };
  pushDecisionHistory({ before: [current], after: [next], label: "camera cut change" });
  state.decisions = state.decisions.filter(decision => decision.frame !== frame);
  state.decisions.push(next);
  state.decisions.sort((a, b) => a.frame - b.frame);
  state.selectedDecisionFrame = frame;
  const active = activeDecisionAtFrame(state.timelineFrame);
  if (active) {
    state.activeAngleId = active.angleId;
    showActiveProgramAngle();
  }
  scheduleProjectStateAutosave();
  renderAll();
  setStatus(`Changed cut at ${framesToTimecode(frame, state.project.fps)} to ${angle.name}.`);
}

function moveDecisionToPlayhead(frame) {
  const targetFrame = clampFrame(state.timelineFrame);
  const current = state.decisions.find(decision => decision.frame === frame);
  if (!current || frame === 0 || targetFrame === 0 || targetFrame === frame) {
    setStatus("The starting cut cannot be moved, and cuts cannot replace frame 0.", true);
    return;
  }
  const replaced = state.decisions.find(decision => decision.frame === targetFrame);
  const before = [current, replaced].filter((decision, index, rows) => decision && rows.indexOf(decision) === index);
  const moved = { ...cloneDecision(current), frame: targetFrame, recordedAt: new Date().toISOString() };
  pushDecisionHistory({ before, after: [moved], label: "camera cut move" });
  state.decisions = state.decisions.filter(decision => decision.frame !== frame && decision.frame !== targetFrame);
  state.decisions.push(moved);
  state.decisions.sort((a, b) => a.frame - b.frame);
  state.selectedDecisionFrame = targetFrame;
  scheduleProjectStateAutosave();
  renderAll();
  setStatus(`Moved camera cut to ${framesToTimecode(targetFrame, state.project.fps)}.`);
}

function deleteDecisionFrame(frame) {
  if (!canSelectDecisionForDelete(frame)) {
    setStatus("The starting camera at frame 0 stays fixed.", true);
    return;
  }
  state.selectedDecisionFrames.clear();
  state.selectedDecisionFrames.add(frame);
  state.decisionSelectionMode = true;
  deleteSelectedDecisionFrames();
}

function openMarkerContextMenu(event, markerId) {
  const marker = state.markers.find(item => item.id === markerId);
  if (!marker) {
    return;
  }
  state.selectedMarkerId = markerId;
  state.selectedClipId = null;
  state.focusedEditType = "marker";
  renderMarkerList();
  const category = markerCategoryById(marker.category);
  const timecode = framesToTimecode((state.project.timelineStartFrame || 0) + marker.frame, state.project.fps);
  const detail = `${timecode} • ${category.label}${marker.note ? ` • ${marker.note}` : ""}`;
  openContextMenu(event, {
    target: { type: "marker", markerId },
    title: marker.label || category.label,
    detail,
    actions: [
      { label: "Go to Marker", handler: () => handleMarkerTap({ preventDefault() {} }, markerId) },
      { label: "Edit Marker", handler: () => editMarker(markerId) },
      { label: "Move Marker to Playhead", disabled: marker.frame === state.timelineFrame, handler: () => moveMarkerToPlayhead(markerId) },
      { label: "Copy Marker Details", handler: () => copyContextDetails(`${marker.label || category.label}\n${detail}`) },
      { label: "Delete Marker", danger: true, handler: () => deleteMarkerById(markerId) }
    ]
  });
}

function moveMarkerToPlayhead(markerId) {
  const marker = state.markers.find(item => item.id === markerId);
  if (!marker) {
    return;
  }
  const before = cloneMarker(marker);
  marker.frame = clampFrame(state.timelineFrame);
  const after = cloneMarker(marker);
  pushMarkerHistory({ before: [before], after: [after], label: "marker move" });
  state.markers.sort((a, b) => a.frame - b.frame || a.id.localeCompare(b.id));
  scheduleProjectStateAutosave();
  renderMarkerList();
  setStatus(`Moved ${marker.label || "marker"} to ${framesToTimecode(marker.frame, state.project.fps)}.`);
}

function deleteMarkerById(markerId) {
  if (!state.markers.some(marker => marker.id === markerId)) {
    return;
  }
  state.selectedMarkerIds.clear();
  state.selectedMarkerIds.add(markerId);
  state.markerSelectionMode = true;
  deleteSelectedMarkers();
}

function openClipContextMenu(event, clipId) {
  const clip = state.clips.find(item => item.id === clipId);
  if (!clip) {
    return;
  }
  state.selectedClipId = clipId;
  state.selectedMarkerId = null;
  state.focusedEditType = "clip";
  renderClipList();
  const detail = `${clipFrameTimecode(clip.inFrame)} to ${clipFrameTimecode(clip.outFrame)} • ${formatClipDuration((clip.outFrame - clip.inFrame) / state.project.fps)}`;
  openContextMenu(event, {
    target: { type: "clip", clipId },
    title: "Saved Clip",
    detail,
    actions: [
      { label: "Go to Clip IN", handler: () => handleClipTap({ preventDefault() {} }, clipId) },
      { label: "Set IN to Playhead", disabled: state.timelineFrame >= clip.outFrame, handler: () => setClipBoundaryAtPlayhead(clipId, "in") },
      { label: "Set OUT to Playhead", disabled: state.timelineFrame <= clip.inFrame, handler: () => setClipBoundaryAtPlayhead(clipId, "out") },
      { label: "Render This Clip", handler: () => renderSingleClip(clipId) },
      { label: "Copy Clip Details", handler: () => copyContextDetails(detail) },
      { label: "Delete Clip", danger: true, handler: () => deleteClipById(clipId) }
    ]
  });
}

function setClipBoundaryAtPlayhead(clipId, side) {
  const clip = state.clips.find(item => item.id === clipId);
  if (!clip) {
    return;
  }
  const targetFrame = clampFrame(state.timelineFrame);
  if ((side === "in" && targetFrame >= clip.outFrame) || (side === "out" && targetFrame <= clip.inFrame)) {
    setStatus("Clip OUT must stay after clip IN.", true);
    return;
  }
  const before = cloneClip(clip);
  if (side === "in") {
    clip.inFrame = targetFrame;
  } else {
    clip.outFrame = targetFrame;
  }
  const after = cloneClip(clip);
  pushClipHistory({ before: [before], after: [after], label: `clip ${side.toUpperCase()} edit` });
  state.clips.sort((a, b) => a.inFrame - b.inFrame || a.outFrame - b.outFrame || a.id.localeCompare(b.id));
  scheduleProjectStateAutosave();
  renderClipList();
  setStatus(`Set clip ${side.toUpperCase()} to ${clipFrameTimecode(targetFrame)}.`);
}

function renderSingleClip(clipId) {
  if (!state.clips.some(clip => clip.id === clipId)) {
    return;
  }
  clearClipSelectionState();
  state.clipSelectionMode = true;
  state.selectedClipIds.add(clipId);
  state.selectedClipId = clipId;
  openRenderMenu("reel");
}

function deleteClipById(clipId) {
  if (!state.clips.some(clip => clip.id === clipId)) {
    return;
  }
  state.selectedClipIds.clear();
  state.selectedClipIds.add(clipId);
  state.clipSelectionMode = true;
  deleteSelectedClips();
}

function deleteFocusedReviewItem() {
  if (state.decisionSelectionMode && state.selectedDecisionFrames.size) {
    deleteSelectedDecisionFrames();
    return true;
  }
  if (state.markerSelectionMode && state.selectedMarkerIds.size) {
    deleteSelectedMarkers();
    return true;
  }
  if (state.clipSelectionMode && state.selectedClipIds.size) {
    deleteSelectedClips();
    return true;
  }
  if (state.focusedEditType === "marker" && state.selectedMarkerId) {
    deleteMarkerById(state.selectedMarkerId);
    return true;
  }
  if (state.focusedEditType === "clip" && state.selectedClipId) {
    deleteClipById(state.selectedClipId);
    return true;
  }
  if (state.focusedEditType === "decision" && Number(state.selectedDecisionFrame) > 0) {
    deleteDecisionFrame(state.selectedDecisionFrame);
    return true;
  }
  setStatus("Select a camera cut, marker, or clip before deleting.", true);
  return false;
}

function editFocusedMarker() {
  const marker = state.markers.find(item => item.id === state.selectedMarkerId)
    || activeMarkerAtFrame(state.timelineFrame);
  if (!marker) {
    setStatus("There is no marker to edit at this position.", true);
    return;
  }
  editMarker(marker.id);
}

function closeActiveOverlay() {
  if (!elements.gestureCoach.classList.contains("hidden")) {
    hideGestureCoach();
    return true;
  }
  if (document.body.classList.contains("mobile-options-open")) {
    setMobileMenuOpen(false);
    return true;
  }
  if (document.body.classList.contains("mobile-jog-open")) {
    setMobileJogOpen(false);
    return true;
  }
  if (!elements.contextMenu.classList.contains("hidden")) {
    closeContextMenu();
    return true;
  }
  if (!elements.shortcutMenu.classList.contains("hidden")) {
    closeShortcutMenu();
    return true;
  }
  if (!elements.previewActionMenu.classList.contains("hidden")) {
    closePreviewActionMenu({ status: "Marker edit canceled." });
    return true;
  }
  if (state.decisionSelectionMode) {
    exitDecisionSelection({ status: "Selection cleared." });
    return true;
  }
  if (state.markerSelectionMode) {
    exitMarkerSelection({ status: "Note selection cleared." });
    return true;
  }
  if (state.clipSelectionMode) {
    exitClipSelection({ status: "Clip selection cleared." });
    return true;
  }
  return false;
}

function isTextEntryTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function handleKeydown(event) {
  if (event.key === "Escape" && closeActiveOverlay()) {
    event.preventDefault();
    return;
  }
  if (isTextEntryTarget(event.target)) {
    return;
  }
  const unmodifiedShortcut = !event.altKey && !event.ctrlKey && !event.metaKey;
  if ((event.key === "?" || (event.code === "Slash" && event.shiftKey)) && !event.repeat) {
    event.preventDefault();
    openShortcutMenu();
    return;
  }
  if (!isReady()) {
    return;
  }
  const historyShortcut = !event.altKey && (event.ctrlKey || event.metaKey) && event.code === "KeyZ";
  if (historyShortcut) {
    event.preventDefault();
    if (!event.repeat) {
      if (event.shiftKey) {
        redoDecision();
      } else {
        undoDecision();
      }
    }
    return;
  }
  if (!event.altKey && (event.ctrlKey || event.metaKey) && event.code === "KeyY") {
    event.preventDefault();
    if (!event.repeat) {
      redoDecision();
    }
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
  if (unmodifiedShortcut && !event.repeat && (event.key === "Delete" || event.key === "Backspace")) {
    event.preventDefault();
    deleteFocusedReviewItem();
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.code === "KeyM") {
    event.preventDefault();
    if (event.shiftKey) {
      editFocusedMarker();
    } else {
      openPreviewActionMenu(state.timelineFrame);
    }
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.code === "KeyJ") {
    event.preventDefault();
    startShuttle(-JOG_SHUTTLE_SPEEDS[0]);
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.code === "KeyK") {
    event.preventDefault();
    stopShuttle();
    pausePlayback({ silent: true });
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.code === "KeyL") {
    event.preventDefault();
    startShuttle(JOG_SHUTTLE_SPEEDS[0]);
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.key === "Home") {
    event.preventDefault();
    pausePlayback({ silent: true });
    setTimelineFrame(0, { syncVideos: true, persist: true });
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.key === "End") {
    event.preventDefault();
    pausePlayback({ silent: true });
    setTimelineFrame(maxFrame(), { syncVideos: true, persist: true });
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.key === "ArrowUp") {
    event.preventDefault();
    selectAdjacentDecision(-1);
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.key === "ArrowDown") {
    event.preventDefault();
    selectAdjacentDecision(1);
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.code === "KeyI") {
    event.preventDefault();
    openRenderMenu("range");
    setRenderInAtPlayhead();
    return;
  }
  if (unmodifiedShortcut && !event.repeat && event.code === "KeyO") {
    event.preventDefault();
    openRenderMenu("range");
    setRenderOutAtPlayhead();
    return;
  }
  if (unmodifiedShortcut && event.code === "KeyQ") {
    event.preventDefault();
    if (!event.repeat) {
      removeCurrentCameraCut();
    }
    return;
  }
  if (unmodifiedShortcut && event.code === "Backquote") {
    event.preventDefault();
    if (!event.repeat) {
      undoDecision();
    }
    return;
  }
  const number = Number(event.key);
  if (unmodifiedShortcut && !event.repeat && Number.isInteger(number) && number > 0) {
    const angle = state.project.angles.find(item => item.index === number);
    if (angle) {
      event.preventDefault();
      switchAngle(angle.id);
    }
  }
}

function toggleClipCapture() {
  if (!isReady() || state.clipRender) {
    return;
  }
  if (!Number.isInteger(state.clipCaptureInFrame)) {
    exitClipSelection();
    state.clipCaptureInFrame = state.timelineFrame;
    renderClipCapture();
    renderClipList();
    setStatus(`Clip IN ${clipFrameTimecode(state.clipCaptureInFrame)}. Press + Clip again for OUT.`);
    return;
  }
  const outFrame = state.timelineFrame;
  if (outFrame <= state.clipCaptureInFrame) {
    setStatus("Clip OUT must be after Clip IN.", true);
    return;
  }
  const clip = {
    id: `clip_${cryptoRandomId()}`,
    inFrame: state.clipCaptureInFrame,
    outFrame,
    createdAt: new Date().toISOString()
  };
  pushClipHistory({ before: [], after: [clip], label: "clip addition" });
  state.clips.push(clip);
  state.clips.sort((a, b) => a.inFrame - b.inFrame || a.outFrame - b.outFrame || a.id.localeCompare(b.id));
  state.clipCaptureInFrame = null;
  scheduleProjectStateAutosave();
  renderAll();
  setStatus(`Saved clip ${clipFrameTimecode(clip.inFrame)} to ${clipFrameTimecode(clip.outFrame)}.`);
}

function cancelClipCapture(options = {}) {
  if (!Number.isInteger(state.clipCaptureInFrame)) {
    return;
  }
  state.clipCaptureInFrame = null;
  renderClipCapture();
  renderClipList();
  if (options.status) {
    setStatus(options.status);
  }
}

function renderClipCapture() {
  const capturing = Number.isInteger(state.clipCaptureInFrame);
  elements.addClipButton.disabled = !isReady() || Boolean(state.clipRender);
  elements.addClipButton.textContent = capturing ? "Set Clip OUT" : "+ Clip";
  elements.addClipButton.classList.toggle("capturing", capturing);
  elements.previewClipButton.textContent = capturing ? "Set Clip OUT" : "Start Clip";
  elements.previewClipButton.disabled = !isReady() || Boolean(state.clipRender);
  elements.clipCaptureBadge.classList.toggle("hidden", !capturing);
  elements.clipCaptureLabel.textContent = capturing
    ? `Clip IN ${clipFrameTimecode(state.clipCaptureInFrame)}`
    : "Clip IN";
}

function renderClipList() {
  elements.clipList.innerHTML = "";
  elements.clipCount.textContent = String(state.clips.length);
  elements.clipListSection.classList.toggle("hidden", !state.clips.length && !Number.isInteger(state.clipCaptureInFrame));
  const active = state.clips.find(clip => state.timelineFrame >= clip.inFrame && state.timelineFrame < clip.outFrame) || null;
  state.clips.forEach((clip, index) => {
    const item = document.createElement("li");
    item.dataset.clipId = clip.id;
    item.classList.toggle("current", clip.id === active?.id);
    item.classList.toggle("selected", state.selectedClipId === clip.id);
    item.classList.toggle("multi-selected", state.selectedClipIds.has(clip.id));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "clip-range-button";
    button.innerHTML = "<strong></strong><span></span><em></em>";
    button.querySelector("strong").textContent = `Clip ${index + 1}`;
    button.querySelector("span").textContent = `${clipFrameTimecode(clip.inFrame)} to ${clipFrameTimecode(clip.outFrame)}`;
    button.querySelector("em").textContent = formatClipDuration((clip.outFrame - clip.inFrame) / state.project.fps);
    button.addEventListener("click", event => handleClipTap(event, clip.id));
    button.addEventListener("pointerdown", event => startClipLongPress(event, clip.id));
    button.addEventListener("contextmenu", event => openClipContextMenu(event, clip.id));
    item.appendChild(button);
    elements.clipList.appendChild(item);
  });
  renderClipSelectionMenu();
}

function updateClipListActiveState() {
  const active = state.clips.find(clip => state.timelineFrame >= clip.inFrame && state.timelineFrame < clip.outFrame) || null;
  for (const item of elements.clipList.querySelectorAll("li[data-clip-id]")) {
    item.classList.toggle("current", item.dataset.clipId === active?.id);
  }
}

function handleClipTap(event, clipId) {
  if (state.suppressClipClickId === clipId) {
    state.suppressClipClickId = null;
    event.preventDefault();
    return;
  }
  if (state.clipSelectionMode) {
    event.preventDefault();
    toggleClipSelection(clipId);
    return;
  }
  const clip = state.clips.find(item => item.id === clipId);
  if (!clip) {
    return;
  }
  state.selectedClipId = clipId;
  state.selectedMarkerId = null;
  state.focusedEditType = "clip";
  pausePlayback({ silent: true });
  setTimelineFrame(clip.inFrame, { syncVideos: true, persist: true });
  renderClipList();
  setStatus(`Clip ${clipFrameTimecode(clip.inFrame)} to ${clipFrameTimecode(clip.outFrame)}.`);
}

function startClipLongPress(event, clipId) {
  if (!isReady() || event.button > 0) {
    return;
  }
  clearClipLongPress();
  const gesture = {
    pointerId: event.pointerId,
    clipId,
    startX: event.clientX,
    startY: event.clientY,
    fired: false,
    timer: 0
  };
  gesture.timer = setTimeout(() => {
    gesture.fired = true;
    state.suppressClipClickId = clipId;
    enterClipSelection(clipId);
  }, 560);
  state.clipLongPress = gesture;
  window.addEventListener("pointermove", moveClipLongPress);
  window.addEventListener("pointerup", endClipLongPress, { once: true });
  window.addEventListener("pointercancel", endClipLongPress, { once: true });
}

function moveClipLongPress(event) {
  const gesture = state.clipLongPress;
  if (!gesture || event.pointerId !== gesture.pointerId) {
    return;
  }
  if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > 12) {
    clearClipLongPress();
  }
}

function endClipLongPress(event) {
  const gesture = state.clipLongPress;
  if (gesture && event.pointerId === gesture.pointerId && gesture.fired) {
    state.suppressClipClickId = gesture.clipId;
  }
  clearClipLongPress();
}

function clearClipLongPress() {
  if (state.clipLongPress?.timer) {
    clearTimeout(state.clipLongPress.timer);
  }
  state.clipLongPress = null;
  window.removeEventListener("pointermove", moveClipLongPress);
  window.removeEventListener("pointerup", endClipLongPress);
  window.removeEventListener("pointercancel", endClipLongPress);
}

function enterClipSelection(clipId) {
  if (!state.clips.some(clip => clip.id === clipId)) {
    return;
  }
  pausePlayback({ silent: true });
  clearDecisionSelectionState();
  clearMarkerSelectionState();
  state.clipSelectionMode = true;
  state.selectedClipId = clipId;
  state.focusedEditType = "clip";
  state.selectedClipIds.add(clipId);
  renderAll();
  setStatus("Clip selection mode. Tap more clips to include or remove them.");
}

function toggleClipSelection(clipId) {
  if (state.selectedClipIds.has(clipId)) {
    state.selectedClipIds.delete(clipId);
  } else if (state.clips.some(clip => clip.id === clipId)) {
    state.selectedClipIds.add(clipId);
  }
  if (!state.selectedClipIds.size) {
    exitClipSelection({ status: "Clip selection cleared." });
  } else {
    renderAll();
  }
}

function exitClipSelection(options = {}) {
  clearClipSelectionState();
  renderClipList();
  if (options.status) {
    setStatus(options.status);
  }
}

function clearClipSelectionState() {
  clearClipLongPress();
  state.clipSelectionMode = false;
  state.selectedClipIds.clear();
  state.suppressClipClickId = null;
}

function deleteSelectedClips() {
  const selected = new Set(state.selectedClipIds);
  const removed = state.clips.filter(clip => selected.has(clip.id));
  const removedCount = removed.length;
  if (!removedCount) {
    exitClipSelection({ status: "Clip selection cleared." });
    return;
  }
  pushClipHistory({ before: removed, after: [], label: removedCount === 1 ? "clip deletion" : "clip deletion batch" });
  state.clips = state.clips.filter(clip => !selected.has(clip.id));
  state.clipSelectionMode = false;
  state.selectedClipIds.clear();
  state.selectedClipId = null;
  state.suppressClipClickId = null;
  scheduleProjectStateAutosave();
  renderAll();
  setStatus(`Deleted ${removedCount} selected clip${removedCount === 1 ? "" : "s"}.`);
}

function renderClipSelectionMenu() {
  const count = state.selectedClipIds.size;
  const visible = state.clipSelectionMode && count > 0;
  elements.clipSelectionMenu.classList.toggle("hidden", !visible);
  elements.clipSelectionSummary.textContent = visible
    ? `${count} clip${count === 1 ? "" : "s"} selected`
    : "No clips selected";
  elements.renderSelectedClipsButton.disabled = !visible;
  elements.deleteSelectedClipsButton.disabled = !visible;
}

function openRenderMenu(mode = state.renderMode) {
  if (!isReady()) {
    return;
  }
  state.exportInFrame = clampFrame(state.exportInFrame || 0);
  state.exportOutFrame = Number.isInteger(state.exportOutFrame) ? clampFrame(state.exportOutFrame) : maxFrame();
  setRenderMode(mode);
  elements.clipSelectionMenu.classList.add("hidden");
  elements.renderMenu.classList.remove("hidden");
  renderRenderMenu();
}

function closeRenderMenu() {
  if (state.clipRender) {
    setStatus("Cancel the current render before closing this menu.", true);
    return;
  }
  elements.renderMenu.classList.add("hidden");
  renderClipSelectionMenu();
}

function setRenderMode(mode) {
  if (!["full", "range", "reel"].includes(mode)) {
    return;
  }
  state.renderMode = mode;
  renderRenderMenu();
}

function setRenderInAtPlayhead() {
  if (!isReady() || state.clipRender) {
    return;
  }
  state.exportInFrame = state.timelineFrame;
  if (!Number.isInteger(state.exportOutFrame) || state.exportOutFrame <= state.exportInFrame) {
    state.exportOutFrame = maxFrame();
  }
  scheduleProjectStateAutosave();
  renderRenderMenu();
  setStatus(`Export IN set to ${clipFrameTimecode(state.exportInFrame)}.`);
}

function setRenderOutAtPlayhead() {
  if (!isReady() || state.clipRender) {
    return;
  }
  state.exportOutFrame = state.timelineFrame;
  scheduleProjectStateAutosave();
  renderRenderMenu();
  setStatus(exportRangeIsValid()
    ? `Export OUT set to ${clipFrameTimecode(state.exportOutFrame)}.`
    : "Export OUT must be after Export IN.",
  !exportRangeIsValid());
}

function exportRangeIsValid() {
  return Boolean(
    state.project
    && Number.isInteger(state.exportInFrame)
    && Number.isInteger(state.exportOutFrame)
    && state.exportInFrame >= 0
    && state.exportOutFrame > state.exportInFrame
    && state.exportOutFrame <= maxFrame()
  );
}

function selectedClipSegments() {
  return state.clips
    .filter(clip => state.selectedClipIds.has(clip.id))
    .sort((a, b) => a.inFrame - b.inFrame || a.outFrame - b.outFrame)
    .map(clip => ({ id: clip.id, inFrame: clip.inFrame, outFrame: clip.outFrame }));
}

function renderSegmentsForMode(mode = state.renderMode) {
  if (mode === "full") {
    return maxFrame() > 0 ? [{ id: "full", inFrame: 0, outFrame: maxFrame() }] : [];
  }
  if (mode === "range") {
    return exportRangeIsValid()
      ? [{ id: "range", inFrame: state.exportInFrame, outFrame: state.exportOutFrame }]
      : [];
  }
  return selectedClipSegments();
}

function renderDurationSeconds(segments = renderSegmentsForMode()) {
  if (!state.project) {
    return 0;
  }
  return segments.reduce((total, segment) => total + Math.max(0, segment.outFrame - segment.inFrame), 0) / state.project.fps;
}

function clipFrameTimecode(frame) {
  if (!state.project || !Number.isFinite(frame)) {
    return "--:--:--:--";
  }
  return framesToTimecode((state.project.timelineStartFrame || 0) + frame, state.project.fps);
}

function renderRenderMenu() {
  const active = state.clipRender;
  const segments = renderSegmentsForMode();
  const duration = renderDurationSeconds(segments);
  const profile = clipRecordingProfile();
  const directSave = supportsDirectRenderSave();
  for (const button of [elements.renderFullModeButton, elements.renderRangeModeButton, elements.renderReelModeButton]) {
    button.classList.toggle("selected", button.dataset.renderMode === state.renderMode);
    button.disabled = Boolean(active);
  }
  elements.renderRangeControls.classList.toggle("hidden", state.renderMode !== "range");
  elements.setRenderInButton.disabled = Boolean(active);
  elements.setRenderOutButton.disabled = Boolean(active);
  elements.closeRenderMenuButton.disabled = Boolean(active);
  elements.renderRangeLabel.textContent = exportRangeIsValid()
    ? `${clipFrameTimecode(state.exportInFrame)} to ${clipFrameTimecode(state.exportOutFrame)}`
    : "Set a valid IN and OUT";
  const modeLabel = state.renderMode === "full"
    ? "Full review"
    : state.renderMode === "range"
      ? "In / Out range"
      : `${segments.length} selected clip${segments.length === 1 ? "" : "s"}`;
  elements.renderMenuSummary.textContent = `${modeLabel} | ${formatClipDuration(duration)} | proxy quality`;
  const touchDevice = window.matchMedia?.("(pointer: coarse)")?.matches || navigator.maxTouchPoints > 1;
  elements.renderDestinationLabel.textContent = directSave
    ? "A save dialog opens first, then PECO writes directly to that file."
    : touchDevice
      ? "Your Share or Download choices appear after rendering."
      : "The finished file downloads through your browser.";
  elements.renderClipButton.textContent = directSave
    ? "Choose Location & Render"
    : touchDevice
      ? "Render & Share"
      : "Render & Download";
  const tooLongForMemory = !directSave && duration > IN_MEMORY_RENDER_MAX_SECONDS;
  elements.renderClipButton.disabled = !isReady()
    || Boolean(active)
    || !segments.length
    || duration <= 0
    || tooLongForMemory
    || !profile;
  elements.renderClipButton.hidden = Boolean(active);
  elements.cancelClipRenderButton.hidden = !active;
  elements.clipRenderProgress.hidden = !active;
  elements.clipRenderProgress.value = active?.progress || 0;
  if (active) {
    const percent = Math.round((active.progress || 0) * 100);
    elements.renderMenuSummary.textContent = `Rendering ${percent}% | ${active.label}`;
  } else if (tooLongForMemory) {
    elements.renderDestinationLabel.textContent = "This range is over 5 minutes. Use desktop Chrome or Edge to save it directly without filling phone memory.";
  } else if (state.renderMode === "reel" && !segments.length) {
    elements.renderDestinationLabel.textContent = "Long-press clip tiles to highlight the clips for this reel.";
  }
}

function supportsDirectRenderSave() {
  return window.isSecureContext && typeof window.showSaveFilePicker === "function";
}

function formatClipDuration(seconds) {
  const whole = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function clipRecordingProfiles() {
  if (webCodecsRenderSupported()) {
    return [{ mimeType: "video/webm", extension: "webm" }];
  }
  if (typeof MediaRecorder !== "function") {
    return [];
  }
  return [
    { mimeType: "video/webm;codecs=vp9,opus", extension: "webm" },
    { mimeType: "video/webm;codecs=vp8,opus", extension: "webm" },
    { mimeType: "video/webm", extension: "webm" },
    { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", extension: "mp4" },
    { mimeType: "video/mp4", extension: "mp4" }
  ].filter(profile => !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(profile.mimeType));
}

function clipRecordingProfile() {
  if (webCodecsRenderSupported()) {
    return clipRecordingProfiles()[0];
  }
  const canvas = document.createElement("canvas");
  if (typeof canvas.captureStream !== "function") {
    return null;
  }
  return clipRecordingProfiles()[0] || null;
}

function webCodecsRenderSupported() {
  return Boolean(
    window.WebMMuxer?.Muxer
    && window.WebMMuxer?.ArrayBufferTarget
    && typeof VideoEncoder === "function"
    && typeof AudioEncoder === "function"
    && typeof MediaStreamTrackProcessor === "function"
    && typeof VideoFrame === "function"
    && typeof AudioData === "function"
  );
}

async function renderProxyClip() {
  if (!isReady() || state.clipRender) {
    return;
  }
  const segments = renderSegmentsForMode();
  if (!segments.length) {
    setStatus(state.renderMode === "reel"
      ? "Long-press clip tiles to highlight clips for the reel."
      : "Set a valid export IN and OUT before rendering.", true);
    return;
  }
  const duration = renderDurationSeconds(segments);
  const directSave = supportsDirectRenderSave();
  if (!directSave && duration > IN_MEMORY_RENDER_MAX_SECONDS) {
    setStatus("Renders over 5 minutes require desktop Chrome or Edge so PECO can write directly to a chosen file.", true);
    return;
  }
  const profiles = clipRecordingProfiles();
  if (!profiles.length || (!webCodecsRenderSupported() && typeof document.createElement("canvas").captureStream !== "function")) {
    setStatus("This browser cannot render video clips. Use current Chrome, Edge, or Safari and try again.", true);
    return;
  }
  const profile = profiles[0];
  const filename = renderOutputFilename(state.renderMode, segments, profile.extension);
  let fileHandle = null;
  let writable = null;
  if (directSave) {
    try {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: profile.extension === "mp4" ? "MP4 video" : "WebM video",
          accept: { [profile.mimeType.split(";")[0]]: [`.${profile.extension}`] }
        }]
      });
      writable = await fileHandle.createWritable();
    } catch (error) {
      if (error?.name === "AbortError") {
        setStatus("Render canceled before it began.");
        return;
      }
      setStatus(`Could not open the save location: ${error.message}`, true);
      return;
    }
  }
  pausePlayback({ silent: true });
  const totalFrames = segments.reduce((total, segment) => total + Math.max(0, segment.outFrame - segment.inFrame), 0);
  const firstSegment = segments[0];
  const render = {
    projectName: state.project.name,
    fps: state.project.fps,
    timelineStartFrame: state.project.timelineStartFrame || 0,
    mode: state.renderMode,
    label: renderModeLabel(state.renderMode, segments),
    filename,
    segments,
    segmentIndex: 0,
    completedFrames: 0,
    totalFrames,
    inFrame: firstSegment.inFrame,
    outFrame: firstSegment.outFrame,
    progress: 0,
    chunks: [],
    writable,
    writeChain: Promise.resolve(),
    recorder: null,
    outputStream: null,
    canvasRaf: 0,
    transitioning: false,
    cancelled: false,
    error: null,
    finalized: false,
    wakeLock: null,
    profile: null
  };
  state.clipRender = render;
  document.body.classList.add("clip-rendering");
  renderRenderMenu();
  renderTransport();
  setStatus(`Preparing ${render.label.toLowerCase()}...`);
  try {
    const realm = createClipRenderRealm();
    render.realm = realm;
    render.audio = realm.audio;
    render.previousMasterMuted = elements.audioMaster.muted;
    elements.audioMaster.muted = true;
    await prepareClipMediaAtFrame(render.inFrame, render.audio);
    if (!clipRenderIsActive(render)) {
      return;
    }
    const dimensions = clipCanvasDimensions();
    const canvas = realm.document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("The browser could not create the clip render surface.");
    }
    const audioCapture = await createClipAudioCapture(render.audio, realm.window);
    if (!clipRenderIsActive(render)) {
      audioCapture?.cleanup?.();
      return;
    }
    if (!audioCapture?.track) {
      throw new Error("Floater audio could not be attached to the clip render.");
    }
    render.canvas = canvas;
    render.context = context;
    render.audioCleanup = audioCapture.cleanup || null;
    render.profile = profile;
    if (webCodecsRenderSupported()) {
      render.webCodecs = await createWebCodecsClipRecorder(render, audioCapture.track, dimensions, directSave);
    } else {
      const videoStream = canvas.captureStream(Math.min(CLIP_RENDER_FPS_CAP, Math.max(1, Math.round(render.fps))));
      const outputStream = new realm.window.MediaStream();
      for (const track of videoStream.getVideoTracks()) {
        outputStream.addTrack(track);
      }
      outputStream.addTrack(audioCapture.track);
      const recorderResult = createClipMediaRecorder(outputStream, directSave ? [profile] : profiles, realm.window.MediaRecorder);
      if (!recorderResult) {
        throw new Error("The browser rejected every supported clip recording format.");
      }
      render.sourceOutputStream = outputStream;
      render.outputStream = outputStream;
      render.recorder = recorderResult.recorder;
      render.profile = recorderResult.profile;
    }
    const wakeLock = await requestClipWakeLock();
    if (!clipRenderIsActive(render)) {
      render.webCodecs?.cleanup?.();
      for (const track of render.outputStream?.getTracks?.() || []) {
        track.stop();
      }
      try {
        await wakeLock?.release?.();
      } catch {
        // Screen wake lock is best effort.
      }
      return;
    }
    render.wakeLock = wakeLock;
    drawClipRenderFrame(render);
    state.isPlaying = true;
    enableDecisionListAutoFollow({ center: true });
    enableMarkerListAutoFollow({ center: true });
    await playSyncedProgramVideos();
    if (!clipRenderIsActive(render)) {
      pausePlayback({ silent: true });
      return;
    }
    await render.audio.play();
    drawClipRenderFrame(render);
    if (render.webCodecs) {
      render.webCodecs.resumeAudio();
      encodeWebCodecsVideoFrame(render, true);
    } else {
      startClipRecorder(render);
    }
    startPlaybackLoop();
    renderRenderMenu();
    setStatus(`Rendering ${render.label.toLowerCase()}. Keep PECO open until it finishes.`);
    monitorClipRender(render);
  } catch (error) {
    failProxyClipRender(render, error);
  }
}

function createClipRenderRealm() {
  const frame = document.createElement("iframe");
  frame.hidden = true;
  frame.setAttribute("aria-hidden", "true");
  frame.src = "about:blank";
  document.body.appendChild(frame);
  if (!frame.contentWindow || !frame.contentDocument) {
    frame.remove();
    throw new Error("The browser could not isolate the video recorder.");
  }
  const audio = frame.contentDocument.createElement("audio");
  const angle = audioMasterAngle();
  audio.preload = "auto";
  audio.playsInline = true;
  audio.src = angle ? proxyUrlFor(angle) : "";
  frame.contentDocument.body.appendChild(audio);
  audio.load();
  return { frame, window: frame.contentWindow, document: frame.contentDocument, audio };
}

async function createWebCodecsClipRecorder(render, audioTrack, dimensions, directSave) {
  const videoConfigs = [
    { codec: "vp09.00.10.08", muxerCodec: "V_VP9" },
    { codec: "vp8", muxerCodec: "V_VP8" }
  ];
  let videoConfig = null;
  for (const candidate of videoConfigs) {
    const config = {
      codec: candidate.codec,
      width: dimensions.width,
      height: dimensions.height,
      bitrate: 4_000_000,
      framerate: Math.min(CLIP_RENDER_FPS_CAP, Math.max(1, Math.round(render.fps))),
      latencyMode: "realtime"
    };
    try {
      const support = await VideoEncoder.isConfigSupported(config);
      if (support.supported) {
        videoConfig = { ...config, muxerCodec: candidate.muxerCodec };
        break;
      }
    } catch {
      // Try the next browser encoder.
    }
  }
  if (!videoConfig) {
    throw new Error("This browser does not provide a VP8 or VP9 video encoder.");
  }
  const audioSettings = audioTrack.getSettings?.() || {};
  const audioConfig = {
    codec: "opus",
    sampleRate: Math.round(Number(audioSettings.sampleRate) || 48_000),
    numberOfChannels: Math.max(1, Math.round(Number(audioSettings.channelCount) || 2)),
    bitrate: 128_000
  };
  const audioSupport = await AudioEncoder.isConfigSupported(audioConfig);
  if (!audioSupport.supported) {
    throw new Error("This browser does not provide the Opus audio encoder needed for a clip render.");
  }
  const target = directSave
    ? new WebMMuxer.StreamTarget({
        chunked: true,
        chunkSize: 4 * 1024 * 1024,
        onData(data, position) {
          const bytes = data.slice();
          render.writeChain = render.writeChain.then(async () => {
            await render.writable.write({ type: "write", position, data: bytes });
            render.bytesWritten = Math.max(render.bytesWritten || 0, position + bytes.byteLength);
          });
        }
      })
    : new WebMMuxer.ArrayBufferTarget();
  const muxer = new WebMMuxer.Muxer({
    target,
    video: {
      codec: videoConfig.muxerCodec,
      width: dimensions.width,
      height: dimensions.height,
      frameRate: videoConfig.framerate
    },
    audio: {
      codec: "A_OPUS",
      numberOfChannels: audioConfig.numberOfChannels,
      sampleRate: audioConfig.sampleRate
    },
    firstTimestampBehavior: "strict"
  });
  const control = {
    target,
    muxer,
    videoEncoder: null,
    audioEncoder: null,
    audioReader: null,
    audioPump: null,
    audioRunning: false,
    audioOutputEnd: 0,
    videoFrameIndex: 0,
    stopped: false,
    finished: false,
    resumeAudio() {
      this.audioRunning = true;
    },
    pauseAudio() {
      this.audioRunning = false;
    },
    cleanup() {
      this.stopped = true;
      this.audioRunning = false;
      this.audioReader?.cancel?.().catch(() => {});
      try {
        this.videoEncoder?.close?.();
      } catch {}
      try {
        this.audioEncoder?.close?.();
      } catch {}
    }
  };
  control.videoEncoder = new VideoEncoder({
    output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
    error: error => {
      if (!control.stopped) {
        failProxyClipRender(render, error);
      }
    }
  });
  control.audioEncoder = new AudioEncoder({
    output: (chunk, metadata) => muxer.addAudioChunk(chunk, metadata),
    error: error => {
      if (!control.stopped) {
        failProxyClipRender(render, error);
      }
    }
  });
  control.videoEncoder.configure(videoConfig);
  control.audioEncoder.configure(audioConfig);
  const processor = new MediaStreamTrackProcessor({ track: audioTrack });
  control.audioReader = processor.readable.getReader();
  control.audioPump = pumpWebCodecsAudio(control, render);
  return control;
}

async function pumpWebCodecsAudio(control, render) {
  try {
    while (!control.stopped) {
      const { value, done } = await control.audioReader.read();
      if (done) {
        break;
      }
      if (!control.audioRunning) {
        value.close();
        continue;
      }
      const duration = Math.max(1, Number(value.duration || value.numberOfFrames / value.sampleRate * 1_000_000));
      const totalDuration = render.totalFrames / render.fps * 1_000_000;
      while (
        control.audioRunning
        && control.audioOutputEnd < totalDuration
        && control.audioOutputEnd > currentRenderedDurationMicroseconds(render) + 80_000
      ) {
        await new Promise(resolve => setTimeout(resolve, 8));
      }
      if (!control.audioRunning || control.audioOutputEnd >= totalDuration) {
        value.close();
        continue;
      }
      const timestamp = control.audioOutputEnd;
      const rebased = cloneAudioDataAtTimestamp(value, timestamp);
      value.close();
      control.audioEncoder.encode(rebased);
      rebased.close();
      control.audioOutputEnd = timestamp + duration;
    }
  } catch (error) {
    if (!control.stopped && clipRenderIsActive(render)) {
      failProxyClipRender(render, error);
    }
  }
}

function currentRenderedDurationMicroseconds(render) {
  const currentFrames = Math.max(0, Math.min(render.outFrame - render.inFrame, state.timelineFrame - render.inFrame));
  return Math.max(0, (render.completedFrames + currentFrames) / render.fps * 1_000_000);
}

function encodeWebCodecsVideoFrame(render, force = false) {
  const control = render.webCodecs;
  if (!control || control.stopped || !render.canvas) {
    return;
  }
  const currentFrames = Math.max(0, Math.min(render.outFrame - render.inFrame, state.timelineFrame - render.inFrame));
  const targetFrames = Math.min(render.totalFrames, render.completedFrames + currentFrames + 1);
  const frameDuration = 1_000_000 / Math.min(CLIP_RENDER_FPS_CAP, Math.max(1, Math.round(render.fps)));
  while (control.videoFrameIndex < targetFrames && (force || control.videoEncoder.encodeQueueSize < 4)) {
    const timestamp = Math.round(control.videoFrameIndex * frameDuration);
    const frame = new VideoFrame(render.canvas, { timestamp, duration: Math.round(frameDuration) });
    control.videoEncoder.encode(frame, {
      keyFrame: control.videoFrameIndex % Math.max(1, Math.round(render.fps * 2)) === 0
    });
    frame.close();
    control.videoFrameIndex += 1;
    if (!force) {
      break;
    }
  }
}

function cloneAudioDataAtTimestamp(audioData, timestamp) {
  const planar = String(audioData.format || "").includes("planar");
  const planeCount = planar ? audioData.numberOfChannels : 1;
  const sizes = [];
  let totalSize = 0;
  for (let planeIndex = 0; planeIndex < planeCount; planeIndex += 1) {
    const size = audioData.allocationSize({ planeIndex });
    sizes.push(size);
    totalSize += size;
  }
  const bytes = new Uint8Array(totalSize);
  let offset = 0;
  for (let planeIndex = 0; planeIndex < planeCount; planeIndex += 1) {
    const size = sizes[planeIndex];
    audioData.copyTo(bytes.subarray(offset, offset + size), { planeIndex });
    offset += size;
  }
  return new AudioData({
    format: audioData.format,
    sampleRate: audioData.sampleRate,
    numberOfFrames: audioData.numberOfFrames,
    numberOfChannels: audioData.numberOfChannels,
    timestamp,
    data: bytes
  });
}

function renderModeLabel(mode, segments) {
  if (mode === "full") {
    return "Full Review";
  }
  if (mode === "range") {
    return "In / Out Range";
  }
  return `Clip Reel (${segments.length})`;
}

function renderOutputFilename(mode, segments, extension) {
  const base = safeFilename(state.project?.name || "peco_review");
  if (mode === "full") {
    return `${base}_full_review.${extension}`;
  }
  if (mode === "range") {
    return `${base}_range_${filenameTimecode(clipFrameTimecode(segments[0].inFrame))}-${filenameTimecode(clipFrameTimecode(segments[0].outFrame))}.${extension}`;
  }
  return `${base}_clip_reel_${segments.length}.${extension}`;
}

function clipRenderIsActive(render) {
  return Boolean(state.clipRender === render && !render.cancelled && !render.finalized && !render.error);
}

async function prepareClipMediaAtFrame(frame, renderAudio = null) {
  setTimelineFrame(frame, { syncVideos: true, forceDecisionListFollow: true });
  ensureProgramVideos();
  const audio = ensureAudioMaster();
  const audioAngle = audioMasterAngle();
  if (!audio || !audioAngle) {
    throw new Error("Floater audio is unavailable in this review package.");
  }
  const seeks = [seekVideoElementToTimeline(audio, audioAngle)];
  if (renderAudio) {
    seeks.push(seekVideoElementToTimeline(renderAudio, audioAngle));
  }
  for (const entry of state.programVideos.values()) {
    const angle = angleById(entry.angleId);
    if (angle) {
      seeks.push(seekVideoElementToTimeline(entry.video, angle));
    }
  }
  await Promise.all(seeks);
  await Promise.all([...state.programVideos.values()].map(entry => waitForClipVideoFrame(entry.video)));
}

function waitForClipVideoFrame(video) {
  if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        resolve();
      } else {
        reject(new Error("A camera proxy did not provide a renderable video frame."));
      }
    };
    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("canplay", finish);
      video.removeEventListener("error", fail);
    };
    const fail = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(new Error("A camera proxy failed while preparing the clip render."));
    };
    const timeout = setTimeout(finish, 2500);
    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("canplay", finish, { once: true });
    video.addEventListener("error", fail, { once: true });
  });
}

function clipCanvasDimensions() {
  const active = activeProgramVideo();
  const source = active?.videoWidth > 0
    ? active
    : [...state.programVideos.values()].map(entry => entry.video).find(video => video.videoWidth > 0);
  const sourceWidth = Math.max(2, source?.videoWidth || 1280);
  const sourceHeight = Math.max(2, source?.videoHeight || 720);
  const scale = Math.min(1, CLIP_RENDER_MAX_WIDTH / sourceWidth, CLIP_RENDER_MAX_HEIGHT / sourceHeight);
  return {
    width: Math.max(2, Math.round((sourceWidth * scale) / 2) * 2),
    height: Math.max(2, Math.round((sourceHeight * scale) / 2) * 2)
  };
}

async function createClipAudioCapture(audio = ensureAudioMaster(), renderWindow = window) {
  if (!audio) {
    return null;
  }
  const AudioContextType = renderWindow.AudioContext || renderWindow.webkitAudioContext || window.AudioContext || window.webkitAudioContext;
  const capture = audio.captureStream || audio.mozCaptureStream;
  if (typeof capture === "function" && typeof AudioContextType === "function") {
    try {
      const sourceStream = capture.call(audio);
      const context = new AudioContextType();
      const source = context.createMediaStreamSource(sourceStream);
      const destination = context.createMediaStreamDestination();
      source.connect(destination);
      await context.resume();
      const track = destination.stream.getAudioTracks()[0];
      if (track) {
        let cleaned = false;
        return {
          track,
          sourceStream: destination.stream,
          cleanup() {
            if (cleaned) {
              return;
            }
            cleaned = true;
            try {
              source.disconnect(destination);
            } catch {
              // The destination may already be disconnected during page teardown.
            }
            for (const streamTrack of destination.stream.getTracks()) {
              streamTrack.stop();
            }
            context.close().catch(() => {});
          }
        };
      }
    } catch {
      // Direct track capture below is the fallback for limited WebViews.
    }
  }
  if (typeof capture === "function") {
    try {
      const sourceStream = capture.call(audio);
      const sourceTrack = sourceStream.getAudioTracks()[0];
      if (sourceTrack) {
        const track = sourceTrack.clone();
        return {
          track,
          sourceStream,
          cleanup() {
            track.stop();
          }
        };
      }
    } catch {
      return null;
    }
  }
  if (typeof AudioContextType === "function") {
    try {
      if (!state.clipAudioGraph) {
        const context = new AudioContextType();
        const source = context.createMediaElementSource(audio);
        source.connect(context.destination);
        state.clipAudioGraph = { context, source };
      }
      await state.clipAudioGraph.context.resume();
      const destination = state.clipAudioGraph.context.createMediaStreamDestination();
      state.clipAudioGraph.source.connect(destination);
      const track = destination.stream.getAudioTracks()[0];
      if (track) {
        let cleaned = false;
        return {
          track,
          sourceStream: destination.stream,
          cleanup() {
            if (cleaned) {
              return;
            }
            cleaned = true;
            try {
              state.clipAudioGraph?.source?.disconnect(destination);
            } catch {
              // The destination may already be disconnected during page teardown.
            }
            for (const streamTrack of destination.stream.getTracks()) {
              streamTrack.stop();
            }
          }
        };
      }
    } catch {
      return null;
    }
  }
  return null;
}

function createClipMediaRecorder(stream, profiles, RecorderType = MediaRecorder) {
  for (const profile of profiles) {
    try {
      return {
        profile,
        recorder: new RecorderType(stream, {
          mimeType: profile.mimeType,
          videoBitsPerSecond: 4_000_000,
          audioBitsPerSecond: 128_000
        })
      };
    } catch {
      try {
        return { profile, recorder: new RecorderType(stream, { mimeType: profile.mimeType }) };
      } catch {
        // Try the next browser-supported recording profile.
      }
    }
  }
  return null;
}

function startClipRecorder(render) {
  const recorder = render.recorder;
  recorder.addEventListener("error", event => {
    failProxyClipRender(render, event.error || new Error("The browser could not record the clip."));
  }, { once: true });
  recorder.addEventListener("dataavailable", event => {
    if (event.data?.size) {
      if (render.writable) {
        render.writeChain = render.writeChain.then(async () => {
          await render.writable.write(event.data);
          render.bytesWritten = (render.bytesWritten || 0) + event.data.size;
        });
        render.writeChain.catch(error => {
          if (clipRenderIsActive(render)) {
            failProxyClipRender(render, error);
          }
        });
      } else {
        render.chunks.push(event.data);
      }
    }
  });
  recorder.addEventListener("stop", () => finalizeProxyClipRender(render), { once: true });
  try {
    recorder.start(500);
  } catch (error) {
    throw error instanceof Error ? error : new Error("The clip recorder did not start.");
  }
  if (recorder.state !== "recording") {
    throw new Error("The clip recorder did not enter the recording state.");
  }
}

function monitorClipRender(render) {
  if (state.clipRender !== render || render.cancelled || render.error || render.transitioning) {
    return;
  }
  drawClipRenderFrame(render);
  encodeWebCodecsVideoFrame(render);
  const currentFrames = Math.max(0, Math.min(render.outFrame - render.inFrame, state.timelineFrame - render.inFrame));
  render.progress = Math.max(0, Math.min(1, (render.completedFrames + currentFrames) / Math.max(1, render.totalFrames)));
  elements.clipRenderProgress.value = render.progress;
  const percent = Math.round(render.progress * 100);
  elements.renderMenuSummary.textContent = `Rendering ${percent}% | ${render.label}`;
  if (state.timelineFrame >= render.outFrame) {
    if (render.segmentIndex < render.segments.length - 1) {
      advanceClipRenderSegment(render);
    } else {
      stopProxyClipRecorder(render);
    }
    return;
  }
  if (!state.isPlaying) {
    failProxyClipRender(render, new Error("Playback stopped before the selected clip range finished."));
    return;
  }
  render.canvasRaf = requestAnimationFrame(() => monitorClipRender(render));
}

async function advanceClipRenderSegment(render) {
  if (!clipRenderIsActive(render) || render.transitioning) {
    return;
  }
  render.transitioning = true;
  cancelAnimationFrame(render.canvasRaf);
  render.canvasRaf = 0;
  try {
    if (render.webCodecs) {
      render.webCodecs.pauseAudio();
    } else {
      await setClipRecorderPaused(render.recorder, true);
    }
    if (!clipRenderIsActive(render)) {
      return;
    }
    pausePlayback({ silent: true });
    render.completedFrames += Math.max(0, render.outFrame - render.inFrame);
    render.segmentIndex += 1;
    const segment = render.segments[render.segmentIndex];
    render.inFrame = segment.inFrame;
    render.outFrame = segment.outFrame;
    await prepareClipMediaAtFrame(segment.inFrame, render.audio);
    if (!clipRenderIsActive(render)) {
      return;
    }
    drawClipRenderFrame(render);
    state.isPlaying = true;
    enableDecisionListAutoFollow({ center: true });
    enableMarkerListAutoFollow({ center: true });
    await playSyncedProgramVideos();
    if (!clipRenderIsActive(render)) {
      pausePlayback({ silent: true });
      return;
    }
    await render.audio.play();
    startPlaybackLoop();
    if (render.webCodecs) {
      render.webCodecs.resumeAudio();
    } else {
      await setClipRecorderPaused(render.recorder, false);
    }
    render.transitioning = false;
    monitorClipRender(render);
  } catch (error) {
    render.transitioning = false;
    failProxyClipRender(render, error);
  }
}

function setClipRecorderPaused(recorder, paused) {
  if (!recorder || recorder.state === "inactive") {
    return Promise.reject(new Error("The clip recorder stopped between reel segments."));
  }
  const targetState = paused ? "paused" : "recording";
  if (recorder.state === targetState) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const eventName = paused ? "pause" : "resume";
    const timer = setTimeout(() => {
      cleanup();
      if (recorder.state === targetState) {
        resolve();
      } else {
        reject(new Error(`The clip recorder could not ${paused ? "pause" : "resume"}.`));
      }
    }, 1500);
    const cleanup = () => {
      clearTimeout(timer);
      recorder.removeEventListener(eventName, finish);
      recorder.removeEventListener("error", fail);
    };
    const finish = () => {
      cleanup();
      resolve();
    };
    const fail = () => {
      cleanup();
      reject(new Error(`The clip recorder could not ${paused ? "pause" : "resume"}.`));
    };
    recorder.addEventListener(eventName, finish, { once: true });
    recorder.addEventListener("error", fail, { once: true });
    try {
      if (paused) {
        recorder.pause();
      } else {
        recorder.resume();
      }
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

function drawClipRenderFrame(render) {
  const decision = activeDecisionAtFrame(state.timelineFrame);
  const entry = state.programVideos.get(decision?.angleId || state.activeAngleId);
  const video = entry?.video;
  const context = render.context;
  const canvas = render.canvas;
  if (!video || video.readyState < 2 || !context || !canvas) {
    return false;
  }
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
  const width = video.videoWidth * scale;
  const height = video.videoHeight * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;
  try {
    context.drawImage(video, x, y, width, height);
    return true;
  } catch {
    return false;
  }
}

function stopProxyClipRecorder(render) {
  if (!render || render.finalized || render.finishing) {
    return;
  }
  render.finishing = true;
  cancelAnimationFrame(render.canvasRaf);
  render.canvasRaf = 0;
  pausePlayback({ silent: true });
  if (render.webCodecs) {
    finishWebCodecsClipRender(render);
    return;
  }
  if (render.recorder?.state && render.recorder.state !== "inactive") {
    try {
      render.recorder.stop();
      return;
    } catch (error) {
      render.error = render.error || error;
    }
  }
  finalizeProxyClipRender(render);
}

async function finishWebCodecsClipRender(render) {
  const control = render.webCodecs;
  try {
    if (!render.cancelled && !render.error) {
      drawClipRenderFrame(render);
      encodeWebCodecsVideoFrame(render, true);
      control.pauseAudio();
      control.stopped = true;
      await control.audioReader.cancel().catch(() => {});
      await control.audioPump.catch(() => {});
      await control.videoEncoder.flush();
      await control.audioEncoder.flush();
      control.muxer.finalize();
      if (control.target instanceof WebMMuxer.ArrayBufferTarget) {
        const buffer = control.target.buffer;
        render.chunks = [new Blob([buffer], { type: "video/webm" })];
        render.bytesWritten = buffer.byteLength;
      } else {
        render.bytesWritten = Math.max(1024, render.bytesWritten || 0);
      }
      control.videoEncoder.close();
      control.audioEncoder.close();
      control.finished = true;
    } else {
      control.cleanup();
    }
  } catch (error) {
    render.error = render.error || error;
    control.cleanup();
  }
  await finalizeProxyClipRender(render);
}

function cancelProxyClipRender(options = {}) {
  const render = state.clipRender;
  if (!render) {
    return false;
  }
  render.cancelled = true;
  render.quietCancel = Boolean(options.quiet);
  if (!options.quiet) {
    setStatus("Canceling proxy clip render...");
  }
  stopProxyClipRecorder(render);
  return true;
}

function failProxyClipRender(render, error) {
  if (!render || render.finalized) {
    return;
  }
  render.error = error instanceof Error ? error : new Error(String(error || "Clip render failed."));
  stopProxyClipRecorder(render);
}

async function finalizeProxyClipRender(render) {
  if (!render || render.finalized) {
    return;
  }
  render.finalized = true;
  cancelAnimationFrame(render.canvasRaf);
  pausePlayback({ silent: true });
  for (const track of render.outputStream?.getTracks?.() || []) {
    track.stop();
  }
  for (const track of render.sourceOutputStream?.getTracks?.() || []) {
    track.stop();
  }
  render.audioCleanup?.();
  if (typeof render.previousMasterMuted === "boolean") {
    elements.audioMaster.muted = render.previousMasterMuted;
  }
  try {
    render.audio?.pause?.();
    render.audio?.removeAttribute?.("src");
    render.audio?.load?.();
  } catch {
    // Render-only audio cleanup must not block delivery.
  }
  render.realm?.frame?.remove?.();
  try {
    await render.wakeLock?.release?.();
  } catch {
    // Screen wake lock is best effort.
  }
  try {
    await render.writeChain;
  } catch (error) {
    if (!render.cancelled) {
      render.error = render.error || error;
    }
  }
  if (render.writable) {
    try {
      if (render.cancelled || render.error || (render.bytesWritten || 0) < 1024) {
        if (!render.cancelled && !render.error) {
          render.error = new Error("The browser produced an empty video file.");
        }
        await render.writable.abort();
      } else {
        await render.writable.close();
      }
    } catch (error) {
      if (!render.cancelled) {
        render.error = render.error || error;
      }
    }
  }
  if (state.clipRender === render) {
    state.clipRender = null;
  }
  document.body.classList.remove("clip-rendering");
  if (state.project) {
    setTimelineFrame(Math.min(render.outFrame, maxFrame()), { syncVideos: true, persist: true });
  }
  renderTransport();
  renderRenderMenu();
  if (render.cancelled) {
    if (!render.quietCancel) {
      setStatus("Video render canceled.");
    }
    return;
  }
  if (render.error) {
    setStatus(`Clip render failed: ${render.error.message}`, true);
    return;
  }
  const duration = render.totalFrames / render.fps;
  if (render.writable) {
    setStatus(`Rendered ${formatClipDuration(duration)} ${render.label.toLowerCase()} to ${render.filename}.`);
    return;
  }
  const mimeType = render.recorder?.mimeType || render.profile?.mimeType || "video/webm";
  const blob = new Blob(render.chunks, { type: mimeType });
  if (blob.size < 1024) {
    setStatus("Clip render failed: the browser produced an empty video file.", true);
    return;
  }
  const delivery = await shareOrDownloadBlob(render.filename, blob, {
    title: `${render.projectName} ${render.label}`,
    text: "Proxy-quality video rendered from PECO Mobile Review"
  });
  if (delivery.cancelled) {
    setStatus("Proxy clip sharing canceled. Render range was kept.");
    return;
  }
  setStatus(`Rendered ${formatClipDuration(duration)} ${render.label.toLowerCase()}: ${render.filename}`);
}

function filenameTimecode(value) {
  return String(value || "00:00:00:00").replace(/[:;]/g, "-");
}

async function requestClipWakeLock() {
  if (!navigator.wakeLock?.request) {
    return null;
  }
  try {
    return await navigator.wakeLock.request("screen");
  } catch {
    return null;
  }
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

async function shareOrDownloadBlob(filename, blob, options = {}) {
  const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
  const touchDevice = window.matchMedia?.("(pointer: coarse)")?.matches || navigator.maxTouchPoints > 1;
  if (touchDevice && navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: options.title || filename,
        text: options.text || "PECO Mobile clip",
        files: [file]
      });
      return { shared: true, cancelled: false };
    } catch (error) {
      if (error?.name === "AbortError") {
        return { shared: false, cancelled: true };
      }
    }
  }
  downloadBlob(filename, blob);
  return { shared: false, cancelled: false };
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
      markProjectSentBack(payload);
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
  markProjectSentBack(payload);
  setStatus(exportStatusMessage(payload, notesOnly));
}

function markProjectSentBack(payload) {
  if (!state.project?.id) {
    return;
  }
  const metadata = payload?.return_metadata && typeof payload.return_metadata === "object"
    ? cloneJsonValue(payload.return_metadata)
    : null;
  if (metadata?.return_id) {
    state.returnHeadId = String(metadata.return_id);
    state.lastExport = metadata;
  }
  try {
    localStorage.setItem(`${PROJECT_RETURN_STORAGE_PREFIX}${state.project.id}`, JSON.stringify({
      schema: metadata?.schema || "peco.mobile_review_return_status.v1",
      return_id: metadata?.return_id || "",
      base_return_id: metadata?.base_return_id || "",
      review_fingerprint: metadata?.review_fingerprint || currentReviewFingerprint(),
      sent_at: new Date().toISOString()
    }));
  } catch {
    // Return status is optional when browser preferences are blocked.
  }
  saveProjectState();
  renderReviewLibrary();
}

function exportStatusMessage(payload, notesOnly) {
  const noteCount = payload.review_markers.length;
  const summary = payload.review_summary || {};
  const collaboration = [summary.workflow_label, summary.assigned_to ? `assigned to ${summary.assigned_to}` : ""]
    .filter(Boolean)
    .join(", ");
  const context = collaboration ? ` ${collaboration}.` : "";
  if (notesOnly) {
    return `Exported ${noteCount} review note${noteCount === 1 ? "" : "s"}.${context} Send the .peconotes.json file back to PECO.`;
  }
  return `Exported ${payload.selected_camera_changes.length} camera decision(s) and ${noteCount} review note${noteCount === 1 ? "" : "s"}.${context} Send the .pecocuts.json file back to PECO.`;
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
    markProjectSentBack(payload);
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
  const payload = {
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
    collaboration: cloneJsonValue(state.collaboration),
    review_cloud: cloneJsonValue(project.reviewCloud || {}),
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
    review_clips: state.clips.map((clip, index) => ({
      clip_id: clip.id,
      clip_index: index + 1,
      in_frame: clip.inFrame,
      out_frame: clip.outFrame,
      in_timecode: framesToTimecode(project.timelineStartFrame + clip.inFrame, project.fps),
      out_timecode: framesToTimecode(project.timelineStartFrame + clip.outFrame, project.fps),
      duration_frames: clip.outFrame - clip.inFrame,
      created_at: clip.createdAt
    })),
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
  payload.review_summary = reviewWorkflow().reviewSummary({
    collaboration: payload.collaboration,
    reviewCloud: payload.review_cloud,
    reviewerName,
    decisions: payload.selected_camera_changes,
    markers: payload.review_markers,
    clips: payload.review_clips
  });
  payload.return_metadata = reviewWorkflow().buildReturnMetadata({
    snapshot: reviewExportSnapshot(reviewerName),
    baseReturnId: state.returnHeadId,
    lastExport: state.lastExport,
    packageRevisionId: project.packageRevisionId,
    reviewSessionId: state.reviewSessionId,
    reviewerName
  });
  return payload;
}

function reviewContentSnapshot() {
  return {
    decisions: (supportsCameraDecisions() ? compactDecisions() : []).map(decision => ({
      frame: decision.frame,
      angle_id: decision.angleId
    })),
    markers: state.markers.map(marker => ({
      marker_id: marker.id,
      frame: marker.frame,
      category: marker.category,
      label: marker.label || "",
      note: marker.note || ""
    })),
    clips: state.clips.map(clip => ({
      clip_id: clip.id,
      in_frame: clip.inFrame,
      out_frame: clip.outFrame
    })),
    collaboration: cloneJsonValue(state.collaboration)
  };
}

function reviewExportSnapshot(reviewerName = elements.reviewerInput.value.trim()) {
  return {
    project_id: state.project?.id || "",
    reviewer_name: String(reviewerName || ""),
    ...reviewContentSnapshot()
  };
}

function currentReviewFingerprint() {
  return reviewWorkflow().reviewFingerprint(reviewExportSnapshot());
}

function reviewChangeCount() {
  if (!state.project) {
    return 0;
  }
  const current = reviewWorkflow().reviewFingerprint(reviewContentSnapshot());
  return current === state.project.baselineReviewFingerprint ? 0 : 1;
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
  renderPerformanceStatus();
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
  setStatus(`Updated to PECO Mobile ${APP_VERSION}. Saved projects were kept. What's new: ${APP_PATCH_NOTES.join(" ")}`);
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
  scheduleProjectStateAutosave();
  renderProjectLine();
  renderReviewLibrary();
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
    package_revision_id: project.packageRevisionId,
    review_session_id: state.reviewSessionId,
    return_head_id: state.returnHeadId,
    last_export: state.lastExport ? cloneJsonValue(state.lastExport) : null,
    review_fingerprint: currentReviewFingerprint(),
    review_change_count: reviewChangeCount(),
    timeline_frame: state.timelineFrame,
    selected_decision_frame: state.selectedDecisionFrame,
    active_angle_id: state.activeAngleId,
    reviewer_name: elements.reviewerInput.value.trim(),
    collaboration: cloneJsonValue(state.collaboration),
    export_range: exportRangeIsValid()
      ? {
          in_frame: state.exportInFrame,
          out_frame: state.exportOutFrame
        }
      : null,
    clip_ranges: state.clips.map(clip => ({
      clip_id: clip.id,
      in_frame: clip.inFrame,
      out_frame: clip.outFrame,
      created_at: clip.createdAt
    })),
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
    if (
      saved.package_revision_id
      && project.packageRevisionId
      && saved.package_revision_id !== project.packageRevisionId
    ) {
      return false;
    }
    state.collaboration = reviewWorkflow().normalizeCollaboration(saved.collaboration || project.collaboration, {
      workflow: project.packageMetadata?.workflow,
      projectName: project.name
    });
    restoreNotePalette(project);
    const savedHeadId = String(saved.return_head_id || "");
    state.reviewSessionId = String(saved.review_session_id || state.reviewSessionId || `session_${cryptoRandomId()}`);
    state.returnHeadId = String(project.packageReturnHeadId || savedHeadId || "");
    state.lastExport = (
      saved.last_export
      && typeof saved.last_export === "object"
      && (!project.packageReturnHeadId || project.packageReturnHeadId === savedHeadId)
    ) ? cloneJsonValue(saved.last_export) : null;
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
    state.clips = [];
    for (const row of Array.isArray(saved.clip_ranges) ? saved.clip_ranges : []) {
      const inFrame = Math.round(Number(row.in_frame ?? row.inFrame));
      const outFrame = Math.round(Number(row.out_frame ?? row.outFrame));
      if (!Number.isFinite(inFrame) || !Number.isFinite(outFrame) || inFrame < 0 || outFrame <= inFrame || outFrame >= project.durationFrames) {
        continue;
      }
      state.clips.push({
        id: String(row.clip_id || row.id || `clip_${cryptoRandomId()}`),
        inFrame,
        outFrame,
        createdAt: String(row.created_at || row.createdAt || saved.saved_at || new Date().toISOString())
      });
    }
    state.clips.sort((a, b) => a.inFrame - b.inFrame || a.outFrame - b.outFrame || a.id.localeCompare(b.id));
    const savedRange = saved.export_range || saved.clip_range;
    const savedClipIn = Math.round(Number(savedRange?.in_frame));
    const savedClipOut = Math.round(Number(savedRange?.out_frame));
    if (
      Number.isFinite(savedClipIn)
      && Number.isFinite(savedClipOut)
      && savedClipIn >= 0
      && savedClipOut > savedClipIn
      && savedClipOut < project.durationFrames
    ) {
      state.exportInFrame = savedClipIn;
      state.exportOutFrame = savedClipOut;
    }
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
