import { WarrantyBlock } from "../src";

const Example = ({ inputs }) => (
  <WarrantyBlock
    aPR={inputs?.aPR}
    incentiveConnectorText={inputs?.incentiveConnectorText}
    incentivePreText={inputs?.incentivePreText}
    incentiveText={inputs?.incentiveText}
    connectorLinesText={inputs?.connectorLinesText}
    warrantyText={inputs?.warrantyText}
    warrantyConnectorText={inputs?.warrantyConnectorText}
  />
);

export { Example };
