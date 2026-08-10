import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { TextElement } from "./TextElement.js";
import {
  onceADummyText,
  checkInputExists,
  cloneInlineClick,
} from "../utils/helpers.js";
export interface OfferOptionBlockProps {
  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   paymentPlanText: { value: "lease for as low as" }
   *   paymentAmount: { value: "XXX" },
   *   aPR: { value: "0" },
   * }
   */
  fallbackContent?: OfferOptionBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: OfferOptionBlockFallbackContent;

  /**
   * This prop allows you to set the behavior fort a specific background and text color for the OfferOptionBlock.
   */
  backgroundColor?: OfferOptionBlockField;
  /**
   * APR percentage value. Keep to 5 characters or fewer.
   * Use "available" to render the fallback 0% APR treatment.
   * Can be omitted if not applicable to the offer.
   */
  aPR?: OfferOptionBlockField;
  /**
   * Short connector text between the apr and the payment amount.
   * Recommended max: 1 line.
   * choice options: "up to", "for".
   * Can be omitted if not applicable to the offer.
   */
  aprPaymentMonthsConnectorText?: OfferOptionBlockField;
  /**
   * Payment months (term) value.
   * Recommended max: 6 characters.
   * Can be omitted if not applicable to the offer.
   */
  paymentMonths?: OfferOptionBlockField;
  /**
   * Connector text between the APR/Months and the saving amount.
   * Choice options: "and", "or", "with", "plus", "minus", "for", "to", "from", "at", "in", "on", "over", "under".
   * Can be omitted if not applicable to the offer.
   */
  connectorLinesText?: OfferOptionBlockField;
  /**
   * Short connector text above the saving amount.
   * Recommended max: 1 line.
   * Text is required as a connector before the saving amount. If removed a warning will be displayed.
   */
  savingAmountPreText?: OfferOptionBlockField;
  /**
   * Saving amount.
   * Recommended max: 6 characters.
   * Always required. If removed a warning will be displayed.
   */
  savingAmount?: OfferOptionBlockField;
  /**
   * descriptive text below the saving amount.
   * Recommended max: 2 lines.
   * Descriptive text is required below the saving amount. If removed a warning will be displayed.
   */
  savingAmountPostText?: OfferOptionBlockField;

  /**
   * Optional prop to limit the number of lines for the savingAmountPostText text field. If the text exceeds the maxLines, it will show the overflow warning.
   * structure: {  square: 3, landscape: 2 }
   * if maxLines is not provided, the default maxLines will be used for each field which is 2.
   */
  maxSavingAmountPostText?: MaxLinesBlockField;
}

export type OfferOptionBlockField = {
  value: string;
};
export type MaxLinesBlockField = {
  square: number;
  landscape: number;
};

/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type OfferOptionBlockFallbackContent = {
  aPR?: OfferOptionBlockField;
  backgroundColor?: OfferOptionBlockField;
  aprPaymentMonthsConnectorText?: OfferOptionBlockField;
  paymentMonths?: OfferOptionBlockField;
  connectorLinesText?: OfferOptionBlockField;
  savingAmountPreText?: OfferOptionBlockField;
  savingAmount?: OfferOptionBlockField;
  savingAmountPostText?: OfferOptionBlockField;
  maxSavingAmountPostText?: MaxLinesBlockField;
};

const defaultOfferOptionFallbackContent: OfferOptionBlockFallbackContent = {
  aPR: { value: "X.XX" },
  backgroundColor: { value: "black" },
  aprPaymentMonthsConnectorText: { value: "up to" },
  paymentMonths: { value: "XX" },
  connectorLinesText: { value: "or" },
  savingAmountPreText: { value: "save up to" },
  savingAmount: { value: "X,XXX" },
  savingAmountPostText: {
    value: "when you bundle a LX Series with Snow Attachments",
  },
  maxSavingAmountPostText: { square: 2, landscape: 2 },
};

