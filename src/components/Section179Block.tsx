import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { Limiter } from "@outfit.io/react";
import { TextElement } from "./sharedV2/TextElement.js";
import rawSection179BlockTextSettings from "../utils/Section179BlockTextSettings.json" with { type: "json" };

// Copy this file and its companion files using docs/section179-block.md.
// Keep declarations self-contained for templates that do not import JSON.
export const section179BlockTextSettings = rawSection179BlockTextSettings;
export type Section179BlockPreset = keyof typeof section179BlockTextSettings;
export const DEFAULT_SECTION179_PRESET: Section179BlockPreset = "print";

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
    | "termLabels",
    Section179BlockTextLimits
  >
>;

export interface Section179BlockProps extends Section179BlockFallbackContent {
  preset?: Section179BlockPreset;
  fallbackContent?: Section179BlockFallbackContent;
  /** Existing template alias; fallbackContent takes priority. */
  dummyData?: Section179BlockFallbackContent;
  textSettings?: Section179BlockTextSettings;
  className?: string;
  children?: ReactNode;
}

export const defaultSection179BlockFallbackContent: Section179BlockFallbackContent =
  {
    backgroundColor: { value: "white" },
    aPR: { value: "available" },
    paymentMonths: { value: "60" },
    downPayment: { value: "0" },
    aprPaymentMonthsConnectorText: { value: "for" },
    connectorLinesText: { value: "or" },
    savingAmountPreText: { value: "Save up to" },
    savingAmount: { value: "0" },
    savingAmountPostText: { value: "on select models" },
    section179connectorLinesText: { value: "or" },
    section179Text: { value: "Section 179 Tax Deduction" },
    section179PostText: { value: "on select models" },
  };

const Section179BlockWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  color: var(--color-white, #fff);
  background: var(--color-black, #000);

  &.theme--white {
    color: var(--color-black, #000);
    background: var(--color-white, #fff);
  }
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);

  /* Set font sizes on the parent so TextElement can inherit fitted sizes. */
  .section179-block-content {
    font-size: 1rem;
  }

  /* Plain structural styles only; the artwork styling is yours to add. */
  .apr-wrapper,
  .savingAmount {
    display: flex;
    align-items: baseline;
    gap: 0.15em;
  }
  .connectorWrapper,
  .section179connectorWrapper {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  .connector-line {
    flex: 1;
    border-top: 1px solid currentColor;
  }

  /* TODO: Add each layout's CSS as you work through the designs. */
  &[data-preset="print"] {
  }
  &[data-preset="tractru"] {
  }
  &[data-preset="web-banner"] {
  }
  &[data-preset="300x600"] {
  }
  &[data-preset="160x600"] {
  }
  &[data-preset="300x250"] {
  }
  &[data-preset="728x90"] {
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

  // 1. Resolve every field once. Live inputs win; explicit blanks stay blank.
  const content = {
    ...defaultSection179BlockFallbackContent,
    ...(fallbackContent ?? dummyData),
  };
  const keys = Object.keys(defaultSection179BlockFallbackContent) as Array<
    keyof Section179BlockFallbackContent
  >;
  const fields = Object.fromEntries(
    keys.map((key) => {
      const input = props[key] === undefined ? content[key] : props[key];
      return [key, { ...input, value: input?.value ?? "" }];
    })
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
  const text = (
    key: Exclude<keyof Section179BlockFallbackContent, "backgroundColor">,
    dynamicClassName: string,
    inline = false
  ) => (
    <TextElement
      destructedProp={fields[key]}
      dynamicClassName={dynamicClassName}
      inline={inline}
      fitOnlyOnOverflow
      {...limits(key)}
    />
  );

  // 3. Decide which regions have content. Numeric 0 is valid content.
  const available = fields.aPR.value === "available";
  const aprInput = available ? { ...fields.aPR, value: "0" } : fields.aPR;
  const hasFinancing = hasContent(fields.aPR.value);
  const hasMonths = hasContent(fields.paymentMonths.value);
  const hasDownPayment = hasContent(fields.downPayment.value);
  const hasSavings = hasContent(fields.savingAmount.value);
  const hasDescription = hasContent(fields.savingAmountPostText.value);
  const hasOffer = hasSavings || hasDescription;
  const hasSection179Text = hasContent(fields.section179Text.value);
  const hasSection179PostText = hasContent(fields.section179PostText.value);
  const hasSection179 = hasSection179Text || hasSection179PostText;
  const termLimits = limits("termLabels");

  // Both connectors use the existing choices: blank label keeps lines;
  // hide-element removes the whole connector. No neighbouring content => no connector.
  const connector = (
    key: "connectorLinesText" | "section179connectorLinesText",
    visible: boolean
  ) => {
    const value = fields[key].value;
    if (!visible || !hasContent(value) || value === "hide-element") return null;
    return (
      <div className={`connectorWrapper ${key}`}>
        <span className="connector-line" />
        {value !== "hide-text" && text(key, key)}
        <span className="connector-line" />
      </div>
    );
  };

  // 4. Working markup: finance, savings, then Section 179. Style these regions above.
  return (
    <Section179BlockWrapper
      className={`section179Block theme--${fields.backgroundColor.value === "white" ? "white" : "black"} ${className ?? ""}`}
      data-preset={preset}
    >
      <div className="section179-block-content">
        {hasFinancing && (
          <div className="financingContent">
            <div className="apr-wrapper">
              <TextElement
                destructedProp={aprInput}
                dynamicClassName="offerAPR"
                chars={5}
              />
              <span className="percentage">%</span>
            </div>
            <div className="term-labels">
              <Limiter
                maxLines={termLimits.lines}
                textfit={termLimits.textfit}
                textfitConfig={termLimits.textfitConfig}
              >
                <div>
                  <span>{available ? "financing available" : "APR"}</span>
                  {hasMonths && (
                    <>
                      {" "}
                      {text(
                        "aprPaymentMonthsConnectorText",
                        "apr-payment-months-connector",
                        true
                      )}{" "}
                      {text("paymentMonths", "payment-months", true)} months
                    </>
                  )}
                  {hasDownPayment && (
                    <>
                      {" with $"}
                      {text("downPayment", "down-payment", true)} down
                    </>
                  )}
                </div>
              </Limiter>
            </div>
          </div>
        )}
        {connector("connectorLinesText", hasFinancing && hasOffer)}
        {hasOffer && (
          <div className="offerContent">
            {hasSavings && (
              <div className="savingContent">
                {hasContent(fields.savingAmountPreText.value) &&
                  text("savingAmountPreText", "pre-saving-amount")}
                <div className="savingAmount">
                  <span className="currency">$</span>
                  {text("savingAmount", "saving-amount")}
                </div>
              </div>
            )}
            {hasDescription && (
              <div className="offerDescription">
                {text("savingAmountPostText", "post-saving-amount")}
              </div>
            )}
          </div>
        )}
        {connector(
          "section179connectorLinesText",
          (hasFinancing || hasOffer) && hasSection179
        )}
        {hasSection179 && (
          <div className="section179Content">
            {hasSection179Text && (
              <div className="section179Heading">
                {text("section179Text", "section179-text")}
              </div>
            )}
            {hasSection179PostText && (
              <div className="section179Description">
                {text("section179PostText", "section179-post-text")}
              </div>
            )}
          </div>
        )}
      </div>
      {children}
    </Section179BlockWrapper>
  );
};
