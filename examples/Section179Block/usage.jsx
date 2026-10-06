import { Section179Block } from "kubota-outfit-components";
import { data } from "./data.js";

// Use a container sized for your component, not necessarily the whole advert.
// These are the existing print preset dimensions, not new Figma measurements.
export const Section179BlockExample = ({ preset = "print", inputs = {} }) => (
  <div style={{ width: 598, height: 181 }}>
    <Section179Block
      preset={preset}
      backgroundColor={inputs.offerTheming}
      aPR={inputs.aPR}
      paymentMonths={inputs.paymentMonths}
      downPayment={inputs.downPayment}
      aprPaymentMonthsConnectorText={inputs.aprPaymentMonthsConnectorText}
      connectorLinesText={inputs.connectorLinesText}
      savingAmountPreText={inputs.savingAmountPreText}
      savingAmount={inputs.savingAmount}
      savingAmountPostText={inputs.savingAmountPostText}
      section179connectorLinesText={inputs.section179connectorLinesText}
      section179Text={inputs.section179Text}
      section179PostText={inputs.section179PostText}
      fallbackContent={data}
    />
  </div>
);
