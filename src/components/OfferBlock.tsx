/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { TextElement } from "./TextElement.js";
import {
  onceADummyText,
  checkInputExists,
  cloneInlineClick,
} from "../utils/helpers.js";

export type OfferBlockField = {
  value: string;
};

/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type OfferBlockFallbackContent = {
  incentiveAmount?: OfferBlockField;
  downPayment?: OfferBlockField;
  aPR?: OfferBlockField;
  paymentMonths?: OfferBlockField;
};

const defaultOfferFallbackContent: OfferBlockFallbackContent = {
  incentiveAmount: {
    value: "XXXX",
  },
  downPayment: {
    value: "0",
  },
  aPR: {
    value: "4.99",
  },
  paymentMonths: {
    value: "84",
  },
};

export interface OfferBlockProps {
  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   incentiveAmount: { value: "XXXX" },
   *   downPayment: { value: "0" },
   *   aPR: { value: "4.99" },
   *   paymentMonths: { value: "84" }
   * }
   */
  fallbackContent?: OfferBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: OfferBlockFallbackContent;
  /**
   * Main monthly offer amount. Rendered as the large value in `$XXXX /MO`.
   * Placeholder `XXXX` is supported for previews.
   */
  incentiveAmount?: OfferBlockField;
  /**
   * Down payment value. Rendered in the supporting finance terms row.
   */
  downPayment?: OfferBlockField;
  /**
   * APR percentage value. Rendered in the supporting finance terms row.
   */
  aPR?: OfferBlockField;
  /**
   * Payment term in months. Rendered in the supporting finance terms row.
   */
  paymentMonths?: OfferBlockField;
}

const OfferBlockWrapper = styled.div`
  container-name: offerBlock;
  container-type: inline-size;

  grid-area: offerBlock;
  display: grid;
  grid-template-areas:
    "amount"
    "terms";
  grid-template-rows:
    min-content
    min-content;
  grid-template-columns: minmax(0, max-content);
  row-gap: 0.5em;
  height: 100%;
  width: 100%;
  align-content: center;
  justify-content: center;
  padding-bottom: 0.05em;
  font-size: var(
    --clamp-size-1,
    clamp(0.65em, calc(-0.875rem + 7.333cqi), 8.5rem)
  );
  font-family: var(--font-family-inter-default, sans-serif);
  color: var(--color-orange, #ff6600);

  .amount-block-wrapper {
    grid-area: amount;
    display: grid;
    grid-template-columns: min-content fit-content(77cqi) min-content;
    align-items: start;
    justify-content: center;
    justify-self: center;
    column-gap: 0.08em;
    max-width: 100%;

    color: var(--color-orange, #ff6600);
    font-family: var(--font-family-inter-default, sans-serif);
    .currency-symbol,
    .term-frequency {
      font-size: 1em;
      font-weight: 500;
      top: -0.15em;
      position: relative;
    }
    /* [data-testid="limiter"] {
      min-width: 0;
      max-width: 77cqi;
      justify-self: center;
    } */
    .text-type--incentive-amount {
      font-size: 3em;
      font-weight: 700;
      color: inherit;
      line-height: 0.72;
      text-transform: uppercase;
      white-space: nowrap;
    }
  }

  .terms-block-wrapper {
    grid-area: terms;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, max-content));
    align-items: center;
    justify-content: center;
    column-gap: 0.5em;
    max-width: 100%;
    color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
    font-size: 0.53em;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;

    .downpayment-wrapper,
    .apr-wrapper,
    .payment-months-wrapper {
      display: inline-grid;
      grid-auto-flow: column;
      align-items: baseline;
      justify-content: center;
      white-space: nowrap;
      align-self: baseline;
      :first-child {
        :before {
          content: "";
        }
      }
      ::before {
        position: relative;
        content: "|";
        margin-inline: -0.1em 0.3em;
        color: var(--color-black-tint-55, rgba(0, 0, 0, 0.55));
        font-size: 1.05em;
      }
      .text-type--downPayment,
      .text-type--offerAPR,
      .text-type--paymentMonths,
      strong {
        color: inherit;
        font-weight: 700;
      }
      .term-label {
        color: inherit;
        font-weight: 500;
        :not(.percentage) {
          margin-left: 0.2em;
        }
      }

      .apr-wrapper {
        .apr-text {
          margin-left: 0.1em;
        }
      }
    }

    &.downpayment--hide {
      .downpayment-wrapper {
        display: none;
      }
      .apr-wrapper {
        :before {
          content: "";
        }
      }
    }
    .apr-wrapper.show--includes {
      .apr-text {
        &::after {
          content: "available";
          margin-left: 0.5ch;
        }
      }
    }
    &.aPR--hide {
      .apr-wrapper {
        display: none;
      }
      .apr-wrapper {
        :before {
          content: "";
        }
      }
    }
    &.downpayment--hide.aPR--hide {
      .downpayment-wrapper,
      .payment-months-wrapper {
        &::before {
          content: "";
        }
      }
    }
    &.paymentMonths--hide {
      .payment-months-wrapper {
        display: none;
      }
    }
  }
`;

