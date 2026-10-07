/**
 * Optional starting content for this preview template, in the same dummyData
 * shape production templates can supply. Component defaults live in Section179.
 *
 * Example per-layout override:
 * print: { section179Text: { value: "Section 179 Tax Deduction" } }
 *
 * @type {Record<import('kubota-outfit-components').Section179BlockPreset,
 *   import('kubota-outfit-components').Section179BlockFallbackContent
 *   & import('../components/PreviewButtonCTA').ButtonCTAFallbackContent>}
 */
export const section179Data = {
  "300x600": {
    aPR: { value: "1.99" },
  },
  "160x600": {},
  "300x250": {},
  "728x90": {},
  print: {},
  tractru: {},
  "web-banner": {},
};
