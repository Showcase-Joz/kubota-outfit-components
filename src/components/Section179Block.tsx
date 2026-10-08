import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { Limiter } from "@outfit.io/react";
import { TextElement } from "./sharedV2/TextElement.js";
import rawSection179BlockTextSettings from "../utils/Section179BlockTextSettings.json" with { type: "json" };
import { checkInputExists, cloneInlineClick } from "../utils/helpers.js";

// Copy this file and its companion files using docs/section179-block.md.
// Keep declarations self-contained for templates that do not import JSON.
export const section179BlockTextSettings = rawSection179BlockTextSettings;
export type Section179BlockPreset = keyof typeof section179BlockTextSettings;
export const DEFAULT_SECTION179_PRESET: Section179BlockPreset = "print";

export interface Section179BlockProps extends Section179BlockFallbackContent {
  preset?: Section179BlockPreset;
  children?: ReactNode;
  /**
   * Overrides the preset's termLabels.lines for the complete inline finance phrase.
   * If neither supplies a limit, the phrase wraps without a configured line cap.
   *
   * @example
   * <OfferOptionBlockV2 preset="160x600" maxTermLabelsText={4} />
   */
  maxTermLabelsText?: number;
  /**
   * Alternative prop name for template starting content. If both this and dummyData
   * are supplied, fallbackContent takes priority. Explicit inputs win over either.
   *
   * @example
   * {
   *   aPR: { value: "0" },
   *   paymentMonths: { value: "60" },
   * }
   */
  fallbackContent?: Section179BlockFallbackContent;
  /**
   * Optional starting content supplied by a template, shaped as
   * `{ fieldName: { value: "..." } }`. Missing fields use component defaults;
   * explicit input values (including blanks) take precedence over this content.
   * The component does not import a template's data file or choose its content.
   *
   * @example
   * <OfferOptionBlockV2 preset="160x600" dummyData={data["160x600"]} />
   */
  dummyData?: Section179BlockFallbackContent;
  /**
   * This prop allows you to set the behavior fort a specific background and text color for the OfferOptionBlockV2.
   */
  backgroundColor?: Section179BlockField;
  /**
   * APR percentage value. Keep to 5 characters or fewer.
   * Use "available" to render the fallback 0% APR treatment.
   * Can be omitted if not applicable to the offer.
   */
  aPR?: Section179BlockField;
  /**
   * Short connector text between the apr and the payment amount.
   * Recommended max: 1 line.
   * choice options: "up to", "for".
   * Can be omitted if not applicable to the offer.
   */
  aprPaymentMonthsConnectorText?: Section179BlockField;
  /**
   * Payment months (term) value.
   * Maximum: 2 displayed characters, checked by the inline character validator.
   * Can be omitted if not applicable to the offer.
   */
  paymentMonths?: Section179BlockField;
  /**
   * Down payment value.
   * Maximum: 6 displayed characters, including the thousands separator (99,999).
   * The separate currency symbol is not counted.
   * Can be omitted if not applicable to the offer.
   */
  downPayment?: Section179BlockField;
  /**
   * Connector text between the APR/Months and the saving amount.
   * Choice options: "and", "or", "with", "plus", "minus", "for", "to", "from", "at", "in", "on", "over", "under".
   * Can be omitted if not applicable to the offer.
   */
  connectorLinesText?: Section179BlockField;
  /**
   * Short connector text above the saving amount.
   * The line limit comes from the selected preset's text settings.
   * When the savings amount is empty, this becomes the large orange headline.
   * An explicit empty value omits the heading.
   */
  savingAmountPreText?: Section179BlockField;
  /**
   * Saving amount.
   * Recommended max: 6 characters.
   * An explicit empty value omits the amount and its currency marker.
   */
  savingAmount?: Section179BlockField;
  /**
   * descriptive text below the saving amount.
   * Recommended max: 2 lines.
   * May remain when the savings heading and amount are omitted.
   */
  savingAmountPostText?: Section179BlockField;
  /**
   * Connector text between the section 179 information and the saving amount.
   * Choice options: "and", "or", "with", "plus", "minus", "for", "to", "from", "at", "in", "on", "over", "under".
   * Can be omitted if not applicable to the offer.
   */
  section179connectorLinesText?: Section179BlockField;
  /**
   * Section 179 heading text.
   * Recommended max: 2 lines.
   * An explicit empty value omits the heading.
   */
  section179Text?: Section179BlockField;
  /**
   * Section 179 descriptive text below the heading.
   * Recommended max: 1 line.
   * May remain when the heading is omitted.
   */
  section179PostText?: Section179BlockField;
  textSettings?: Section179BlockTextSettings;
  className?: string;
}

