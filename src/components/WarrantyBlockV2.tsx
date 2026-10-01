import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { Limiter } from "@outfit.io/react";
import { TextElement } from "./sharedV2/TextElement.js";
import rawTextSettings from "../utils/warrantyBlockV2TextSettings.json" with { type: "json" };

export type WarrantyBlockV2Preset = keyof typeof rawTextSettings;
export const DEFAULT_WARRANTY_V2_PRESET: WarrantyBlockV2Preset = "300x600";

export type WarrantyBlockV2Field = {
  value: string | number | null;
  ids?: Record<string, unknown>;
};

export type WarrantyBlockV2ServiceType =
  "orange-protection" | "k-maintenance" | "hide";

/** Choice values stay stable; this map owns the displayed service copy. */
export const warrantyBlockV2ServiceTypes = {
  "orange-protection": "Orange Protection Extended Warranty",
  "k-maintenance": "K-MAINTENANCE Service on Us",
  hide: "",
} as const;

export type WarrantyBlockV2TextLimits = {
  /** Warns about overflow; does not truncate the input. */
  lines?: number;
  /** Off for the skeleton. Font sizes and spacing belong in the CSS below. */
  textfit?: boolean;
  /** Percentages of the authored font size, when textfit is enabled. */
  min?: number;
  max?: number;
};

export type WarrantyBlockV2TextSettings = Partial<
  Record<
    | "termLabels"
    | "savingAmountPreText"
    | "savingAmountPostText"
    | "discountText"
    | "serviceType",
    WarrantyBlockV2TextLimits
  >
> & {
  warrantyText?: WarrantyBlockV2TextLimits & {
    /** Merged over the base limits when service type is hidden or empty. */
    withoutServiceType?: WarrantyBlockV2TextLimits;
  };
};

export const warrantyBlockV2TextSettings: Record<
  WarrantyBlockV2Preset,
  WarrantyBlockV2TextSettings
> = rawTextSettings;

/** The same { value, ids? } shape as Outfit inputs; defaults remain component-owned. */
export interface WarrantyBlockV2FallbackContent {
  backgroundColor?: WarrantyBlockV2Field;
  /** "available" is the approved first-rollout finance treatment. */
  aPR?: WarrantyBlockV2Field;
  aprPaymentMonthsConnectorText?: WarrantyBlockV2Field;
  paymentMonths?: WarrantyBlockV2Field;
  downPayment?: WarrantyBlockV2Field;
  /** Visible only when both this text and savingAmount are populated. No automatic "or". */
  savingAmountPreText?: WarrantyBlockV2Field;
  /** A supplied amount, including 0, wins over discountText. Clear it to show discountText. */
  savingAmount?: WarrantyBlockV2Field;
  /** Free text replacing the heading/amount together when savingAmount is empty. */
  discountText?: WarrantyBlockV2Field;
  /** Shared offer description; can remain when amount and discount text are both empty. */
  savingAmountPostText?: WarrantyBlockV2Field;
  /** Joins the offer region to the warranty/service region. Supports hide-text / hide-element. */
  connectorLinesText?: WarrantyBlockV2Field;
  /** Large plain-text heading, e.g. "2-Year". Text-fit is off initially. */
  warrantyText?: WarrantyBlockV2Field;
  /** "orange-protection", "k-maintenance", or "hide". Hiding releases its grid space. */
  serviceType?: WarrantyBlockV2Field;
}

export interface WarrantyBlockV2Props extends WarrantyBlockV2FallbackContent {
  preset?: WarrantyBlockV2Preset;
  children?: ReactNode;
  /** Optional template starting values; explicit fields (including blanks) take precedence. */
  dummyData?: WarrantyBlockV2FallbackContent;
  /** Alternative to dummyData; takes precedence when both are supplied. */
  fallbackContent?: WarrantyBlockV2FallbackContent;
  /** Per-field outlier overrides, applied after the preset's base and visibility settings.
   * A warrantyText.withoutServiceType override applies last when service type is absent.
   * @example textSettings={{ savingAmountPostText: { lines: 3, textfit: false } }}
   */
  textSettings?: WarrantyBlockV2TextSettings;
}