const OfferOptionBlockWrapper = styled.div<{}>`
  container-type: size;
  container-name: offerOptionBlock;
  grid-area: offerOptionBlock;
  font-size: var(
    --clamp-size-1,
    clamp(0.42em, calc(-0.875rem + 7.333cqi), 11.5rem)
  );
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
  height: inherit;
  width: 100%;
  --offerOptionBlockWrapperPadding: 1em;
  .offerOptionBlockWrapper {
    height: inherit;
    padding: calc(var(--offerOptionBlockWrapperPadding));
    padding: calc(var(--offerOptionBlockWrapperPadding))
      calc(var(--offerOptionBlockWrapperPadding) * 2)
      calc(var(--offerOptionBlockWrapperPadding))
      calc(var(--offerOptionBlockWrapperPadding));
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(auto, 2em) 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "financingOption connectorContent offerOptionContent";
    gap: 0.6em;
    background-color: inherit;
    font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
    position: relative;
    z-index: 0;

    &::after {
      content: "";
      position: absolute;
      height: 100.1%;
      width: 100%;
      top: 0;
      right: 0;
      /* transform: skewX(10deg); */
      clip-path: polygon(0 0, 95% 0, 100% 100%, 0% 100%);
      z-index: -1;
    }

    &.square--content {
      &::after {
        clip-path: polygon(0 0, 93% 0, 100% 100%, 0% 100%);
      }
    }
    &.theme--black {
      &::after {
        background-color: var(--color-black, black);
      }
      color: var(--color-white, white);
    }
    &.theme--white {
      &::after {
        background-color: var(--color-white, white);
      }
      color: var(--color-black, black);
    }

    .financingContent {
      grid-area: financingOption;
      align-self: baseline;
      padding-block: 0.2em;
      padding-left: 0.5em;
      justify-self: start;
      .apr-wrapper {
        font-family: var(--font-family-arial-black-default);
        display: grid;
        grid-template-columns: min-content min-content;
        grid-template-columns: min-content min-content 1fr 1fr;
        grid-template-areas: "apr percentage";
        grid-template-areas:
          "apr percentage"
          "termLabels termLabels";
        row-gap: 0.325em;
        .percentage {
          grid-area: percentage;
          font-family: inherit;
        }
        > [data-testid="limiter"] {
          grid-area: apr;
          font-family: inherit;
        }

        .text-type--offerAPR,
        .percentage {
          font-size: 1.95em;
        }
        &.text-type--offerAPR--long {
          .text-type--offerAPR,
          .percentage {
            font-size: 1.75em;
          }
          .term-labels {
            font-size: 0.65em;
          }
        }
        &.text-type--offerAPR--longer {
          .text-type--offerAPR,
          .percentage {
            font-size: 1.55em;
          }
          .term-labels {
            font-size: 0.75em;
          }
        }
        .term-labels {
          font-family: var(
            --font-family-inter-default,
            Inter,
            Arial,
            sans-serif
          );
          font-weight: 800;
          font-size: 0.55em;
          line-height: 1.2;
          text-transform: uppercase;
          display: flex;
          flex-wrap: wrap;
          grid-area: termLabels;
          gap: 0 0.4em;
        }
        .apr-available {
          display: none;
          grid-area: available;
        }
        &.hide--available {
          .apr-available {
            display: none;
          }
          .apr-text {
            display: inline-block;
          }
        }
        &.show--available {
          grid-template-areas:
            "apr percentage"
            "termLabels termLabels";
          .apr-available {
            display: inline-block;
          }
          .apr-text {
            display: none;
          }
        }

        &.show--available:not(.payment-months--hide) {
          .term-labels {
            min-width: 130%;
            font-size: 0.4em;
            > * {
              font-size: inherit;
            }
          }
        }
        .payment-months-wrapper {
          display: inline-flex;
          column-gap: 0.3em;
          .text-type--paymentMonths {
            font-size: inherit;
          }
        }
        &.apr--not-applicable {
          display: none;
        }
      }
      .payment-months--hide {
        .payment-months-wrapper,
        .text-type--apr-payment-months-connector {
          display: none;
        }
      }
    }
    &.theme--white .financingContent {
      .text-type--offerAPR,
      .percentage {
        color: var(--color-orange);
      }
    }
    &.apr-months--not-applicable,
    &.apr--not-applicable {
      .financingContent,
      .connectorWrapper {
        display: none;
      }
      grid-template-columns: 1fr;
      grid-template-areas: "offerOptionContent";
      height: 100%;
      .offerOptionContent {
        grid-template-rows: 1fr min-content;
        grid-template-columns: 1fr;
        grid-template-areas: "preAndSavingAmount" "postSavingAmount";
        height: fit-content;
        align-self: center;
        padding-inline: 1em;
        row-gap: 0.5em;
        .offerOptionContent-top {
          gap: 0.3em;
          display: flex;
          align-items: center;
          align-self: center;

          [data-testid="limiter"]:nth-child(1) {
            text-transform: unset;
            .text-type--pre-saving-amount {
              font-size: 1.5em;
            }
          }
          [data-testid="limiter"]:nth-child(2) {
            .text-type--saving-amount {
              font-family: var(--font-family-arial-black-default);
              font-size: 1.5em;
            }
          }
        }
      }

      /* apply orange color when the same wrapper also has the white theme */
      &.theme--white,
      &.theme--white .offerOptionContent {
        .offerOptionContent-top {
          color: var(--color-orange);
        }
      }
    }

    .connectorWrapper {
      grid-area: connectorContent;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr min-content 1fr;
      justify-items: center;
      width: 100%;
      height: 100%;
      gap: 0.3em;
      span.connector-line {
        height: inherit;
        width: 0.1em;
        background-color: var(--color-orange);
      }

      .text-type--connectorLines {
        font-size: 0.47em;
        font-weight: 700;
        color: inherit;
        text-transform: uppercase;
        text-align: center;
        width: max-content;
      }
    }
    &.connectorLinesText--hide-text-only {
      .connectorWrapper {
        gap: unset;
        .text-type--connectorLines {
          display: none;
        }
      }
    }
    .offerOptionContent {
      grid-area: offerOptionContent;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content;
      grid-template-areas:
        "preAndSavingAmount"
        "postSavingAmount";
      justify-items: start;
      align-items: center;
      align-content: space-between;
      font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
      height: 100%;
      left: -0.4em;
      position: relative;

      > * > * {
        text-transform: uppercase;
      }
      .offerOptionContent-top {
        grid-area: preAndSavingAmount;
        [data-testid="limiter"]:nth-child(1) {
          .text-type--pre-saving-amount {
            font-size: 0.6em;
            font-weight: 900;
          }
        }
        [data-testid="limiter"]:nth-child(2) {
          .text-type--saving-amount {
            font-family: var(--font-family-arial-black-default);
            font-size: 1.88em;
            ::before {
              content: "$";
              position: relative;
            }
          }
        }
      }

      .offerOptionContent-bottom {
        grid-area: postSavingAmount;
        .text-type--post-saving-amount {
          line-height: 1.18;
          letter-spacing: -0.02em;
          font-weight: 700;
          text-wrap-style: pretty;
        }
      }

      &.savingAmountPreText--hide {
        align-content: space-evenly;
        .offerOptionContent-top {
          [data-testid="limiter"]:nth-child(1) {
            display: none;
          }
        }
      }

      &.savingAmountPostText--hide {
        grid-template-rows: min-content;
        grid-template-areas: "preAndSavingAmount";
        align-content: center;
        .offerOptionContent-bottom {
          [data-testid="limiter"] {
            display: none;
          }
        }
      }
    }
    &.theme--white .offerOptionContent {
      .text-type--saving-amount {
        color: var(--color-orange);
      }
    }
  }
  @container offerOptionBlock (max-aspect-ratio: 1.5 / 1) {
    .offerOptionBlockWrapper {
      grid-template-rows: minmax(0, 28%) minmax(0, 11%) 1fr;
      grid-template-columns: 1fr;
      grid-template-areas:
        "financingOption"
        "connectorContent"
        "offerOptionContent";
      .financingContent {
        width: fit-content;
        place-self: end center;
        padding-left: unset;
        .apr-wrapper[class*="--available"] {
          grid-template-columns: min-content min-content min-content;
          grid-template-areas: "apr percentage termLabels";
          place-self: center;
          width: inherit;
          .term-labels {
            font-weight: 700;
            font-size: 1.15em;
            justify-content: start;
            width: min-content;
            align-content: space-evenly;
            align-self: end;
            margin-left: 0.3em;
          }
          &.show--available {
            .term-labels {
              min-width: 100%;
              font-size: 0.65em;
            }
          }
          .text-type--offerAPR,
          .percentage {
            font-size: 3.55em;
          }
          &.text-type--offerAPR--long .text-type--offerAPR,
          &.text-type--offerAPR--long .percentage {
            font-size: 2.45em;
          }
          &.text-type--offerAPR--longer .text-type--offerAPR,
          &.text-type--offerAPR--longer .percentage {
            font-size: 2.05em;
          }
        }
        :has(.text-type--offerAPR--long),
        :has(.text-type--offerAPR--longer) {
          align-self: center;
          .apr-wrapper {
            align-items: center;
          }
        }
      }

      .connectorWrapper {
        height: 1.2em;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr min-content 1fr;
        align-items: center;
        justify-items: unset;
        gap: 0.5em;

        .text-type--connectorLines {
          font-size: 0.9em;
        }

        span.connector-line {
          display: inline-block;
          width: inherit;
          height: min(3.5px, 0.08em);
          margin: unset;
        }
      }

      .offerOptionContent {
        left: unset;
        justify-self: center;
        align-content: center;
        height: fit-content;
        gap: 1em;
        width: 100%;
        justify-items: center;
        max-width: calc(
          100cqi - calc(var(--offerOptionBlockWrapperPadding) * 2)
        );

        .offerOptionContent-top {
          [data-testid="limiter"]:nth-child(1) {
            .text-type--pre-saving-amount {
              font-size: 1.3em;
            }
          }
          [data-testid="limiter"]:nth-child(2) {
            .text-type--saving-amount {
              font-size: 3.45em;
            }
          }
        }
        .offerOptionContent-bottom {
          max-width: 72cqi;
          .text-type--post-saving-amount {
            text-wrap-style: balance;
          }
        }
      }
      &.apr-months--not-applicable,
      &.apr--not-applicable {
        .financingContent,
        .connectorWrapper {
          display: none;
        }
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: "offerOptionContent";
        height: 100%;
        .offerOptionContent {
          .offerOptionContent-top {
            display: grid;
            [data-testid="limiter"]:nth-child(1) {
              text-transform: uppercase;
            }
            [data-testid="limiter"]:nth-child(2) {
              .text-type--saving-amount {
                font-size: 3.45em;
              }
            }
          }
        }
      }
    }
  }
`;

