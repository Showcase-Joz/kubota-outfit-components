/**
 * Optional starting content for this preview template, in the same dummyData
 * shape production templates can supply. Component defaults live in WarrantyBlockV2.
 *
 * Example cash-discount starting values for a layout:
 * { savingAmount: { value: "" }, serviceType: { value: "orange-protection" } }
 * Example one-year maintenance override: { warrantyText: { value: "1-Year" } }
 *
 * @type {Record<import('kubota-outfit-components').WarrantyBlockV2Preset,
 *   import('kubota-outfit-components').WarrantyBlockV2FallbackContent
 *   & import('../components/PreviewButtonCTA').ButtonCTAFallbackContent>}
 */
export const warrantyData = {
  "300x600": {},
  "160x600": {},
  "300x250": {},
  "728x90": {},
  print: {},
  tractru: {},
  "web-banner": {},
};