export type Section179BlockField = {
  value: string | number | null;
  ids?: Record<string, unknown>;
};

export type Section179BlockFallbackContent = {
  backgroundColor?: Section179BlockField;
  aPR?: Section179BlockField;
  paymentMonths?: Section179BlockField;
  downPayment?: Section179BlockField;
  aprPaymentMonthsConnectorText?: Section179BlockField;
  connectorLinesText?: Section179BlockField;
  savingAmountPreText?: Section179BlockField;
  savingAmount?: Section179BlockField;
  savingAmountPostText?: Section179BlockField;
  section179connectorLinesText?: Section179BlockField;
  section179Text?: Section179BlockField;
  section179PostText?: Section179BlockField;
};

export type Section179BlockTextLimits = {
  /** Warns about overflow; does not truncate the input. */
  lines?: number;
  /** Off for the skeleton. Font sizes and spacing belong in the CSS below. */
  textfit?: boolean;
  /** Percentages of the authored font size, when textfit is enabled. */
  min?: number;
  max?: number;
};

// These keys match this component's fields and its text-settings JSON.
export type Section179BlockTextSettings = Partial<
  Record<
    | Exclude<keyof Section179BlockFallbackContent, "backgroundColor">
    | "termLabels"
    | "savingAmountPreTextNoAmount",
    Section179BlockTextLimits
  >
>;

export const defaultSection179BlockFallbackContent: Section179BlockFallbackContent =
  {
    backgroundColor: { value: "white" },
    aPR: { value: "0" },
    paymentMonths: { value: "60" },
    downPayment: { value: "" },
    aprPaymentMonthsConnectorText: { value: "up to" },
    connectorLinesText: { value: "or" },
    savingAmountPreText: { value: "Save up to" },
    savingAmount: { value: "12000" },
    savingAmountPostText: { value: `On Select<br/>Kubota Series Equipment` },
    section179connectorLinesText: { value: "plus" },
    section179Text: { value: "Section 179†" },
    section179PostText: { value: "tax savings" },
  };

