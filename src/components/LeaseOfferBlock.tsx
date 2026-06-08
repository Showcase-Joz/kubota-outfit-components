/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { TextElement } from "./TextElement.js";
import {
  onceADummyText,
  checkInputExists,
  cloneInlineClick,
} from "../utils/helpers.js";
export interface LeaseOfferBlockProps {
  children?: ReactNode;
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
  fallbackContent?: LeaseOfferBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: LeaseOfferBlockFallbackContent;
  /**
   * Short connector text above the payment amount.
   * Recommended max: 1 line.
   * If removed text space is still honoured.
   */
  paymentPreText?: LeaseOfferBlockField;
  /**
   * large payment price per month, digits only.
   * Recommended max: 4 characters.
   */
  paymentAmount?: LeaseOfferBlockField;
  /**
   * large hours of use value.
   * Recommended max: 3-4 digits, depending on the vehicle.
   */
  hoursOfUse?: LeaseOfferBlockField;
  /**
   * APR percentage value. Keep to 5 characters or fewer.
   * Use "available" to render the fallback 0% APR treatment.
   * goes under the hours of use in smaller text, so typically doesn't need to be as prominent as the payment amount.
   */
  aPR?: LeaseOfferBlockField;
  /**
   * Down payment amount.
   * Recommended max: 6 characters.
   * goes under the hours of use in smaller text, so typically doesn't need to be as prominent as the payment amount.
   */
  paymentMonths?: LeaseOfferBlockField;
  /**
   * Down payment amount.
   * Recommended max: 6 characters.
   * goes under the hours of use in smaller text, so typically doesn't need to be as prominent as the payment amount.
   */
  downPayment?: LeaseOfferBlockField;
}

export type LeaseOfferBlockField = {
  value: string;
};

/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type LeaseOfferBlockFallbackContent = {
  paymentPreText?: LeaseOfferBlockField;
  paymentAmount?: LeaseOfferBlockField;
  hoursOfUse?: LeaseOfferBlockField;
  aPR?: LeaseOfferBlockField;
  paymentMonths?: LeaseOfferBlockField;
  downPayment?: LeaseOfferBlockField;
};

const defaultLeaseOfferFallbackContent: LeaseOfferBlockFallbackContent = {
  paymentPreText: {
    value: "lease for as low as",
  },
  paymentAmount: {
    value: "XXX",
  },
  hoursOfUse: {
    value: "XXX",
  },
  aPR: {
    value: "X.XX",
  },
  paymentMonths: {
    value: "XX",
  },
  downPayment: {
    value: "XX,XXX",
  },
};

