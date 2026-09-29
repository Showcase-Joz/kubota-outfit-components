import type { ReactNode } from "react";
import { Limiter } from "@outfit.io/react";
import styled from "@emotion/styled";
import { TextElement } from "./offerOptionBlockV2/TextElement.js";
import rawOfferOptionBlockV2TextSettings from "../utils/offerOptionBlockV2TextSettings.json" with { type: "json" };
import { checkInputExists, cloneInlineClick } from "../utils/helpers.js";

// Keep the public declaration self-contained rather than requiring JSON compiler options.
const offerOptionBlockV2TextSettings = rawOfferOptionBlockV2TextSettings;
/**
 * Preset names taken from the JSON keys, e.g. "print" or "160x600".
 * TypeScript tip: `typeof` reads the imported object's type; `keyof` takes its keys.
 */
export type OfferOptionBlockV2Preset =
  keyof typeof offerOptionBlockV2TextSettings;
export const DEFAULT_OFFER_OPTION_V2_PRESET: OfferOptionBlockV2Preset = "print";

export interface OfferOptionBlockV2Props {
  /** Selects the component's layout rules and default text limits. */
  preset?: OfferOptionBlockV2Preset;
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
  fallbackContent?: OfferOptionBlockV2FallbackContent;
  /**
   * Optional starting content supplied by a template, shaped as
   * `{ fieldName: { value: "..." } }`. Missing fields use component defaults;
   * explicit input values (including blanks) take precedence over this content.
   * The component does not import a template's data file or choose its content.
   *
   * @example
   * <OfferOptionBlockV2 preset="160x600" dummyData={data["160x600"]} />
   */
  dummyData?: OfferOptionBlockV2FallbackContent;

  /**
   * This prop allows you to set the behavior fort a specific background and text color for the OfferOptionBlockV2.
   */
  backgroundColor?: OfferOptionBlockV2Field;
  /**
   * APR percentage value. Keep to 5 characters or fewer.
   * Use "available" to render the fallback 0% APR treatment.
   * Can be omitted if not applicable to the offer.
   */
  aPR?: OfferOptionBlockV2Field;
  /**
   * Short connector text between the apr and the payment amount.
   * Recommended max: 1 line.
   * choice options: "up to", "for".
   * Can be omitted if not applicable to the offer.
   */
  aprPaymentMonthsConnectorText?: OfferOptionBlockV2Field;
  /**
   * Payment months (term) value.
   * Maximum: 2 displayed characters, checked by the inline character validator.
   * Can be omitted if not applicable to the offer.
   */
  paymentMonths?: OfferOptionBlockV2Field;
  /**
   * Down payment value.
   * Maximum: 6 displayed characters, including the thousands separator (99,999).
   * The separate currency symbol is not counted.
   * Can be omitted if not applicable to the offer.
   */
  downPayment?: OfferOptionBlockV2Field;
  /**
   * Connector text between the APR/Months and the saving amount.
   * Choice options: "and", "or", "with", "plus", "minus", "for", "to", "from", "at", "in", "on", "over", "under".
   * Can be omitted if not applicable to the offer.
   */
  connectorLinesText?: OfferOptionBlockV2Field;
  /**
   * Short connector text above the saving amount.
   * The line limit comes from the selected preset's text settings.
   * An explicit empty value omits the heading.
   */
  savingAmountPreText?: OfferOptionBlockV2Field;
  /**
   * Overrides the savings heading's line limit (savingAmountPreText).
   * Despite this prop's historical name, it does not limit the numeric amount.
   */
  maxSavingAmountText?: number;
  /**
   * Saving amount.
   * Recommended max: 6 characters.
   * An explicit empty value omits the amount and its currency marker.
   */
  savingAmount?: OfferOptionBlockV2Field;
  /**
   * descriptive text below the saving amount.
   * Recommended max: 2 lines.
   * May remain when the savings heading and amount are omitted.
   */
  savingAmountPostText?: OfferOptionBlockV2Field;

  /**
   * Optional outlier override, merged with the selected preset's text settings.
   * Unspecified settings keep their preset values. min/max are font-size percentages.
   *
   * @example
   * <OfferOptionBlockV2
   *   preset="160x600"
   *   maxSavingAmountPostText={{ lines: 4, min: 75 }}
   * />
   */
  maxSavingAmountPostText?: OfferOptionBlockV2TextLimits;
}

