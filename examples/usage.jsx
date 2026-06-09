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

    <BackgroundImageBlock
      backgroundImage={inputs?.backgroundImage}
      /** {children} can be used to add additional content inside the block, like the AnnouncementBanner and HeadlineBlock */
    />
  </>
);

export { Example };