export const defaultWarrantyBlockV2FallbackContent: Required<WarrantyBlockV2FallbackContent> =
  {
    backgroundColor: { value: "black" },
    aPR: { value: "available" },
    aprPaymentMonthsConnectorText: { value: "up to" },
    paymentMonths: { value: "notApplicable" },
    downPayment: { value: "" },
    savingAmountPreText: { value: "or save up to" },
    savingAmount: { value: "3000" },
    discountText: { value: "or instant cash discount" },
    savingAmountPostText: { value: "on select Kubota L02 Series equipment" },
    connectorLinesText: { value: "plus" },
    warrantyText: { value: "2-Year" },
    serviceType: { value: "k-maintenance" },
  };

// Structural baseline. These simple shared sizes/gaps are working values,
// ready for the design pass. Keep shared rules here and measured overrides below.
const WarrantyBlockV2Wrapper = styled.div`
  --offer-background: var(--color-black, #000);
  --offer-foreground: var(--color-white, #fff);
  --offer-number-color: var(--offer-foreground);
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  background: var(--offer-background);
  color: var(--offer-foreground);
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
  font-size: 0.625rem;
  line-height: 1.1;
  text-transform: uppercase;

  &,
  * {
    box-sizing: border-box;
  }
  [hidden] {
    display: none !important;
  }
  &.theme--white {
    --offer-background: var(--color-white, #fff);
    --offer-foreground: var(--color-black, #000);
    --offer-number-color: var(--color-orange, #dc4405);
  }
  &.has-children {
    grid-template-rows: minmax(0, 1fr) auto;
  }

  /* Let these grid/flex regions shrink within the component box. */
  .warrantyChildren,
  .warrantyBlockWrapper,
  .warrantyOfferContent,
  .financingContent,
  .term-labels,
  .offerContent,
  .offerValue,
  .offerDescription,
  .savingContent,
  .warrantyContent,
  .warrantyHeading,
  .serviceType {
    min-width: 0;
  }

  /* Print, Tractru and leaderboard: offer | connector | warranty/service. */
  .warrantyBlockWrapper {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    grid-template-areas: "offer connector warranty";
    gap: 0.5rem;
    align-items: center;
    min-height: 0;
    padding: 0.5rem;
    &[data-has-connector="false"] {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-areas: "offer warranty";
    }
    &[data-has-offer-section="false"] {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: "warranty";
    }
    &[data-has-warranty="false"] {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: "offer";
    }
  }
  .warrantyOfferContent {
    grid-area: offer;
    display: grid;
    gap: 0.25rem;
  }
  .financingContent {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.25rem;
    width: fit-content;
    justify-self: center;
  }
  .apr-wrapper,
  .text-type--saving-amount,
  .warrantyHeading {
    font-size: 1.5rem;
  }
  .apr-wrapper {
    display: flex;
    align-items: baseline;
  }
  .apr-wrapper,
  .text-type--saving-amount,
  .text-type--warranty-text,
  .text-type--discount-text {
    color: var(--offer-number-color);
    font-family: var(
      --font-family-arial-black-default,
      "Arial Black",
      Arial,
      sans-serif
    );
    font-weight: 900;
  }
  .term-labels,
  .serviceType {
    font-weight: 800;
  }
  .offerContent {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
  .savingContent {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .text-type--pre-saving-amount {
    font-weight: 900;
  }
  .text-type--discount-text {
    font-size: 0.875rem;
    white-space: pre-line;
  }
  .text-type--saving-amount {
    white-space: nowrap;
    &::before {
      content: "$";
    }
    &::after {
      content: "*";
      font-size: 0.425rem;
      vertical-align: top;
    }
  }
  .offerDescription {
    font-weight: 600;
    .text-type--post-saving-amount {
      text-wrap-style: balance;
      text-align: start;
    }
  }
  .connectorWrapper {
    grid-area: connector;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
    gap: 0.25rem;
    font-size: 0.5rem;
    font-weight: 700;
  }
  .text-type--connectorLines {
    line-height: 1.2;
  }
  .connector-line {
    flex: 1;
    width: 1px;
    background: var(--color-orange, #dc4405);
  }
  .warrantyContent {
    grid-area: warranty;
    display: grid;
    align-content: center;
    gap: 0.25rem;
    .serviceType {
      .text-type--service-type {
        text-wrap-style: balance;
      }
    }
  }
  .text-type--warranty-text {
    white-space: pre-line;
  }

  /* Digital overlay keeps the feature image visible through the background. */
  &[data-preset="300x600"],
  &[data-preset="160x600"],
  &[data-preset="300x250"],
  &[data-preset="728x90"] {
    background: color-mix(in srgb, var(--offer-background) 80%, transparent);
  }

  /* Vertical content flow; finance orientation is specified separately below. */
  &[data-preset="web-banner"],
  &[data-preset="300x600"],
  &[data-preset="160x600"],
  &[data-preset="300x250"] {
    .warrantyBlockWrapper {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: "offer" "connector" "warranty";
      align-content: center;
      &[data-has-connector="false"] {
        grid-template-areas: "offer" "warranty";
      }
      &[data-has-offer-section="false"] {
        grid-template-areas: "warranty";
      }
      &[data-has-warranty="false"] {
        grid-template-areas: "offer";
      }
    }
    .connectorWrapper {
      flex-direction: row;
    }
    .connector-line {
      width: auto;
      height: 1px;
    }
    .warrantyContent {
      text-align: center;
    }
  }

  /* These finance rows stay stacked in BOTH savings and discount modes. */
  &[data-preset="160x600"],
  &[data-preset="300x250"] {
    .warrantyBlockWrapper {
      grid-template-rows: auto 1fr auto;
      .financingContent {
        grid-template-columns: minmax(0, 1fr);
        justify-items: center;
        text-align: center;

        .term-labels {
          justify-self: center;
        }
      }
      .savingContent {
        flex-direction: column;
      }
      .offerContent {
        text-align: center;
      }
    }
  }
  /* Discount replaces the heading/amount, while description remains independent. */
  &[data-offer-mode="discount"] {
    .financingContent {
      .term-labels {
        text-align: center;
      }
      :has(.apr-available) {
        .term-labels {
          width: 9ch;
        }
      }
    }
  }

  /* Shared preset values first, then the differences between offer modes. */
  &[data-preset="300x600"] {
    .warrantyBlockWrapper {
      padding: 16px 32px;
    }

    /* Finance sizing and description type are common to both populated modes. */
    &[data-offer-mode="savings"],
    &[data-offer-mode="discount"] {
      .warrantyOfferContent {
        .financingContent {
          gap: 0.3125rem;
          .apr-wrapper {
            .text-type--offerAPR,
            .percentage {
              font-size: 1.8125rem;
            }
          }
          .term-labels {
            font-size: 0.75rem;
          }
          :has(.apr-available.has-months),
          :has(.apr-available.has-down-payment) {
            .term-labels {
              width: 17ch;
              text-align: start;
            }
          }
          :has(.apr-available.has-months.has-down-payment) {
            .term-labels {
              width: 24ch;
            }
          }
          :has(.apr-text) {
            .term-labels {
              width: fit-content;
            }
          }
          :has(.apr-text.has-months) {
            .term-labels {
              width: 10.2ch;
              text-align: start;
            }
          }
          :has(.apr-text.has-down-payment) {
            .term-labels {
              width: 11.5ch;
              text-align: start;
            }
          }
          :has(.apr-text.has-months.has-down-payment) {
            .term-labels {
              width: 17ch;
            }
          }
        }
        .offerContent {
          text-align: center;
        }
        .offerDescription {
          font-size: 0.66rem;
        }
      }
    }

    /* Savings sit beside the description; finance starts at the left edge. */
    &[data-offer-mode="savings"] .warrantyOfferContent {
      .financingContent {
        justify-self: start;
      }
      .offerContent {
        grid-template-columns: max-content minmax(0, 1fr);
        align-items: end;
        &[data-has-description="false"] {
          grid-template-columns: minmax(0, 1fr);
        }
        .text-type--pre-saving-amount {
          font-size: 0.75rem;
        }
        .text-type--saving-amount {
          letter-spacing: -0.03625rem;
          font-size: 1.8125rem;
        }
        .offerDescription {
          padding-bottom: 0.1875rem;
        }
      }
    }

    /* Discount keeps its centered finance exception and tighter lettering. */
    &[data-offer-mode="discount"] .warrantyOfferContent {
      .financingContent:has(.apr-available.has-months.has-down-payment) {
        .term-labels {
          text-align: center;
        }
      }
      .offerContent .text-type--discount-text {
        letter-spacing: -0.02rem;
        font-size: 1rem;
      }
    }

    .savingContent {
      flex-direction: column;
      align-items: start;
    }
    .connectorWrapper {
      gap: 0.47944rem;
      .connector-line {
        width: 6.08306rem;
        height: 0.05994rem;
      }
      .text-type--connectorLines {
        font-size: 0.625rem;
      }
    }
    .warrantyContent {
      grid-template-columns: max-content minmax(0, 1fr);
      align-items: center;
      text-align: left;
      gap: 0.3rem;
      .warrantyHeading {
        .text-type--warranty-text {
          font-size: 1.812rem;
          letter-spacing: -0.03625rem;
        }
      }
      .serviceType {
        .text-type--service-type {
          font-size: 0.625rem;
        }
      }
      &[data-has-service-type="false"],
      &[data-has-warranty-text="false"] {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  }
  &[data-preset="160x600"] {
    .warrantyBlockWrapper {
      padding: 0.75rem 1rem 1rem 1rem;
      gap: 0.3125rem;
    }
    /* Finance sizing and description type are common to both populated modes. */
    &[data-offer-mode="savings"],
    &[data-offer-mode="discount"] {
      .warrantyOfferContent {
        gap: 0.3125rem;
        .financingContent {
          gap: 0.125rem;
          .apr-wrapper {
            .text-type--offerAPR,
            .percentage {
              font-size: 1.375rem;
              letter-spacing: -0.0275rem;
            }
          }
          .term-labels {
            font-size: 0.5rem;
          }
          :has(.apr-available.has-months),
          :has(.apr-available.has-down-payment) {
            .term-labels {
              width: 17ch;
            }
          }
          :has(.apr-available.has-months.has-down-payment) {
            .term-labels {
              width: 24ch;
            }
          }
          :has(.apr-text) {
            .term-labels {
              width: fit-content;
            }
          }
          :has(.apr-text.has-months) {
            .term-labels {
              width: 10.2ch;
            }
          }
          :has(.apr-text.has-down-payment) {
            .term-labels {
              width: 11.5ch;
            }
          }
          :has(.apr-text.has-months.has-down-payment) {
            .term-labels {
              width: 17ch;
            }
          }
        }
        .offerContent {
          text-align: center;
          .offerValue {
            .savingContent {
              gap: unset;
              .text-type--pre-saving-amount {
                font-size: 0.6875rem;
              }
              .text-type--saving-amount {
                font-size: 1.375rem;
                letter-spacing: -0.0275rem;
              }
            }
          }
        }
        .offerDescription {
          font-size: 0.5rem;
          .text-type--post-saving-amount {
            text-align: center;
          }
        }
      }
    }

    &[data-offer-mode="discount"] .warrantyBlockWrapper {
      grid-template-rows: auto max-content auto;
      .warrantyOfferContent {
        .financingContent {
          grid-template-columns: minmax(0, 1fr) auto;
          :has(.apr-text.has-months.has-down-payment),
          :has(.apr-available.has-down-payment),
          :has(.apr-available.has-months) {
            gap: 0.3125rem;
          }
          .term-labels {
            text-align: start;
          }

          :has(.apr-length--long + .apr-text.has-months.has-down-payment),
          :has(.apr-length--long + .apr-text.has-down-payment),
          :has(.apr-length--long + .apr-text.has-months),
          :has(
            .apr-length--short + .apr-available.has-months.has-down-payment
          ) {
            grid-template-columns: minmax(0, 1fr);
            gap: 0.125rem;
            .term-labels {
              text-align: center;
            }
          }
        }

        .offerContent {
          .offerValue {
            .text-type--discount-text {
              font-size: 0.9rem;
              letter-spacing: -0.0275rem;
              justify-self: center;
              width: 9.5rem;
            }
          }
        }
        .offerDescription {
          .text-type--post-saving-amount {
            text-wrap-style: pretty;
          }
        }
      }
    }
    .connectorWrapper {
      gap: 0.3125rem;
      padding-top: 0.125rem;
      .connector-line {
        width: 2.9375rem;
        height: 0.03838rem;
      }
      .text-type--connectorLines {
        font-size: 0.5625rem;
      }
    }

    .warrantyContent {
      gap: 0.0625rem;
      .warrantyHeading {
        .text-type--warranty-text {
          font-size: 1.375rem;
          letter-spacing: -0.0275rem;
        }
      }
      .serviceType {
        .text-type--service-type {
          font-size: 0.5625rem;
        }
      }
    }
  }
  &[data-preset="300x250"] {
    .warrantyBlockWrapper {
      padding: 0.75rem 0.5rem 1rem 0.5rem;
      gap: 0.3rem;
    } /* Finance sizing and description type are common to both populated modes. */
    &[data-offer-mode="savings"],
    &[data-offer-mode="discount"] {
      .warrantyOfferContent {
        gap: 0.5rem;
        .financingContent {
          gap: 0.125rem;
          .apr-wrapper {
            .text-type--offerAPR,
            .percentage {
              font-size: 1.375rem;
              letter-spacing: -0.0275rem;
            }
          }
          .term-labels {
            font-size: 0.45rem;
          }
          :has(.apr-available.has-months),
          :has(.apr-available.has-down-payment) {
            .term-labels {
              width: 17ch;
            }
          }
          :has(.apr-available.has-months.has-down-payment) {
            .term-labels {
              width: 24ch;
            }
          }
          :has(.apr-text) {
            .term-labels {
              width: fit-content;
            }
          }
          :has(.apr-text.has-months) {
            .term-labels {
              width: 10.2ch;
            }
          }
          :has(.apr-text.has-down-payment) {
            .term-labels {
              width: 11.5ch;
            }
          }
          :has(.apr-text.has-months.has-down-payment) {
            .term-labels {
              width: 17ch;
            }
          }
        }
        .offerContent {
          text-align: center;
          .offerValue {
            .savingContent {
              gap: unset;
              .text-type--pre-saving-amount {
                font-size: 0.6275rem;
              }
              .text-type--saving-amount {
                font-size: 1.25rem;
              }
            }
          }
        }
        .offerDescription {
          font-size: 0.45rem;
          .text-type--post-saving-amount {
            text-align: center;
          }
        }
      }

      .connectorWrapper {
        gap: 0.3125rem;
        padding-top: 0.125rem;
        .connector-line {
          width: 2.9375rem;
          height: 0.03838rem;
        }
        .text-type--connectorLines {
          font-size: 0.5625rem;
        }
      }
      .warrantyContent {
        gap: 0.0625rem;
        .warrantyHeading {
          .text-type--warranty-text {
            font-size: 1.25rem;
            letter-spacing: -0.0275rem;
          }
        }
        .serviceType {
          .text-type--service-type {
            font-size: 0.51rem;
          }
        }
      }
    }
  }
  &[data-preset="728x90"] {
    /* Smaller working type for the 240 x 90 component box. */
    font-size: 0.5rem;
    .apr-wrapper,
    .text-type--saving-amount,
    .warrantyHeading {
      font-size: 1.125rem;
    }
    .text-type--discount-text {
      font-size: 0.625rem;
    }
    .warrantyBlockWrapper {
      /* Reserve enough of this compact row for the finance and savings copy. */
      &[data-has-connector="true"] {
        grid-template-columns: minmax(0, 1.5fr) auto minmax(0, 1fr);
      }
    }
  }
  &[data-preset="print"] {
    .warrantyBlockWrapper {
      /* Preset-specific measured styles go here. */
    }
  }
  &[data-preset="tractru"] {
    .warrantyBlockWrapper {
      /* Preset-specific measured styles go here. */
    }
  }
  &[data-preset="web-banner"] {
    .warrantyBlockWrapper {
      /* Provisional structure; wide artwork still needed. */
    }
    .offerContent {
      text-align: center;
    }
    .savingContent {
      justify-content: center;
    }
  }
`;