const Section179BlockWrapper = styled.div`
  --offer-background: var(--color-black, #000);
  --offer-foreground: var(--color-white, #fff);
  --offer-number-color: var(--offer-foreground);
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  background: var(--offer-background);
  color: var(--offer-foreground);
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
  font-size: 1rem;
  text-transform: uppercase;

  * {
    box-sizing: border-box;
  }
  &.theme--white {
    --offer-background: var(--color-white, #fff);
    --offer-foreground: var(--color-black, #000);
    --offer-number-color: var(--color-orange, #dc4405);
  }
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);

  /* Set font sizes on the parent so TextElement can inherit fitted sizes. */
  .section179-block-content {
    font-size: 1rem;
  }
  .section179-block-content {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, auto) auto minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "financeOfferGroup section179ConnectorContent section179OptionContent";
    align-items: center;
    width: fit-content;
    justify-self: center;
  }

  .financeOfferGroup {
    grid-area: financeOfferGroup;
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, auto) auto minmax(0, 1fr);
    grid-template-areas: "financingOption connectorContent offerOptionContent";
    align-items: center;
    align-self: stretch;
  }

  .financingContent {
    grid-area: financingOption;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "apr" "termLabels";
    align-content: center;
    width: inherit;
    height: 100%;
    align-content: space-around;

    .apr-wrapper {
      grid-area: apr;
      display: grid;
      grid-template-columns: max-content max-content;
      align-items: baseline;
      font-family: var(
        --font-family-arial-black-default,
        "Arial Black",
        Arial,
        sans-serif
      );
      color: var(--offer-number-color);
    }
    .term-labels {
      grid-area: termLabels;
      font-weight: 800;
      line-height: 1.1;
      min-width: 0;
      text-wrap: balance;
      text-wrap-style: balance;
    }
  }

  .connectorWrapper,
  .section179connectorWrapper {
    grid-area: connectorContent;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr auto 1fr;
    justify-items: center;
    align-self: stretch;

    .text-type--connectorLinesText,
    .text-type--section179connectorLinesText {
      font-weight: 700;
      line-height: 1.2;
      text-transform: uppercase;
    }
    .connector-line {
      display: block;
      width: 1px;
      height: 100%;
      background: var(--color-orange, #dc4405);
    }
    .connector-line:last-child {
      grid-row: 3;
    }
  }
  .connectorWrapper {
    height: fit-content;
    align-self: center;
    width: fit-content;
    justify-self: center;
    border: 1px solid var(--color-orange, #dc4405);
    padding: 0.438rem;
    gap: 0.625rem;
    .text-type--connectorLinesText {
      font-weight: 700;
    }
  }

  .offerOptionContent {
    grid-area: offerOptionContent;
    min-width: 0;
    display: grid;
    grid-template-rows: auto auto;
    align-content: center;

    .offerOptionContent-top {
      min-width: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr);

      .text-type--pre-saving-amount {
        font-weight: 800;
      }
      .text-type--saving-amount {
        max-width: fit-content;
        font-family: var(
          --font-family-arial-black-default,
          "Arial Black",
          Arial,
          sans-serif
        );
        color: var(--offer-number-color);
        &::before {
          content: "$";
        }
        &::after {
          content: "*";
          font-size: 0.5em;
          /* top: -0.85em; */
          position: absolute;
        }
      }
    }
    .offerOptionContent-bottom {
      min-width: 0;
      /* Set preset font sizes on this wrapper so the text inherits Limiter's fitted size. */
      .text-type--post-saving-amount {
        font-weight: 600;
        line-height: 1.1;
        white-space: normal;
        letter-spacing: unset;
        font-kerning: none;
      }
    }
  }

  /* AG treatment: the existing pre-text becomes the headline when no amount is shown. */
  .offerOptionContent[data-offer-mode="text-only"] {
    .offerOptionContent-top .text-type--pre-saving-amount {
      color: var(--color-orange, #dc4405);
      font-family: var(
        --font-family-arial-black-default,
        "Arial Black",
        Arial,
        sans-serif
      );
      font-weight: 900;
      font-size: 1.5rem;
      line-height: 1;
      white-space: normal;
    }
  }

  .section179connectorWrapper {
    grid-area: section179ConnectorContent;
  }

  .section179Content {
    display: grid;
    grid-area: section179OptionContent;
    gap: 0.5rem;
    .section179Heading {
      .text-type--section179-text {
        font-weight: 800;
        font-family: var(
          --font-family-arial-black-default,
          "Arial Black",
          Arial,
          sans-serif
        );
        font-weight: 900;
        text-transform: uppercase;
        color: var(--offer-number-color);
      }
    }
    .section179Description {
      max-width: 95%;
      place-self: center start;

      .text-type--section179-post-text {
        font-weight: 800;
        font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
        text-transform: uppercase;
        line-height: 1.1;
      }
    }
  }
  /* Plain structural styles only; the artwork styling is yours to add. */
  .apr-wrapper {
    display: flex;
    align-items: baseline;
    gap: 0.15em;
  }
  .connectorWrapper,
  .section179connectorWrapper {
    display: flex;
    align-items: center;
    gap: 0.5em;

    .connector-line {
      flex: 1;
      border-top: 1px solid var(--color-orange, #dc4405);
    }
  }

  [hidden] {
    display: none !important;
  }

  /* Vertical formats stack the three outer regions; the offer group stays together. */
  &[data-preset="web-banner"],
  &[data-preset="300x600"],
  &[data-preset="160x600"],
  &[data-preset="300x250"] {
    .section179-block-content {
      width: 100%;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(0, 1fr) auto minmax(0, max-content);
      grid-template-areas:
        "financeOfferGroup"
        "section179ConnectorContent"
        "section179OptionContent";

      /* .financeOfferGroup {
        grid-template-rows: minmax(0, auto) auto minmax(0, 1fr);
      } */
      .section179connectorWrapper {
        flex-direction: row;
        justify-content: center;
      }
    }
  }

  /* TODO: Add each layout's CSS as you work through the designs. */
  &[data-preset="print"] {
    .section179-block-content {
      grid-template-columns: minmax(0, auto) auto minmax(0, 7.4rem);
      gap: 1rem;
      .financeOfferGroup {
        gap: 1rem;
        grid-template-columns: minmax(0, auto) auto minmax(0, auto);
        .financingContent {
          /* gap: 0.5rem; */

          .apr-wrapper {
            .text-type--offerAPR,
            .percentage {
              font-size: 2.5rem;
              letter-spacing: -0.07rem;
            }
            &.apr-length--long {
              .percentage {
                font-size: 1.6rem;
              }
            }
          }
          .term-labels {
            font-size: 1rem;
          }
          :has(.apr-available) {
            .term-labels {
              width: 8.5ch;
            }
          }

          :has(.apr-available.has-down-payment) {
            .term-labels {
              font-size: 0.875rem;
              width: 12.8ch;
            }
          }
          :has(.apr-available.has-months) {
            .term-labels {
              font-size: 0.875rem;
              width: 11.5ch;
            }
          }
          :has(.apr-available.has-months.has-down-payment) {
            .term-labels {
              font-size: 0.7rem;
              width: 18ch;
            }
          }

          :has(.apr-text) {
            height: unset;
            align-content: unset;
            gap: 0.5rem;
          }
          :has(.apr-text.has-months),
          :has(.apr-text.has-down-payment) {
            .term-labels {
              width: 9.1ch;
            }
          }
        }

        .connectorWrapper {
          gap: 0.5rem;
          .text-type--connectorLinesText {
            font-size: 0.8rem;
          }
        }

        .offerOptionContent {
          padding-left: 0.25rem;
          gap: 0.375rem;
          .offerOptionContent-top {
            gap: 0.5rem;
            .text-type--pre-saving-amount {
              font-size: 1rem;
            }
            .text-type--saving-amount {
              font-size: 2.5rem;
              letter-spacing: -0.07rem;
            }
          }
          .offerOptionContent-bottom {
            font-size: 0.75rem;
          }
          &[data-offer-mode="text-only"] {
            gap: 0.5rem;
            .offerOptionContent-top .text-type--pre-saving-amount {
              font-size: 1.75rem;
              line-height: 1;
              letter-spacing: -0.035rem;
            }
          }
        }
      }
    }

    .section179connectorWrapper {
      gap: 0.5rem;
      flex-direction: column;
      .text-type--section179connectorLinesText {
        font-size: 0.75rem;
      }
      .connector-line {
        width: 0.07681rem;
        height: 2.30338rem;
      }
    }
    .section179Content {
      .section179Heading {
        max-width: 16.4ch;
        .text-type--section179-text {
          font-size: 1.5rem;
          letter-spacing: -0.04rem;
        }
      }
      .section179Description {
        .text-type--section179-post-text {
          font-size: 1rem;
        }
      }
    }
  }
  &[data-preset="tractru"] {
    .offerOptionContent[data-offer-mode="text-only"] {
      /* AG: add this layout's headline size/width here; line limits live in the JSON. */
    }
  }
  &[data-preset="web-banner"] {
    .offerOptionContent[data-offer-mode="text-only"] {
      /* AG: add this layout's headline size/width here; line limits live in the JSON. */
    }
  }
  &[data-preset="300x600"] {
    .section179-block-content {
      padding: 1rem;
      gap: 0.375rem;
      width: 100%;
      .financeOfferGroup {
        gap: 0.4855rem;
        .financingContent {
          /* gap: 0.32369rem; */

          .apr-wrapper {
            .text-type--offerAPR,
            .percentage {
              font-size: 1.75rem;
              letter-spacing: -0.035rem;
            }
            &.apr-length--long {
              .percentage {
                font-size: 1.6rem;
              }
            }
          }
          .term-labels {
            font-size: 0.75rem;
          }
          :has(.apr-available) {
            .term-labels {
              width: 8.5ch;
            }
          }

          :has(.apr-available.has-down-payment) {
            .term-labels {
              font-size: 0.875rem;
              width: 12.8ch;
            }
          }
          :has(.apr-available.has-months) {
            .term-labels {
              font-size: 0.875rem;
              width: 11.5ch;
            }
          }
          :has(.apr-available.has-months.has-down-payment) {
            .term-labels {
              font-size: 0.7rem;
              width: 18ch;
            }
          }

          :has(.apr-text) {
            height: unset;
            align-content: unset;
            gap: 0.5rem;
          }
          :has(.apr-text.has-months),
          :has(.apr-text.has-down-payment) {
            .term-labels {
              width: 9.1ch;
            }
          }
        }
        .connectorWrapper {
          padding: 0.28319rem 0.32369rem;
          .text-type--connectorLinesText {
            font-size: 0.5rem;
          }
        }
        .offerOptionContent {
          padding-left: 0.16181rem;
          gap: 0.24275rem;
          .offerOptionContent-top {
            .text-type--pre-saving-amount {
              font-size: 0.75rem;
            }
            .text-type--saving-amount {
              font-size: 1.75rem;
              letter-spacing: -0.07rem;
            }
          }
          .offerOptionContent-bottom {
            font-size: 0.5625rem;
          }
          &[data-offer-mode="text-only"] {
            .offerOptionContent-top {
              .text-type--pre-saving-amount {
                font-size: 1em;
              }
              .text-type--saving-amount {
                display: none;
              }
            }
          }
        }
      }
      .section179connectorWrapper {
        padding-top: 0.125rem;
        gap: 0.5rem;
        .connector-line {
          width: 7.0625rem;
          height: 0.05994rem;
        }
        .text-type--section179connectorLinesText {
          font-size: 0.625rem;
        }
      }
      .section179Content {
        gap: 0.125rem;
        grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
        .section179Heading {
          .text-type--section179-text {
            font-size: 1.375rem;
            letter-spacing: -0.0275rem;
          }
        }
        .section179Description {
          .text-type--section179-post-text {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
  &[data-preset="160x600"] {
    .offerOptionContent[data-offer-mode="text-only"] {
      /* AG: add this layout's headline size/width here; line limits live in the JSON. */
    }
  }
  &[data-preset="300x250"] {
    .offerOptionContent[data-offer-mode="text-only"] {
      /* AG: add this layout's headline size/width here; line limits live in the JSON. */
    }
  }
  &[data-preset="728x90"] {
    .offerOptionContent[data-offer-mode="text-only"] {
      /* AG: add this layout's headline size/width here; line limits live in the JSON. */
    }
  }
`;

