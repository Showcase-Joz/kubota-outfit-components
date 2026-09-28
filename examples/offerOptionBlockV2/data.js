/**
 * Optional template starting content, supplied explicitly through `dummyData`.
 * The component keeps its own defaults and does not import this file.
 * The testing environment follows the same pattern as production templates.
 *
 * Each layout entry is a plain dummyData prop object. Keep the Outfit input shape:
 * { value: "..." }. An explicit empty string hides a field, while an omitted field
 * inherits the component's default. Templates choose which entry to pass.
 * Text-fit/line limits remain in the exported offerOptionBlockV2TextSettings object.
 *
 * @typedef {import('kubota-outfit-components').OfferOptionBlockV2FallbackContent
 *   & import('kubota-outfit-components').ButtonCTAFallbackContent} BaselineContent
 * @example
 * <OfferOptionBlockV2 preset="160x600" dummyData={data["160x600"]} />
 */

/** @type {Record<import('kubota-outfit-components').OfferOptionBlockV2Preset, BaselineContent>} */
export const data = {
  print: {},
  tractru: {},
  "web-banner": {},
  "300x600": {
    aPR: { value: "1.99" },
  },
  "160x600": {
    aPR: { value: "available" },
  },
  "300x250": {},
  "728x90": {},
};
