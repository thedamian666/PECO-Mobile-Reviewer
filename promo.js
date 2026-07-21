(function () {
  "use strict";

  const Core = globalThis.PecoPromoCore;
  if (!Core) throw new Error("PECO Promo Studio core did not load.");

  const byId = id => document.getElementById(id);
  const elements = {
    status: byId("promoStatus"),
    projectName: byId("projectNameInput"),
    newPromo: byId("newPromoButton"),
    openPromo: byId("openPromoButton"),
    openPromoInput: byId("openPromoInput"),
    savePromo: byId("savePromoButton"),
    exportPromo: byId("exportPromoButton"),
    importTake: byId("importTakeButton"),
    importTakeInput: byId("importTakeInput"),
    cameraTakeInput: byId("cameraTakeInput"),
    recordTake: byId("recordTakeButton"),
    recordingBadge: byId("recordingBadge"),
    recordingTime: byId("recordingTime"),
    programFrame: byId("programFrame"),
    video: byId("programVideo"),
    empty: byId("programEmpty"),
    safeGuides: byId("safeGuides"),
    safeGuidesInput: byId("safeGuidesInput"),
    lowerThird: byId("lowerThird"),
    lowerThirdNickname: byId("lowerThirdNickname"),
    lowerThirdName: byId("lowerThirdName"),
    lowerThirdPromotion: byId("lowerThirdPromotion"),
    endCard: byId("endCard"),
    endCardPromotion: byId("endCardPromotion"),
    endCardName: byId("endCardName"),
    endCardOpponent: byId("endCardOpponent"),
    endCardEvent: byId("endCardEvent"),
    endCardCta: byId("endCardCta"),
    viewerTime: byId("viewerTime"),
    viewerPlayHint: byId("viewerPlayHint"),
    previewMode: byId("previewModeLabel"),
    previewSequence: byId("previewSequenceButton"),
    compareA: byId("compareAButton"),
    compareB: byId("compareBButton"),
    previewEndCard: byId("previewEndCardButton"),
    sequenceReadout: byId("sequenceReadout"),
    slider: byId("promoTimelineSlider"),
    promoType: byId("promoTypeSelect"),
    promoTypeSummary: byId("promoTypeSummary"),
    targetSeconds: byId("targetSecondsSelect"),
    lowerThirdEnabled: byId("lowerThirdEnabledInput"),
    endCardEnabled: byId("endCardEnabledInput"),
    voicePresetSummary: byId("voicePresetSummary"),
    voicePresetButtons: byId("voicePresetButtons"),
    voiceBypass: byId("voiceBypassInput"),
    voiceDescription: byId("voiceDescription"),
    voiceMeterFill: byId("voiceMeterFill"),
    takeList: byId("takeList"),
    takeCount: byId("takeCount"),
    sequenceStrip: byId("sequenceStrip"),
    clipCount: byId("clipCount"),
    selectedClipLabel: byId("selectedClipLabel"),
    moveEarlier: byId("moveEarlierButton"),
    moveLater: byId("moveLaterButton"),
    splitClip: byId("splitClipButton"),
    rippleDelete: byId("rippleDeleteButton"),
    noteCategory: byId("noteCategorySelect"),
    noteLabel: byId("noteLabelInput"),
    noteDetails: byId("noteDetailsInput"),
    addNote: byId("addNoteButton"),
    noteList: byId("noteList"),
    noteCount: byId("noteCount"),
    saveState: byId("saveStateLabel")
  };

  const state = {
    project: Core.createProject(),
    mediaByAssetId: new Map(),
    objectUrls: new Map(),
    selectedTakeId: "",
    selectedClipId: "",
    previewMode: "sequence",
    frame: 0,
    playing: false,
    activeClipId: "",
    playbackStartedAt: 0,
    playbackStartFrame: 0,
    animationFrame: 0,
    history: [],
    future: [],
    dirty: false,
    saveTimer: 0,
    recorder: null,
    recordingStream: null,
    recordingChunks: [],
    recordingStartedAt: 0,
    recordingTimer: 0,
    audio: {
      context: null,
      source: null,
      dry: null,
      highpass: null,
      presence: null,
      compressor: null,
      limiter: null,
      wet: null,
      analyser: null,
      meterFrame: 0,
      meterData: null
    }
  };

  function clone(value) {
    return Core.clone(value);
  }

  function fps() {
    return Core.fps(state.project);
  }

  function durationFrames() {
    return Core.durationFrames(state.project);
  }

  function frameToTimecode(frameValue) {
    const nominal = Math.max(1, Math.round(fps()));
    let frames = Math.max(0, Math.round(Number(frameValue || 0)));
    const ff = frames % nominal;
    frames = Math.floor(frames / nominal);
    const ss = frames % 60;
    frames = Math.floor(frames / 60);
    const mm = frames % 60;
    const hh = Math.floor(frames / 60);
    return [hh, mm, ss, ff].map(value => String(value).padStart(2, "0")).join(":");
  }

  function durationLabel(frameValue) {
    const seconds = Math.max(0, Math.round(Number(frameValue || 0) / fps()));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function takeName(asset) {
    return String(asset?.metadata?.take_name || asset?.name || "Untitled Take");
  }

  function selectedTake() {
    return Core.asset(state.project, state.selectedTakeId);
  }

  function selectedClip() {
    return Core.clip(state.project, state.selectedClipId);
  }

  function assetForClip(row) {
    return Core.asset(state.project, row?.asset_id);
  }

  function setStatus(message, error = false) {
    elements.status.textContent = String(message || "");
    elements.status.style.color = error ? "#ff9f9a" : "";
  }

  function snapshot() {
    return {
      project: clone(state.project),
      selectedTakeId: state.selectedTakeId,
      selectedClipId: state.selectedClipId,
      previewMode: state.previewMode,
      frame: state.frame
    };
  }

  function beginEdit() {
    state.history.push(snapshot());
    if (state.history.length > 80) state.history.shift();
    state.future = [];
  }

  function restore(value) {
    stopPlayback();
    state.project = Core.normalizeProject(value.project);
    state.selectedTakeId = value.selectedTakeId || "";
    state.selectedClipId = value.selectedClipId || "";
    state.previewMode = value.previewMode || "sequence";
    state.frame = Math.max(0, Math.min(Number(value.frame || 0), durationFrames()));
    markDirty(false);
    syncFormsFromProject();
    render();
  }

  function undo() {
    if (!state.history.length) return;
    state.future.push(snapshot());
    restore(state.history.pop());
    setStatus("Undid promo edit");
  }

  function redo() {
    if (!state.future.length) return;
    state.history.push(snapshot());
    restore(state.future.pop());
    setStatus("Redid promo edit");
  }

  function markDirty(renderNow = true) {
    state.project.duration_frames = durationFrames();
    state.project.timeline.name = state.project.project_name;
    state.project.timeline.metadata = {
      ...(state.project.timeline.metadata || {}),
      project_kind: "wrestling_promo",
      promo_studio: clone(state.project.promo)
    };
    state.dirty = true;
    elements.saveState.textContent = "Unsaved local changes";
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(() => saveLocal(true), 900);
    if (renderNow) render();
  }

  function revokeObjectUrls() {
    for (const url of state.objectUrls.values()) URL.revokeObjectURL(url);
    state.objectUrls.clear();
  }

  function mediaObjectUrl(assetId) {
    if (state.objectUrls.has(assetId)) return state.objectUrls.get(assetId);
    const media = state.mediaByAssetId.get(assetId);
    if (!(media instanceof Blob)) return "";
    const url = URL.createObjectURL(media);
    state.objectUrls.set(assetId, url);
    return url;
  }

  async function mediaDurationFrames(file) {
    return new Promise(resolve => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);
      let finished = false;
      const finish = seconds => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        URL.revokeObjectURL(url);
        video.removeAttribute("src");
        resolve(Math.max(1, Math.round((Number.isFinite(seconds) && seconds > 0 ? seconds : 5) * fps())));
      };
      const timer = window.setTimeout(() => finish(5), 8000);
      video.addEventListener("loadedmetadata", () => finish(Number(video.duration || 0)), { once: true });
      video.addEventListener("error", () => finish(5), { once: true });
      video.preload = "metadata";
      video.src = url;
    });
  }

  async function addFiles(fileList, { recorded = false } = {}) {
    const files = Array.from(fileList || []).filter(file => file instanceof File && String(file.type || "").startsWith("video/"));
    if (!files.length) return [];
    beginEdit();
    const added = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      setStatus(`Reading take ${index + 1} of ${files.length}: ${file.name}`);
      const row = Core.addTake(state.project, {
        name: file.name,
        take_name: recorded ? `Recorded Take ${state.project.assets.length + 1}` : `Take ${state.project.assets.length + 1}`,
        duration_frames: await mediaDurationFrames(file),
        mime_type: file.type,
        file_size: file.size,
        recorded_at: new Date(Number(file.lastModified || Date.now())).toISOString()
      });
      row.metadata.recorded_in_browser = recorded;
      state.mediaByAssetId.set(row.asset_id, file);
      state.selectedTakeId = row.asset_id;
      added.push(row);
    }
    markDirty();
    if (added.length) previewTake(added[added.length - 1].asset_id, false);
    setStatus(`${added.length} raw take${added.length === 1 ? "" : "s"} added to the Take Locker`);
    return added;
  }

  function ensureVideoSource(assetId, sourceFrame = 0, autoplay = false) {
    const url = mediaObjectUrl(assetId);
    if (!url) return false;
    if (state.recorder?.state === "recording") {
      setStatus("Stop the active recording before previewing another take.", true);
      return false;
    }
    elements.video.srcObject = null;
    elements.video.muted = false;
    if (elements.video.dataset.assetId !== assetId || elements.video.src !== url) {
      elements.video.dataset.assetId = assetId;
      elements.video.src = url;
      elements.video.load();
    }
    const desired = Math.max(0, Number(sourceFrame || 0) / fps());
    const seek = () => {
      try { elements.video.currentTime = desired; } catch { /* Metadata will catch up. */ }
      if (autoplay) elements.video.play().catch(() => {});
    };
    if (elements.video.readyState >= 1) seek();
    else elements.video.addEventListener("loadedmetadata", seek, { once: true });
    elements.empty.classList.add("hidden");
    ensureAudioGraph().catch(() => {});
    return true;
  }

  function previewTake(assetId, autoplay = false) {
    stopPlayback();
    const row = Core.asset(state.project, assetId);
    if (!row) return;
    state.selectedTakeId = row.asset_id;
    state.previewMode = "take";
    ensureVideoSource(row.asset_id, 0, autoplay);
    elements.slider.max = String(Math.max(1, Number(row.duration_frames || 1)));
    elements.slider.value = "0";
    render();
  }

  function previewSequence(frame = state.frame, autoplay = false) {
    stopPlayback();
    state.previewMode = "sequence";
    state.frame = Math.max(0, Math.min(Math.round(Number(frame || 0)), durationFrames()));
    syncSequenceVideo(true, autoplay);
    render();
    if (autoplay) startSequencePlayback();
  }

  function previewEndCard() {
    stopPlayback();
    state.previewMode = "end_card";
    elements.video.pause();
    render();
  }

  function activeSequenceClip(frameValue) {
    const frame = Number(frameValue || 0);
    return Core.sortedClips(state.project).find(row => frame >= Number(row.timeline_start_frame || 0) && frame < Number(row.timeline_start_frame || 0) + Number(row.duration_frames || 1)) || null;
  }

  function syncSequenceVideo(force = false, autoplay = false) {
    const row = activeSequenceClip(state.frame);
    if (!row) {
      elements.video.pause();
      elements.empty.classList.toggle("hidden", Boolean(state.project.assets.length));
      state.activeClipId = "";
      renderOverlays();
      return;
    }
    const sourceFrame = Number(row.source_start_frame || 0) + state.frame - Number(row.timeline_start_frame || 0);
    if (force || state.activeClipId !== row.clip_id) {
      state.activeClipId = row.clip_id;
      ensureVideoSource(row.asset_id, sourceFrame, autoplay || state.playing);
    } else {
      const desired = sourceFrame / fps();
      if (Math.abs(Number(elements.video.currentTime || 0) - desired) > .12) {
        try { elements.video.currentTime = Math.max(0, desired); } catch { /* Safe during metadata changes. */ }
      }
    }
    renderOverlays();
  }

  async function togglePlayback() {
    if (state.recorder?.state === "recording") return;
    await ensureAudioGraph().catch(() => {});
    if (state.previewMode === "end_card") {
      previewSequence(0, true);
      return;
    }
    if (state.previewMode === "take") {
      if (!elements.video.src) return;
      if (elements.video.paused) await elements.video.play().catch(() => {});
      else elements.video.pause();
      updatePlayHint();
      return;
    }
    if (state.playing) stopPlayback();
    else startSequencePlayback();
  }

  function startSequencePlayback() {
    if (!state.project.clips.length) return;
    if (state.frame >= durationFrames()) state.frame = 0;
    state.playing = true;
    state.playbackStartFrame = state.frame;
    state.playbackStartedAt = performance.now();
    syncSequenceVideo(true, true);
    playbackTick();
    updatePlayHint();
  }

  function playbackTick(now = performance.now()) {
    if (!state.playing) return;
    const elapsed = (now - state.playbackStartedAt) / 1000;
    state.frame = Math.min(durationFrames(), Math.round(state.playbackStartFrame + elapsed * fps()));
    syncSequenceVideo(false, true);
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
    updatePlayHint();
  }

  function updatePlayHint() {
    elements.viewerPlayHint.setAttribute("aria-label", (state.playing || !elements.video.paused) ? "Pause preview" : "Play preview");
  }

  async function ensureAudioGraph() {
    if (state.audio.context) {
      if (state.audio.context.state === "suspended") await state.audio.context.resume();
      applyVoiceGraph();
      return state.audio.context;
    }
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) {
      setStatus("This browser cannot preview the Clean Voice chain. Settings will still transfer to Desktop.", true);
      return null;
    }
    const context = new AudioContextClass();
    const source = context.createMediaElementSource(elements.video);
    const dry = context.createGain();
    const highpass = context.createBiquadFilter();
    const presence = context.createBiquadFilter();
    const compressor = context.createDynamicsCompressor();
    const limiter = context.createDynamicsCompressor();
    const wet = context.createGain();
    const analyser = context.createAnalyser();
    highpass.type = "highpass";
    presence.type = "peaking";
    presence.frequency.value = 3200;
    presence.Q.value = .8;
    limiter.threshold.value = -1;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = .003;
    limiter.release.value = .08;
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = .72;
    source.connect(dry).connect(analyser);
    source.connect(highpass).connect(presence).connect(compressor).connect(limiter).connect(wet).connect(analyser);
    analyser.connect(context.destination);
    Object.assign(state.audio, { context, source, dry, highpass, presence, compressor, limiter, wet, analyser, meterData: new Uint8Array(analyser.fftSize) });
    applyVoiceGraph();
    meterTick();
    if (context.state === "suspended") await context.resume();
    return context;
  }

  function applyVoiceGraph() {
    const audio = state.audio;
    if (!audio.context) return;
    const voice = state.project.promo.voice;
    const params = Core.VOICE_PRESETS[voice.preset] || Core.VOICE_PRESETS.natural;
    const now = audio.context.currentTime;
    const set = (parameter, value) => parameter.setTargetAtTime(Number(value), now, .015);
    set(audio.highpass.frequency, params.highpass_hz);
    set(audio.presence.gain, params.presence_db);
    set(audio.compressor.threshold, params.compressor_threshold_db);
    set(audio.compressor.knee, 12);
    set(audio.compressor.ratio, params.compressor_ratio);
    set(audio.compressor.attack, params.compressor_attack_seconds);
    set(audio.compressor.release, params.compressor_release_seconds);
    const gain = Math.pow(10, Number(params.output_gain_db || 0) / 20);
    set(audio.dry.gain, voice.bypass ? 1 : 0);
    set(audio.wet.gain, voice.bypass ? 0 : gain);
  }

  function meterTick() {
    if (!state.audio.analyser || !state.audio.meterData) return;
    state.audio.analyser.getByteTimeDomainData(state.audio.meterData);
    let peak = 0;
    for (const value of state.audio.meterData) peak = Math.max(peak, Math.abs(value - 128) / 128);
    elements.voiceMeterFill.style.transform = `translateX(${Math.min(100, peak * 112).toFixed(1)}%)`;
    state.audio.meterFrame = requestAnimationFrame(meterTick);
  }

  async function toggleRecording() {
    if (state.recorder?.state === "recording") {
      stopRecording(true);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder !== "function") {
      elements.cameraTakeInput.click();
      setStatus("Live recording is unavailable here. Opening the phone camera instead.");
      return;
    }
    try {
      stopPlayback();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false }
      });
      const choices = ["video/webm;codecs=vp8,opus", "video/webm;codecs=vp9,opus", "video/webm"];
      const mimeType = choices.find(value => MediaRecorder.isTypeSupported?.(value)) || "";
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      state.recordingStream = stream;
      state.recordingChunks = [];
      state.recorder = recorder;
      state.recordingStartedAt = performance.now();
      elements.video.removeAttribute("src");
      elements.video.srcObject = stream;
      elements.video.muted = true;
      elements.video.play().catch(() => {});
      elements.empty.classList.add("hidden");
      elements.recordingBadge.classList.remove("hidden");
      elements.recordTake.classList.add("active");
      elements.recordTake.textContent = "Stop Recording";
      updateRecordingClock();
      recorder.addEventListener("dataavailable", event => {
        if (event.data?.size) state.recordingChunks.push(event.data);
      });
      recorder.addEventListener("stop", finishRecording, { once: true });
      recorder.start(500);
      setStatus("Recording raw take. Tap Stop Recording when the performance is finished.");
    } catch (error) {
      cleanupRecordingStream();
      setStatus(`Could not start live recording: ${error.message}. Opening camera capture instead.`, true);
      elements.cameraTakeInput.click();
    }
  }

  function updateRecordingClock() {
    if (!state.recordingStartedAt) return;
    const elapsed = Math.max(0, Math.floor((performance.now() - state.recordingStartedAt) / 1000));
    elements.recordingTime.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
    state.recordingTimer = window.setTimeout(updateRecordingClock, 250);
  }

  function stopRecording(save = true) {
    if (!state.recorder) return;
    state.recorder.datasetSave = save ? "yes" : "no";
    if (state.recorder.state !== "inactive") state.recorder.stop();
    else cleanupRecordingStream();
  }

  async function finishRecording() {
    const recorder = state.recorder;
    const save = recorder?.datasetSave !== "no";
    const type = recorder?.mimeType || "video/webm";
    const blob = new Blob(state.recordingChunks, { type });
    cleanupRecordingStream();
    if (!save || !blob.size) {
      setStatus("Recording cancelled");
      return;
    }
    const extension = type.includes("mp4") ? "mp4" : "webm";
    const file = new File([blob], `promo-take-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`, { type, lastModified: Date.now() });
    await addFiles([file], { recorded: true });
  }

  function cleanupRecordingStream() {
    if (state.recordingTimer) clearTimeout(state.recordingTimer);
    state.recordingTimer = 0;
    for (const track of state.recordingStream?.getTracks?.() || []) track.stop();
    state.recordingStream = null;
    state.recordingChunks = [];
    state.recordingStartedAt = 0;
    state.recorder = null;
    elements.video.pause();
    elements.video.srcObject = null;
    elements.video.muted = false;
    elements.recordingBadge.classList.add("hidden");
    elements.recordTake.classList.remove("active");
    elements.recordTake.textContent = "Record Take";
  }

  function appendSelectedTake(assetId = state.selectedTakeId) {
    if (!assetId) {
      setStatus("Select a Take Locker item before adding it to the sequence.", true);
      return;
    }
    beginEdit();
    const row = Core.appendTake(state.project, assetId);
    state.selectedClipId = row.clip_id;
    state.frame = Number(row.timeline_start_frame || 0);
    markDirty();
    previewSequence(state.frame);
    setStatus(`Added ${takeName(Core.asset(state.project, assetId))} to the promo sequence`);
  }

  function renameTake(assetId) {
    const row = Core.asset(state.project, assetId);
    if (!row) return;
    const next = window.prompt("Take name", takeName(row));
    if (next === null || !String(next).trim()) return;
    beginEdit();
    Core.renameTake(state.project, assetId, next);
    markDirty();
    setStatus(`Renamed take to ${String(next).trim()}`);
  }

  function toggleFavorite(assetId) {
    beginEdit();
    const favorite = Core.toggleFavorite(state.project, assetId);
    markDirty();
    setStatus(favorite ? "Marked take as a favorite" : "Removed favorite mark");
  }

  function setComparison(slot, assetId) {
    beginEdit();
    state.project.promo.comparison[`${slot}_asset_id`] = assetId;
    markDirty();
    setStatus(`Assigned ${takeName(Core.asset(state.project, assetId))} to comparison ${slot.toUpperCase()}`);
  }

  function selectSequenceClip(clipId) {
    const row = Core.clip(state.project, clipId);
    if (!row) return;
    state.selectedClipId = row.clip_id;
    state.selectedTakeId = row.asset_id;
    state.frame = Number(row.timeline_start_frame || 0);
    previewSequence(state.frame);
  }

  function moveSelected(direction) {
    if (!state.selectedClipId) return;
    beginEdit();
    if (!Core.moveClip(state.project, state.selectedClipId, direction)) {
      state.history.pop();
      return;
    }
    const row = selectedClip();
    state.frame = Number(row?.timeline_start_frame || 0);
    markDirty();
    previewSequence(state.frame);
    setStatus(`Moved clip ${direction < 0 ? "earlier" : "later"}`);
  }

  function trimSelected(edge, frames) {
    if (!state.selectedClipId) return;
    beginEdit();
    if (!Core.trimClip(state.project, state.selectedClipId, edge, frames)) {
      state.history.pop();
      return;
    }
    const row = selectedClip();
    state.frame = Number(row?.timeline_start_frame || 0);
    markDirty();
    previewSequence(state.frame);
    setStatus(`Trimmed ${edge.toUpperCase()} ${Number(frames) > 0 ? "+" : ""}${frames} frame${Math.abs(frames) === 1 ? "" : "s"}`);
  }

  function splitSelected() {
    if (!state.selectedClipId) return;
    beginEdit();
    const right = Core.splitClip(state.project, state.selectedClipId, state.frame);
    if (!right) {
      state.history.pop();
      setStatus("Place the playhead inside the selected clip before using Blade.", true);
      return;
    }
    state.selectedClipId = right.clip_id;
    markDirty();
    previewSequence(state.frame);
    setStatus(`Bladed promo at ${frameToTimecode(state.frame)}`);
  }

  function deleteSelected() {
    if (!state.selectedClipId) return;
    const row = selectedClip();
    const start = Number(row?.timeline_start_frame || 0);
    beginEdit();
    if (!Core.rippleDelete(state.project, state.selectedClipId)) {
      state.history.pop();
      return;
    }
    state.selectedClipId = "";
    state.frame = Math.min(start, durationFrames());
    markDirty();
    previewSequence(state.frame);
    setStatus("Ripple deleted sequence clip. Raw Take Locker media was preserved.");
  }

  function addNote() {
    const label = String(elements.noteLabel.value || "").trim();
    const details = String(elements.noteDetails.value || "").trim();
    if (!label && !details) {
      setStatus("Write a coach note or Desktop work order first.", true);
      elements.noteLabel.focus();
      return;
    }
    beginEdit();
    Core.addNote(state.project, state.frame, label, details, elements.noteCategory.value);
    elements.noteLabel.value = "";
    elements.noteDetails.value = "";
    markDirty();
    setStatus(`Added note at ${frameToTimecode(state.frame)}`);
  }

  function deleteNote(markerId) {
    beginEdit();
    state.project.markers = state.project.markers.filter(row => row.marker_id !== markerId);
    markDirty();
    setStatus("Deleted promo note");
  }

  function setAspect(aspect) {
    if (!["9:16", "16:9", "1:1"].includes(aspect)) return;
    state.project.promo.aspect_ratio = aspect;
    markDirty(false);
    renderAspect();
    renderOverlays();
  }

  function renderAspect() {
    const aspect = state.project.promo.aspect_ratio;
    elements.programFrame.classList.remove("aspect-9-16", "aspect-16-9", "aspect-1-1");
    elements.programFrame.classList.add(`aspect-${aspect.replace(":", "-")}`);
    document.querySelectorAll("[data-aspect]").forEach(button => button.classList.toggle("selected", button.dataset.aspect === aspect));
  }

  function renderOverlays() {
    const promo = state.project.promo;
    const kit = promo.character_kit;
    elements.programFrame.style.setProperty("--promo-primary", kit.primary_color || "#92ff45");
    elements.programFrame.style.setProperty("--promo-secondary", kit.secondary_color || "#111711");
    elements.lowerThirdNickname.textContent = (kit.nickname || "THE CHALLENGER").toUpperCase();
    elements.lowerThirdName.textContent = (kit.wrestler_name || "WRESTLER NAME").toUpperCase();
    elements.lowerThirdPromotion.textContent = (kit.promotion || "PROMOTION").toUpperCase();
    elements.endCardPromotion.textContent = (kit.promotion || "PROMOTION").toUpperCase();
    elements.endCardName.textContent = (kit.wrestler_name || "WRESTLER").toUpperCase();
    elements.endCardOpponent.textContent = (kit.opponent || "OPPONENT").toUpperCase();
    elements.endCardEvent.textContent = [kit.event_name, kit.event_date, kit.venue].filter(Boolean).join(" · ").toUpperCase() || "EVENT · DATE · VENUE";
    elements.endCardCta.textContent = (kit.social_cta || "FOLLOW FOR DETAILS").toUpperCase();
    elements.safeGuides.classList.toggle("hidden", !promo.safe_guides);
    const active = state.previewMode === "sequence" ? activeSequenceClip(state.frame) : null;
    const relative = active ? state.frame - Number(active.timeline_start_frame || 0) : Math.round(Number(elements.video.currentTime || 0) * fps());
    const lowerThirdVisible = promo.overlays.lower_third_enabled && state.previewMode !== "end_card" && relative < Number(promo.overlays.lower_third_duration_frames || 120);
    const endStart = Math.max(0, durationFrames() - Number(promo.overlays.end_card_duration_frames || 90));
    const endCardVisible = promo.overlays.end_card_enabled && (state.previewMode === "end_card" || (state.previewMode === "sequence" && state.frame >= endStart && state.project.clips.length));
    elements.lowerThird.classList.toggle("hidden", !lowerThirdVisible || endCardVisible);
    elements.endCard.classList.toggle("hidden", !endCardVisible);
  }

  function renderTakeList() {
    elements.takeList.replaceChildren();
    if (!state.project.assets.length) {
      const empty = document.createElement("div");
      empty.className = "empty-row";
      empty.textContent = "Record or import several performances. Nothing is added to the sequence automatically.";
      elements.takeList.append(empty);
    }
    const comparison = state.project.promo.comparison;
    for (const row of state.project.assets) {
      const card = document.createElement("article");
      card.className = `take-card${row.asset_id === state.selectedTakeId ? " selected" : ""}${row.metadata?.favorite ? " favorite" : ""}`;
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "take-thumb";
      thumb.textContent = row.metadata?.recorded_in_browser ? "REC" : "VIDEO";
      thumb.addEventListener("click", () => previewTake(row.asset_id));
      const info = document.createElement("button");
      info.type = "button";
      info.className = "take-info";
      const name = document.createElement("strong");
      name.textContent = takeName(row);
      const details = document.createElement("small");
      details.textContent = `${durationLabel(row.duration_frames)} · raw preserved`;
      info.append(name, details);
      info.addEventListener("click", () => previewTake(row.asset_id));
      const actions = document.createElement("div");
      actions.className = "take-card-actions";
      const buttons = [
        [row.metadata?.favorite ? "★" : "☆", () => toggleFavorite(row.asset_id), row.metadata?.favorite],
        ["Rename", () => renameTake(row.asset_id), false],
        ["A", () => setComparison("a", row.asset_id), comparison.a_asset_id === row.asset_id],
        ["B", () => setComparison("b", row.asset_id), comparison.b_asset_id === row.asset_id],
        ["+ Sequence", () => appendSelectedTake(row.asset_id), false]
      ];
      for (const [label, handler, active] of buttons) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.classList.toggle("active", Boolean(active));
        button.addEventListener("click", handler);
        actions.append(button);
      }
      card.append(thumb, info, actions);
      elements.takeList.append(card);
    }
    const count = state.project.assets.length;
    elements.takeCount.textContent = `${count} take${count === 1 ? "" : "s"}`;
    const a = Core.asset(state.project, comparison.a_asset_id);
    const b = Core.asset(state.project, comparison.b_asset_id);
    elements.compareA.disabled = !a;
    elements.compareB.disabled = !b;
    elements.compareA.title = a ? `Preview ${takeName(a)}` : "Assign a take to A";
    elements.compareB.title = b ? `Preview ${takeName(b)}` : "Assign a take to B";
  }

  function renderSequence() {
    elements.sequenceStrip.replaceChildren();
    const rows = Core.sortedClips(state.project);
    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "empty-row";
      empty.textContent = "Choose + Sequence on a take. Clips remain frame-editable and source-linked.";
      elements.sequenceStrip.append(empty);
    }
    for (const [index, row] of rows.entries()) {
      const take = assetForClip(row);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `sequence-clip${row.clip_id === state.selectedClipId ? " selected" : ""}`;
      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${takeName(take)}`;
      const detail = document.createElement("small");
      detail.textContent = `${frameToTimecode(row.timeline_start_frame)} · ${durationLabel(row.duration_frames)} · source ${frameToTimecode(row.source_start_frame)}`;
      button.append(title, detail);
      button.addEventListener("click", () => selectSequenceClip(row.clip_id));
      elements.sequenceStrip.append(button);
    }
    const count = rows.length;
    elements.clipCount.textContent = `${count} clip${count === 1 ? "" : "s"}`;
    elements.sequenceReadout.textContent = `${count} clip${count === 1 ? "" : "s"} · ${durationLabel(durationFrames())}`;
    const selected = selectedClip();
    elements.selectedClipLabel.textContent = selected ? takeName(assetForClip(selected)) : "Select a sequence clip";
    const selectedIndex = rows.findIndex(row => row.clip_id === state.selectedClipId);
    elements.moveEarlier.disabled = selectedIndex <= 0;
    elements.moveLater.disabled = selectedIndex < 0 || selectedIndex >= rows.length - 1;
    elements.splitClip.disabled = !selected;
    elements.rippleDelete.disabled = !selected;
    document.querySelectorAll("[data-trim-edge]").forEach(button => { button.disabled = !selected; });
  }

  function renderNotes() {
    elements.noteList.replaceChildren();
    const rows = state.project.markers.slice().sort((left, right) => Number(left.timeline_frame || 0) - Number(right.timeline_frame || 0));
    for (const row of rows) {
      const card = document.createElement("article");
      card.className = "note-card";
      const time = document.createElement("time");
      time.textContent = frameToTimecode(row.timeline_frame);
      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = row.label || "Promo note";
      const detail = document.createElement("small");
      detail.textContent = `${row.category || "coach"}${row.note ? ` · ${row.note}` : ""}`;
      body.append(title, detail);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => deleteNote(row.marker_id));
      card.append(time, body, remove);
      elements.noteList.append(card);
    }
    elements.noteCount.textContent = `${rows.length} note${rows.length === 1 ? "" : "s"}`;
  }

  function renderVoice() {
    const voice = state.project.promo.voice;
    const preset = Core.VOICE_PRESETS[voice.preset] || Core.VOICE_PRESETS.natural;
    elements.voicePresetSummary.textContent = `${preset.label}${voice.bypass ? " · Bypassed" : ""}`;
    elements.voiceDescription.textContent = preset.description;
    elements.voiceBypass.checked = Boolean(voice.bypass);
    elements.voicePresetButtons.querySelectorAll("[data-voice-preset]").forEach(button => button.classList.toggle("selected", button.dataset.voicePreset === voice.preset));
    applyVoiceGraph();
  }

  function renderPlayhead() {
    if (state.previewMode === "take") {
      const frame = Math.round(Number(elements.video.currentTime || 0) * fps());
      elements.viewerTime.textContent = frameToTimecode(frame);
      elements.slider.value = String(Math.min(frame, Number(elements.slider.max || frame)));
    } else {
      elements.viewerTime.textContent = frameToTimecode(state.frame);
      elements.slider.max = String(durationFrames());
      elements.slider.value = String(Math.min(state.frame, durationFrames()));
    }
    renderOverlays();
  }

  function render() {
    elements.projectName.value = state.project.project_name;
    elements.previewMode.textContent = state.previewMode === "take" ? `Raw take · ${takeName(selectedTake())}` : state.previewMode === "end_card" ? "End card preview" : "Sequence preview";
    elements.promoTypeSummary.textContent = Core.PROMO_TYPES[state.project.promo.promo_type] || "Promo";
    renderAspect();
    renderOverlays();
    renderTakeList();
    renderSequence();
    renderNotes();
    renderVoice();
    renderPlayhead();
    updatePlayHint();
  }

  function syncFormsFromProject() {
    const promo = state.project.promo;
    elements.projectName.value = state.project.project_name;
    elements.promoType.value = promo.promo_type;
    elements.targetSeconds.value = String(promo.target_seconds);
    elements.safeGuidesInput.checked = Boolean(promo.safe_guides);
    elements.lowerThirdEnabled.checked = Boolean(promo.overlays.lower_third_enabled);
    elements.endCardEnabled.checked = Boolean(promo.overlays.end_card_enabled);
    elements.voiceBypass.checked = Boolean(promo.voice.bypass);
    document.querySelectorAll("[data-kit]").forEach(input => { input.value = promo.character_kit[input.dataset.kit] || ""; });
    document.querySelectorAll("[data-beat]").forEach(input => { input.value = promo.beats[input.dataset.beat] || ""; });
  }

  async function saveLocal(silent = false) {
    if (!globalThis.PecoPromoStorage) {
      if (!silent) setStatus("Local Promo Studio storage is unavailable in this browser.", true);
      return false;
    }
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = 0;
    try {
      const savedAt = await PecoPromoStorage.saveProject(state.project, state.mediaByAssetId);
      state.dirty = false;
      elements.saveState.textContent = `Saved locally ${new Date(savedAt).toLocaleString()}`;
      if (!silent) setStatus("Promo project saved on this device");
      return true;
    } catch (error) {
      elements.saveState.textContent = "Local save failed";
      if (!silent) setStatus(`Could not save promo project: ${error.message}`, true);
      return false;
    }
  }

  function replaceProject(project, mediaByAssetId, status) {
    stopPlayback();
    revokeObjectUrls();
    state.project = Core.normalizeProject(project);
    state.mediaByAssetId = mediaByAssetId instanceof Map ? mediaByAssetId : new Map();
    state.selectedTakeId = state.project.assets[0]?.asset_id || "";
    state.selectedClipId = Core.sortedClips(state.project)[0]?.clip_id || "";
    state.previewMode = state.project.clips.length ? "sequence" : (state.selectedTakeId ? "take" : "sequence");
    state.frame = 0;
    state.history = [];
    state.future = [];
    state.dirty = false;
    syncFormsFromProject();
    if (state.previewMode === "take") ensureVideoSource(state.selectedTakeId, 0, false);
    else syncSequenceVideo(true, false);
    render();
    setStatus(status);
  }

  async function loadLastLocal() {
    if (!globalThis.PecoPromoStorage) return;
    try {
      const record = await PecoPromoStorage.loadLastProject();
      if (record) {
        replaceProject(record.project, record.mediaByAssetId, `Recovered ${record.project.project_name} from this device`);
        elements.saveState.textContent = `Recovered local save ${new Date(record.savedAt).toLocaleString()}`;
      }
    } catch (error) {
      setStatus(`Local recovery unavailable: ${error.message}`, true);
    }
  }

  async function openPackage(file) {
    if (!(file instanceof File)) return;
    if (!globalThis.PecoDraftArchive) {
      setStatus("Portable promo archive support did not load.", true);
      return;
    }
    try {
      setStatus(`Opening ${file.name}...`);
      const opened = await PecoDraftArchive.readPackage(file, { onProgress: setStatus });
      replaceProject(opened.manifest, opened.mediaByAssetId, `Opened ${file.name}. Raw packaged takes were restored.`);
      await saveLocal(true);
    } catch (error) {
      setStatus(`Could not open promo project: ${error.message}`, true);
    }
  }

  function safeName(value) {
    return String(value || "promo").replace(/[^A-Za-z0-9._ -]+/g, "_").replace(/^[ .]+|[ .]+$/g, "") || "promo";
  }

  async function shareOrDownload(blob, filename) {
    if (globalThis.PecoMobileNativeBridge?.exportDraft) {
      await PecoMobileNativeBridge.exportDraft({ filename, blob, onProgress: setStatus });
      return "Opened Android sharing for";
    }
    const file = new File([blob], filename, { type: "application/zip", lastModified: Date.now() });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: state.project.project_name, text: "PECO Promo Studio Desktop handoff", files: [file] });
      return "Shared";
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    return "Downloaded";
  }

  async function exportPackage() {
    if (!state.project.clips.length) {
      setStatus("Add at least one raw take to the promo sequence before sending it to Desktop.", true);
      return;
    }
    elements.exportPromo.disabled = true;
    try {
      await saveLocal(true);
      const payload = Core.exportHandoff(state.project);
      const blob = await PecoDraftArchive.writePackage(payload, state.mediaByAssetId, { onProgress: setStatus });
      const filename = `${safeName(state.project.project_name)}_promo.pecodraft`;
      const action = await shareOrDownload(blob, filename);
      setStatus(`${action} ${filename}. Desktop import creates a new timeline and preserves raw source takes.`);
    } catch (error) {
      setStatus(`Could not export promo handoff: ${error.message}`, true);
    } finally {
      elements.exportPromo.disabled = false;
    }
  }

  function resetProject(force = false) {
    if (!force && state.dirty && !window.confirm("Start a new promo? Your last autosave stays on this device.")) return;
    if (state.recorder?.state === "recording") {
      stopRecording(false);
    } else {
      cleanupRecordingStream();
    }
    revokeObjectUrls();
    state.project = Core.createProject();
    state.mediaByAssetId = new Map();
    state.selectedTakeId = "";
    state.selectedClipId = "";
    state.previewMode = "sequence";
    state.frame = 0;
    state.history = [];
    state.future = [];
    elements.video.removeAttribute("src");
    elements.video.load();
    elements.empty.classList.remove("hidden");
    syncFormsFromProject();
    markDirty();
    setStatus("New wrestling promo ready. Record or import a raw take.");
  }

  function seek(value) {
    if (state.previewMode === "take") {
      const frame = Math.max(0, Math.round(Number(value || 0)));
      try { elements.video.currentTime = frame / fps(); } catch { /* Metadata will catch up. */ }
      renderPlayhead();
      return;
    }
    state.frame = Math.max(0, Math.min(Math.round(Number(value || 0)), durationFrames()));
    if (state.previewMode === "end_card") state.previewMode = "sequence";
    if (!state.playing) syncSequenceVideo();
    renderPlayhead();
  }

  function handleKeydown(event) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
    if ((event.ctrlKey || event.metaKey) && event.code === "KeyZ") {
      event.preventDefault();
      if (event.shiftKey) redo(); else undo();
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      seek((state.previewMode === "take" ? Number(elements.slider.value || 0) : state.frame) - 1);
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      seek((state.previewMode === "take" ? Number(elements.slider.value || 0) : state.frame) + 1);
    } else if (event.code === "KeyB") {
      event.preventDefault();
      splitSelected();
    } else if (event.code === "Delete" || event.code === "Backspace") {
      event.preventDefault();
      deleteSelected();
    }
  }

  function bindEvents() {
    elements.newPromo.addEventListener("click", () => resetProject(false));
    elements.openPromo.addEventListener("click", () => elements.openPromoInput.click());
    elements.openPromoInput.addEventListener("change", async () => {
      const [file] = elements.openPromoInput.files || [];
      elements.openPromoInput.value = "";
      if (file) await openPackage(file);
    });
    elements.savePromo.addEventListener("click", () => saveLocal(false));
    elements.exportPromo.addEventListener("click", exportPackage);
    elements.importTake.addEventListener("click", () => elements.importTakeInput.click());
    elements.importTakeInput.addEventListener("change", async () => {
      await addFiles(elements.importTakeInput.files);
      elements.importTakeInput.value = "";
    });
    elements.cameraTakeInput.addEventListener("change", async () => {
      await addFiles(elements.cameraTakeInput.files, { recorded: true });
      elements.cameraTakeInput.value = "";
    });
    elements.recordTake.addEventListener("click", toggleRecording);
    elements.viewerPlayHint.addEventListener("click", togglePlayback);
    elements.previewSequence.addEventListener("click", () => previewSequence(state.frame));
    elements.previewEndCard.addEventListener("click", previewEndCard);
    elements.compareA.addEventListener("click", () => previewTake(state.project.promo.comparison.a_asset_id));
    elements.compareB.addEventListener("click", () => previewTake(state.project.promo.comparison.b_asset_id));
    elements.slider.addEventListener("input", () => seek(elements.slider.value));
    elements.video.addEventListener("timeupdate", () => {
      if (state.previewMode === "take" && !state.recordingStream) renderPlayhead();
    });
    elements.video.addEventListener("play", updatePlayHint);
    elements.video.addEventListener("pause", updatePlayHint);
    elements.projectName.addEventListener("input", () => {
      state.project.project_name = String(elements.projectName.value || "Untitled Wrestling Promo").trim() || "Untitled Wrestling Promo";
      markDirty(false);
    });
    elements.promoType.addEventListener("change", () => {
      state.project.promo.promo_type = elements.promoType.value;
      markDirty();
    });
    elements.targetSeconds.addEventListener("change", () => {
      state.project.promo.target_seconds = Number(elements.targetSeconds.value || 30);
      markDirty(false);
    });
    elements.safeGuidesInput.addEventListener("change", () => {
      state.project.promo.safe_guides = elements.safeGuidesInput.checked;
      markDirty(false);
      renderOverlays();
    });
    elements.lowerThirdEnabled.addEventListener("change", () => {
      state.project.promo.overlays.lower_third_enabled = elements.lowerThirdEnabled.checked;
      markDirty(false);
      renderOverlays();
    });
    elements.endCardEnabled.addEventListener("change", () => {
      state.project.promo.overlays.end_card_enabled = elements.endCardEnabled.checked;
      markDirty(false);
      renderOverlays();
    });
    document.querySelectorAll("[data-aspect]").forEach(button => button.addEventListener("click", () => setAspect(button.dataset.aspect)));
    document.querySelectorAll("[data-kit]").forEach(input => input.addEventListener("input", () => {
      state.project.promo.character_kit[input.dataset.kit] = input.value;
      markDirty(false);
      renderOverlays();
    }));
    document.querySelectorAll("[data-beat]").forEach(input => input.addEventListener("input", () => {
      state.project.promo.beats[input.dataset.beat] = input.value;
      markDirty(false);
    }));
    elements.voicePresetButtons.querySelectorAll("[data-voice-preset]").forEach(button => button.addEventListener("click", async () => {
      beginEdit();
      Core.setVoicePreset(state.project, button.dataset.voicePreset);
      markDirty();
      await ensureAudioGraph().catch(() => {});
      setStatus(`${Core.VOICE_PRESETS[button.dataset.voicePreset].label} voice preview applied non-destructively`);
    }));
    elements.voiceBypass.addEventListener("change", async () => {
      state.project.promo.voice.bypass = elements.voiceBypass.checked;
      markDirty();
      await ensureAudioGraph().catch(() => {});
      setStatus(elements.voiceBypass.checked ? "Clean Voice bypassed for raw A/B" : "Clean Voice processing restored");
    });
    elements.moveEarlier.addEventListener("click", () => moveSelected(-1));
    elements.moveLater.addEventListener("click", () => moveSelected(1));
    elements.splitClip.addEventListener("click", splitSelected);
    elements.rippleDelete.addEventListener("click", deleteSelected);
    document.querySelectorAll("[data-trim-edge]").forEach(button => button.addEventListener("click", () => trimSelected(button.dataset.trimEdge, Number(button.dataset.trimFrames))));
    elements.addNote.addEventListener("click", addNote);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("beforeunload", () => {
      cleanupRecordingStream();
      revokeObjectUrls();
      if (state.audio.meterFrame) cancelAnimationFrame(state.audio.meterFrame);
    });
  }

  async function initialize() {
    bindEvents();
    syncFormsFromProject();
    render();
    await loadLastLocal();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }

  globalThis.__pecoPromoTest = Object.freeze({
    state,
    resetProject: () => resetProject(true),
    addFiles,
    appendSelectedTake,
    previewTake,
    previewSequence,
    selectSequenceClip,
    trimSelected,
    splitSelected,
    deleteSelected,
    moveSelected,
    addNote,
    setAspect,
    exportPayload: () => Core.exportHandoff(state.project),
    render
  });

  initialize();
})();