/**
 * Responsive monthly offer block.
 *
 * Renders a large `$XXXX /MO` amount with supporting finance terms. Accepts
 * Outfit-style field props such as `incentiveAmount={{ value: "XXXX" }}`.
 */
const OfferBlock = ({
  fallbackContent,
  dummyData,
  incentiveAmount,
  downPayment,
  aPR,
  paymentMonths,
}: OfferBlockProps) => {
  const content = fallbackContent || dummyData || defaultOfferFallbackContent;

  const downPaymentValue = onceADummyText(
    downPayment,
    content.downPayment?.value,
  );

  const testAprValue = checkInputExists(aPR, content?.aPR?.value);
  const aprInput = aPR || content?.aPR;

  const standInAprInput = aprInput
    ? cloneInlineClick(aprInput, {
        value: "0",
      })
    : { value: "0" };
  const checkedAprInput = testAprValue === "available" ? standInAprInput : aPR;

  const testPaymentMonthsValue = checkInputExists(
    paymentMonths,
    content?.paymentMonths?.value,
  );
  return (
    <OfferBlockWrapper className="offer-block">
      <div className="amount-block-wrapper" aria-label="Monthly offer">
        <span className="currency-symbol">$</span>
        <TextElement
          dummyData={content?.incentiveAmount?.value || ""}
          destructedProp={incentiveAmount}
          dynamicClassName="incentive-amount"
          height={undefined}
          lines={undefined}
          chars={7}
          textfit={false}
          textfitConfig={undefined}
        ></TextElement>
        <span className="term-frequency">/MO</span>
      </div>
      <div
        className={`terms-block-wrapper downpayment--${
          downPaymentValue?.class
        } aPR--${
          testAprValue === "notApplicable" ? "hide" : "show"
        } paymentMonths--${
          testPaymentMonthsValue === "notApplicable" ? "hide" : "show"
        }  `}
      >
        <div className="downpayment-wrapper">
          <span className="currency-symbol">
            <strong>$</strong>
          </span>
          <TextElement
            dummyData={content?.downPayment?.value || ""}
            destructedProp={downPayment}
            dynamicClassName="downPayment"
            height={undefined}
            lines={undefined}
            chars={7}
            textfit={false}
            textfitConfig={undefined}
          ></TextElement>
          <span className="term-label">down</span>
        </div>
        <div
          className={`apr-wrapper ${
            testAprValue !== "available" ? "hide" : "show"
          }--includes`}
        >
          <TextElement
            dummyData={content?.aPR?.value || "0"}
            destructedProp={checkedAprInput}
            dynamicClassName="offerAPR"
            height={undefined}
            lines={undefined}
            chars={5}
            textfit={false}
            textfitConfig={undefined}
          ></TextElement>
          <span className="term-label percentage">
            <strong>%</strong>
          </span>
          <span className="term-label apr-text">APR</span>
        </div>
        <div className="payment-months-wrapper">
          <TextElement
            dummyData={content?.paymentMonths?.value || ""}
            destructedProp={paymentMonths}
            dynamicClassName="paymentMonths"
            height={undefined}
            lines={undefined}
            chars={3}
            textfit={false}
            textfitConfig={undefined}
          ></TextElement>
          <span className="term-label">months</span>
        </div>
      </div>
    </OfferBlockWrapper>
  );
};

export { OfferBlock };
