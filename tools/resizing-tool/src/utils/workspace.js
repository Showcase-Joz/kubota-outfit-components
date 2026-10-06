import {
  DEFAULT_WARRANTY_V2_PRESET,
  defaultWarrantyBlockV2FallbackContent,
  defaultComponentStarterFallbackContent,
} from "kubota-outfit-components";
import { createPreviewModel, offerPreview } from "./preview";
import { defaultButtonCTAFallbackContent } from "../components/PreviewButtonCTA";
import { data } from "../dummy/data";
import { warrantyData } from "../dummy/warrantyData";
import { componentStarterData } from "../dummy/componentStarterData";

export const COMPONENT_STORAGE_KEY = "component-workspace:selection";
export const DEFAULT_COMPONENT = "warranty";
export const WARRANTY_PREVIEW_STORAGE_KEY = "warranty-block-v2:inputs";
export const warrantyPreview = createPreviewModel({
  storageKey: WARRANTY_PREVIEW_STORAGE_KEY,
  defaultPreset: DEFAULT_WARRANTY_V2_PRESET,
  getDefaults: (preset) => ({
    ...defaultWarrantyBlockV2FallbackContent,
    ...defaultButtonCTAFallbackContent,
    ...warrantyData[preset],
  }),
});

export const componentStarterPreview = createPreviewModel({
  storageKey: "component-starter:inputs",
  defaultPreset: "print",
  getDefaults: (preset) => ({
    componentStarterPlaceholderText:
      componentStarterData[preset]?.placeholderText ??
      defaultComponentStarterFallbackContent.placeholderText,
  }),
});

export const previewComponents = {
  warranty: {
    label: "WarrantyBlock V2",
    model: warrantyPreview,
    data: warrantyData,
  },
  offer: { label: "OfferOptionBlock V2", model: offerPreview, data },
  componentStarter: {
    label: "ComponentStarter",
    model: componentStarterPreview,
    data: componentStarterData,
  },
};
export const resolveComponent = (value) =>
  Object.prototype.hasOwnProperty.call(previewComponents, value)
    ? value
    : DEFAULT_COMPONENT;

const warrantyFields = ["discountText", "warrantyText", "serviceType"];
export const isPreviewInputVisible = (tag, component, preset) => {
  if (component === "componentStarter") {
    return [
      "aspect_selection",
      "size_model",
      "componentStarterPlaceholderText",
    ].includes(tag);
  }
  return (
    tag !== "component_selection" &&
    tag !== "componentStarterPlaceholderText" &&
    (component === "warranty" || !warrantyFields.includes(tag)) &&
    (!["showCTA", "callToActionText"].includes(tag) || preset === "web-banner")
  );
};
