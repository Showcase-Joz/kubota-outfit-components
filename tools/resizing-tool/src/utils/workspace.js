import {
  DEFAULT_WARRANTY_V2_PRESET,
  defaultWarrantyBlockV2FallbackContent,
} from "kubota-outfit-components";
import { createPreviewModel, offerPreview } from "./preview";
import { defaultButtonCTAFallbackContent } from "../components/PreviewButtonCTA";
import { data } from "../dummy/data";
import { warrantyData } from "../dummy/warrantyData";

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

export const previewComponents = {
  warranty: {
    label: "WarrantyBlock V2",
    model: warrantyPreview,
    data: warrantyData,
  },
  offer: { label: "OfferOptionBlock V2", model: offerPreview, data },
};
export const resolveComponent = (value) =>
  Object.prototype.hasOwnProperty.call(previewComponents, value)
    ? value
    : DEFAULT_COMPONENT;

const warrantyFields = ["discountText", "warrantyText", "serviceType"];
export const isPreviewInputVisible = (tag, component, preset) =>
  tag !== "component_selection" &&
  (component === "warranty" || !warrantyFields.includes(tag)) &&
  (!["showCTA", "callToActionText"].includes(tag) || preset === "web-banner");