const hasContent = (value: unknown) =>
  value != null && String(value).trim() !== "" && value !== "notApplicable";

export const Section179Block = (props: Section179BlockProps) => {
  const { children, className, fallbackContent, dummyData, textSettings } =
    props;
  const preset =
    props.preset &&
    Object.prototype.hasOwnProperty.call(
      section179BlockTextSettings,
      props.preset
    )
      ? props.preset
      : DEFAULT_SECTION179_PRESET;

  // 1. Use the existing fallback helper: null/undefined use starting data;
  // explicit blanks and hide choices remain intact.
  const content = {
    ...defaultSection179BlockFallbackContent,
    ...(fallbackContent ?? dummyData),
  };
  const keys = Object.keys(defaultSection179BlockFallbackContent) as Array<
    keyof Section179BlockFallbackContent
  >;
  const fields = Object.fromEntries(
    keys.map((key) => [
      key,
      {
        ...(props[key] ?? content[key]),
        value: checkInputExists(props[key], content[key]?.value) ?? "",
      },
    ])
  ) as Required<Section179BlockFallbackContent>;

  // 2. Read this dimension's limits; optional prop overrides win.
  const presetSettings: Section179BlockTextSettings =
    section179BlockTextSettings[preset];
  const limits = (key: keyof Section179BlockTextSettings) => {
    const settings = { ...presetSettings[key], ...textSettings?.[key] };
    return {
      lines: settings.lines,
      textfit: settings.textfit ?? false,
      textfitConfig: {
        minFontSize: settings.min ?? 100,
        maxFontSize: settings.max ?? 100,
      },
    };
  };
  // 3. Decide which regions have content. Numeric 0 is valid content.
  const available = fields.aPR.value === "available";
  const aprInput = available ? { ...fields.aPR, value: "0" } : fields.aPR;
  const hasNumericAprGreaterThanZero =
    hasContent(aprInput?.value) &&
    Number.isFinite(Number(aprInput?.value)) &&
    Number(aprInput?.value) > 0;
  const hasFinancing = hasContent(fields.aPR.value);
  const hasMonths = hasContent(fields.paymentMonths.value);
  const hasDownPayment = hasContent(fields.downPayment.value);
  const hasPreText = hasContent(fields.savingAmountPreText.value);
  const hasSavingAmount = hasContent(fields.savingAmount.value);
  const hasSavings = hasPreText || hasSavingAmount;
  const hasDescription = hasContent(fields.savingAmountPostText.value);
  const hasOffer = hasSavings || hasDescription;
  const offerMode = hasSavingAmount
    ? "amount"
    : hasPreText
      ? "text-only"
      : "empty";
  const preTextLimits = limits(
    offerMode === "text-only"
      ? "savingAmountPreTextNoAmount"
      : "savingAmountPreText"
  );
  const hasSection179Text = hasContent(fields.section179Text.value);
  const hasSection179PostText = hasContent(fields.section179PostText.value);
  const hasSection179 = hasSection179Text || hasSection179PostText;
  const termLimits = limits("termLabels");
  // 4. Three outer regions: finance/offer group, Section 179 connector, campaign.
  return (
    <Section179BlockWrapper
      className={`section179Block theme--${fields.backgroundColor.value === "white" ? "white" : "black"} ${className ?? ""}`}
      data-preset={preset}
    >
      <div className="section179-block-content">
        <div className="financeOfferGroup" hidden={!hasFinancing && !hasOffer}>
          {hasFinancing && (
            <div className="financingContent">
              <div
                className={`apr-wrapper apr-length--${
                  hasNumericAprGreaterThanZero ? "long" : "short"
                }`}
              >
                <TextElement
                  destructedProp={aprInput}
                  dynamicClassName="offerAPR"
                  chars={5}
                />
                <span className="percentage">%</span>
              </div>
              <div
                className={`term-labels ${hasMonths ? "has-months" : ""} ${
                  hasDownPayment ? "has-down-payment" : ""
                } ${available ? "apr-available" : "apr-text"} `}
              >
                <Limiter
                  maxLines={termLimits.lines}
                  textfit={termLimits.textfit}
                  textfitConfig={termLimits.textfitConfig}
                >
                  <div className="term-labels-content">
                    <span
                      className={`term-label ${available ? "apr-available" : "apr-text"}`}
                    >
                      {available ? "financing available" : "APR"}
                    </span>
                    {hasMonths && (
                      <>
                        {" "}
                        <span className="payment-months-wrapper">
                          <TextElement
                            inline
                            destructedProp={
                              fields.aprPaymentMonthsConnectorText
                            }
                            dynamicClassName="apr-payment-months-connector"
                            fitOnlyOnOverflow
                            {...limits("aprPaymentMonthsConnectorText")}
                          />{" "}
                          <TextElement
                            inline
                            chars={2}
                            destructedProp={fields.paymentMonths}
                            dynamicClassName="payment-months"
                            fitOnlyOnOverflow
                            {...limits("paymentMonths")}
                          />{" "}
                          months
                        </span>
                      </>
                    )}
                    {hasDownPayment && (
                      <>
                        {" "}
                        <span className="down-payment-wrapper">
                          {"with $"}
                          <TextElement
                            inline
                            chars={6}
                            destructedProp={fields.downPayment}
                            dynamicClassName="down-payment"
                            fitOnlyOnOverflow
                            {...limits("downPayment")}
                          />{" "}
                          down
                        </span>
                      </>
                    )}
                  </div>
                </Limiter>
              </div>
            </div>
          )}
          {hasFinancing &&
            hasOffer &&
            hasContent(fields.connectorLinesText.value) &&
            fields.connectorLinesText.value !== "hide-element" && (
              <div className="connectorWrapper connectorLinesText">
                {fields.connectorLinesText.value !== "hide-text" && (
                  <TextElement
                    destructedProp={fields.connectorLinesText}
                    dynamicClassName="connectorLinesText"
                    chars={20}
                    fitOnlyOnOverflow
                    {...limits("connectorLinesText")}
                  />
                )}
              </div>
            )}
          <div
            className="offerOptionContent"
            data-offer-mode={offerMode}
            hidden={!hasOffer}
          >
            <div className="offerOptionContent-top" hidden={!hasSavings}>
              {hasPreText && (
                <TextElement
                  destructedProp={fields.savingAmountPreText}
                  dynamicClassName="pre-saving-amount"
                  fitOnlyOnOverflow
                  {...preTextLimits}
                />
              )}
              {hasSavingAmount && (
                <TextElement
                  destructedProp={fields.savingAmount}
                  dynamicClassName="saving-amount"
                  chars={6}
                  fitOnlyOnOverflow
                  {...limits("savingAmount")}
                />
              )}
            </div>
            <div className="offerOptionContent-bottom" hidden={!hasDescription}>
              <TextElement
                destructedProp={fields.savingAmountPostText}
                dynamicClassName="post-saving-amount"
                fitOnlyOnOverflow
                {...limits("savingAmountPostText")}
              />
            </div>
          </div>
        </div>
        {(hasFinancing || hasOffer) &&
          hasSection179 &&
          hasContent(fields.section179connectorLinesText.value) &&
          fields.section179connectorLinesText.value !== "hide-element" && (
            <div className="section179connectorWrapper section179connectorLinesText">
              <span className="connector-line" />
              {fields.section179connectorLinesText.value !== "hide-text" && (
                <TextElement
                  destructedProp={fields.section179connectorLinesText}
                  dynamicClassName="section179connectorLinesText"
                  chars={20}
                  fitOnlyOnOverflow
                  {...limits("section179connectorLinesText")}
                />
              )}
              <span className="connector-line" />
            </div>
          )}
        {hasSection179 && (
          <div className="section179Content">
            {hasSection179Text && (
              <div className="section179Heading">
                <TextElement
                  destructedProp={fields.section179Text}
                  dynamicClassName="section179-text"
                  fitOnlyOnOverflow
                  {...limits("section179Text")}
                />
              </div>
            )}
            {hasSection179PostText && (
              <div className="section179Description">
                <TextElement
                  destructedProp={fields.section179PostText}
                  dynamicClassName="section179-post-text"
                  fitOnlyOnOverflow
                  {...limits("section179PostText")}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {children}
    </Section179BlockWrapper>
  );
};
