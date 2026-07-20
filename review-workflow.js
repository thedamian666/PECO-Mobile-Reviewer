(function (global, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  global.PecoReviewWorkflow = Object.freeze(api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ROUNDTRIP_SCHEMA = "peco.mobile_review_roundtrip.v1";
  const RETURN_SCHEMA = "peco.mobile_review_return.v1";
  const PALETTE_SCHEMA = "peco.mobile_note_palette.v1";
  const COLLABORATION_SCHEMA = "peco.mobile_review_collaboration.v1";
  const SUMMARY_SCHEMA = "peco.mobile_review_summary.v1";
  const WORKFLOW_PROFILES = Object.freeze([
    Object.freeze({
      id: "general",
      label: "General Review",
      description: "Flexible edit notes, keep/cut decisions, audio, graphics, and clips.",
      defaultPaletteIds: Object.freeze(["tighten", "audio", "keep"])
    }),
    Object.freeze({
      id: "wrestling",
      label: "Pro Wrestling",
      description: "Camera coverage, missed action, crowd reactions, replays, entrances, and finishes.",
      defaultPaletteIds: Object.freeze(["bad_floater", "hardcam_safer", "missed_action", "crowd_reaction", "replay"])
    }),
    Object.freeze({
      id: "lets_play",
      label: "Let's Play",
      description: "Funny moments, dead air, censor points, sync problems, chapters, and thumbnails.",
      defaultPaletteIds: Object.freeze(["funny_moment", "dead_air", "censor", "desync", "short"])
    })
  ]);

  function stableValue(value) {
    if (Array.isArray(value)) {
      return value.map(stableValue);
    }
    if (value && typeof value === "object") {
      return Object.keys(value)
        .sort()
        .reduce((result, key) => {
          if (value[key] !== undefined) {
            result[key] = stableValue(value[key]);
          }
          return result;
        }, {});
    }
    if (typeof value === "number" && !Number.isFinite(value)) {
      return null;
    }
    return value;
  }

  function reviewFingerprint(value) {
    const text = JSON.stringify(stableValue(value ?? null));
    let hash = 0x811c9dc5;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return `fnv1a32:${hash.toString(16).padStart(8, "0")}`;
  }

  function safeParse(value) {
    if (!value) {
      return null;
    }
    if (typeof value === "object") {
      return value;
    }
    try {
      const parsed = JSON.parse(String(value));
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  function inboxStatus(projectStateValue, returnRecordValue) {
    const projectState = safeParse(projectStateValue);
    const returnRecord = safeParse(returnRecordValue);
    if (returnRecordValue && !returnRecord) {
      return { id: "sent", label: "Sent back", cssClass: "sent" };
    }
    if (
      returnRecord
      && (!projectState || (
        projectState.review_fingerprint
        && projectState.review_fingerprint === returnRecord.review_fingerprint
      ))
    ) {
      return { id: "sent", label: "Sent back", cssClass: "sent" };
    }
    if (Number(projectState?.review_change_count || 0) > 0) {
      return { id: "ready", label: "Ready to send", cssClass: "ready" };
    }
    if (projectState) {
      return { id: "in_review", label: "In review", cssClass: "active" };
    }
    return { id: "new", label: "New", cssClass: "new" };
  }

  function normalizedPaletteIds(value, availableIds, fallbackIds = []) {
    const available = new Set((availableIds || []).map(item => String(item || "").trim()).filter(Boolean));
    const requested = Array.isArray(value)
      ? value.map(item => typeof item === "object" ? item.id : item)
      : [];
    const normalized = [...new Set(requested.map(item => String(item || "").trim().toLowerCase()))]
      .filter(item => available.has(item));
    if (normalized.length) {
      return normalized;
    }
    return [...new Set((fallbackIds || []).map(item => String(item || "").trim().toLowerCase()))]
      .filter(item => available.has(item));
  }

  function workflowProfiles() {
    return WORKFLOW_PROFILES.map(profile => ({
      ...profile,
      defaultPaletteIds: [...profile.defaultPaletteIds]
    }));
  }

  function normalizeWorkflowId(value, context = "") {
    const requested = String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
    if (/wrestl|hardcam|floater|sports[_ -]?entertainment/.test(requested)) {
      return "wrestling";
    }
    if (/let'?s?[_ -]?play|letsplay|gameplay|gaming/.test(requested)) {
      return "lets_play";
    }
    if (WORKFLOW_PROFILES.some(profile => profile.id === requested)) {
      return requested;
    }
    const contextText = String(context || "").trim().toLowerCase();
    if (/wrestl|hardcam|floater|multicam|sports[_ -]?entertainment/.test(contextText)) {
      return "wrestling";
    }
    if (/let'?s?[_ -]?play|letsplay|gameplay|gaming/.test(contextText)) {
      return "lets_play";
    }
    return "general";
  }

  function workflowProfile(value, context = "") {
    const id = normalizeWorkflowId(value, context);
    const profile = WORKFLOW_PROFILES.find(item => item.id === id) || WORKFLOW_PROFILES[0];
    return { ...profile, defaultPaletteIds: [...profile.defaultPaletteIds] };
  }

  function trimmedText(value, maximumLength) {
    return String(value || "").trim().slice(0, maximumLength);
  }

  function normalizeCollaboration(value, context = {}) {
    const source = value && typeof value === "object" ? value : {};
    const contextText = [
      context.workflow,
      context.projectName,
      context.sourceName
    ].filter(Boolean).join(" ");
    const workflowId = normalizeWorkflowId(
      source.workflow_id || source.workflow || context.workflowId,
      contextText
    );
    return {
      schema: COLLABORATION_SCHEMA,
      workflow_id: workflowId,
      assigned_to: trimmedText(source.assigned_to || source.assignee || context.assignedTo, 120),
      requested_by: trimmedText(source.requested_by || context.requestedBy, 120),
      instructions: trimmedText(source.instructions || source.review_instructions || context.instructions, 2000)
    };
  }

  function reviewSummary(options = {}) {
    const collaboration = normalizeCollaboration(options.collaboration, options.context || {});
    const profile = workflowProfile(collaboration.workflow_id);
    const markers = Array.isArray(options.markers) ? options.markers : [];
    const decisions = Array.isArray(options.decisions) ? options.decisions : [];
    const clips = Array.isArray(options.clips) ? options.clips : [];
    const categoryCounts = {};
    for (const marker of markers) {
      const category = trimmedText(marker?.category || "note", 80).toLowerCase() || "note";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
    return {
      schema: SUMMARY_SCHEMA,
      workflow_id: profile.id,
      workflow_label: profile.label,
      reviewer_name: trimmedText(options.reviewerName, 120),
      assigned_to: collaboration.assigned_to,
      requested_by: collaboration.requested_by,
      instructions: collaboration.instructions,
      camera_change_count: decisions.length,
      marker_count: markers.length,
      clip_count: clips.length,
      category_counts: stableValue(categoryCounts)
    };
  }

  function buildReturnMetadata(options = {}) {
    const snapshot = stableValue(options.snapshot ?? {});
    const fingerprint = reviewFingerprint(snapshot);
    const previous = options.lastExport && typeof options.lastExport === "object" ? options.lastExport : null;
    if (previous?.review_fingerprint === fingerprint && previous?.return_id) {
      return {
        schema: RETURN_SCHEMA,
        return_id: String(previous.return_id),
        base_return_id: String(previous.base_return_id || ""),
        review_session_id: String(previous.review_session_id || options.reviewSessionId || ""),
        package_revision_id: String(previous.package_revision_id || options.packageRevisionId || ""),
        review_fingerprint: fingerprint,
        reviewer_name: String(options.reviewerName || previous.reviewer_name || ""),
        exported_at: String(previous.exported_at || options.now || new Date().toISOString())
      };
    }
    const now = String(options.now || new Date().toISOString());
    const idFactory = typeof options.idFactory === "function"
      ? options.idFactory
      : () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      schema: RETURN_SCHEMA,
      return_id: `return_${idFactory()}`,
      base_return_id: String(options.baseReturnId || ""),
      review_session_id: String(options.reviewSessionId || ""),
      package_revision_id: String(options.packageRevisionId || ""),
      review_fingerprint: fingerprint,
      reviewer_name: String(options.reviewerName || ""),
      exported_at: now
    };
  }

  return {
    ROUNDTRIP_SCHEMA,
    RETURN_SCHEMA,
    PALETTE_SCHEMA,
    COLLABORATION_SCHEMA,
    SUMMARY_SCHEMA,
    stableValue,
    reviewFingerprint,
    inboxStatus,
    normalizedPaletteIds,
    workflowProfiles,
    normalizeWorkflowId,
    workflowProfile,
    normalizeCollaboration,
    reviewSummary,
    buildReturnMetadata
  };
});
