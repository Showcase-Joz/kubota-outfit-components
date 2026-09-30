import dimensions from "./dimension.json";
import {
  DEFAULT_OFFER_OPTION_V2_PRESET,
  defaultOfferOptionBlockV2FallbackContent,
} from "kubota-outfit-components";
import { defaultButtonCTAFallbackContent } from "../components/PreviewButtonCTA";
import { data } from "../dummy/data";

export const DEFAULT_PRESET = DEFAULT_OFFER_OPTION_V2_PRESET;
export const PREVIEW_STORAGE_KEY = "offer-option-v2:inputs";

export const resolvePreset = (value) =>
  Object.prototype.hasOwnProperty.call(dimensions, value)
    ? value
    : DEFAULT_PRESET;

/** Mirror component defaults plus the template's optional dummyData in the UI. */
export const getDefaultPreviewInputs = (preset = DEFAULT_PRESET) => {
  const activePreset = resolvePreset(preset);
  const { backgroundColor, buttonText, ...offerContent } = {
    ...defaultOfferOptionBlockV2FallbackContent,
    ...defaultButtonCTAFallbackContent,
    ...data[activePreset],
  };
  return {
    ...offerContent,
    aspect_selection: { value: activePreset },
    size_model: { value: "aspect" },
    offerTheming: backgroundColor,
    showCTA: { value: "show" },
    callToActionText: buttonText,
  };
};

export const defaultPreviewInputs = getDefaultPreviewInputs();

// Aspect scales the exact component uniformly; the surrounding stage reserves its visual size.
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

export const sanitizePreviewInputs = (inputs) => {
  const preset = resolvePreset(inputs?.aspect_selection?.value);
  const defaults = getDefaultPreviewInputs(preset);
  const fields = Object.fromEntries(
    Object.keys(defaults).map((key) => [
      key,
      { value: inputs?.[key]?.value ?? defaults[key].value },
    ])
  );
  fields.aspect_selection.value = preset;
  fields.size_model.value =
    fields.size_model.value === "exact" ? "exact" : "aspect";
  // Migrate older saved previews; the input now stores display text directly.
  if (fields.aprPaymentMonthsConnectorText.value === "upTo") {
    fields.aprPaymentMonthsConnectorText.value = "up to";
  }
  return fields;
};

// Store only edited fields per layout, so untouched inputs continue to follow
// data.js after a reload. Blank strings and zero are deliberate edits, too.
const contentKeys = Object.keys(defaultPreviewInputs).filter(
  (key) => !["aspect_selection", "size_model"].includes(key)
);

const sanitizeOverrides = (inputs) =>
  Object.fromEntries(
    contentKeys
      .filter((key) => inputs?.[key]?.value != null)
      .map((key) => [
        key,
        {
          value:
            key === "aprPaymentMonthsConnectorText" &&
            inputs[key].value === "upTo"
              ? "up to"
              : inputs[key].value,
        },
      ])
  );

export const readPreviewState = () => {
  const saved = readSaved(PREVIEW_STORAGE_KEY, {});
  if (saved.version === 2) {
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
  }
  // Preserve the previous flat saved form under its selected layout. Its values
  // may be user edits, so do not silently replace them with the new baselines.
  const preset = resolvePreset(saved.aspect_selection?.value);
  return {
    version: 2,
    preset,
    sizeModel: saved.size_model?.value === "exact" ? "exact" : "aspect",
    layouts: { [preset]: sanitizeOverrides(saved) },
  };
};

export const getPreviewInputs = (state) =>
  sanitizePreviewInputs({
    ...state.layouts[state.preset],
    aspect_selection: { value: state.preset },
    size_model: { value: state.sizeModel },
  });

export const readPreviewInputs = () => getPreviewInputs(readPreviewState());

export const setPreviewInput = (state, tag, value) => {
  if (tag === "aspect_selection") {
    return { ...state, preset: resolvePreset(value) };
  }
  if (tag === "size_model") {
    return { ...state, sizeModel: value === "exact" ? "exact" : "aspect" };
  }
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

/** Clear only the current layout's edits; other layouts and sizing mode remain. */
export const resetPreviewLayout = (state) => ({
  ...state,
  layouts: { ...state.layouts, [state.preset]: {} },
});