export type OfferOptionBlockV2Field = {
  value: string | number | null;
  /** Outfit inline-edit identifiers, passed through unchanged. */
  ids?: Record<string, unknown>;
};
/**
 * Line-limit and text-fit options passed through to Outfit's Limiter.
 * Font sizes, padding and spacing are authored separately in the component CSS.
 */
export type OfferOptionBlockV2TextLimits = {
  /** Maximum allowed lines; does not insert breaks or truncate the text. */
  lines?: number;
  /** Allows Limiter to resize text to fit; false keeps the authored font size. */
  textfit?: boolean;
  /** Minimum font-size percentage when textfit is enabled, e.g. 66 means 66%. */
  min?: number;
  /** Maximum font-size percentage when textfit is enabled, e.g. 100 means 100%. */
  max?: number;
};

/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type OfferOptionBlockV2FallbackContent = {
  aPR?: OfferOptionBlockV2Field;
  backgroundColor?: OfferOptionBlockV2Field;
  aprPaymentMonthsConnectorText?: OfferOptionBlockV2Field;
  paymentMonths?: OfferOptionBlockV2Field;
  downPayment?: OfferOptionBlockV2Field;
  connectorLinesText?: OfferOptionBlockV2Field;
  savingAmountPreText?: OfferOptionBlockV2Field;
  maxSavingAmountText?: number;
  savingAmount?: OfferOptionBlockV2Field;
  savingAmountPostText?: OfferOptionBlockV2Field;
  maxSavingAmountPostText?: OfferOptionBlockV2TextLimits;
};

// Component-owned defaults. Templates can optionally override them with dummyData.
export const defaultOfferOptionBlockV2FallbackContent: OfferOptionBlockV2FallbackContent =
  {
    aPR: { value: "0.99" },
    backgroundColor: { value: "black" },
    aprPaymentMonthsConnectorText: { value: "up to" },
    paymentMonths: { value: "60" },
    downPayment: { value: "0" },
    connectorLinesText: { value: "or" },
    savingAmountPreText: { value: "Save up to" },
    savingAmount: { value: "2500" },
    savingAmountPostText: {
      value: "on select Kubota BX Series equipment",
    },
  };

