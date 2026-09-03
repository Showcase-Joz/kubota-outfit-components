import {
  AnnouncementBanner,
  LeaseOfferBlock,
  OfferBlock,
  WarrantyBlock,
} from "../src";

const Example = ({ inputs }) => (
  <>
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
      /** {children} can be used to add additional content inside the block */
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
      connectorLinesText={inputs?.connectorLinesText}
      savingAmountPreText={inputs?.savingAmountPreText}
      savingAmount={inputs?.savingAmount}
      savingAmountPostText={inputs?.savingAmountPostText}
      maxSavingAmountPostText={{ square: 3, landscape: 2 }}
    />
  </>
);

export { Example };
