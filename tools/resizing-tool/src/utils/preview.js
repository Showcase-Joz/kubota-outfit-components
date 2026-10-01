import dimensions from "./dimension.json";
import {
  DEFAULT_OFFER_OPTION_V2_PRESET,
  defaultOfferOptionBlockV2FallbackContent,
} from "kubota-outfit-components";
import { defaultButtonCTAFallbackContent } from "../components/PreviewButtonCTA";
import { data } from "../dummy/data";

export const DEFAULT_PRESET = DEFAULT_OFFER_OPTION_V2_PRESET;
export const PREVIEW_STORAGE_KEY = "offer-option-v2:inputs";

// Aspect scales the exact component uniformly, including text and spacing.
export const getStageSize = (preset, mode) =>
  mode === "exact"
    ? { width: preset.width, height: preset.height }
    : { width: "100%", aspectRatio: `${preset.width} / ${preset.height}` };
export const getPreviewScale = (preset, mode, renderedWidth) =>
  mode === "aspect" && renderedWidth > 0 ? renderedWidth / preset.width : 1;

export const readSaved = (key, fallback) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

/** Shared persistence mechanics; each component owns its defaults and storage key. */
export const createPreviewModel = ({
  storageKey,
  defaultPreset,
  getDefaults,
}) => {
  const resolvePreset = (value) =>
    Object.prototype.hasOwnProperty.call(dimensions, value)
      ? value
      : defaultPreset;
  const getDefaultPreviewInputs = (preset = defaultPreset) => {
    const activePreset = resolvePreset(preset);
    const { backgroundColor, buttonText, ...content } =
      getDefaults(activePreset);
    return {
      ...content,
      aspect_selection: { value: activePreset },
      size_model: { value: "aspect" },
      offerTheming: backgroundColor,
      showCTA: { value: "show" },
      callToActionText: buttonText,
    };
  };
  const contentKeys = Object.keys(getDefaultPreviewInputs()).filter(
    (key) => !["aspect_selection", "size_model"].includes(key)
  );
  const normalize = (key, value) =>
    key === "aprPaymentMonthsConnectorText" && value === "upTo"
      ? "up to"
      : value;
  const sanitizePreviewInputs = (inputs) => {
    const preset = resolvePreset(inputs?.aspect_selection?.value);
    const defaults = getDefaultPreviewInputs(preset);
    const fields = Object.fromEntries(
      Object.keys(defaults).map((key) => [
        key,
        {
          value: normalize(key, inputs?.[key]?.value ?? defaults[key].value),
        },
      ])
    );
    fields.aspect_selection.value = preset;
    fields.size_model.value =
      fields.size_model.value === "exact" ? "exact" : "aspect";
    return fields;
  };
  const sanitizeOverrides = (inputs) =>
    Object.fromEntries(
      contentKeys
        .filter((key) => inputs?.[key]?.value != null)
        .map((key) => [key, { value: normalize(key, inputs[key].value) }])
    );
  const readPreviewState = () => {
    const saved = readSaved(storageKey, {});
    if (saved.version === 2)
      return {
        version: 2,
        preset: resolvePreset(saved.preset),
        sizeModel: saved.sizeModel === "exact" ? "exact" : "aspect",
        layouts: Object.fromEntries(
          Object.keys(dimensions)
            .filter((preset) => saved.layouts?.[preset])
            .map((preset) => [preset, sanitizeOverrides(saved.layouts[preset])])
        ),
      };
    // Preserve legacy flat offer previews under their original selected layout.
    const preset = resolvePreset(saved.aspect_selection?.value);
    return {
      version: 2,
      preset,
      sizeModel: saved.size_model?.value === "exact" ? "exact" : "aspect",
      layouts: { [preset]: sanitizeOverrides(saved) },
    };
  };
  const getPreviewInputs = (state) =>
    sanitizePreviewInputs({
      ...state.layouts[state.preset],
      aspect_selection: { value: state.preset },
      size_model: { value: state.sizeModel },
    });
  const setPreviewInput = (state, tag, value) => {
    if (tag === "aspect_selection")
      return { ...state, preset: resolvePreset(value) };
    if (tag === "size_model")
      return { ...state, sizeModel: value === "exact" ? "exact" : "aspect" };
    if (!contentKeys.includes(tag)) return state;
    return {
      ...state,
      layouts: {
        ...state.layouts,
        [state.preset]: {
          ...state.layouts[state.preset],
          [tag]: { value },
        },
      },
    };
  };
  const resetPreviewLayout = (state) => ({
    ...state,
    layouts: { ...state.layouts, [state.preset]: {} },
  });
  return {
    storageKey,
    defaultPreset,
    resolvePreset,
    getDefaultPreviewInputs,
    sanitizePreviewInputs,
    readPreviewState,
    getPreviewInputs,
    readPreviewInputs: () => getPreviewInputs(readPreviewState()),
    setPreviewInput,
    resetPreviewLayout,
  };
};

export const offerPreview = createPreviewModel({
  storageKey: PREVIEW_STORAGE_KEY,
  defaultPreset: DEFAULT_PRESET,
  getDefaults: (preset) => ({
    ...defaultOfferOptionBlockV2FallbackContent,
    ...defaultButtonCTAFallbackContent,
    ...data[preset],
  }),
});

// Keep the existing offer preview API and saved values intact.
export const {
  resolvePreset,
  getDefaultPreviewInputs,
  sanitizePreviewInputs,
  readPreviewState,
  getPreviewInputs,
  readPreviewInputs,
  setPreviewInput,
  resetPreviewLayout,
} = offerPreview;
export const defaultPreviewInputs = getDefaultPreviewInputs();
