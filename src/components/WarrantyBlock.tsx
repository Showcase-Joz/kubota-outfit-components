/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import {
  checkInputExists,
  cloneInlineClick,
  onceADummyText,
} from "../utils/helpers.js";
import { TextElement } from "./TextElement.js";

export type WarrantyBlockField = {
  value: string;
};

/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type WarrantyBlockFallbackContent = {
  aPR?: WarrantyBlockField;
  incentiveConnectorText?: WarrantyBlockField;
  incentivePreText?: WarrantyBlockField;
  incentiveText?: WarrantyBlockField;
  connectorLinesText?: WarrantyBlockField;
  warrantyText?: WarrantyBlockField;
  warrantyConnectorText?: WarrantyBlockField;
};

const defaultWarrantyFallbackContent: WarrantyBlockFallbackContent = {
  aPR: {
    value: "available",
  },
  incentiveConnectorText: {
    value: "or",
  },
  incentivePreText: {
    value: "instant",
  },
  incentiveText: {
    value: "cash discount",
  },
  connectorLinesText: {
    value: "plus",
  },
  warrantyText: {
    value: "4,000 Hours up to 4 Years",
  },
  warrantyConnectorText: {
    value: "2 year standard warranty + 2 year extended warranty",
  },
};

export interface WarrantyBlockProps {
  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   aPR: { value: "available" },
   *   incentiveConnectorText: { value: "or" }
   * }
   */
  fallbackContent?: WarrantyBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: WarrantyBlockFallbackContent;
  /**
   * APR percentage value. Keep to 5 characters or fewer.
   * Use "available" to render the fallback 0% APR treatment.
   */
  aPR?: WarrantyBlockField;
  /**
   * Short connector between APR and incentive copy.
   * Recommended max: 5 characters, e.g. "or", "plus", "with".
   * If left undefined, connector will not render and incentive text will be visually connected to the APR.
   */
  incentiveConnectorText?: WarrantyBlockField;
  /**
   * Small label shown above the main incentive.
   * Recommended max: 1 line, e.g. "instant".
   */
  incentivePreText?: WarrantyBlockField;
  /**
   * Main incentive headline.
   * Recommended max: 20 characters. Short offer copy works best.
   */
  incentiveText?: WarrantyBlockField;
  /**
   * Connector label rendered between the incentive and warranty sections.
   * Recommended max: 20 characters, e.g. "plus, or, with etc.".
   * "Other" choice option is available to support custom connectors, but use should be curtailed as space is limited and short connectors work best.
   */
  connectorLinesText?: WarrantyBlockField;
  /**
   * Main warranty headline.
   * Recommended max: 30 characters. Copy can balance over 2 lines in some cases.
   */
  warrantyText?: WarrantyBlockField;
  /**
   * Warranty support text.
   * Recommended max: 55 characters. Copy can balance over 2 lines in some cases.
   */
  warrantyConnectorText?: WarrantyBlockField;
}

