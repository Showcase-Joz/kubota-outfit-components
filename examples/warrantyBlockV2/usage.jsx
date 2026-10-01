import { WarrantyBlockV2 } from "kubota-outfit-components";
import { data } from "./data.js";

/**
 * Copy this wiring into your template's existing content container.
 * `preset` is the advert layout key, e.g. "300x600", not its component rectangle.
 * Input tags match inputs.json; rename the mapping if your template uses suffixes.
 * @param {{
 *   preset?: import('kubota-outfit-components').WarrantyBlockV2Preset,
 *   inputs?: Partial<Record<string, import('kubota-outfit-components').WarrantyBlockV2Field>>,
 * }} props
 */
export const WarrantyExample = ({ preset = "300x600", inputs = {} }) => (
  <WarrantyBlockV2
    preset={preset}
    dummyData={data[preset]}
    backgroundColor={inputs.offerTheming}
    aPR={inputs.aPR}
    aprPaymentMonthsConnectorText={inputs.aprPaymentMonthsConnectorText}
    paymentMonths={inputs.paymentMonths}
    downPayment={inputs.downPayment}
    savingAmountPreText={inputs.savingAmountPreText}
    savingAmount={inputs.savingAmount}
    discountText={inputs.discountText}
    savingAmountPostText={inputs.savingAmountPostText}
    connectorLinesText={inputs.connectorLinesText}
    warrantyText={inputs.warrantyText}
    serviceType={inputs.serviceType}
  />
);

// A 300x600 advert reserves a 300x164 component box. Styles use 1rem = 16px.
// Other presets need their own box dimensions from docs/warranty-block-v2.md.
/** @param {{ inputs?: Partial<Record<string, import('kubota-outfit-components').WarrantyBlockV2Field>> }} props */
export const Digital300x600Example = ({ inputs }) => (
  <div style={{ width: 300, height: 164 }}>
    <WarrantyExample preset="300x600" inputs={inputs} />
  </div>
);
