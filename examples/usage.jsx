import { AnnouncementBanner, WarrantyBlock } from "../src";

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
  </>
);

export { Example };