const WarrantyBlockWrapper = styled.div`
  container-name: warrantyWrapper;
  container-type: size;

  grid-area: warrantyBlock;
  display: grid;
  grid-template-rows: min-content min-content min-content;
  height: 100cqb;
  width: 100%;
  place-content: center;
  justify-items: center;

  font-size: var(
    --clamp-size-1,
    clamp(0.65em, calc(-0.875rem + 7.333cqi), 8.5rem)
  );
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
  color: var(--color-orange, #ff6600);

  .incentiveWrapper {
    font-size: 10cqi;
    font-size: 1.05em;
    display: flex;
    flex-wrap: wrap;
    align-items: anchor-center;
    justify-content: center;
    max-width: inherit;
    column-gap: 0.4em;
    height: fit-content;
    .aPR {
      // INFO aPR wrapper and content
      align-self: anchor-center;
      .text-type--aPR {
        display: grid;
        font-size: 1em;
        font-family: var(
          --font-family-arial-black-default,
          "Arial Black",
          Arial,
          Helvetica,
          sans-serif
        );
        text-transform: uppercase;
        color: var(--color-orange, #ff6600);
        position: relative;
        width: fit-content;
        line-height: 0.7;
        &::before {
          grid-column: 2;
          grid-row: 1;
          font-size: 0.41em;
          font-family: var(
            --font-family-arial-black-default,
            "Arial Black",
            Arial,
            Helvetica,
            sans-serif
          );
          color: inherit;
          content: "%";
          height: fit-content;
          margin-top: 0.1em;
          position: absolute;
          top: 0;
          text-transform: inherit;
        }
        &::after {
          grid-column: 2;
          font-size: 0.21em;
          font-weight: 700;
          color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
          content: "available";
          text-transform: inherit;
          align-self: end;
          height: fit-content;
        }
      }
    }
    .incentiveConnectorTextWrapper {
      align-self: center;
      .text-type--incentiveConnectorText {
        text-transform: uppercase;
        font-size: 0.4em;
        font-weight: 700;
        color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
      }
    }
    .incentiveBlock {
      display: block;
      .incentivePreText {
        .text-type--incentivePreText {
          text-transform: uppercase;
          font-size: 0.26em;
          font-weight: 700;
          color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
        }
      }

      .incentiveText {
        .text-type--incentiveText {
          text-transform: uppercase;
          font-size: 0.65em;
          font-family: var(
            --font-family-arial-black-default,
            "Arial Black",
            Arial,
            Helvetica,
            sans-serif
          );
          color: var(--color-orange, #ff6600);
          width: fit-content;
        }
      }
    }
  }

  .connectorWrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.2em;
    span.connector-line {
      display: inline-block;
      width: inherit;
      height: min(0.9px, 0.03em);
      background-color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
      vertical-align: middle;
      margin: 0 0.23em;
    }

    .text-type--connectorLines {
      font-size: 0.5em;
      font-weight: 700;
      color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
      text-transform: uppercase;
      text-align: center;
      width: max-content;
    }
  }

  .warrantyWrapper {
    display: grid;
    row-gap: 0.4em;
    height: fit-content;
    .warrantyText {
      .text-type--warrantyText {
        text-transform: uppercase;
        font-size: 0.93em;
        font-family: var(
          --font-family-arial-black-default,
          "Arial Black",
          Arial,
          Helvetica,
          sans-serif
        );
        color: var(--color-orange, #ff6600);
        text-align: center;
      }
    }
    .warrantyConnectorText {
      .text-type--warrantyConnectorText {
        text-transform: uppercase;
        font-size: 0.33em;
        font-weight: 700;
        color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
        text-align: center;
        text-wrap-style: balance;
      }
    }
  }

  // INFO conditional overrides
  &.aPR--hide {
    .aPR {
      display: none;
    }
  }
  &.aPR--standard-size {
    .incentiveWrapper {
      .aPR {
        .text-type--aPR {
          font-size: 1.4em;
          margin-right: 0.3em;
          &::before {
            font-size: 0.41em;
          }
          &::after {
            display: none;
          }
        }
      }
    }
  }

  &.incentiveWrapper:has(.text-type--incentiveConnectorText:empty) {
    .incentiveConnectorTextWrapper {
      display: none;
    }
  }

  &.incentivePreText--hide .incentivePreText {
    visibility: hidden;
  }

  .connectorWrapper:has(.text-type--connectorLines:empty) {
    .connector-line {
      margin: unset;
    }
  }

  &.warrantyConnectorText--hide .warrantyConnectorText {
    display: none;
  }

  @container warrantyWrapper (max-aspect-ratio: 11 / 10) {
    // INFO stacked layout styles (160x600, 300x250)
    &.incentivePreText--hide .incentivePreText {
      display: none;
    }

    .incentiveWrapper {
      flex-direction: column;
      row-gap: 0.6em;

      .aPR {
        align-self: center;
        .text-type--aPR {
          font-size: 2.2em;
          line-height: 0.8;
          ::before {
            font-size: 0.6em;
          }
          ::after {
            font-size: 0.15em;
          }
        }
      }

      .incentiveConnectorTextWrapper {
        .text-type--incentiveConnectorText {
          font-size: 0.6em;
        }
      }

      .incentiveBlock {
        justify-items: center;
        text-align: center;
        .incentivePreText {
          .text-type--incentivePreText {
            font-size: 0.4em;
          }
        }
        .incentiveText {
          .text-type--incentiveText {
            width: min-content;
            font-size: 1.05em;
          }
        }
      }
    }

    .connectorWrapper {
      span.connector-line {
        height: min(0.9px, 0.03em);
      }
    }

    .warrantyWrapper {
      .warrantyText {
        max-width: 8em;
        justify-self: center;
      }
      .warrantyConnectorText {
        max-width: 5.5em;
        justify-self: center;
        text-wrap-style: balance;
      }
    }

    .incentiveWrapper,
    .connectorWrapper,
    .warrantyWrapper {
      font-size: 0.42em;
    }
  }

  @container warrantyWrapper (min-aspect-ratio: 11 / 10) and (max-aspect-ratio: 2 / 1) {
    // INFO wide layout styles (300x600)
    .incentiveWrapper {
      .aPR {
        align-self: baseline;
        .text-type--aPR {
          font-size: 2em;
          ::before {
            font-size: 0.5em;
          }
          ::after {
            font-size: 0.15em;
          }
        }
      }
      .incentiveBlock {
        .incentiveText {
          .text-type--incentiveText {
            width: min-content;
          }
        }
      }
    }

    .connectorWrapper:has(.text-type--connectorLines:empty) {
      width: 95%;
    }

    .warrantyWrapper {
      font-size: 0.64em;

      justify-items: center;
      .warrantyText {
        .text-type--warrantyText {
          font-size: 1.16em;
          text-wrap-style: balance;
        }
      }
      .warrantyConnectorText {
        .text-type--warrantyConnectorText {
          font-size: 0.36em;
        }
      }
    }
  }

  @container warrantyWrapper (min-aspect-ratio: 2 / 1) {
    // INFO extra wide layout styles (728x90)
    .incentiveWrapper {
      font-size: 0.7em;
      .text-type--incentiveText {
        max-width: fit-content;
      }
    }
    .connectorWrapper {
      font-size: 0.5em;
    }
    .warrantyWrapper {
      font-size: 0.5em;
    }
  }
`;

