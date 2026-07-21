(function (global) {
  "use strict";

  const PROJECT_SCHEMA = "peco.browser_edit_project.v1";
  const RETURN_SCHEMA = "peco.browser_edit_return.v1";
  const PROMO_SCHEMA = "peco.wrestling_promo.v1";
  const DEFAULT_FPS = 30;

  const VOICE_PRESETS = Object.freeze({
    natural: Object.freeze({
      label: "Natural",
      description: "Gentle cleanup that keeps room tone, breath, and performance dynamics.",
      highpass_hz: 70,
      presence_db: 1.5,
      compressor_threshold_db: -18,
      compressor_ratio: 2.2,
      compressor_attack_seconds: 0.012,
      compressor_release_seconds: 0.22,
      output_gain_db: 0
    }),
    broadcast: Object.freeze({
      label: "Broadcast",
      description: "Clear speech EQ and moderate compression for announcements and social promos.",
      highpass_hz: 85,
      presence_db: 2.8,
      compressor_threshold_db: -23,
      compressor_ratio: 3.2,
      compressor_attack_seconds: 0.008,
      compressor_release_seconds: 0.18,
      output_gain_db: 1
    }),
    aggressive: Object.freeze({
      label: "Aggressive Promo",
      description: "A denser, forward sound for intense delivery without crushing the raw take.",
      highpass_hz: 90,
      presence_db: 4,
      compressor_threshold_db: -27,
      compressor_ratio: 4.5,
      compressor_attack_seconds: 0.006,
      compressor_release_seconds: 0.14,
      output_gain_db: 1.5
    }),
    arena: Object.freeze({
      label: "Arena Energy",
      description: "Keeps more room and crowd character while controlling vocal peaks.",
      highpass_hz: 60,
      presence_db: 2,
      compressor_threshold_db: -20,
      compressor_ratio: 2.8,
      compressor_attack_seconds: 0.01,
      compressor_release_seconds: 0.26,
      output_gain_db: 0.5
    })
  });

  const PROMO_TYPES = Object.freeze({
    character_intro: "Character Introduction",
    match_challenge: "Match Challenge",
    event_ad: "Event Advertisement",
    post_match: "Post-Match Reaction"
  });

  const PROMO_TEMPLATES = Object.freeze({
    school_drill: Object.freeze({
      label: "Wrestling School Drill",
      description: "A short character, target, stakes, and closing-line practice promo.",
      promo_type: "character_intro",
      target_seconds: 30,
      aspect_ratio: "9:16",
      end_card_enabled: false,
      script: "My name is {wrestler}.\n{target}, listen closely.\nThis matters because {stakes}.\n{closing}"
    }),
    match_challenge: Object.freeze({
      label: "Match Challenge",
      description: "A direct opponent callout with the event information and a strong close.",
      promo_type: "match_challenge",
      target_seconds: 30,
      aspect_ratio: "9:16",
      end_card_enabled: true,
      script: "{target}, you know who I am.\n{grievance}\nAt {event}, {stakes}.\n{closing}"
    }),
    event_hype: Object.freeze({
      label: "Event Hype",
      description: "A compact event advertisement built for a vertical social post.",
      promo_type: "event_ad",
      target_seconds: 30,
      aspect_ratio: "9:16",
      end_card_enabled: true,
      script: "{promotion} presents {event}.\n{event_details}\nI'm {wrestler}, and {target} is about to find out why this matters.\n{closing}"
    }),
    post_match: Object.freeze({
      label: "Post-Match Reaction",
      description: "A fast reaction that captures what happened and what comes next.",
      promo_type: "post_match",
      target_seconds: 30,
      aspect_ratio: "9:16",
      end_card_enabled: false,
      script: "You just saw what happened.\n{grievance}\nThis is what comes next: {stakes}.\n{closing}"
    })
  });

  function uniqueId(prefix) {
    if (global.crypto?.randomUUID) return `${prefix}_${global.crypto.randomUUID()}`;
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function positiveInteger(value, fallback = 1) {
    const number = Math.round(Number(value));
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function createProject(name = "Untitled Wrestling Promo") {
    const trackId = uniqueId("promo_track");
    const revisionId = uniqueId("promo_revision");
    return {
      schema: PROJECT_SCHEMA,
      project_id: uniqueId("promo_project"),
      project_name: String(name || "Untitled Wrestling Promo"),
      project_kind: "wrestling_promo",
      promo_schema: PROMO_SCHEMA,
      fps: DEFAULT_FPS,
      duration_frames: 1,
      timeline: {
        timeline_id: uniqueId("promo_timeline"),
        source_timeline_id: "",
        name: String(name || "Untitled Wrestling Promo"),
        revision_id: revisionId,
        start_timecode: "00:00:00:00",
        metadata: { browser_created: true, project_kind: "wrestling_promo" }
      },
      tracks: [{
        track_id: trackId,
        source_track_id: "",
        name: "Promo Sequence",
        track_type: "video",
        index: 0,
        muted: false,
        locked: false,
        metadata: { browser_created: true, promo_sequence: true }
      }],
      assets: [],
      clips: [],
      markers: [],
      promo: {
        schema: PROMO_SCHEMA,
        promo_type: "match_challenge",
        aspect_ratio: "9:16",
        target_seconds: 30,
        safe_guides: true,
        character_kit: {
          wrestler_name: "",
          nickname: "",
          opponent: "",
          promotion: "",
          event_name: "",
          event_date: "",
          venue: "",
          social_cta: "",
          primary_color: "#92ff45",
          secondary_color: "#111711"
        },
        overlays: {
          lower_third_enabled: true,
          lower_third_duration_frames: 120,
          end_card_enabled: true,
          end_card_duration_frames: 90
        },
        voice: {
          preset: "natural",
          bypass: false,
          isolation_requested: false,
          isolation_status: "not_available_in_milestone_1",
          peak_ceiling_db: -1,
          parameters: clone(VOICE_PRESETS.natural)
        },
        beats: {
          identity: "",
          target: "",
          grievance: "",
          stakes: "",
          event_details: "",
          closing_line: ""
        },
        comparison: { a_asset_id: "", b_asset_id: "" },
        field_check: {
          status: "not_run",
          checked_at: "",
          camera_ready: false,
          microphone_ready: false,
          microphone_signal_detected: false,
          microphone_peak_db: -120,
          recorder_ready: false,
          storage_available_mb: 0,
          summary: "Run the field check before recording on a new device.",
          checks: []
        },
        teleprompter: {
          enabled: false,
          preview_only: true,
          script: "",
          font_scale: 1,
          speed: 24,
          mirror: false
        },
        captions: {
          enabled: false,
          auto_capture: false,
          language: "en-US",
          dictionary_text: "",
          cues: [],
          render_status: "editable_metadata_only"
        },
        template_id: ""
      },
      collaboration: {
        workspace: "wrestling",
        lane: "wrestling_promos",
        organization_id: "",
        editor_name: "",
        revision_id: revisionId,
        parent_revision_id: "",
        base_revision_id: "",
        revision_number: 1,
        updated_at: "",
        conflict_status: "local_only",
        cloud_sync_status: "not_configured"
      },
      package_metadata: {
        schema: "peco.browser_edit_package.v1",
        source_app: "PECO Promo Studio",
        source_project_id: "",
        source_timeline_id: "",
        source_revision_id: "",
        source_media_included: false,
        browser_local_media_allowed: true,
        import_policy: "create_new_timeline",
        desktop_is_source_of_truth: false,
        project_kind: "wrestling_promo",
        original_media_preserved: true,
        warnings: ["Deep AI voice isolation is not rendered by Promo Studio."]
      }
    };
  }

  function normalizeProject(value) {
    const source = value && typeof value === "object" ? clone(value) : createProject();
    if (![PROJECT_SCHEMA, RETURN_SCHEMA].includes(String(source.schema || ""))) {
      throw new Error(`Unsupported PECO Promo Studio schema: ${source.schema || "missing"}`);
    }
    if (String(source.project_kind || source.package_metadata?.project_kind || "") !== "wrestling_promo") {
      throw new Error("This package is not a PECO Wrestling Promo project.");
    }
    const defaults = createProject(source.project_name || "Untitled Wrestling Promo");
    source.project_id = String(source.project_id || defaults.project_id);
    source.project_name = String(source.project_name || defaults.project_name);
    source.project_kind = "wrestling_promo";
    source.promo_schema = PROMO_SCHEMA;
    source.fps = Number(source.fps) > 0 ? Number(source.fps) : DEFAULT_FPS;
    source.timeline = { ...defaults.timeline, ...(source.timeline || {}) };
    source.tracks = Array.isArray(source.tracks) && source.tracks.length ? source.tracks : defaults.tracks;
    source.assets = Array.isArray(source.assets) ? source.assets : [];
    source.clips = Array.isArray(source.clips) ? source.clips : [];
    source.markers = Array.isArray(source.markers) ? source.markers : [];
    source.promo = {
      ...defaults.promo,
      ...(source.promo || {}),
      character_kit: { ...defaults.promo.character_kit, ...(source.promo?.character_kit || {}) },
      overlays: { ...defaults.promo.overlays, ...(source.promo?.overlays || {}) },
      voice: { ...defaults.promo.voice, ...(source.promo?.voice || {}) },
      beats: { ...defaults.promo.beats, ...(source.promo?.beats || {}) },
      comparison: { ...defaults.promo.comparison, ...(source.promo?.comparison || {}) },
      field_check: { ...defaults.promo.field_check, ...(source.promo?.field_check || {}) },
      teleprompter: { ...defaults.promo.teleprompter, ...(source.promo?.teleprompter || {}) },
      captions: {
        ...defaults.promo.captions,
        ...(source.promo?.captions || {}),
        cues: Array.isArray(source.promo?.captions?.cues) ? source.promo.captions.cues : []
      }
    };
    source.collaboration = { ...defaults.collaboration, ...(source.collaboration || {}) };
    source.collaboration.workspace = "wrestling";
    source.collaboration.lane = "wrestling_promos";
    source.collaboration.cloud_sync_status = String(source.collaboration.cloud_sync_status || "not_configured");
    source.timeline.revision_id = String(source.collaboration.revision_id || source.timeline.revision_id || defaults.timeline.revision_id);
    source.package_metadata = { ...defaults.package_metadata, ...(source.package_metadata || {}), project_kind: "wrestling_promo" };
    source.duration_frames = durationFrames(source);
    return source;
  }

  function fps(project) {
    return Number(project?.fps) > 0 ? Number(project.fps) : DEFAULT_FPS;
  }

  function durationFrames(project) {
    return Math.max(1, ...(project?.clips || []).map(clip => positiveInteger(clip.timeline_start_frame, 0) + positiveInteger(clip.duration_frames)));
  }

  function sortedClips(project) {
    return (project?.clips || []).slice().sort((left, right) =>
      Number(left.timeline_start_frame || 0) - Number(right.timeline_start_frame || 0)
      || String(left.clip_id || "").localeCompare(String(right.clip_id || ""))
    );
  }

  function asset(project, assetId) {
    return (project?.assets || []).find(row => row.asset_id === assetId) || null;
  }

  function clip(project, clipId) {
    return (project?.clips || []).find(row => row.clip_id === clipId) || null;
  }

  function addTake(project, details = {}) {
    const takeNumber = project.assets.length + 1;
    const assetId = String(details.asset_id || uniqueId("promo_take"));
    const row = {
      asset_id: assetId,
      source_asset_id: String(details.source_asset_id || ""),
      name: String(details.name || `Take ${takeNumber}`),
      media_type: "video",
      media_origin: String(details.media_origin || "browser_local"),
      editability: "editable",
      duration_frames: positiveInteger(details.duration_frames, fps(project) * 5),
      package_path: String(details.package_path || ""),
      proxy_filename: String(details.proxy_filename || ""),
      metadata: {
        browser_local: !details.source_asset_id,
        promo_take: true,
        take_name: String(details.take_name || `Take ${takeNumber}`),
        favorite: Boolean(details.favorite),
        recorded_at: String(details.recorded_at || new Date().toISOString()),
        mime_type: String(details.mime_type || "video/webm"),
        file_size: Number(details.file_size || 0)
      }
    };
    project.assets.push(row);
    return row;
  }

  function renameTake(project, assetId, name) {
    const row = asset(project, assetId);
    if (!row) return false;
    const next = String(name || "").trim();
    if (!next) return false;
    row.metadata = { ...(row.metadata || {}), take_name: next };
    return true;
  }

  function toggleFavorite(project, assetId) {
    const row = asset(project, assetId);
    if (!row) return false;
    row.metadata = { ...(row.metadata || {}), favorite: !Boolean(row.metadata?.favorite) };
    return Boolean(row.metadata.favorite);
  }

  function appendTake(project, assetId) {
    const row = asset(project, assetId);
    if (!row) throw new Error("Select a Take Locker item first.");
    const trackId = String(project.tracks[0]?.track_id || "");
    if (!trackId) throw new Error("Promo sequence has no editable video track.");
    const start = durationFrames(project) === 1 && !project.clips.length ? 0 : durationFrames(project);
    const created = {
      clip_id: uniqueId("promo_clip"),
      source_clip_id: "",
      track_id: trackId,
      asset_id: row.asset_id,
      timeline_start_frame: start,
      duration_frames: positiveInteger(row.duration_frames),
      source_start_frame: 0,
      enabled: true,
      editability: "editable",
      desktop_only_features: [],
      transition_in: { kind: project.clips.length ? "cross_dissolve" : "none", duration_frames: project.clips.length ? 8 : 0 },
      metadata: {
        browser_created: true,
        promo_clip: true,
        promo_voice: clone(project.promo.voice),
        promo_overlay_reference: "project.promo"
      }
    };
    project.clips.push(created);
    for (const caption of row.metadata?.captions || []) {
      const cue = addCaption(
        project,
        start + Number(caption.start_frame || 0),
        start + Number(caption.end_frame || fps(project) * 2),
        caption.text,
        caption.source || "browser_speech"
      );
      if (cue) {
        cue.asset_id = row.asset_id;
        cue.clip_id = created.clip_id;
        cue.source_start_frame = Number(caption.start_frame || 0);
        cue.source_end_frame = Number(caption.end_frame || cue.source_start_frame + fps(project) * 2);
        cue.needs_review = caption.needs_review !== false;
      }
    }
    project.duration_frames = durationFrames(project);
    return created;
  }

  function compactSequence(project) {
    let cursor = 0;
    for (const row of sortedClips(project)) {
      row.timeline_start_frame = cursor;
      cursor += positiveInteger(row.duration_frames);
    }
    project.duration_frames = Math.max(1, cursor);
    syncClipCaptions(project);
  }

  function syncClipCaptions(project) {
    const clipsById = new Map((project.clips || []).map(row => [row.clip_id, row]));
    project.promo.captions.cues = (project.promo.captions.cues || []).filter(cue => {
      if (!cue.clip_id) return true;
      const row = clipsById.get(cue.clip_id);
      if (!row) return false;
      const clipSourceStart = Number(row.source_start_frame || 0);
      const clipSourceEnd = clipSourceStart + positiveInteger(row.duration_frames);
      const cueSourceStart = Number.isFinite(Number(cue.source_start_frame)) ? Number(cue.source_start_frame) : clipSourceStart + Math.max(0, Number(cue.start_frame || 0) - Number(row.timeline_start_frame || 0));
      const cueSourceEnd = Number.isFinite(Number(cue.source_end_frame)) ? Number(cue.source_end_frame) : cueSourceStart + Math.max(1, Number(cue.end_frame || 0) - Number(cue.start_frame || 0));
      cue.source_start_frame = cueSourceStart;
      cue.source_end_frame = Math.max(cueSourceStart + 1, cueSourceEnd);
      const visibleStart = Math.max(clipSourceStart, cue.source_start_frame);
      const visibleEnd = Math.min(clipSourceEnd, cue.source_end_frame);
      cue.excluded = visibleEnd <= visibleStart;
      if (!cue.excluded) {
        cue.start_frame = Number(row.timeline_start_frame || 0) + (visibleStart - clipSourceStart);
        cue.end_frame = Number(row.timeline_start_frame || 0) + (visibleEnd - clipSourceStart);
      }
      return true;
    });
  }

  function moveClip(project, clipId, direction) {
    const rows = sortedClips(project);
    const index = rows.findIndex(row => row.clip_id === clipId);
    const target = index + Math.sign(Number(direction || 0));
    if (index < 0 || target < 0 || target >= rows.length) return false;
    [rows[index], rows[target]] = [rows[target], rows[index]];
    let cursor = 0;
    for (const row of rows) {
      row.timeline_start_frame = cursor;
      cursor += positiveInteger(row.duration_frames);
    }
    project.duration_frames = Math.max(1, cursor);
    syncClipCaptions(project);
    return true;
  }

  function trimClip(project, clipId, edge, deltaValue) {
    const row = clip(project, clipId);
    const source = row ? asset(project, row.asset_id) : null;
    if (!row || !source) return false;
    const delta = Math.round(Number(deltaValue || 0));
    if (!delta) return false;
    if (edge === "in") {
      if (delta > 0) {
        const amount = Math.min(delta, positiveInteger(row.duration_frames) - 1);
        row.source_start_frame = Number(row.source_start_frame || 0) + amount;
        row.duration_frames = positiveInteger(row.duration_frames) - amount;
      } else {
        const amount = Math.min(-delta, Number(row.source_start_frame || 0));
        row.source_start_frame = Number(row.source_start_frame || 0) - amount;
        row.duration_frames = positiveInteger(row.duration_frames) + amount;
      }
    } else {
      const available = Math.max(1, Number(source.duration_frames || 1) - Number(row.source_start_frame || 0));
      row.duration_frames = Math.max(1, Math.min(available, positiveInteger(row.duration_frames) + delta));
    }
    compactSequence(project);
    return true;
  }

  function splitClip(project, clipId, timelineFrame) {
    const row = clip(project, clipId);
    if (!row) return null;
    const at = Math.round(Number(timelineFrame || 0));
    const start = Number(row.timeline_start_frame || 0);
    const end = start + positiveInteger(row.duration_frames);
    if (at <= start || at >= end) return null;
    const right = clone(row);
    right.clip_id = uniqueId("promo_clip");
    right.source_clip_id = row.source_clip_id || row.clip_id;
    right.timeline_start_frame = at;
    right.source_start_frame = Number(row.source_start_frame || 0) + (at - start);
    right.duration_frames = end - at;
    right.transition_in = { kind: "none", duration_frames: 0 };
    const rightSourceStart = Number(right.source_start_frame || 0);
    for (const cue of project.promo.captions.cues.filter(item => item.clip_id === row.clip_id)) {
      const cueSourceStart = Number(cue.source_start_frame || 0);
      const cueSourceEnd = Number(cue.source_end_frame || cueSourceStart + 1);
      if (cueSourceStart >= rightSourceStart) {
        cue.clip_id = right.clip_id;
      } else if (cueSourceEnd > rightSourceStart) {
        const rightCue = clone(cue);
        rightCue.caption_id = uniqueId("promo_caption");
        rightCue.clip_id = right.clip_id;
        rightCue.source_start_frame = rightSourceStart;
        cue.source_end_frame = rightSourceStart;
        project.promo.captions.cues.push(rightCue);
      }
    }
    row.duration_frames = at - start;
    project.clips.push(right);
    compactSequence(project);
    return right;
  }

  function rippleDelete(project, clipId) {
    const before = project.clips.length;
    project.clips = project.clips.filter(row => row.clip_id !== clipId);
    if (project.clips.length === before) return false;
    project.promo.captions.cues = project.promo.captions.cues.filter(row => row.clip_id !== clipId);
    compactSequence(project);
    return true;
  }

  function setVoicePreset(project, presetId) {
    const preset = VOICE_PRESETS[presetId] || VOICE_PRESETS.natural;
    project.promo.voice.preset = VOICE_PRESETS[presetId] ? presetId : "natural";
    project.promo.voice.parameters = clone(preset);
    for (const row of project.clips) {
      row.metadata = { ...(row.metadata || {}), promo_voice: clone(project.promo.voice) };
    }
    return preset;
  }

  function addNote(project, frame, label, note = "", category = "coach") {
    const cleanLabel = String(label || "").trim();
    const cleanNote = String(note || "").trim();
    if (!cleanLabel && !cleanNote) return null;
    const marker = {
      marker_id: uniqueId("promo_note"),
      source_marker_id: "",
      timeline_frame: Math.max(0, Math.round(Number(frame || 0))),
      label: cleanLabel || "Promo note",
      note: cleanNote,
      color: category === "codex" ? "purple" : "cyan",
      category: String(category || "coach"),
      metadata: {
        browser_created: true,
        project_kind: "wrestling_promo",
        codex_work_order: category === "codex",
        requires_review: true
      }
    };
    project.markers.push(marker);
    return marker;
  }

  function templateValue(project, key) {
    const promo = project?.promo || {};
    const kit = promo.character_kit || {};
    const beats = promo.beats || {};
    const values = {
      wrestler: kit.wrestler_name || beats.identity || "[RING NAME]",
      target: kit.opponent || beats.target || "[OPPONENT OR AUDIENCE]",
      stakes: beats.stakes || "[WHY THIS MATTERS]",
      grievance: beats.grievance || "[WHAT HAPPENED]",
      closing: beats.closing_line || "[CLOSING LINE]",
      event: kit.event_name || "[EVENT]",
      event_details: beats.event_details || [kit.event_date, kit.venue].filter(Boolean).join(" at ") || "[DATE AND VENUE]",
      promotion: kit.promotion || "[PROMOTION]"
    };
    return String(values[key] || "");
  }

  function applyTemplate(project, templateId) {
    const template = PROMO_TEMPLATES[templateId];
    if (!template) return false;
    project.promo.template_id = templateId;
    project.promo.promo_type = template.promo_type;
    project.promo.target_seconds = template.target_seconds;
    project.promo.aspect_ratio = template.aspect_ratio;
    project.promo.overlays.lower_third_enabled = true;
    project.promo.overlays.end_card_enabled = Boolean(template.end_card_enabled);
    project.promo.teleprompter.enabled = true;
    project.promo.teleprompter.preview_only = true;
    project.promo.teleprompter.script = template.script.replace(/\{([a-z_]+)\}/g, (_match, key) => templateValue(project, key));
    return true;
  }

  function addCaption(project, startFrame, endFrame, text, source = "manual") {
    const cleanText = String(text || "").trim();
    if (!cleanText) return null;
    const start = Math.max(0, Math.round(Number(startFrame || 0)));
    const end = Math.max(start + 1, Math.round(Number(endFrame || (start + fps(project) * 2))));
    const cue = {
      caption_id: uniqueId("promo_caption"),
      start_frame: start,
      end_frame: end,
      text: cleanText,
      original_text: cleanText,
      source: String(source || "manual"),
      needs_review: source !== "manual"
    };
    project.promo.captions.cues.push(cue);
    project.promo.captions.enabled = true;
    return cue;
  }

  function updateCaption(project, captionId, values = {}) {
    const cue = project.promo.captions.cues.find(row => row.caption_id === captionId);
    if (!cue) return false;
    if (Object.prototype.hasOwnProperty.call(values, "text")) {
      const cleanText = String(values.text || "").trim();
      if (!cleanText) return false;
      cue.text = cleanText;
      cue.needs_review = false;
    }
    if (Object.prototype.hasOwnProperty.call(values, "start_frame")) cue.start_frame = Math.max(0, Math.round(Number(values.start_frame || 0)));
    if (Object.prototype.hasOwnProperty.call(values, "end_frame")) cue.end_frame = Math.max(cue.start_frame + 1, Math.round(Number(values.end_frame || 0)));
    return true;
  }

  function removeCaption(project, captionId) {
    const before = project.promo.captions.cues.length;
    project.promo.captions.cues = project.promo.captions.cues.filter(row => row.caption_id !== captionId);
    return project.promo.captions.cues.length !== before;
  }

  function dictionaryEntries(value) {
    return String(value || "").split(/\r?\n/).map(line => {
      const separator = line.indexOf("=");
      if (separator <= 0) return null;
      const from = line.slice(0, separator).trim();
      const to = line.slice(separator + 1).trim();
      return from && to ? { from, to } : null;
    }).filter(Boolean);
  }

  function correctCaptionText(text, dictionaryText) {
    let result = String(text || "");
    for (const { from, to } of dictionaryEntries(dictionaryText)) {
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      result = result.replace(new RegExp(`(^|[^A-Za-z0-9_])(${escaped})(?=$|[^A-Za-z0-9_])`, "gi"), (_match, prefix) => `${prefix}${to}`);
    }
    return result;
  }

  function applyCaptionCorrections(project, dictionaryText) {
    project.promo.captions.dictionary_text = String(dictionaryText || "");
    let changed = 0;
    for (const cue of project.promo.captions.cues) {
      const corrected = correctCaptionText(cue.text, dictionaryText);
      if (corrected !== cue.text) {
        cue.text = corrected;
        changed += 1;
      }
    }
    return changed;
  }

  function activeCaption(project, frame) {
    const at = Math.max(0, Math.round(Number(frame || 0)));
    return project.promo.captions.cues.find(row => !row.excluded && at >= Number(row.start_frame || 0) && at < Number(row.end_frame || 0)) || null;
  }

  function evaluateFieldReadiness(details = {}) {
    const microphonePeakDb = Number.isFinite(Number(details.microphone_peak_db)) ? Number(details.microphone_peak_db) : -120;
    const checks = [
      { id: "secure", label: "Secure browser context", status: details.secure_context ? "pass" : "fail" },
      { id: "camera", label: "Camera input", status: details.camera_ready ? "pass" : "fail" },
      { id: "microphone", label: "Microphone input", status: details.microphone_ready ? "pass" : "fail" },
      { id: "microphone_signal", label: "Microphone signal", status: details.microphone_ready ? (microphonePeakDb > -55 ? "pass" : "warn") : "unknown" },
      { id: "recorder", label: "Direct browser recorder", status: details.recorder_ready ? "pass" : "warn" },
      { id: "storage", label: "Local storage", status: Number(details.storage_available_mb || 0) >= 250 ? "pass" : (Number(details.storage_available_mb || 0) > 0 ? "warn" : "unknown") }
    ];
    const failed = checks.filter(row => row.status === "fail");
    const warnings = checks.filter(row => row.status === "warn" || row.status === "unknown");
    const status = failed.length ? "blocked" : (warnings.length ? "warning" : "ready");
    return {
      status,
      checked_at: String(details.checked_at || new Date().toISOString()),
      camera_ready: Boolean(details.camera_ready),
      microphone_ready: Boolean(details.microphone_ready),
      microphone_signal_detected: microphonePeakDb > -55,
      microphone_peak_db: Math.max(-120, Math.min(0, microphonePeakDb)),
      recorder_ready: Boolean(details.recorder_ready),
      storage_available_mb: Math.max(0, Math.round(Number(details.storage_available_mb || 0))),
      summary: status === "ready" ? "Camera, microphone, recorder, and storage are ready." : status === "warning" ? "Recording works, but review the warnings before a long take." : "This device needs attention before direct browser recording.",
      checks
    };
  }

  function touchRevision(project, editorName = "") {
    const collaboration = project.collaboration || (project.collaboration = {});
    const previous = String(collaboration.revision_id || project.timeline?.revision_id || "");
    collaboration.parent_revision_id = previous;
    collaboration.base_revision_id = String(collaboration.base_revision_id || previous);
    collaboration.revision_id = uniqueId("promo_revision");
    collaboration.revision_number = Math.max(0, Number(collaboration.revision_number || 0)) + 1;
    collaboration.editor_name = String(editorName || collaboration.editor_name || "").trim();
    collaboration.updated_at = new Date().toISOString();
    collaboration.conflict_status = "local_only";
    collaboration.cloud_sync_status = "not_configured";
    project.timeline.revision_id = collaboration.revision_id;
    return collaboration;
  }

  function compareRevisions(currentProject, incomingProject) {
    if (String(currentProject?.project_id || "") !== String(incomingProject?.project_id || "")) return "different_project";
    const current = currentProject?.collaboration || {};
    const incoming = incomingProject?.collaboration || {};
    if (current.revision_id && current.revision_id === incoming.revision_id) return "same";
    if (current.revision_id && incoming.parent_revision_id === current.revision_id) return "fast_forward";
    if (incoming.revision_id && current.parent_revision_id === incoming.revision_id) return "stale";
    return "diverged";
  }

  function exportHandoff(project) {
    const payload = normalizeProject(project);
    payload.schema = RETURN_SCHEMA;
    payload.exported_at = new Date().toISOString();
    payload.source = {
      source_project_id: String(payload.package_metadata?.source_project_id || ""),
      source_timeline_id: String(payload.package_metadata?.source_timeline_id || ""),
      source_revision_id: String(payload.package_metadata?.source_revision_id || "")
    };
    payload.package_metadata = {
      ...(payload.package_metadata || {}),
      source_app: "PECO Promo Studio",
      project_kind: "wrestling_promo",
      original_media_preserved: true,
      import_policy: "create_new_timeline",
      advanced_voice_isolation_rendered: false,
      coach_note_count: payload.markers.length,
      take_count: payload.assets.length,
      sequence_clip_count: payload.clips.length
    };
    payload.package_metadata.last_editor = String(payload.collaboration?.editor_name || "");
    payload.package_metadata.revision_id = String(payload.collaboration?.revision_id || "");
    payload.package_metadata.parent_revision_id = String(payload.collaboration?.parent_revision_id || "");
    payload.package_metadata.revision_number = Number(payload.collaboration?.revision_number || 0);
    payload.package_metadata.cloud_sync_status = "not_configured";
    payload.timeline.metadata = {
      ...(payload.timeline.metadata || {}),
      project_kind: "wrestling_promo",
      promo_studio: clone(payload.promo)
    };
    return payload;
  }

  global.PecoPromoCore = Object.freeze({
    PROJECT_SCHEMA,
    RETURN_SCHEMA,
    PROMO_SCHEMA,
    DEFAULT_FPS,
    VOICE_PRESETS,
    PROMO_TYPES,
    PROMO_TEMPLATES,
    uniqueId,
    clone,
    createProject,
    normalizeProject,
    fps,
    durationFrames,
    sortedClips,
    asset,
    clip,
    addTake,
    renameTake,
    toggleFavorite,
    appendTake,
    compactSequence,
    syncClipCaptions,
    moveClip,
    trimClip,
    splitClip,
    rippleDelete,
    setVoicePreset,
    addNote,
    applyTemplate,
    addCaption,
    updateCaption,
    removeCaption,
    dictionaryEntries,
    correctCaptionText,
    applyCaptionCorrections,
    activeCaption,
    evaluateFieldReadiness,
    touchRevision,
    compareRevisions,
    exportHandoff
  });
})(window);
