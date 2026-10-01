/**
 * Optional template starting values. The component keeps its own defaults;
 * importing this file does not change them until an entry is passed as dummyData.
 * Explicit input objects, including { value: "" }, take precedence.
 */

/** @type {Record<string, import('kubota-outfit-components').WarrantyBlockV2FallbackContent>} */
export const scenarios = {
  twoYearMaintenance: {
    aPR: { value: "available" },
    paymentMonths: { value: "notApplicable" },
    downPayment: { value: "" },
    savingAmountPreText: { value: "or save up to" },
    savingAmount: { value: "3000" },
    savingAmountPostText: { value: "on select Kubota L02 Series equipment" },
    connectorLinesText: { value: "plus" },
    warrantyText: { value: "2-Year" },
    serviceType: { value: "k-maintenance" },
  },
  oneYearMaintenance: {
    warrantyText: { value: "1-Year" },
    serviceType: { value: "k-maintenance" },
  },
  twoYearCashDiscount: {
    savingAmount: { value: "" },
    discountText: { value: "or instant cash discount" },
    warrantyText: { value: "2-Year" },
    serviceType: { value: "orange-protection" },
  },
};

/**
 * Illustrative layout baselines; choose the starting scenario for your template.
 * Empty entries retain component defaults. Print/Tractru/web-banner styling is pending.
 * @type {Record<import('kubota-outfit-components').WarrantyBlockV2Preset,
 *   import('kubota-outfit-components').WarrantyBlockV2FallbackContent>}
 * @example <WarrantyBlockV2 preset="160x600" dummyData={data["160x600"]} />
 */
export const data = {
  "300x600": { ...scenarios.twoYearMaintenance },
  "160x600": {},
  "300x250": { ...scenarios.oneYearMaintenance },
  "728x90": { ...scenarios.twoYearCashDiscount },
  print: {},
  tractru: {},
  "web-banner": {},
};