const LeaseOfferBlockWrapper = styled.div`
  container-name: leaseOfferWrapper;
  container-type: size;
  grid-area: leaseOfferBlock;

  font-size: var(
    --clamp-size-1,
    clamp(0.65em, calc(-0.875rem + 7.333cqi), 11.5rem)
  );
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);
  height: inherit;
  --border-width: 0.2vh;
  --sub-text-size: 0.32em;

  .leaseOfferBlockWrapper {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-areas:
      "mainArea"
      "subContent";
    padding: 0.4em 0.6em;
    gap: 0.2em;

    position: relative;
    z-index: 0;
    justify-content: start;
    height: inherit;
    align-content: center;
    justify-self: center;
    width: 100cqi;
    background-color: var(--color-orange, #ff6600);
    color: var(--color-white, #ffffff);
    clip-path: polygon(0 0, 93.7% 0, 100% 100%, 0% 100%);

    .mainArea {
      display: grid;
      grid-template-columns: min-content min-content;
      grid-template-rows: minmax(0, auto) max-content;
      max-width: 97%;
      width: fit-content;
      .paymentArea,
      .hoursArea {
        display: grid;
        grid-template-rows: min-content 1fr;
        row-gap: 0.15em;
        border-bottom: var(--border-width) solid currentColor;
        border-right: 0.15vw solid currentColor;
        height: fit-content;
        text-transform: uppercase;
        padding-bottom: 0.3em;

        .paymentPreText,
        .hoursPreText {
          font-size: var(--sub-text-size);
          font-weight: 700;
        }
        .paymentPreText {
          .text-type--paymentPreText {
            min-height: 1em;
          }
        }
        .paymentAmount {
          display: grid;
          grid-template-areas: "amount asterisk" "amount perMonthText";
          grid-template-columns: max-content min-content;
          font-weight: 800;

          .amount {
            grid-area: amount;
            .text-type--paymentAmount::before {
              content: "$";
              font-size: inherit;
              font-weight: 800;
              position: relative;
            }
          }
          ::before,
          ::after {
            font-weight: 700;
            font-size: 0.37em;
            position: relative;
            align-self: anchor-center;
          }
          ::before {
            grid-area: asterisk;
            content: "*";
            right: -0.1em;
            top: -0.3em;
            align-self: end;
          }
          ::after {
            grid-area: perMonthText;
            content: "/month";
            font-weight: 400;
            right: -0.3em;
            margin-right: 1.2em;
          }
        }
        .hoursAmount {
          display: grid;
          grid-template-areas: "hours" "hoursUnit";
          padding-left: 0.27em;
          font-weight: 800;
          font-size: inherit;

          .hours {
            grid-area: hours;
            .text-type--hours {
              min-width: calc(100% + 0.3em);

              ::after {
                grid-area: hoursUnit;
                content: "hours";
                font-weight: 400;
                font-size: 0.25em;
                text-transform: uppercase;
                letter-spacing: normal;
                right: -0.5em;
                position: relative;
              }
            }
          }
        }
        .amount,
        .hours {
          font-size: 1.3em;
          letter-spacing: 0.03em;
        }
      }
      .hoursArea {
        border-right: none;
      }
    }
    .subContent {
      display: block;
      font-size: var(--sub-text-size);
      font-weight: 400;
      line-height: 1.15;
      text-transform: uppercase;
      width: inherit;
      > * {
        display: inline;
      }
      .apr > div,
      .paymentMonths > div,
      .downPayment > div {
        display: inline-block;
        overflow-wrap: normal;
        vertical-align: baseline;
      }

      .apr {
        color: currentColor;
        font-weight: 700;
        font-size: 1em;
        line-height: inherit;
        width: auto;
        display: inline;

        .text-type--aPR {
          font-weight: 700;
          color: inherit;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
          ::before {
            content: "%";
            right: -1.5ch;
            position: absolute;
          }
          .aPR-text,
          .aPR--available-text {
            display: inline-block;
          }
        }
        span.aPR-text {
          margin-left: 1.8ch;
        }
        span.aPR--available-text {
          margin-left: 0.6ch;
        }
      }
      &.aPR--not-available .apr {
        display: none;
      }

      &.aPR--digits .apr {
        .aPR--available-text {
          display: none;
        }
      }
      .paymentMonths {
        color: currentColor;
        font-weight: 700;
        font-size: 1em;
        line-height: inherit;
        margin-left: 0.5ch;
        width: auto;
        display: inline;

        .text-type--paymentMonths {
          font-weight: 700;
          color: inherit;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
        }
        span.paymentMonths--pre-text {
          margin-right: 0.5ch;
          font-weight: 500;
        }
        .term-label {
          color: inherit;
          font-weight: inherit;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
          margin-left: 0.5ch;
        }
      }
      &.paymentMonths--hide {
        .paymentMonths {
          display: none;
        }
      }
      .downPayment {
        color: currentColor;
        font-size: 1em;
        font-weight: 700;
        line-height: inherit;
        margin-left: 0.5ch;
        display: inline;
        align-items: center;
        span.text-label {
          margin-right: 0.5ch;
          font-weight: 500;
        }

        .currency-symbol {
          font-weight: inherit;
          color: inherit;
          margin-right: 0.1ch;
          display: inline-block;
        }
        .text-type--downPayment {
          font-weight: inherit;
          color: inherit;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
        }
        .term-label {
          font-weight: inherit;
          color: inherit;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
          margin-left: 0.5ch;
        }
      }
      &.downpayment--hide .downPayment {
        display: none;
      }
    }
    .buttonCTA {
      display: none;
    }
    [data-overflow]:after {
      top: unset;
    }
  }
  @container leaseOfferWrapper (max-aspect-ratio: 1 / 1) {
    .leaseOfferBlockWrapper {
      clip-path: polygon(20.2cqi 0, 100% 0, 100% 100%, 0 100%);
      padding-left: 2em;
      padding-block: 5cqb;
      width: fit-content;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      grid-template-areas:
        "mainArea"
        "subContent"
        "buttonCTA";
      width: 100%;
      align-content: space-evenly;
      .mainArea,
      .subContent,
      .buttonCTA {
        justify-items: center;
      }
      .mainArea {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        width: inherit;
        justify-self: end;
        .paymentArea {
          border-right: none;
          .paymentAmount {
            justify-content: center;
            ::after {
              margin-right: 0.4em;
            }
          }
        }
        .hoursArea {
          border-bottom: none;
        }
      }
      .subContent {
        width: inherit;
        text-wrap-style: balance;
        text-align: center;
      }
      .buttonCTA {
        display: inline-block;
        margin-top: 0.5em;
      }
    }
  }
`;