// Component-owned styles for the standard and no-savings layouts.
const OfferOptionBlockV2Wrapper = styled.div`
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
    --offer-number-color: var(--color-orange, #ff5000);
  }
  &.has-children {
    grid-template-rows: minmax(0, 1fr) auto;
  }
  .offerOptionChildren {
    min-width: 0;
  }

  /* Print, tractru and leaderboard: finance | connector | offer. */
  .offerOptionBlockWrapper {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "financingOption connectorContent offerOptionContent";
    align-items: center;
  }
  .financingContent {
    grid-area: financingOption;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "apr" "terms";
    align-content: center;

    .term-labels {
      font-weight: 800;
      line-height: 1.1;
    }
  }
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
    grid-area: terms;
    min-width: 0;
  }
  .connectorWrapper {
    grid-area: connectorContent;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr auto 1fr;
    justify-items: center;
    align-self: stretch;

    .text-type--connectorLines {
      font-weight: 700;
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
  .offerOptionContent {
    grid-area: offerOptionContent;
    min-width: 0;
    display: grid;
    grid-template-rows: auto auto;
    align-content: center;
  }
  .offerOptionContent-top {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);

    .text-type--pre-saving-amount {
      font-weight: 900;
    }
    .text-type--saving-amount {
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
        top: -0.85em;
        position: relative;
      }
    }
  }
  .offerOptionContent-bottom {
    min-width: 0;
    /* Set preset font sizes on this wrapper so the text inherits Limiter's fitted size. */
    .text-type--post-saving-amount {
      font-weight: 600;
    }
  }

  /* These presets stack the three main sections, regardless of preview size. */
  &[data-preset="web-banner"],
  &[data-preset="300x600"],
  &[data-preset="160x600"],
  &[data-preset="300x250"] {
    .offerOptionBlockWrapper {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto auto minmax(0, 1fr);
      grid-template-areas: "financingOption" "connectorContent" "offerOptionContent";
      gap: 0.5rem;

      .financingContent {
        .apr-wrapper {
          justify-content: center;
          align-items: center;
        }

        .term-labels {
          text-wrap-style: pretty;
          text-align: center;
          justify-self: center;
        }
      }
    }
    .connectorWrapper {
      grid-template-columns: 1fr auto 1fr;
      grid-template-rows: auto;
      align-items: center;
      align-self: center;
      justify-items: stretch;
      .connector-line {
        width: 100%;
        height: 1px;
      }
      .connector-line:last-child {
        grid-row: 1;
        grid-column: 3;
      }
    }

    .offerOptionContent {
      gap: 0.23013rem;
      .offerOptionContent-top {
        justify-items: center;
        text-align: center;
      }
      .offerOptionContent-bottom {
        justify-items: center;
        text-align: center;
      }
    }
  }
  /* Shared layout when both savings inputs are empty. Preset overrides follow below. */
  &[data-preset] .offerOptionBlockWrapper[data-has-savings="false"] {
    /* Leave the single-section fallbacks in charge if finance or description is empty. */
    &:where([data-has-financing="true"][data-has-offer="true"]) {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto auto;
      grid-template-areas: "financingOption" "offerOptionContent";
      align-content: center;
    }

    .financingContent {
      width: auto;
      justify-self: stretch;
    }

    .offerOptionContent {
      grid-template-rows: auto;
      gap: 0;
      height: auto;
      align-content: center;
      justify-self: stretch;
    }

    .offerOptionContent-bottom {
      width: auto;
    }
  }

  /* APR beside the terms, with the description below both. */
  &[data-preset="print"],
  &[data-preset="tractru"],
  &[data-preset="300x600"],
  &[data-preset="728x90"] {
    .offerOptionBlockWrapper[data-has-savings="false"] .financingContent {
      grid-template-columns: max-content minmax(0, 1fr);
      grid-template-rows: auto;
      grid-template-areas: "apr terms";
      align-items: center;

      .term-labels {
        justify-self: start;
        text-align: left;
      }
    }
  }

  /* APR, terms and description stacked in that order. */
  &[data-preset="web-banner"],
  &[data-preset="160x600"],
  &[data-preset="300x250"] {
    .offerOptionBlockWrapper[data-has-savings="false"] .financingContent {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto auto;
      grid-template-areas: "apr" "terms";
      justify-items: center;

      .term-labels {
        text-align: center;
      }
    }
  }

  &[data-preset="print"] .offerOptionBlockWrapper {
    width: 37.375rem;
    padding: 1.5rem 1rem 1.5rem 2rem;
    gap: 1.25rem;
    grid-template-columns: auto auto minmax(0, auto);
    .financingContent {
      gap: 0.5rem;
      /* width: 34.375rem; */

      .apr-wrapper {
        .text-type--offerAPR,
        .percentage {
          font-size: 3.25rem;
        }
      }
      .term-labels {
        font-size: 1.125rem;
        width: fit-content;
      }

      :has(.apr-text.has-down-payment) {
        .term-labels {
          width: 12ch;
          text-wrap-style: pretty;
        }
      }

      :has(.apr-text.has-months) {
        .term-labels {
          width: 9ch;
        }
      }
      :has(.apr-text.has-down-payment.has-months) {
        .term-labels {
          width: 17ch;
        }
      }
      :has(.apr-available) {
        .term-labels {
          width: 8.5ch;
        }
      }
      :has(.apr-available.has-months),
      :has(.apr-available.has-down-payment),
      :has(.apr-available.has-down-payment.has-months) {
        .term-labels {
          width: 17ch;
        }
      }
    }

    .connectorWrapper {
      gap: 0.61456rem;
      .text-type--connectorLines {
        font-size: 0.93913rem;
        line-height: 1.2;
      }
      .connector-line {
        width: 0.07681rem;
        height: 2.35419rem;
      }
    }

    .offerOptionContent {
      gap: 0.5rem;
      .offerOptionContent-top {
        .text-type--pre-saving-amount {
          font-size: 1.125rem;
          line-height: 1.1;
        }
        .text-type--saving-amount {
          font-size: 3.25rem;
          letter-spacing: -0.065rem;
          line-height: 1.1;
        }
      }
      .offerOptionContent-bottom {
        font-size: 0.875rem;
        line-height: 1.1;
      }
    }

    &[data-has-savings="false"] {
      /* Print overrides for the shared layout without savings. */
    }
  }

  &[data-preset="web-banner"] .offerOptionBlockWrapper {
    padding: 0 3.25rem 0 1rem;
    gap: 0.3rem;
    height: fit-content;
    align-self: center;
    justify-items: center;
    .financingContent {
      gap: 0.49669rem;
      .apr-wrapper {
        .text-type--offerAPR,
        .percentage {
          font-size: 5.625rem;
          line-height: 1.1;
        }
        &.apr-length--long {
          .text-type--offerAPR,
          .percentage {
            font-size: 4rem;
          }
        }
      }
      .term-labels {
        font-size: 1.875rem;
        line-height: 1.1;
        text-align: left;
        text-wrap-style: balance;
      }
      :has(.apr-available) {
        .term-labels {
          width: 8.5ch;
        }
      }
      :has(.apr-available.has-months) {
        .term-labels {
          width: 12ch;
        }
      }
      :has(.apr-available.has-down-payment) {
        .term-labels {
          width: 12.7ch;
          text-wrap-style: pretty;
        }
      }
      :has(.apr-available.has-down-payment.has-months) {
        .term-labels {
          width: 13.5ch;
        }
      }
      :has(.apr-text.has-down-payment.has-months) {
        .term-labels {
          width: 11.5ch;
          text-wrap-style: balance;
        }
      }
      :has(.apr-text.has-months) {
        .term-labels {
          width: 9.2ch;
        }
      }
      :has(.apr-text.has-down-payment) {
        .term-labels {
          width: 11.4ch;
          text-wrap-style: pretty;
        }
      }
    }

    .connectorWrapper {
      height: 3.28875rem;
      gap: 0.99331rem;
      padding-top: 0.253rem;
      .text-type--connectorLines {
        font-size: 1.5625rem;
        line-height: 1.2;
      }
      .connector-line {
        width: 11.10675rem;
        height: 0.12419rem;
      }
    }

    .offerOptionContent {
      gap: 0.9375rem;
      .offerOptionContent-top {
        grid-template-columns: 9ch max-content;
        justify-content: center;
        align-items: center;
        gap: 0.80938rem;
        .text-type--pre-saving-amount {
          font-size: 1.875rem;
          text-align: left;
        }
        .text-type--saving-amount {
          font-size: 5.625rem;
          letter-spacing: -0.1125rem;
        }
      }
      .offerOptionContent-bottom {
        font-size: 1.5625rem;
      }
    }

    &[data-has-savings="false"] {
      /* Web-banner overrides for the shared layout without savings. */
    }
  }

  &[data-preset="tractru"] .offerOptionBlockWrapper {
    min-width: 46.86519rem;
    padding: 1.88088rem 1.25394rem 1.88088rem 2.50781rem;
    gap: 1.56738rem;
    grid-template-columns: auto auto minmax(0, auto);
    .financingContent {
      gap: 0.62694rem;
      .apr-wrapper {
        .text-type--offerAPR,
        .percentage {
          font-size: 4.07525rem;
        }
      }
      .term-labels {
        font-size: 1.41069rem;
      }
      :has(.apr-available) {
        .term-labels {
          width: 8.5ch;
        }
      }
      :has(.apr-available.has-months),
      :has(.apr-available.has-down-payment),
      :has(.apr-available.has-down-payment.has-months) {
        .term-labels {
          width: 17ch;
        }
      }
      :has(.apr-text.has-down-payment) {
        .term-labels {
          width: 12ch;
        }
      }
      :has(.apr-text.has-months.has-down-payment) {
        .term-labels {
          width: 17ch;
        }
      }
    }
    .connectorWrapper {
      gap: 0.77063rem;
      .connector-line {
        width: 0.09631rem;
        height: 2.64431rem;
      }
    }

    .offerOptionContent {
      gap: 0.62694rem;
      .offerOptionContent-top {
        .text-type--pre-saving-amount {
          font-size: 1.41069rem;
          line-height: 1.1;
        }
        .text-type--saving-amount {
          font-size: 4.07525rem;
          line-height: 1.1;
          letter-spacing: -0.0815rem;
        }
      }
      .offerOptionContent-bottom {
        font-size: 1.01881rem;
        text-wrap-style: balance;
      }
    }

    &[data-has-savings="false"] {
      /* Tractru overrides for the shared layout without savings. */
    }
  }
  &[data-preset="728x90"] .offerOptionBlockWrapper {
    padding: 0.684375rem 0.5rem;
    grid-template-columns: minmax(auto, 1fr) auto minmax(0, auto);
    gap: 0.1rem;
    .financingContent {
      gap: 0.2rem;
      padding-left: 0.3rem;
      justify-self: center;
      width: max-content;
      .apr-wrapper {
        .text-type--offerAPR,
        .percentage {
          font-size: 1.5rem;
          line-height: 1.1;
        }
      }
      .term-labels {
        line-height: 1.1;
        font-size: 0.625rem;
        text-wrap-style: pretty;
      }
    }
    :has(.apr-available) {
      .term-labels {
        width: 11ch;
      }
    }
    :has(.apr-available.has-months),
    :has(.apr-available.has-down-payment) {
      &:where([data-has-savings="true"]) {
        grid-template-columns: minmax(auto, 1fr) auto minmax(0, auto);
      }
      .term-labels {
        width: 14ch;
      }
    }

    :has(.apr-available.has-down-payment.has-months) {
      &:where([data-has-savings="true"]) {
        grid-template-columns: minmax(auto, 1fr) auto minmax(0, auto);
      }
      .term-labels {
        width: 17ch;
        font-size: 0.45rem;
      }
    }
    :has(.apr-text) {
      .term-labels {
        width: 9ch;
      }
    }
    :has(.apr-text.has-down-payment.has-months) {
      &:where([data-has-savings="true"]) {
        grid-template-columns: minmax(auto, 1fr) auto minmax(0, auto);
      }
      .term-labels {
        width: 11.2ch;
        text-wrap-style: balance;
      }
    }

    .connectorWrapper {
      padding-bottom: 0.125rem;
      gap: 0.30681rem;
      .text-type--connectorLines {
        font-size: 0.5rem;
        line-height: 1.2;
      }
      .connector-line {
        width: 0.04281rem;
        height: 1.40756rem;
      }
    }

    .offerOptionContent {
      height: 100%;
      align-content: space-around;
      padding-left: 0.3rem;
      .offerOptionContent-top {
        .text-type--pre-saving-amount {
          font-size: 0.625rem;
          line-height: 1.1;
          font-weight: 800;
        }
        .text-type--saving-amount {
          font-size: 1.5rem;
        }
      }
      .offerOptionContent-bottom {
        font-size: 0.5625rem;
        .text-type--post-saving-amount {
          line-height: 1.2;
        }
      }
    }

    &[data-has-savings="false"] {
      gap: 0.5rem;
      .financingContent {
        :has(.apr-text.has-down-payment.has-months) {
          .term-labels {
            width: 17ch;
          }
        }
      }
    }
  }

  /* Wide finance rows place the term phrase beside the APR. */
  &[data-preset="web-banner"],
  &[data-preset="300x600"] {
    .financingContent {
      grid-template-columns: max-content minmax(0, 1fr);
      grid-template-areas: "apr terms";
      align-items: center;
    }
  }

  /* Both digital layouts use the same term size. */
  &[data-preset="300x600"],
  &[data-preset="160x600"] {
    .term-labels {
      font-size: 0.6875rem;
    }
  }
  &[data-preset="web-banner"] .offerOptionBlockWrapper {
    padding: 0 3.25rem 0 1rem;
    gap: 0.3rem;
  }

  &[data-preset="300x250"] .offerOptionBlockWrapper {
    padding: 0.75rem 0.5rem 1rem 0.5rem;

    .financingContent {
      gap: 0.2rem;
      .apr-wrapper {
        .text-type--offerAPR,
        .percentage {
          font-size: 1.75rem;
        }
      }
      .term-labels {
        line-height: 1.1;
        font-size: 0.6875rem;
      }
    }

    .connectorWrapper {
      padding-bottom: 0.125rem;
      gap: 0.30681rem;
      .text-type--connectorLines {
        font-size: 0.5625rem;
        line-height: 1.2;
      }
      .connector-line {
        width: 3.28694rem;
        height: 0.03838rem;
      }
    }

    .offerOptionContent {
      .offerOptionContent-top {
        .text-type--pre-saving-amount {
          font-size: 0.6875rem;
          line-height: 1.1;
        }
        .text-type--saving-amount {
          font-size: 1.7rem;
          line-height: 1.1;
        }
      }
      .offerOptionContent-bottom {
        font-size: 0.5625rem;
        .text-type--post-saving-amount {
          line-height: 1.1;
        }
      }
    }
    &[data-has-savings="false"] {
      gap: 0.625rem;
    }
  }
  &[data-preset="300x600"] .offerOptionBlockWrapper {
    padding: 1rem 2rem 1.25rem 2rem;
    gap: 0;
    grid-template-rows: auto minmax(0, 1fr) auto;

    .financingContent {
      grid-template-columns: max-content 1fr;
      justify-content: center;
      align-items: end;
      gap: 0.23969rem;

      .apr-wrapper {
        line-height: 1.1;
        .text-type--offerAPR,
        .percentage {
          font-size: 2.25rem;
          letter-spacing: -0.045rem;
        }
      }
      :has(.apr-available) {
        justify-self: center;
        .term-labels {
          font-size: 0.875rem;
          width: 9ch;
        }
      }
      .term-labels {
        text-align: left;
        justify-self: stretch;
        align-self: inherit;
      }
    }
    .connectorWrapper {
      align-self: stretch;
      padding-top: 0.12213rem;
      gap: 0.47944rem;
      .text-type--connectorLines {
        font-size: 0.7025rem;
        line-height: 1.2;
      }
      .connector-line {
        height: 0.06rem;
      }
    }
    .offerOptionContent {
      gap: 0.35956rem;
      justify-self: center;
      width: 100%;
    }

    .offerOptionContent-top {
      grid-template-columns: max-content max-content;
      justify-content: center;
      align-items: center;
      gap: 0.39063rem;

      .text-type--pre-saving-amount {
        max-width: 2.75rem;
        font-size: 0.875rem;
        line-height: 1.1;
        text-align: left;
      }
      .text-type--saving-amount {
        font-size: 2.25rem;
        line-height: 1.1;
        letter-spacing: -0.045rem;
        &::after {
          font-size: 0.80625rem;
          top: -1rem;
        }
      }
    }
    .offerOptionContent-bottom {
      width: min-content;
      min-width: 100%;
      font-size: 0.625rem;
      .text-type--post-saving-amount {
        line-height: 1.1;
        text-wrap-style: balance;
      }
    }

    &:where([data-has-savings="true"]) {
      .financingContent {
        :has(.apr-text) {
          grid-template-columns: max-content 37%;
        }
        :has(.apr-available) {
          grid-template-columns: max-content 28%;
          align-self: center;
        }
        :has(.apr-available.has-months),
        :has(.apr-available.has-down-payment) {
          grid-template-columns: max-content 55%;
        }
      }
    }

    &[data-has-savings="false"] {
      gap: 0.625rem;
    }
  }
  &[data-preset="160x600"] .offerOptionBlockWrapper {
    padding: 0.75rem 1rem 1rem;
    gap: 0.25rem;
    .financingContent {
      gap: 0.25rem;
      .apr-wrapper {
        .text-type--offerAPR,
        .percentage {
          font-size: 1.75rem;
        }
      }
      .term-labels {
        padding-bottom: 0.23013rem;
      }
    }
    .connectorWrapper {
      padding-bottom: 0.125rem;
      gap: 0.30681rem;
      .text-type--connectorLines {
        font-size: 0.5625rem;
        line-height: 1.2;
      }
      .connector-line {
        width: 3.28694rem;
        height: 0.03838rem;
      }
    }

    .offerOptionContent {
      .offerOptionContent-top {
        .text-type--pre-saving-amount {
          font-size: 0.6875rem;
          line-height: 1.1;
        }
        .text-type--saving-amount {
          font-size: 1.7rem;
          line-height: 1.1;
        }
      }
      .offerOptionContent-bottom {
        font-size: 0.5625rem;
        .text-type--post-saving-amount {
          line-height: 1.1;
        }
      }
    }
    &[data-has-savings="false"] {
      gap: 0.625rem;
    }
  }

  /* Completely empty sections collapse; a description alone still counts as offer content. */
  .offerOptionBlockWrapper[data-has-financing="false"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "offerOptionContent";
  }
  .offerOptionBlockWrapper[data-has-offer="false"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "financingOption";
  }
  [hidden] {
    display: none;
  }
`;

