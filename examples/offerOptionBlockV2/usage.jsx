import { OfferOptionBlockV2 } from "kubota-outfit-components";
import { data } from "./data.js";

/**
 * Preserve omitted inputs for initial defaults; map explicit null field values to
 * empty strings so cleared savings inputs cannot revive the example content.
 * @param {import('kubota-outfit-components').OfferOptionBlockV2Field | undefined} input
 */
const clearedSavingsInput = (input) =>
  input === undefined ? undefined : { ...input, value: input.value ?? "" };

/**
 * Wire into a template container sized for the selected preset.
 * Input tags match inputs.json; adapt names where a template uses suffixes.
 * @param {{
 *   preset?: import('kubota-outfit-components').OfferOptionBlockV2Preset,
 *   inputs?: Partial<Record<string, import('kubota-outfit-components').OfferOptionBlockV2Field>>,
 * }} props
 */
export const OfferOptionExample = ({ preset = "print", inputs = {} }) => (
  <OfferOptionBlockV2
    preset={preset}
    dummyData={data[preset]}
    backgroundColor={inputs.offerTheming}
    aPR={inputs.aPR}
    aprPaymentMonthsConnectorText={inputs.aprPaymentMonthsConnectorText}
    paymentMonths={inputs.paymentMonths}
    downPayment={inputs.downPayment}
    connectorLinesText={inputs.connectorLinesText}
    savingAmountPreText={clearedSavingsInput(inputs.savingAmountPreText)}
    savingAmount={clearedSavingsInput(inputs.savingAmount)}
    savingAmountPostText={inputs.savingAmountPostText}
  />
);

/** @param {{ inputs?: Partial<Record<string, import('kubota-outfit-components').OfferOptionBlockV2Field>> }} props */
export const OfferPrintExample = ({ inputs }) => (
  <div style={{ width: 598, height: 181 }}>
    <OfferOptionExample preset="print" inputs={inputs} />
  </div>
);