const hasContent = (value: unknown) =>
  value != null && String(value).trim() !== "" && value !== "notApplicable";

export const WarrantyBlockV2 = (props: WarrantyBlockV2Props) => {
  const { children, dummyData, fallbackContent, textSettings } = props;
  const preset =
    props.preset &&
    Object.prototype.hasOwnProperty.call(rawTextSettings, props.preset)
      ? props.preset
      : DEFAULT_WARRANTY_V2_PRESET;
  const content = {
    ...defaultWarrantyBlockV2FallbackContent,
    ...(fallbackContent ?? dummyData),
  };

  // Resolve once for BOTH rendering and visibility. Only an omitted input uses
  // example content; a supplied empty/null value stays empty and 0 stays valid.
  const keys = Object.keys(defaultWarrantyBlockV2FallbackContent) as Array<
    keyof WarrantyBlockV2FallbackContent
  >;
  const fields = Object.fromEntries(
    keys.map((key) => {
      const input = props[key] === undefined ? content[key] : props[key];
      return [key, { ...input, value: input?.value ?? "" }];
    })
  ) as Required<WarrantyBlockV2FallbackContent>;

  const available = fields.aPR.value === "available";
  const aprInput = available ? { ...fields.aPR, value: "0" } : fields.aPR;
  const hasNumericAprGreaterThanZero =
    hasContent(aprInput?.value) &&
    Number.isFinite(Number(aprInput?.value)) &&
    Number(aprInput?.value) > 0;
  const hasFinancing = hasContent(fields.aPR.value);
  const hasMonths = hasContent(fields.paymentMonths.value);
  const hasDownPayment = hasContent(fields.downPayment.value);
  const hasSavings = hasContent(fields.savingAmount.value);
  const hasDiscount = !hasSavings && hasContent(fields.discountText.value);
  const offerMode = hasSavings ? "savings" : hasDiscount ? "discount" : "empty";
  const hasPreText = hasSavings && hasContent(fields.savingAmountPreText.value);
  const hasDescription = hasContent(fields.savingAmountPostText.value);
  const hasOffer = hasSavings || hasDiscount || hasDescription;
  const hasOfferSection = hasFinancing || hasOffer;
  const service = String(fields.serviceType.value);
  const serviceLabel = Object.prototype.hasOwnProperty.call(
    warrantyBlockV2ServiceTypes,
    service
  )
    ? warrantyBlockV2ServiceTypes[service as WarrantyBlockV2ServiceType]
    : "";
  const hasServiceType = hasContent(serviceLabel);
  const limits = (key: keyof WarrantyBlockV2TextSettings) => {
    const withoutServiceType = key === "warrantyText" && !hasServiceType;
    const settings = {
      ...warrantyBlockV2TextSettings[preset][key],
      ...(withoutServiceType &&
        warrantyBlockV2TextSettings[preset].warrantyText?.withoutServiceType),
      ...textSettings?.[key],
      ...(withoutServiceType && textSettings?.warrantyText?.withoutServiceType),
    };
    return {
      lines: settings.lines,
      textfit: settings.textfit ?? false,
      textfitConfig: { minFontSize: settings.min, maxFontSize: settings.max },
    };
  };
  const termLimits = limits("termLabels");
  const hasWarrantyText = hasContent(fields.warrantyText.value);
  const hasWarranty = hasWarrantyText || hasServiceType;
  const connector = fields.connectorLinesText.value;
  const hasConnector =
    hasOfferSection &&
    hasWarranty &&
    hasContent(connector) &&
    connector !== "hide-element";

  return (
    <WarrantyBlockV2Wrapper
      className={`warrantyBlockV2 ${children ? "has-children" : ""} theme--${
        fields.backgroundColor.value === "white" ? "white" : "black"
      }`}
      data-preset={preset}
      data-offer-mode={offerMode}
    >
      <div
        className="warrantyBlockWrapper"
        data-has-financing={hasFinancing}
        data-has-offer={hasOffer}
        data-has-savings={hasSavings}
        data-has-offer-section={hasOfferSection}
        data-has-warranty={hasWarranty}
        data-has-connector={hasConnector}
        hidden={!hasOfferSection && !hasWarranty}
      >
        <div className="warrantyOfferContent" hidden={!hasOfferSection}>
          <div className="financingContent" hidden={!hasFinancing}>
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
              className={`term-labels ${
                available ? "apr-available" : "apr-text"
              } ${hasMonths ? "has-months" : ""} ${hasDownPayment ? "has-down-payment" : ""}`}
            >
              <Limiter
                maxLines={termLimits.lines}
                textfit={termLimits.textfit}
                textfitConfig={termLimits.textfitConfig}
              >
                <div className="term-labels-content">
                  <span>{available ? "financing available" : "APR"}</span>
                  {hasMonths && (
                    <>
                      {" "}
                      <span className="payment-months-wrapper">
                        <TextElement
                          inline
                          destructedProp={fields.aprPaymentMonthsConnectorText}
                          dynamicClassName="apr-payment-months-connector"
                        />{" "}
                        <TextElement
                          inline
                          chars={2}
                          destructedProp={fields.paymentMonths}
                          dynamicClassName="payment-months"
                        />{" "}
                        {preset === "728x90" ? "mos" : "months"}
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
                        />
                        {" down"}
                      </span>
                    </>
                  )}
                </div>
              </Limiter>
            </div>
          </div>
          <div
            className="offerContent"
            data-has-description={hasDescription}
            hidden={!hasOffer}
          >
            <div className="offerValue" hidden={!hasSavings && !hasDiscount}>
              {hasSavings && (
                <div className="savingContent">
                  {hasPreText && (
                    <TextElement
                      destructedProp={fields.savingAmountPreText}
                      dynamicClassName="pre-saving-amount"
                      {...limits("savingAmountPreText")}
                    />
                  )}
                  <TextElement
                    destructedProp={fields.savingAmount}
                    dynamicClassName="saving-amount"
                    chars={6}
                  />
                </div>
              )}
              {hasDiscount && (
                <TextElement
                  destructedProp={fields.discountText}
                  dynamicClassName="discount-text"
                  {...limits("discountText")}
                />
              )}
            </div>
            {hasDescription && (
              <div className="offerDescription">
                <TextElement
                  destructedProp={fields.savingAmountPostText}
                  dynamicClassName="post-saving-amount"
                  {...limits("savingAmountPostText")}
                />
              </div>
            )}
          </div>
        </div>
        <div className="connectorWrapper" hidden={!hasConnector}>
          <span className="connector-line" />
          {connector !== "hide-text" && (
            <TextElement
              destructedProp={fields.connectorLinesText}
              dynamicClassName="connectorLines"
              chars={20}
            />
          )}
          <span className="connector-line" />
        </div>
        <div
          className="warrantyContent"
          hidden={!hasWarranty}
          data-has-warranty-text={hasWarrantyText}
          data-has-service-type={hasServiceType}
        >
          {hasWarrantyText && (
            <div className="warrantyHeading">
              <TextElement
                destructedProp={fields.warrantyText}
                dynamicClassName="warranty-text"
                {...limits("warrantyText")}
              />
            </div>
          )}
          {hasServiceType && (
            <div className="serviceType">
              <TextElement
                destructedProp={{ ...fields.serviceType, value: serviceLabel }}
                dynamicClassName="service-type"
                {...limits("serviceType")}
              />
            </div>
          )}
        </div>
      </div>
      {children && <div className="warrantyChildren">{children}</div>}
    </WarrantyBlockV2Wrapper>
  );
};