/**
 * Describes the text settings for ONE preset; it does not create runtime values.
 * Edit ../utils/offerOptionBlockV2TextSettings.json to change the actual settings.
 * Keep visual measurements (font size, padding and spacing) in the component CSS.
 *
 * TypeScript tips:
 * - `typeof offerOptionBlockV2TextSettings` reads the imported JSON's type.
 * - `[OfferOptionBlockV2Preset]` takes the value types under the allowed preset keys.
 * - `&` combines that structure with the additional property below.
 * - `termLabels?` allows that property to be absent; it supplies no default values.
 *
 * Add a termLabels entry inside a preset once its design has been checked.
 * Its settings apply to the whole phrase (e.g. "APR up to 60 months with $0 down")
 * through one shared Limiter, rather than separately to each inline fragment.
 * Without an entry, term text-fit is off and there is no configured line limit,
 * unless maxTermLabelsText supplies one.
 *
 * @example
 * // Optional entry alongside savingAmountPreText and savingAmountPostText:
 * "termLabels": { "lines": 3, "textfit": false }
 */
export type OfferOptionBlockV2TextSettings =
  (typeof offerOptionBlockV2TextSettings)[OfferOptionBlockV2Preset] & {
    /** Shared finance-phrase settings: lines, textfit, min and max. */
    termLabels?: OfferOptionBlockV2TextLimits;
  };