/**
 * Responsive warranty and incentive offer block.
 *
 * Renders built-in preview content by default, accepts live Outfit-style fields
 * such as `aPR={{ value: "available" }}`, and can be customised with
 * `fallbackContent` using the same `{ value: "..." }` field shape.
 */
const WarrantyBlock = ({
  fallbackContent,
  dummyData,
  aPR,
  incentiveConnectorText,
  incentivePreText,
  incentiveText,
  connectorLinesText,
  warrantyText,
  warrantyConnectorText,
}: WarrantyBlockProps) => {
  const content =
    fallbackContent || dummyData || defaultWarrantyFallbackContent;
  const testAprValue = checkInputExists(aPR, content?.aPR?.value);
  const aprInput = aPR || content?.aPR;

  const standInAprInput = aprInput
    ? cloneInlineClick(aprInput, {
        value: "0",
      })
    : { value: "0" };
  const checkedAprInput = testAprValue === "available" ? standInAprInput : aPR;

  const incentiveConnectorTextValue = onceADummyText(
    incentiveConnectorText,
    content?.incentiveConnectorText?.value,
  );

  const incentivePreTextValue = onceADummyText(
    incentivePreText,
    content?.incentivePreText?.value,
  );

  const warrantyConnectorTextValue = onceADummyText(
    warrantyConnectorText,
    content?.warrantyConnectorText?.value,
  );

  return (
    <WarrantyBlockWrapper
      className={`warrantyBlock
      aPR--${testAprValue === "notApplicable" ? "hide" : "show"} aPR--${testAprValue !== "0" ? "long" : "short"} special-apr-value--${
        testAprValue === "available" ? "show" : "hide"
      } incentivePreText--${incentivePreTextValue?.class} incentiveConnectorText--${incentiveConnectorTextValue?.class} warrantyConnectorText--${warrantyConnectorTextValue?.class}`}
    >
      <div className="incentiveWrapper">
        <div className="aPR">
          <TextElement
            dummyData={content?.aPR?.value || "0"}
            destructedProp={checkedAprInput}
            dynamicClassName={`aPR`}
            height={undefined}
            lines={undefined}
            chars={5}
          ></TextElement>
        </div>
        <div className="incentiveConnectorTextWrapper">
          <TextElement
            dummyData={incentiveConnectorTextValue?.dummyData || ""}
            destructedProp={incentiveConnectorText}
            dynamicClassName={`incentiveConnectorText`}
            height={undefined}
            lines={undefined}
            chars={5}
          ></TextElement>
        </div>
        <div className="incentiveBlock">
          <div className="incentivePreText">
            <TextElement
              dummyData={incentivePreTextValue?.dummyData || ""}
              destructedProp={incentivePreText}
              dynamicClassName={`incentivePreText`}
              height={undefined}
              lines={1}
              chars={undefined}
            ></TextElement>
          </div>
          <div className="incentiveText">
            <TextElement
              dummyData={content?.incentiveText?.value || ""}
              destructedProp={incentiveText}
              dynamicClassName={`incentiveText`}
              height={undefined}
              lines={undefined}
              chars={20}
            ></TextElement>
          </div>
        </div>
      </div>
      <div className="connectorWrapper">
        <span className="connector-line"></span>
        <TextElement
          dummyData={content?.connectorLinesText?.value || ""}
          destructedProp={connectorLinesText}
          dynamicClassName={`connectorLines`}
          height={undefined}
          lines={undefined}
          chars={20}
        ></TextElement>
        <span className="connector-line"></span>
      </div>
      <div className="warrantyWrapper">
        <div className="warrantyText">
          <TextElement
            dummyData={content?.warrantyText?.value || ""}
            destructedProp={warrantyText}
            dynamicClassName={`warrantyText`}
            height={undefined}
            lines={undefined}
            chars={30}
          ></TextElement>
        </div>
        <div className="warrantyConnectorText">
          <TextElement
            dummyData={warrantyConnectorTextValue?.dummyData || ""}
            destructedProp={warrantyConnectorText}
            dynamicClassName={`warrantyConnectorText`}
            height={undefined}
            lines={undefined}
            chars={55}
          ></TextElement>
        </div>
      </div>
    </WarrantyBlockWrapper>
  );
};

export { WarrantyBlock };
