(function () {
  "use strict";

  const PROJECT_SCHEMA = "peco.browser_edit_project.v1";
  const RETURN_SCHEMA = "peco.browser_edit_return.v1";
  const DEFAULT_FPS = 30;
  const DEFAULT_IMAGE_SECONDS = 5;
  const TRACK_HEADER_PX = 70;

  const byId = id => document.getElementById(id);
  const elements = {
    status: byId("draftStatus"),
    projectName: byId("projectNameInput"),
    newDraft: byId("newDraftButton"),
    openDraft: byId("openDraftButton"),
    openDraftInput: byId("openDraftInput"),
    addMedia: byId("addMediaButton"),
    addMediaInput: byId("addMediaInput"),
    cameraMedia: byId("cameraMediaButton"),
    cameraMediaInput: byId("cameraMediaInput"),
    saveDraft: byId("saveDraftButton"),
    exportDraft: byId("exportDraftButton"),
    video: byId("programVideo"),
    empty: byId("programEmpty"),
    viewerBadge: byId("viewerBadge"),
    viewerTime: byId("viewerTime"),
    jumpStart: byId("jumpStartButton"),
    backTen: byId("backTenButton"),
    backOne: byId("backOneButton"),
    play: byId("playButton"),
    forwardOne: byId("forwardOneButton"),
    forwardTen: byId("forwardTenButton"),
    jumpEnd: byId("jumpEndButton"),
    slider: byId("timelineSlider"),
    mediaList: byId("mediaList"),
    mediaCount: byId("mediaCount"),
    appendMedia: byId("appendMediaButton"),
    insertMedia: byId("insertMediaButton"),
    clipSelection: byId("clipSelectionLabel"),
    protectedWarning: byId("protectedWarning"),
    transition: byId("transitionSelect"),
    transitionFrames: byId("transitionFramesSelect"),
    moveLeft: byId("moveClipLeftButton"),
    moveRight: byId("moveClipRightButton"),
    split: byId("splitClipButton"),
    liftDelete: byId("liftDeleteButton"),
    rippleDelete: byId("rippleDeleteButton"),
    timelineSummary: byId("timelineSummary"),
    undo: byId("undoButton"),
    redo: byId("redoButton"),
    zoomOut: byId("zoomOutButton"),
    zoomFit: byId("zoomFitButton"),
    zoomIn: byId("zoomInButton"),
    timelineScroll: byId("timelineScroll"),
    timelineStage: byId("timelineStage"),
    timeRuler: byId("timeRuler"),
    trackStack: byId("trackStack"),
    noteLane: byId("noteLane"),
    playhead: byId("playhead"),
    noteCount: byId("noteCount"),
    noteCategory: byId("noteCategorySelect"),
    noteTitle: byId("noteTitleInput"),
    noteDetails: byId("noteDetailsInput"),
    addNote: byId("addNoteButton"),
    noteList: byId("noteList"),
    saveState: byId("saveStateLabel")
  };

  const state = {
    project: createProject(),
    mediaByAssetId: new Map(),
    objectUrls: new Map(),
    selectedAssetId: "",
    selectedClipId: "",
    selectedMarkerId: "",
    frame: 0,
    pixelsPerSecond: 72,
    history: [],
    future: [],
    dirty: false,
    saveTimer: 0,
    playing: false,
    activeClipId: "",
    playbackStartedAt: 0,
    playbackStartFrame: 0,
    animationFrame: 0
  };

  function uniqueId(prefix) {
    if (globalThis.crypto?.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  }

  function createProject(name = "Untitled Draft") {
    const trackId = uniqueId("track");
    return {
      schema: PROJECT_SCHEMA,
      project_id: uniqueId("browser_draft"),
      project_name: name,
      fps: DEFAULT_FPS,
      duration_frames: 1,
      timeline: {
        timeline_id: uniqueId("timeline"),
        source_timeline_id: "",
        name,
        revision_id: "",
        start_timecode: "00:00:00:00",
        metadata: { browser_created: true }
      },
      tracks: [{
        track_id: trackId,
        source_track_id: "",
        name: "Video 1",
        track_type: "video",
        index: 0,
        muted: false,
        locked: false,
        metadata: { browser_created: true }
      }],
      assets: [],
      clips: [],
      markers: [],
      package_metadata: {
        schema: "peco.browser_edit_package.v1",
        source_app: "PECO Anywhere Draft",
        source_project_id: "",
        source_timeline_id: "",
        source_revision_id: "",
        source_media_included: false,
        browser_local_media_allowed: true,
        import_policy: "create_new_timeline",
        desktop_is_source_of_truth: false,
        warnings: []
      }
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function fps() {
    const value = Number(state.project?.fps || DEFAULT_FPS);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_FPS;
  }

  function frameToTimecode(frameValue) {
    const rate = fps();
    const nominal = Math.max(1, Math.round(rate));
    let frames = Math.max(0, Math.round(Number(frameValue || 0)));
    const ff = frames % nominal;
    frames = Math.floor(frames / nominal);
    const ss = frames % 60;
    frames = Math.floor(frames / 60);
    const mm = frames % 60;
    const hh = Math.floor(frames / 60);
    return [hh, mm, ss, ff].map(value => String(value).padStart(2, "0")).join(":");
  }

  function durationFrames() {
    return Math.max(1, ...state.project.clips.map(clip => Number(clip.timeline_start_frame || 0) + Number(clip.duration_frames || 1)), ...state.project.markers.map(marker => Number(marker.timeline_frame || 0) + 1));
  }

  function selectedAsset() {
    return state.project.assets.find(asset => asset.asset_id === state.selectedAssetId) || null;
  }

  function selectedClip() {
    return state.project.clips.find(clip => clip.clip_id === state.selectedClipId) || null;
  }

  function assetForClip(clip) {
    return state.project.assets.find(asset => asset.asset_id === clip?.asset_id) || null;
  }

  function editableClip(clip) {
    return Boolean(clip) && String(clip.editability || "editable") === "editable";
  }

  function videoTracks() {
    return state.project.tracks
      .filter(track => String(track.track_type || "video") === "video")
      .sort((left, right) => Number(left.index || 0) - Number(right.index || 0));
  }

  function editingTrack() {
    const selected = selectedClip();
    const selectedTrack = selected && state.project.tracks.find(track => track.track_id === selected.track_id && track.track_type === "video" && !track.locked);
    return selectedTrack || videoTracks().find(track => !track.locked) || null;
  }

  function sortedTrackClips(trackId) {
    return state.project.clips
      .filter(clip => clip.track_id === trackId && clip.enabled !== false)
      .sort((left, right) => Number(left.timeline_start_frame || 0) - Number(right.timeline_start_frame || 0) || String(left.clip_id).localeCompare(String(right.clip_id)));
  }

  function mediaObjectUrl(assetId) {
    if (state.objectUrls.has(assetId)) {
      return state.objectUrls.get(assetId);
    }
    const media = state.mediaByAssetId.get(assetId);
    if (!(media instanceof Blob)) {
      return "";
    }
    const url = URL.createObjectURL(media);
    state.objectUrls.set(assetId, url);
    return url;
  }

  function revokeObjectUrls() {
    for (const url of state.objectUrls.values()) {
      URL.revokeObjectURL(url);
    }
    state.objectUrls.clear();
  }

  function setStatus(message, error = false) {
    elements.status.textContent = String(message || "");
    elements.status.style.color = error ? "#ff9a97" : "";
  }

  function snapshot() {
    return {
      project: clone(state.project),
      selectedAssetId: state.selectedAssetId,
      selectedClipId: state.selectedClipId,
      selectedMarkerId: state.selectedMarkerId,
      frame: state.frame
    };
  }

  function restore(snapshotValue) {
    stopPlayback();
    state.project = clone(snapshotValue.project);
    state.selectedAssetId = snapshotValue.selectedAssetId || "";
    state.selectedClipId = snapshotValue.selectedClipId || "";
    state.selectedMarkerId = snapshotValue.selectedMarkerId || "";
    state.frame = Math.max(0, Math.min(Number(snapshotValue.frame || 0), durationFrames()));
    markDirty(false);
    render();
  }

  function beginEdit() {
    state.history.push(snapshot());
    if (state.history.length > 100) state.history.shift();
    state.future = [];
  }

  function markDirty(renderNow = true) {
    state.project.duration_frames = durationFrames();
    state.dirty = true;
    elements.saveState.textContent = "Unsaved local changes";
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(() => saveLocal(true), 900);
    if (renderNow) render();
  }

  function undo() {
    if (!state.history.length) return;
    state.future.push(snapshot());
    restore(state.history.pop());
    setStatus("Undid draft edit");
  }

  function redo() {
    if (!state.future.length) return;
    state.history.push(snapshot());
    restore(state.future.pop());
    setStatus("Redid draft edit");
  }

  async function mediaDurationFrames(file) {
    if (String(file.type || "").startsWith("image/")) {
      return Math.round(DEFAULT_IMAGE_SECONDS * fps());
    }
    if (!String(file.type || "").startsWith("video/") && !String(file.type || "").startsWith("audio/")) {
      return Math.round(DEFAULT_IMAGE_SECONDS * fps());
    }
    return new Promise(resolve => {
      const media = document.createElement(String(file.type).startsWith("audio/") ? "audio" : "video");
      const url = URL.createObjectURL(file);
      const finish = frames => {
        URL.revokeObjectURL(url);
        media.removeAttribute("src");
        resolve(Math.max(1, frames));
      };
      const timer = window.setTimeout(() => finish(Math.round(DEFAULT_IMAGE_SECONDS * fps())), 8000);
      media.addEventListener("loadedmetadata", () => {
        clearTimeout(timer);
        const seconds = Number(media.duration || 0);
        finish(Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * fps()) : Math.round(DEFAULT_IMAGE_SECONDS * fps()));
      }, { once: true });
      media.addEventListener("error", () => {
        clearTimeout(timer);
        finish(Math.round(DEFAULT_IMAGE_SECONDS * fps()));
      }, { once: true });
      media.preload = "metadata";
      media.src = url;
    });
  }

  async function addFiles(fileList) {
    const files = Array.from(fileList || []).filter(file => file instanceof File && (String(file.type || "").startsWith("video/") || String(file.type || "").startsWith("audio/") || String(file.type || "").startsWith("image/")));
    if (!files.length) return;
    setStatus(`Reading ${files.length} media file${files.length === 1 ? "" : "s"}...`);
    beginEdit();
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      setStatus(`Reading media ${index + 1} of ${files.length}: ${file.name}`);
      const assetId = uniqueId("browser_asset");
      const mediaType = String(file.type).startsWith("audio/") ? "audio" : String(file.type).startsWith("image/") ? "image" : "video";
      state.project.assets.push({
        asset_id: assetId,
        source_asset_id: "",
        name: file.name,
        media_type: mediaType,
        media_origin: "browser_local",
        editability: mediaType === "video" ? "editable" : "desktop_only",
        duration_frames: await mediaDurationFrames(file),
        package_path: "",
        proxy_filename: "",
        metadata: { browser_local: true, file_size: file.size, mime_type: file.type }
      });
      state.mediaByAssetId.set(assetId, file);
      state.selectedAssetId = assetId;
    }
    markDirty();
    setStatus(`${files.length} media file${files.length === 1 ? "" : "s"} ready. Append or insert it.`);
  }

  function appendSelectedAsset() {
    const asset = selectedAsset();
    const track = editingTrack();
    if (!asset || !track) return;
    if (String(asset.editability || "") !== "editable") {
      setStatus("This first Draft milestone edits video clips; audio/images stay protected for Desktop notes.", true);
      return;
    }
    beginEdit();
    const start = sortedTrackClips(track.track_id).reduce((end, clip) => Math.max(end, Number(clip.timeline_start_frame || 0) + Number(clip.duration_frames || 1)), 0);
    const clip = newClip(asset, track.track_id, start);
    state.project.clips.push(clip);
    state.selectedClipId = clip.clip_id;
    state.frame = start;
    markDirty();
    setStatus(`Appended ${asset.name}`);
  }

  function newClip(asset, trackId, start, duration = null, sourceStart = 0) {
    return {
      clip_id: uniqueId("clip"),
      source_clip_id: "",
      track_id: trackId,
      asset_id: asset.asset_id,
      timeline_start_frame: Math.max(0, Math.round(start)),
      duration_frames: Math.max(1, Math.round(duration ?? asset.duration_frames ?? fps() * 5)),
      source_start_frame: Math.max(0, Math.round(sourceStart)),
      enabled: true,
      editability: "editable",
      desktop_only_features: [],
      transition_in: { kind: "none", duration_frames: 0 },
      metadata: { browser_created: true }
    };
  }

  function insertSelectedAsset() {
    const asset = selectedAsset();
    const track = editingTrack();
    if (!asset || !track) return;
    if (String(asset.editability || "") !== "editable") {
      setStatus("Only browser-editable video can be inserted in this milestone.", true);
      return;
    }
    const at = Math.max(0, Math.round(state.frame));
    const affected = sortedTrackClips(track.track_id).filter(clip => Number(clip.timeline_start_frame || 0) + Number(clip.duration_frames || 1) > at);
    if (affected.some(clip => !editableClip(clip))) {
      setStatus("Insert would move a protected Desktop layer. Append instead, or leave a Codex work order.", true);
      return;
    }
    beginEdit();
    const containing = affected.find(clip => Number(clip.timeline_start_frame || 0) < at && Number(clip.timeline_start_frame || 0) + Number(clip.duration_frames || 1) > at);
    if (containing) {
      const leftDuration = at - Number(containing.timeline_start_frame || 0);
      const rightDuration = Number(containing.duration_frames || 1) - leftDuration;
      const right = clone(containing);
      right.clip_id = uniqueId("clip");
      right.source_clip_id = containing.source_clip_id || containing.clip_id;
      right.timeline_start_frame = at;
      right.source_start_frame = Number(containing.source_start_frame || 0) + leftDuration;
      right.duration_frames = rightDuration;
      containing.duration_frames = leftDuration;
      state.project.clips.push(right);
    }
    const insertDuration = Math.max(1, Number(asset.duration_frames || fps() * 5));
    for (const clip of state.project.clips) {
      if (clip.track_id === track.track_id && Number(clip.timeline_start_frame || 0) >= at) {
        clip.timeline_start_frame = Number(clip.timeline_start_frame || 0) + insertDuration;
      }
    }
    const inserted = newClip(asset, track.track_id, at, insertDuration);
    state.project.clips.push(inserted);
    state.selectedClipId = inserted.clip_id;
    markDirty();
    setStatus(`Inserted ${asset.name} at ${frameToTimecode(at)}`);
  }

  function requireEditableSelection(action) {
    const clip = selectedClip();
    if (!clip) {
      setStatus(`Select a clip to ${action}.`, true);
      return null;
    }
    if (!editableClip(clip)) {
      setStatus("That clip is a protected Desktop layer. Its original timing and effects remain unchanged.", true);
      return null;
    }
    return clip;
  }

  function trimClip(edge, deltaValue) {
    const clip = requireEditableSelection("trim");
    if (!clip) return;
    const delta = Math.round(Number(deltaValue || 0));
    if (!delta) return;
    const asset = assetForClip(clip);
    beginEdit();
    if (edge === "in") {
      if (delta > 0) {
        const amount = Math.min(delta, Number(clip.duration_frames || 1) - 1);
        clip.timeline_start_frame += amount;
        clip.source_start_frame += amount;
        clip.duration_frames -= amount;
      } else {
        const amount = Math.min(-delta, Number(clip.source_start_frame || 0), Number(clip.timeline_start_frame || 0));
        clip.timeline_start_frame -= amount;
        clip.source_start_frame -= amount;
        clip.duration_frames += amount;
      }
    } else {
      if (delta < 0) {
        clip.duration_frames = Math.max(1, Number(clip.duration_frames || 1) + delta);
      } else {
        const maxDuration = Math.max(1, Number(asset?.duration_frames || clip.source_start_frame + clip.duration_frames) - Number(clip.source_start_frame || 0));
        clip.duration_frames = Math.min(maxDuration, Number(clip.duration_frames || 1) + delta);
      }
    }
    markDirty();
    setStatus(`Trimmed ${edge.toUpperCase()} ${delta > 0 ? "+" : ""}${delta} frame${Math.abs(delta) === 1 ? "" : "s"}`);
  }

  function nudgeClip(deltaValue) {
    const clip = requireEditableSelection("nudge");
    if (!clip) return;
    const delta = Math.round(Number(deltaValue || 0));
    if (!delta) return;
    beginEdit();
    clip.timeline_start_frame = Math.max(0, Number(clip.timeline_start_frame || 0) + delta);
    state.frame = clip.timeline_start_frame;
    markDirty();
    setStatus(`Nudged clip ${delta > 0 ? "+" : ""}${delta} frame${Math.abs(delta) === 1 ? "" : "s"}`);
  }

  function splitSelectedClip() {
    const clip = requireEditableSelection("blade");
    if (!clip) return;
    const at = Math.round(state.frame);
    const start = Number(clip.timeline_start_frame || 0);
    const end = start + Number(clip.duration_frames || 1);
    if (at <= start || at >= end) {
      setStatus("Put the playhead inside the selected clip before using Blade.", true);
      return;
    }
    beginEdit();
    const right = clone(clip);
    right.clip_id = uniqueId("clip");
    right.source_clip_id = clip.source_clip_id || clip.clip_id;
    right.timeline_start_frame = at;
    right.source_start_frame = Number(clip.source_start_frame || 0) + (at - start);
    right.duration_frames = end - at;
    right.transition_in = { kind: "none", duration_frames: 0 };
    clip.duration_frames = at - start;
    state.project.clips.push(right);
    state.selectedClipId = right.clip_id;
    markDirty();
    setStatus(`Bladed clip at ${frameToTimecode(at)}`);
  }

  function deleteSelectedClip(ripple) {
    const clip = requireEditableSelection(ripple ? "ripple delete" : "lift delete");
    if (!clip) return;
    const start = Number(clip.timeline_start_frame || 0);
    const duration = Number(clip.duration_frames || 1);
    if (ripple) {
      const affected = state.project.clips.filter(row => row.track_id === clip.track_id && row.clip_id !== clip.clip_id && Number(row.timeline_start_frame || 0) >= start + duration);
      if (affected.some(row => !editableClip(row))) {
        setStatus("Ripple delete would move a protected Desktop layer. Use Lift Delete or leave a Codex work order.", true);
        return;
      }
    }
    beginEdit();
    state.project.clips = state.project.clips.filter(row => row.clip_id !== clip.clip_id);
    if (ripple) {
      for (const row of state.project.clips) {
        if (row.track_id === clip.track_id && Number(row.timeline_start_frame || 0) >= start + duration) {
          row.timeline_start_frame -= duration;
        }
      }
    }
    state.selectedClipId = "";
    state.frame = start;
    markDirty();
    setStatus(`${ripple ? "Ripple" : "Lift"} deleted clip`);
  }

  function moveSelectedClip(direction) {
    const clip = requireEditableSelection("move");
    if (!clip) return;
    const rows = sortedTrackClips(clip.track_id);
    const index = rows.findIndex(row => row.clip_id === clip.clip_id);
    const neighborIndex = index + direction;
    if (index < 0 || neighborIndex < 0 || neighborIndex >= rows.length) return;
    const neighbor = rows[neighborIndex];
    if (!editableClip(neighbor)) {
      setStatus("A protected Desktop layer blocks that reorder.", true);
      return;
    }
    beginEdit();
    const left = direction < 0 ? neighbor : clip;
    const right = direction < 0 ? clip : neighbor;
    const start = Math.min(Number(left.timeline_start_frame || 0), Number(right.timeline_start_frame || 0));
    right.timeline_start_frame = start;
    left.timeline_start_frame = start + Number(right.duration_frames || 1);
    state.frame = Number(clip.timeline_start_frame || 0);
    markDirty();
    setStatus(`Moved clip ${direction < 0 ? "earlier" : "later"}`);
  }

  function setTransition() {
    const clip = requireEditableSelection("change its transition");
    if (!clip) return;
    beginEdit();
    const kind = String(elements.transition.value || "none");
    clip.transition_in = {
      kind,
      duration_frames: kind === "none" ? 0 : Math.max(1, Number(elements.transitionFrames.value || 12))
    };
    markDirty();
    setStatus(kind === "none" ? "Set clip to a hard cut" : "Saved transition metadata for Desktop");
  }

  function addNote() {
    const title = String(elements.noteTitle.value || "").trim();
    const details = String(elements.noteDetails.value || "").trim();
    if (!title && !details) {
      setStatus("Write a note or Codex work order first.", true);
      elements.noteTitle.focus();
      return;
    }
    beginEdit();
    const marker = {
      marker_id: uniqueId("browser_note"),
      source_marker_id: "",
      timeline_frame: Math.max(0, Math.round(state.frame)),
      label: title || "Edit note",
      note: details,
      color: elements.noteCategory.value === "codex" ? "purple" : "cyan",
      category: elements.noteCategory.value,
      metadata: {
        browser_created: true,
        codex_work_order: elements.noteCategory.value === "codex",
        requires_review: true
      }
    };
    state.project.markers.push(marker);
    state.selectedMarkerId = marker.marker_id;
    elements.noteTitle.value = "";
    elements.noteDetails.value = "";
    markDirty();
    setStatus(`Added ${marker.category === "codex" ? "Codex work order" : "edit note"} at ${frameToTimecode(marker.timeline_frame)}`);
  }

  function deleteNote(markerId) {
    const marker = state.project.markers.find(row => row.marker_id === markerId);
    if (!marker) return;
    beginEdit();
    state.project.markers = state.project.markers.filter(row => row.marker_id !== markerId);
    if (state.selectedMarkerId === markerId) state.selectedMarkerId = "";
    markDirty();
    setStatus("Deleted edit note");
  }

  function seek(frameValue, renderNow = true) {
    state.frame = Math.max(0, Math.min(Math.round(Number(frameValue || 0)), durationFrames()));
    if (!state.playing) syncViewer();
    if (renderNow) renderPlayhead();
  }

  function activeVideoClipAt(frameValue) {
    const frame = Number(frameValue || 0);
    const trackOrder = new Map(videoTracks().map((track, index) => [track.track_id, index]));
    return state.project.clips
      .filter(clip => clip.enabled !== false && trackOrder.has(clip.track_id) && frame >= Number(clip.timeline_start_frame || 0) && frame < Number(clip.timeline_start_frame || 0) + Number(clip.duration_frames || 1) && state.mediaByAssetId.has(clip.asset_id))
      .sort((left, right) => Number(trackOrder.get(right.track_id)) - Number(trackOrder.get(left.track_id)))[0] || null;
  }

  function syncViewer(force = false) {
    const clip = activeVideoClipAt(state.frame);
    if (!clip) {
      if (force || state.activeClipId) {
        elements.video.pause();
        elements.video.removeAttribute("src");
        elements.video.load();
      }
      state.activeClipId = "";
      elements.empty.classList.remove("hidden");
      elements.viewerBadge.textContent = "GAP";
      return;
    }
    const asset = assetForClip(clip);
    const url = mediaObjectUrl(clip.asset_id);
    if (!url) return;
    const desiredTime = (Number(clip.source_start_frame || 0) + state.frame - Number(clip.timeline_start_frame || 0)) / fps();
    if (force || state.activeClipId !== clip.clip_id || elements.video.src !== url) {
      state.activeClipId = clip.clip_id;
      elements.video.src = url;
      elements.video.load();
    }
    if (Number.isFinite(desiredTime) && Math.abs(Number(elements.video.currentTime || 0) - desiredTime) > 0.08) {
      try { elements.video.currentTime = Math.max(0, desiredTime); } catch { /* metadata will catch up */ }
    }
    elements.empty.classList.add("hidden");
    const transition = clip.transition_in || {};
    elements.viewerBadge.textContent = transition.kind && transition.kind !== "none" ? `${String(transition.kind).replaceAll("_", " ")} - Desktop metadata` : (asset?.media_origin === "desktop_proxy" ? "PROXY CUT" : "CUT preview");
  }

  async function startPlayback() {
    if (state.playing) {
      stopPlayback();
      return;
    }
    if (!state.project.clips.length) return;
    if (state.frame >= durationFrames()) state.frame = 0;
    state.playing = true;
    state.playbackStartFrame = state.frame;
    state.playbackStartedAt = performance.now();
    elements.play.textContent = "Pause";
    playbackTick();
  }

  function playbackTick(now = performance.now()) {
    if (!state.playing) return;
    const elapsed = (now - state.playbackStartedAt) / 1000;
    state.frame = Math.min(durationFrames(), Math.round(state.playbackStartFrame + elapsed * fps()));
    syncViewer();
    if (elements.video.src && elements.video.paused) {
      elements.video.play().catch(() => {});
    }
    renderPlayhead();
    if (state.frame >= durationFrames()) {
      stopPlayback();
      return;
    }
    state.animationFrame = requestAnimationFrame(playbackTick);
  }

  function stopPlayback() {
    state.playing = false;
    if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
    state.animationFrame = 0;
    elements.video.pause();
    elements.play.textContent = "Play";
  }

  function render() {
    state.project.duration_frames = durationFrames();
    elements.projectName.value = state.project.project_name || "Untitled Draft";
    renderMedia();
    renderInspector();
    renderTimeline();
    renderNotes();
    renderPlayhead();
    elements.undo.disabled = !state.history.length;
    elements.redo.disabled = !state.future.length;
    syncViewer();
  }

  function renderMedia() {
    elements.mediaList.replaceChildren();
    for (const asset of state.project.assets) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `media-item${asset.asset_id === state.selectedAssetId ? " selected" : ""}`;
      button.dataset.assetId = asset.asset_id;
      const thumb = document.createElement("span");
      thumb.className = "media-thumb";
      thumb.textContent = String(asset.media_type || "media").toUpperCase();
      const text = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = asset.name || "Untitled media";
      const detail = document.createElement("small");
      detail.textContent = `${frameToTimecode(asset.duration_frames || 1)} - ${asset.media_origin === "desktop_proxy" ? "Desktop proxy" : asset.editability === "editable" ? "Browser media" : "Protected"}`;
      text.append(name, detail);
      button.append(thumb, text);
      button.addEventListener("click", () => {
        state.selectedAssetId = asset.asset_id;
        renderMedia();
      });
      elements.mediaList.append(button);
    }
    elements.mediaCount.textContent = String(state.project.assets.length);
    const asset = selectedAsset();
    elements.appendMedia.disabled = !asset;
    elements.insertMedia.disabled = !asset;
  }

  function renderInspector() {
    const clip = selectedClip();
    const asset = assetForClip(clip);
    elements.clipSelection.textContent = clip ? (asset?.name || clip.clip_id) : "None";
    const enabled = editableClip(clip);
    elements.protectedWarning.classList.toggle("hidden", !clip || enabled);
    document.querySelectorAll("[data-trim], [data-nudge]").forEach(button => { button.disabled = !enabled; });
    [elements.transition, elements.transitionFrames, elements.moveLeft, elements.moveRight, elements.split, elements.liftDelete, elements.rippleDelete].forEach(control => { control.disabled = !enabled; });
    const transition = clip?.transition_in || { kind: "none", duration_frames: 12 };
    elements.transition.value = ["none", "cross_dissolve", "fade_black"].includes(transition.kind) ? transition.kind : "none";
    elements.transitionFrames.value = ["6", "12", "24"].includes(String(transition.duration_frames)) ? String(transition.duration_frames) : "12";
  }

  function renderTimeline() {
    const totalFrames = durationFrames();
    const pxPerFrame = state.pixelsPerSecond / fps();
    const width = Math.max(elements.timelineScroll.clientWidth || 600, TRACK_HEADER_PX + totalFrames * pxPerFrame + 80);
    elements.timelineStage.style.width = `${Math.ceil(width)}px`;
    elements.trackStack.replaceChildren();
    const tracks = state.project.tracks.slice().sort((left, right) => Number(left.index || 0) - Number(right.index || 0));
    for (const track of tracks) {
      const row = document.createElement("div");
      row.className = "draft-track";
      row.dataset.trackId = track.track_id;
      const label = document.createElement("span");
      label.className = "track-label";
      label.textContent = track.name || "Track";
      row.append(label);
      for (const clip of sortedTrackClips(track.track_id)) {
        const asset = assetForClip(clip);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `timeline-clip${clip.clip_id === state.selectedClipId ? " selected" : ""}${editableClip(clip) ? "" : " protected"}`;
        button.style.left = `${TRACK_HEADER_PX + Number(clip.timeline_start_frame || 0) * pxPerFrame}px`;
        button.style.width = `${Math.max(8, Number(clip.duration_frames || 1) * pxPerFrame)}px`;
        button.dataset.clipId = clip.clip_id;
        const title = document.createElement("strong");
        title.textContent = asset?.name || "Missing media";
        const detail = document.createElement("small");
        detail.textContent = `${frameToTimecode(clip.timeline_start_frame)} - ${frameToTimecode(clip.duration_frames)}`;
        button.append(title, detail);
        if (clip.transition_in?.kind && clip.transition_in.kind !== "none") {
          const flag = document.createElement("span");
          flag.className = "transition-flag";
          button.append(flag);
        }
        button.addEventListener("click", event => {
          event.stopPropagation();
          state.selectedClipId = clip.clip_id;
          state.selectedAssetId = clip.asset_id;
          seek(clip.timeline_start_frame, false);
          render();
        });
        row.append(button);
      }
      elements.trackStack.append(row);
    }
    renderRuler(width, pxPerFrame);
    elements.timelineSummary.textContent = `${state.project.clips.length} clip${state.project.clips.length === 1 ? "" : "s"} - ${frameToTimecode(totalFrames)}`;
    elements.slider.max = String(totalFrames);
  }

  function renderRuler(width, pxPerFrame) {
    elements.timeRuler.replaceChildren();
    const seconds = durationFrames() / fps();
    const stepSeconds = state.pixelsPerSecond >= 100 ? 1 : state.pixelsPerSecond >= 45 ? 2 : state.pixelsPerSecond >= 22 ? 5 : 10;
    for (let second = 0; second <= seconds + stepSeconds; second += stepSeconds) {
      const tick = document.createElement("span");
      tick.className = "ruler-tick";
      tick.style.left = `${TRACK_HEADER_PX + second * fps() * pxPerFrame}px`;
      tick.textContent = frameToTimecode(second * fps()).slice(0, 8);
      elements.timeRuler.append(tick);
      if (TRACK_HEADER_PX + second * state.pixelsPerSecond > width) break;
    }
  }

  function renderNotes() {
    const pxPerFrame = state.pixelsPerSecond / fps();
    elements.noteLane.replaceChildren();
    elements.noteList.replaceChildren();
    const markers = state.project.markers.slice().sort((left, right) => Number(left.timeline_frame || 0) - Number(right.timeline_frame || 0));
    for (const marker of markers) {
      const flag = document.createElement("button");
      flag.type = "button";
      flag.className = "note-flag";
      flag.title = marker.label || "Edit note";
      flag.style.left = `${TRACK_HEADER_PX + Number(marker.timeline_frame || 0) * pxPerFrame}px`;
      flag.addEventListener("click", () => {
        state.selectedMarkerId = marker.marker_id;
        seek(marker.timeline_frame);
        renderNotes();
      });
      elements.noteLane.append(flag);

      const card = document.createElement("div");
      card.className = `note-card${marker.marker_id === state.selectedMarkerId ? " selected" : ""}`;
      const time = document.createElement("time");
      time.textContent = frameToTimecode(marker.timeline_frame);
      const body = document.createElement("button");
      body.type = "button";
      body.className = "note-card-body";
      body.style.cssText = "display:block;text-align:left;border:0;background:transparent;padding:0;min-height:0;white-space:normal";
      const title = document.createElement("strong");
      title.textContent = marker.label || "Edit note";
      const detail = document.createElement("small");
      detail.textContent = `${marker.category || "note"}${marker.note ? ` - ${marker.note}` : ""}`;
      body.append(title, detail);
      body.addEventListener("click", () => {
        state.selectedMarkerId = marker.marker_id;
        seek(marker.timeline_frame);
        renderNotes();
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "note-delete";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => deleteNote(marker.marker_id));
      card.append(time, body, remove);
      elements.noteList.append(card);
    }
    elements.noteCount.textContent = String(markers.length);
  }

  function renderPlayhead() {
    const left = TRACK_HEADER_PX + state.frame * state.pixelsPerSecond / fps();
    elements.playhead.style.left = `${left}px`;
    elements.viewerTime.textContent = frameToTimecode(state.frame);
    elements.slider.value = String(Math.min(state.frame, Number(elements.slider.max || durationFrames())));
  }

  function fitTimeline() {
    const available = Math.max(200, Number(elements.timelineScroll.clientWidth || 700) - TRACK_HEADER_PX - 28);
    state.pixelsPerSecond = Math.max(8, Math.min(240, available / Math.max(1, durationFrames() / fps())));
    renderTimeline();
    renderNotes();
    renderPlayhead();
  }

  async function saveLocal(silent = false) {
    if (!globalThis.PecoDraftStorage) {
      if (!silent) setStatus("Local draft storage is unavailable in this browser.", true);
      return false;
    }
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = 0;
    try {
      const savedAt = await PecoDraftStorage.saveDraft(state.project, state.mediaByAssetId);
      state.dirty = false;
      elements.saveState.textContent = `Saved locally ${new Date(savedAt).toLocaleString()}`;
      if (!silent) setStatus("Draft saved on this device");
      return true;
    } catch (error) {
      setStatus(`Could not save locally: ${error.message}`, true);
      elements.saveState.textContent = "Local save failed";
      return false;
    }
  }

  async function openPackage(file) {
    if (!(file instanceof File)) return;
    stopPlayback();
    setStatus(`Opening ${file.name}...`);
    try {
      const result = await PecoDraftArchive.readPackage(file, { onProgress: setStatus });
      revokeObjectUrls();
      state.project = normalizeProject(result.manifest);
      state.mediaByAssetId = result.mediaByAssetId;
      state.selectedAssetId = state.project.assets[0]?.asset_id || "";
      state.selectedClipId = "";
      state.selectedMarkerId = "";
      state.frame = 0;
      state.history = [];
      state.future = [];
      state.dirty = false;
      elements.saveState.textContent = `Opened ${file.name}; not yet saved locally`;
      render();
      fitTimeline();
      setStatus(`Opened ${file.name}. Desktop layers are protected.`);
    } catch (error) {
      setStatus(`Could not open draft: ${error.message}`, true);
    }
  }

  function normalizeProject(payload) {
    const project = clone(payload || {});
    if (![PROJECT_SCHEMA, RETURN_SCHEMA].includes(String(project.schema || ""))) {
      throw new Error("Unsupported PECO Anywhere Draft schema.");
    }
    project.fps = Number(project.fps || DEFAULT_FPS);
    project.project_id = String(project.project_id || uniqueId("browser_draft"));
    project.project_name = String(project.project_name || "Untitled Draft");
    project.timeline = project.timeline && typeof project.timeline === "object" ? project.timeline : {};
    project.tracks = Array.isArray(project.tracks) ? project.tracks : [];
    project.assets = Array.isArray(project.assets) ? project.assets : [];
    project.clips = Array.isArray(project.clips) ? project.clips : [];
    project.markers = Array.isArray(project.markers) ? project.markers : [];
    project.package_metadata = project.package_metadata && typeof project.package_metadata === "object" ? project.package_metadata : {};
    if (!project.tracks.length) {
      const trackId = uniqueId("track");
      project.tracks.push({ track_id: trackId, source_track_id: "", name: "Video 1", track_type: "video", index: 0, muted: false, locked: false, metadata: { browser_created: true } });
    }
    return project;
  }

  async function loadLastLocalDraft() {
    if (!globalThis.PecoDraftStorage) return false;
    try {
      const record = await PecoDraftStorage.loadLastDraft();
      if (!record) return false;
      revokeObjectUrls();
      state.project = normalizeProject(record.project);
      state.mediaByAssetId = record.mediaByAssetId;
      state.selectedAssetId = state.project.assets[0]?.asset_id || "";
      state.history = [];
      state.future = [];
      state.frame = 0;
      state.dirty = false;
      elements.saveState.textContent = `Restored local save ${new Date(record.savedAt).toLocaleString()}`;
      render();
      fitTimeline();
      setStatus("Restored the last local Anywhere Draft");
      return true;
    } catch (error) {
      setStatus(`Local draft restore skipped: ${error.message}`, true);
      return false;
    }
  }

  function exportPayload() {
    const payload = clone(state.project);
    payload.schema = RETURN_SCHEMA;
    payload.project_name = String(elements.projectName.value || payload.project_name || "Untitled Draft").trim() || "Untitled Draft";
    payload.timeline.name = payload.project_name;
    payload.duration_frames = durationFrames();
    payload.source = {
      source_project_id: String(payload.package_metadata?.source_project_id || ""),
      source_timeline_id: String(payload.package_metadata?.source_timeline_id || payload.timeline?.source_timeline_id || ""),
      source_revision_id: String(payload.package_metadata?.source_revision_id || payload.timeline?.revision_id || "")
    };
    payload.package_metadata = {
      ...(payload.package_metadata || {}),
      source_app: "PECO Anywhere Draft",
      source_media_included: false,
      import_policy: "create_new_timeline",
      exported_at: new Date().toISOString(),
      codex_work_order_count: payload.markers.filter(marker => marker.category === "codex").length
    };
    return payload;
  }

  async function exportPackage() {
    stopPlayback();
    elements.exportDraft.disabled = true;
    try {
      const payload = exportPayload();
      setStatus("Packaging draft and referenced media...");
      const blob = await PecoDraftArchive.writePackage(payload, state.mediaByAssetId, { onProgress: setStatus });
      const safeName = payload.project_name.replace(/[^A-Za-z0-9._ -]+/g, "_").replace(/[ .]+$/g, "") || "peco_anywhere_draft";
      const filename = `${safeName}.pecodraft`;
      if (globalThis.PecoMobileNativeBridge?.exportDraft) {
        await PecoMobileNativeBridge.exportDraft({ filename, blob, onProgress: setStatus });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
      await saveLocal(true);
      setStatus(`${globalThis.PecoMobileNativeBridge?.exportDraft ? "Opened Android sharing for" : "Downloaded"} ${filename}. Desktop import will create a new timeline.`);
    } catch (error) {
      setStatus(`Could not export draft: ${error.message}`, true);
    } finally {
      elements.exportDraft.disabled = false;
    }
  }

  function resetProject(force = false) {
    if (!force && state.dirty && !window.confirm("Start a new draft? Your last autosave stays on this device.")) return;
    stopPlayback();
    revokeObjectUrls();
    state.project = createProject();
    state.mediaByAssetId = new Map();
    state.selectedAssetId = "";
    state.selectedClipId = "";
    state.selectedMarkerId = "";
    state.frame = 0;
    state.history = [];
    state.future = [];
    state.dirty = false;
    elements.saveState.textContent = "Not saved yet";
    render();
    fitTimeline();
    setStatus("New local-first cut timeline");
  }

  function clickTimeline(event) {
    if (event.target.closest("button")) return;
    const rectangle = elements.timelineStage.getBoundingClientRect();
    const x = event.clientX - rectangle.left;
    seek((x - TRACK_HEADER_PX) * fps() / state.pixelsPerSecond);
  }

  function isTypingTarget(target) {
    return target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable);
  }

  function keydown(event) {
    if (isTypingTarget(event.target)) return;
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key.toLowerCase() === "z") {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
      return;
    }
    if (modifier && event.key.toLowerCase() === "y") {
      event.preventDefault();
      redo();
      return;
    }
    if (modifier && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveLocal(false);
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      startPlayback();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      seek(state.frame - (event.shiftKey ? 10 : 1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      seek(state.frame + (event.shiftKey ? 10 : 1));
    } else if (event.key.toLowerCase() === "b") {
      event.preventDefault();
      splitSelectedClip();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      deleteSelectedClip(!event.shiftKey);
    }
  }

  function bindEvents() {
    elements.newDraft.addEventListener("click", () => resetProject(false));
    elements.openDraft.addEventListener("click", () => elements.openDraftInput.click());
    elements.openDraftInput.addEventListener("change", () => {
      const file = elements.openDraftInput.files?.[0];
      elements.openDraftInput.value = "";
      openPackage(file);
    });
    elements.addMedia.addEventListener("click", () => elements.addMediaInput.click());
    elements.cameraMedia.addEventListener("click", () => elements.cameraMediaInput.click());
    elements.addMediaInput.addEventListener("change", () => {
      const files = Array.from(elements.addMediaInput.files || []);
      elements.addMediaInput.value = "";
      addFiles(files);
    });
    elements.cameraMediaInput.addEventListener("change", () => {
      const files = Array.from(elements.cameraMediaInput.files || []);
      elements.cameraMediaInput.value = "";
      addFiles(files);
    });
    elements.saveDraft.addEventListener("click", () => saveLocal(false));
    elements.exportDraft.addEventListener("click", exportPackage);
    elements.projectName.addEventListener("change", () => {
      const value = String(elements.projectName.value || "").trim() || "Untitled Draft";
      if (value === state.project.project_name) return;
      beginEdit();
      state.project.project_name = value;
      state.project.timeline.name = value;
      markDirty();
    });
    elements.appendMedia.addEventListener("click", appendSelectedAsset);
    elements.insertMedia.addEventListener("click", insertSelectedAsset);
    document.querySelectorAll("[data-trim]").forEach(button => button.addEventListener("click", () => trimClip(button.dataset.trim, button.dataset.frames)));
    document.querySelectorAll("[data-nudge]").forEach(button => button.addEventListener("click", () => nudgeClip(button.dataset.nudge)));
    elements.transition.addEventListener("change", setTransition);
    elements.transitionFrames.addEventListener("change", setTransition);
    elements.moveLeft.addEventListener("click", () => moveSelectedClip(-1));
    elements.moveRight.addEventListener("click", () => moveSelectedClip(1));
    elements.split.addEventListener("click", splitSelectedClip);
    elements.liftDelete.addEventListener("click", () => deleteSelectedClip(false));
    elements.rippleDelete.addEventListener("click", () => deleteSelectedClip(true));
    elements.undo.addEventListener("click", undo);
    elements.redo.addEventListener("click", redo);
    elements.zoomOut.addEventListener("click", () => { state.pixelsPerSecond = Math.max(8, state.pixelsPerSecond / 1.4); render(); });
    elements.zoomFit.addEventListener("click", fitTimeline);
    elements.zoomIn.addEventListener("click", () => { state.pixelsPerSecond = Math.min(240, state.pixelsPerSecond * 1.4); render(); });
    elements.timelineStage.addEventListener("click", clickTimeline);
    elements.slider.addEventListener("input", () => seek(elements.slider.value));
    elements.jumpStart.addEventListener("click", () => seek(0));
    elements.backTen.addEventListener("click", () => seek(state.frame - 10));
    elements.backOne.addEventListener("click", () => seek(state.frame - 1));
    elements.play.addEventListener("click", startPlayback);
    elements.forwardOne.addEventListener("click", () => seek(state.frame + 1));
    elements.forwardTen.addEventListener("click", () => seek(state.frame + 10));
    elements.jumpEnd.addEventListener("click", () => seek(durationFrames()));
    elements.addNote.addEventListener("click", addNote);
    document.addEventListener("keydown", keydown);
    window.addEventListener("resize", () => renderTimeline());
    window.addEventListener("beforeunload", () => {
      revokeObjectUrls();
    });
  }

  async function initialize() {
    bindEvents();
    render();
    await loadLastLocalDraft();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    }
  }

  // Small deterministic surface for the browser smoke probe; it does not mutate the Reviewer app.
  globalThis.__pecoDraftTest = Object.freeze({
    state,
    createProject,
    normalizeProject,
    durationFrames,
    frameToTimecode,
    resetProject: () => resetProject(true),
    addFiles,
    appendSelectedAsset,
    insertSelectedAsset,
    splitSelectedClip,
    deleteSelectedClip,
    trimClip,
    nudgeClip,
    addNote,
    undo,
    redo,
    seek,
    exportPayload,
    render
  });

  initialize();
})();