const hasContent = (value: unknown) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== "" &&
  value !== "notApplicable";

const OfferOptionBlockV2 = ({
  preset = DEFAULT_OFFER_OPTION_V2_PRESET,
  children,
  fallbackContent,
  dummyData,
  backgroundColor,
  aPR,
  aprPaymentMonthsConnectorText,
  paymentMonths,
  downPayment,
  connectorLinesText,
  savingAmountPreText,
  maxSavingAmountText,
  savingAmount,
  savingAmountPostText,
  maxSavingAmountPostText,
  maxTermLabelsText,
}: OfferOptionBlockV2Props) => {
  const activePreset = Object.prototype.hasOwnProperty.call(
    offerOptionBlockV2TextSettings,
    preset,
  )
    ? preset
    : DEFAULT_OFFER_OPTION_V2_PRESET;
  const content = {
    ...defaultOfferOptionBlockV2FallbackContent,
    ...(fallbackContent ?? dummyData),
  };
  /**
   * Actual JSON settings selected by preset, e.g. the "160x600" object.
   * The `: OfferOptionBlockV2TextSettings` annotation checks its shape without changing it.
   * In JSX below, `?.` safely reads optional settings and `??` supplies a fallback
   * only for null/undefined, preserving deliberate values such as textfit: false.
   */
  const textSettings: OfferOptionBlockV2TextSettings =
    offerOptionBlockV2TextSettings[activePreset];
  /**
   * Combine optional description overrides; direct props win over fallbackContent.
   * The JSX below falls back to the preset JSON for each unspecified setting.
   */
  const postTextOverride = {
    ...content.maxSavingAmountPostText,
    ...maxSavingAmountPostText,
  };
  const theme =
    checkInputExists(backgroundColor, content.backgroundColor?.value) ===
    "white"
      ? "white"
      : "black";
  const aprValue = checkInputExists(aPR, content.aPR?.value);
  const available = aprValue === "available";
  const aprInput = aPR ?? content.aPR;
  const checkedAprInput = available
    ? cloneInlineClick(aprInput ?? {}, { value: "0" })
    : aprInput;
  const hasNumericAprGreaterThanZero =
    hasContent(aprValue) &&
    Number.isFinite(Number(aprValue)) &&
    Number(aprValue) > 0;
  const hasFinancing = hasContent(aprValue);
  const hasMonths = hasContent(
    checkInputExists(paymentMonths, content.paymentMonths?.value),
  );
  const hasDownPayment = hasContent(
    checkInputExists(downPayment, content.downPayment?.value),
  );
  const hasPreText = hasContent(
    checkInputExists(savingAmountPreText, content.savingAmountPreText?.value),
  );
  const hasSavingAmount = hasContent(
    checkInputExists(savingAmount, content.savingAmount?.value),
  );
  const hasDescription = hasContent(
    checkInputExists(savingAmountPostText, content.savingAmountPostText?.value),
  );
  /** Savings heading or amount. A description alone does not count as savings. */
  const hasSavings = hasPreText || hasSavingAmount;
  /** Any content in the offer section, including a description without savings. */
  const hasOfferContent = hasSavings || hasDescription;
  const connectorValue = checkInputExists(
    connectorLinesText,
    content.connectorLinesText?.value,
  );
  const hasConnector =
    hasFinancing &&
    hasSavings &&
    hasContent(connectorValue) &&
    connectorValue !== "hide-element";
  const connectorTextOnlyHidden = connectorValue === "hide-text";
  return (
    <OfferOptionBlockV2Wrapper
      data-preset={activePreset}
      className={`offerOptionBlockV2 ${
        children ? "has-children" : ""
      } theme--${theme}`}
    >
      <div
        className="offerOptionBlockWrapper"
        data-has-financing={hasFinancing}
        data-has-offer={hasOfferContent}
        data-has-savings={hasSavings}
      >
        <div className="financingContent" hidden={!hasFinancing}>
          <div
            className={`apr-wrapper apr-length--${
              hasNumericAprGreaterThanZero ? "long" : "short"
            }`}
          >
            <TextElement
              dummyData={content.aPR?.value ?? "0"}
              destructedProp={checkedAprInput}
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
              maxLines={maxTermLabelsText ?? textSettings.termLabels?.lines}
              textfit={textSettings.termLabels?.textfit ?? false}
              textfitConfig={{
                minFontSize: textSettings.termLabels?.min,
                maxFontSize: textSettings.termLabels?.max,
              }}
            >
              <div className="term-labels-content">
                <span
                  className={`term-label ${
                    available ? "apr-available" : "apr-text"
                  }`}
                >
                  {available ? "financing available" : "APR"}
                </span>
                {hasMonths && (
                  <>
                    {" "}
                    <span className="payment-months-wrapper">
                      <TextElement
                        inline
                        dummyData={
                          content.aprPaymentMonthsConnectorText?.value ?? ""
                        }
                        destructedProp={aprPaymentMonthsConnectorText}
                        dynamicClassName="apr-payment-months-connector"
                      />{" "}
                      <TextElement
                        inline
                        chars={2}
                        dummyData={content.paymentMonths?.value ?? ""}
                        destructedProp={paymentMonths}
                        dynamicClassName="payment-months"
                      />{" "}
                      {preset === "728x90" && hasSavings ? "mos" : "months"}
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
                        dummyData={content.downPayment?.value ?? ""}
                        destructedProp={downPayment}
                        dynamicClassName="down-payment"
                      />{" "}
                      down
                    </span>
                  </>
                )}
              </div>
            </Limiter>
          </div>
        </div>
        <div className="connectorWrapper" hidden={!hasConnector}>
          <span className="connector-line" />
          {!connectorTextOnlyHidden && (
            <TextElement
              dummyData={content.connectorLinesText?.value ?? ""}
              destructedProp={connectorLinesText}
              dynamicClassName="connectorLines"
              chars={20}
            />
          )}
          <span className="connector-line" />
        </div>
        <div className="offerOptionContent" hidden={!hasOfferContent}>
          <div className="offerOptionContent-top" hidden={!hasSavings}>
            {hasPreText && (
              <TextElement
                dummyData={content.savingAmountPreText?.value ?? ""}
                destructedProp={savingAmountPreText}
                dynamicClassName="pre-saving-amount"
                lines={
                  maxSavingAmountText ??
                  content.maxSavingAmountText ??
                  textSettings.savingAmountPreText.lines
                }
              />
            )}
            {hasSavingAmount && (
              <TextElement
                dummyData={content.savingAmount?.value ?? ""}
                destructedProp={savingAmount}
                dynamicClassName="saving-amount"
                chars={6}
              />
            )}
          </div>
          <div className="offerOptionContent-bottom" hidden={!hasDescription}>
            <TextElement
              dummyData={content.savingAmountPostText?.value ?? ""}
              destructedProp={savingAmountPostText}
              dynamicClassName="post-saving-amount"
              lines={
                postTextOverride.lines ??
                textSettings.savingAmountPostText.lines
              }
              textfit={
                postTextOverride.textfit ??
                textSettings.savingAmountPostText.textfit
              }
              textfitConfig={{
                minFontSize:
                  postTextOverride.min ?? textSettings.savingAmountPostText.min,
                maxFontSize:
                  postTextOverride.max ?? textSettings.savingAmountPostText.max,
              }}
            />
          </div>
        </div>
      </div>
      {children && <div className="offerOptionChildren">{children}</div>}
    </OfferOptionBlockV2Wrapper>
  );
};

export { OfferOptionBlockV2, offerOptionBlockV2TextSettings };