const OfferOptionBlock = ({
  fallbackContent,
  dummyData,
  backgroundColor,
  aPR,
  aprPaymentMonthsConnectorText,
  paymentMonths,
  connectorLinesText,
  savingAmountPreText,
  savingAmount,
  savingAmountPostText,
  maxSavingAmountPostText,
}: OfferOptionBlockProps) => {
  const content =
    fallbackContent || dummyData || defaultOfferOptionFallbackContent;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isSquare, setIsSquare] = useState(false);
  console.log("is square:", isSquare);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect.width;
        const h = e.contentRect.height || 1;
        setIsSquare(w / h <= 1.5);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const landscapeTextfitConfig = {
    minFontSize: 1.4,
    maxFontSize: 2.5,
    heightOnly: true,
    fontUnit: "cqi",
  };
  const squareTextfitConfig = {
    minFontSize: 3.5,
    maxFontSize: 5.5,
    widthOnly: true,
    fontUnit: "cqi",
  };

  const backgroundColorValue = checkInputExists(
    backgroundColor,
    content.backgroundColor?.value,
  );

  const testAprValue = checkInputExists(aPR, content?.aPR?.value);
  const aprInput: OfferOptionBlockField | undefined = aPR || content?.aPR;

  const standInAprInput: OfferOptionBlockField = aprInput
    ? (cloneInlineClick(aprInput, {
        value: "0",
      }) as OfferOptionBlockField)
    : { value: "0" };
  const checkedAprInput: OfferOptionBlockField | undefined =
    testAprValue === "available" ? standInAprInput : aPR;

  const testPaymentMonthsValue = checkInputExists(
    paymentMonths,
    content?.paymentMonths?.value,
  );

  const connectorLinesTextValue = onceADummyText(
    connectorLinesText,
    content?.connectorLinesText?.value,
  );
  const setConnectorLines = checkInputExists(
    connectorLinesText,
    content?.connectorLinesText?.value,
  );

  const savingAmountPreTextValue = onceADummyText(
    savingAmountPreText,
    content.savingAmountPreText?.value,
  );
  const savingAmountValue = onceADummyText(
    savingAmount,
    content.savingAmount?.value,
  );
  const savingAmountPostTextValue = onceADummyText(
    savingAmountPostText,
    content.savingAmountPostText?.value,
  );

  return (
    <OfferOptionBlockWrapper ref={wrapperRef} className="offerOptionBlock">
      <div
        className={`offerOptionBlockWrapper  connectorLinesText--${
          setConnectorLines === "hide-text"
            ? "hide-text-only"
            : setConnectorLines === "hide-element"
            ? "hide-element"
            : connectorLinesTextValue?.class
        } theme--${backgroundColorValue}  ${
          !!checkedAprInput &&
          checkedAprInput?.value === "notApplicable" &&
          testPaymentMonthsValue === "notApplicable"
            ? "apr-months--not-applicable"
            : !!checkedAprInput && checkedAprInput?.value === "notApplicable"
            ? "apr--not-applicable"
            : testPaymentMonthsValue === "notApplicable"
            ? "months--not-applicable"
            : ""
        } ${isSquare ? "square" : "landscape"}--content`}
      >
        <div className="financingContent">
          <div
            className={`apr-wrapper ${
              testAprValue !== "available" ? "hide" : "show"
            }--available ${
              checkedAprInput?.value && checkedAprInput?.value.length === 5
                ? "text-type--offerAPR--longer"
                : checkedAprInput?.value && checkedAprInput?.value.length === 4
                ? "text-type--offerAPR--long"
                : checkedAprInput?.value === "notApplicable"
                ? "apr--not-applicable"
                : ""
            } payment-months--${
              testPaymentMonthsValue === "notApplicable" ? "hide" : "show"
            }`}
          >
            <TextElement
              dummyData={content?.aPR?.value || "0"}
              destructedProp={checkedAprInput}
              dynamicClassName={`offerAPR `}
              height={undefined}
              lines={undefined}
              chars={5}
              textfit={false}
              textfitConfig={undefined}
            ></TextElement>
            <span className="percentage">
              <strong>%</strong>
            </span>
            <div className="term-labels">
              <span className="term-label apr-text">apr</span>

              <span className="term-label apr-available">
                financing available
              </span>
              <TextElement
                dummyData={content?.aprPaymentMonthsConnectorText?.value || ""}
                destructedProp={aprPaymentMonthsConnectorText}
                dynamicClassName="apr-payment-months-connector"
                height={undefined}
                lines={2}
                chars={undefined}
                textfit={false}
                textfitConfig={undefined}
              ></TextElement>
              <div className="payment-months-wrapper">
                <TextElement
                  dummyData={content?.paymentMonths?.value || ""}
                  destructedProp={paymentMonths}
                  dynamicClassName="payment-months"
                  height={undefined}
                  lines={undefined}
                  chars={3}
                  textfit={false}
                  textfitConfig={undefined}
                ></TextElement>
                <span className="term-label">months</span>
              </div>
            </div>
          </div>
        </div>
        <div className="connectorWrapper">
          <span className="connector-line"></span>
          <TextElement
            dummyData={connectorLinesTextValue?.dummyData || ""}
            destructedProp={connectorLinesText}
            dynamicClassName={`connectorLines`}
            height={undefined}
            lines={undefined}
            chars={20}
          ></TextElement>
          <span className="connector-line"></span>
        </div>
        <div
          className={`offerOptionContent savingAmountPreText--${
            savingAmountPreTextValue?.class
          }  savingAmount--${savingAmountValue?.class}  savingAmountPostText--${
            savingAmountPostTextValue?.class
          } aPR--${
            testAprValue === "notApplicable" ? "hide" : "show"
          } paymentMonths--${
            testPaymentMonthsValue === "notApplicable" ? "hide" : "show"
          }  `}
        >
          <div className="offerOptionContent-top">
            <TextElement
              dummyData={content?.savingAmountPreText?.value || ""}
              destructedProp={savingAmountPreText}
              dynamicClassName="pre-saving-amount"
              height={undefined}
              lines={1}
              chars={undefined}
              textfit={false}
              textfitConfig={undefined}
            ></TextElement>
            <TextElement
              dummyData={content?.savingAmount?.value || ""}
              destructedProp={savingAmount}
              dynamicClassName="saving-amount"
              height={undefined}
              lines={undefined}
              chars={6}
              textfit={false}
              textfitConfig={undefined}
            ></TextElement>
          </div>
          <div className="offerOptionContent-bottom">
            <TextElement
              dummyData={content?.savingAmountPostText?.value || ""}
              destructedProp={savingAmountPostText}
              dynamicClassName="post-saving-amount"
              height={undefined}
              lines={
                maxSavingAmountPostText && isSquare
                  ? maxSavingAmountPostText?.square
                  : maxSavingAmountPostText?.landscape
              }
              chars={undefined}
              textfit={true}
              textfitConfig={
                isSquare ? squareTextfitConfig : landscapeTextfitConfig
              }
            ></TextElement>
          </div>
        </div>
      </div>
    </OfferOptionBlockWrapper>
  );
};

export { OfferOptionBlock };