const LeaseOfferBlock = ({
  children,
  fallbackContent,
  dummyData,
  paymentPreText,
  paymentAmount,
  hoursOfUse,
  aPR,
  paymentMonths,
  downPayment,
}: LeaseOfferBlockProps) => {
  // if dummyData is provided, use it as fallback content. Otherwise, use the default fallback content.
  const content =
    fallbackContent || dummyData || defaultLeaseOfferFallbackContent;
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

  const downPaymentValue = onceADummyText(
    downPayment,
    content.downPayment?.value,
  );

  return (
    <LeaseOfferBlockWrapper className="leaseOfferBlock">
      <div className="leaseOfferBlockWrapper">
        <div className="mainArea">
          <div className="paymentArea">
            <div className="paymentPreText">
              <TextElement
                dummyData={content?.paymentPreText?.value || "0"}
                destructedProp={paymentPreText}
                dynamicClassName={`paymentPreText`}
                height={undefined}
                lines={1}
                chars={undefined}
                textfit={false}
                textfitConfig={undefined}
              ></TextElement>
            </div>
            <div className="paymentAmount">
              <div className="amount">
                <TextElement
                  dummyData={content?.paymentAmount?.value || "0"}
                  destructedProp={paymentAmount}
                  dynamicClassName={`paymentAmount`}
                  height={undefined}
                  lines={undefined}
                  chars={5}
                  textfit={false}
                  textfitConfig={undefined}
                  overflowMessage="Max characters reached"
                ></TextElement>
              </div>
            </div>
          </div>
          <div className="hoursArea">
            <div className="hoursPreText">&nbsp;</div>

            <div className="hoursAmount">
              <div className="hours">
                <TextElement
                  dummyData={content?.hoursOfUse?.value || "0"}
                  destructedProp={hoursOfUse}
                  dynamicClassName={`hours`}
                  height={undefined}
                  lines={undefined}
                  chars={5}
                  textfit={false}
                  textfitConfig={undefined}
                  overflowMessage="Max characters reached"
                ></TextElement>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`subContent  aPR--${
            testAprValue === "notApplicable"
              ? "not-available"
              : testAprValue === "available"
              ? "available"
              : "digits"
          } paymentMonths--${
            testPaymentMonthsValue === "notApplicable" ? "hide" : "show"
          } downpayment--${downPaymentValue?.class} `}
        >
          <div className="apr">
            <TextElement
              dummyData={content?.aPR?.value || "0"}
              destructedProp={checkedAprInput}
              dynamicClassName={`aPR`}
              height={undefined}
              lines={undefined}
              chars={5}
              textfit={false}
              textfitConfig={undefined}
            ></TextElement>
            <span className="aPR-text">
              APR<span className="aPR--available-text">available</span>
            </span>
          </div>
          <div className="paymentMonths">
            <span className="paymentMonths--pre-text">finance for</span>
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
          <div className="downPayment">
            <span className="text-label">with</span>

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
        </div>
        {children}
      </div>
    </LeaseOfferBlockWrapper>
  );
};

export { LeaseOfferBlock };
