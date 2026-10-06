// V2 examples include their field mapping and optional per-layout starting data.
export { ComponentStarterExample } from "./componentStarter/usage.jsx";
export {
  WarrantyExample,
  Digital300x600Example,
} from "./warrantyBlockV2/usage.jsx";
export {
  OfferOptionExample,
  OfferPrintExample,
} from "./offerOptionBlockV2/usage.jsx";

// Direct input-wiring examples for both V2 and original components follow.
import {
  AnnouncementBanner,
  ComponentStarter,
  HeadlineBlock,
  ImageBlock,
  OfferOptionBlock,
  OfferOptionBlockV2,
  TextBlock,
  LeaseOfferBlock,
  OfferBlock,
  WarrantyBlock,
  WarrantyBlockV2,
} from "kubota-outfit-components";
import { data as warrantyData } from "./warrantyBlockV2/data.js";
import { data as offerData } from "./offerOptionBlockV2/data.js";

// Each input is an Outfit field, e.g. { value: "3000", ids: { ... } }.
// Keep complete field objects for inline editing. Use { value: "" } to clear.
const Example = ({ inputs }) => (
  <>
    {/* Copy and rename this scaffold to begin a new component. */}
    <div style={{ width: 598, height: 181 }}>
      <ComponentStarter
        preset="print"
        placeholderText={inputs?.componentStarterPlaceholderText}
      />
    </div>

    {/* Warranty V2: 300x600 advert, 300x164 component box; 1rem = 16px. */}
    <div style={{ width: 300, height: 164 }}>
      <WarrantyBlockV2
        preset="300x600"
        dummyData={warrantyData["300x600"]}
        backgroundColor={inputs?.offerTheming}
        aPR={inputs?.aPR}
        aprPaymentMonthsConnectorText={inputs?.aprPaymentMonthsConnectorText}
        paymentMonths={inputs?.paymentMonths}
        downPayment={inputs?.downPayment}
        savingAmountPreText={inputs?.savingAmountPreText}
        savingAmount={inputs?.savingAmount}
        discountText={inputs?.discountText}
        savingAmountPostText={inputs?.savingAmountPostText}
        connectorLinesText={inputs?.connectorLinesText}
        warrantyText={inputs?.warrantyText}
        serviceType={inputs?.serviceType}
      />
    </div>

    {/* Offer V2: clear both savings fields to use the no-savings layout. */}
    <div style={{ width: 598, height: 181 }}>
      <OfferOptionBlockV2
        preset="print"
        dummyData={offerData.print}
        backgroundColor={inputs?.offerTheming}
        aPR={inputs?.aPR}
        aprPaymentMonthsConnectorText={inputs?.aprPaymentMonthsConnectorText}
        paymentMonths={inputs?.paymentMonths}
        downPayment={inputs?.downPayment}
        connectorLinesText={inputs?.connectorLinesText}
        savingAmountPreText={inputs?.savingAmountPreText}
        savingAmount={inputs?.savingAmount}
        savingAmountPostText={inputs?.savingAmountPostText}
      />
    </div>

    <AnnouncementBanner
      announcementMessage={inputs?.announcementMessage}
      fallbackContent={{
        announcementMessage: { value: "this is an announcement" },
      }}
    />

    <WarrantyBlock
      aPR={inputs?.aPR}
      incentiveConnectorText={inputs?.incentiveConnectorText}
      incentivePreText={inputs?.incentivePreText}
      incentiveText={inputs?.incentiveText}
      connectorLinesText={inputs?.connectorLinesText}
      warrantyText={inputs?.warrantyText}
      warrantyConnectorText={inputs?.warrantyConnectorText}
    />

    <OfferBlock
      incentiveAmount={inputs?.incentiveAmount}
      downPayment={inputs?.downPayment}
      aPR={inputs?.aPR}
      paymentMonths={inputs?.paymentMonths}
    />

    <LeaseOfferBlock
      paymentPreText={inputs?.paymentPreText}
      paymentAmount={inputs?.paymentAmount}
      hoursOfUse={inputs?.hoursOfUse}
      aPR={inputs?.aPR}
      paymentMonths={inputs?.paymentMonths}
      downPayment={inputs?.downPayment}
      // Optional children can add content inside the block.
    />

    <ImageBlock
      sourceImage={inputs?.featuredImage}
      imageType="Lifestyle"
      altTag="Lifestyle image"
      imagePosition="center"
      dynamicSourceImageClassName="lifestyle-image"
    />

    <HeadlineBlock
      headlineText={inputs?.headlineText}
      dynamicClassName="headline-block"
      maxWidthInParent={"70cqi"}
      maxLines={4}
      headlinePlacement={inputs?.headlinePlacement}
      textWrapStyle="balanced"
      hideTextOption={false}
    />

    <TextBlock
      headingText={inputs?.headingText}
      headingTextWrapStyle="pretty"
      headingMaxHeight={200}
      headingMaxWidthInParent="100%"
      copyText={inputs?.copyText}
      copyTextWrapStyle="balance"
      textPlacement={inputs?.copyTextPlacement}
      baseFontSize={"2em"}
      hideHeadingTextOption={false} // Set to true to hide the text after initial view
      hideCopyTextOption={false} // Set to true to hide the text after initial view
      maxLines={10}
      maxChars={undefined}
      maxWidthInParent="70%"
      dynamicClassName="text-area"
    />

    <OfferOptionBlock
      backgroundColor={inputs?.offerTheming}
      aPR={inputs?.aPR}
      aprPaymentMonthsConnectorText={inputs?.aprPaymentMonthsConnectorText}
      paymentMonths={inputs?.paymentMonths}
      downPayment={inputs?.downPayment}
      connectorLinesText={inputs?.connectorLinesText}
      savingAmountPreText={inputs?.savingAmountPreText}
      maxSavingAmountPreText={inputs?.maxSavingAmountPreText}
      savingAmount={inputs?.savingAmount}
      savingAmountPostText={inputs?.savingAmountPostText}
      maxSavingAmountPostText={{ square: 3, landscape: 2, min: 50, max: 100 }} // optional min font size (percentage) for textfit
    />
  </>
);

export { Example };
