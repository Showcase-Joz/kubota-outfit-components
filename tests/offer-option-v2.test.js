import { render } from "@testing-library/react";
import {
  OfferOptionBlockV2 as OfferOptionBlock,
  defaultOfferOptionBlockV2FallbackContent as defaultOfferOptionFallbackContent,
  offerOptionBlockV2TextSettings,
} from "kubota-outfit-components";
import { defaultPreviewInputs } from "../tools/resizing-tool/src/utils/preview";
import dimensions from "../tools/resizing-tool/src/utils/dimension.json";
import { data } from "../tools/resizing-tool/src/dummy/data";
import { PreviewButtonCTA as ButtonCTA } from "../tools/resizing-tool/src/components/PreviewButtonCTA";

// Observe the settings delivered to Outfit without running its text-fit engine.
jest.mock("@outfit.io/react", () => ({
  Limiter: ({ children, maxLines, textfit, textfitConfig }) => (
    <div
      data-testid="limiter"
      data-lines={maxLines}
      data-textfit={String(textfit)}
      data-min={textfitConfig?.minFontSize}
      data-max={textfitConfig?.maxFontSize}
    >
      {children}
    </div>
  ),
  onInlineEditClick: jest.fn(),
  runValidation: jest.fn(),
}));

const descriptionLimiter = (container) =>
  container
    .querySelector(".text-type--post-saving-amount")
    .closest('[data-testid="limiter"]');

it("provides component-owned examples and settings for every preview preset", () => {
  expect(Object.keys(offerOptionBlockV2TextSettings).sort()).toEqual(
    Object.keys(dimensions).sort()
  );
  const { container } = render(<OfferOptionBlock preset="print" />);
  expect(container.querySelector(".text-type--offerAPR")).toHaveTextContent(
    defaultPreviewInputs.aPR.value
  );
  expect(
    container.querySelector(".text-type--post-saving-amount")
  ).toHaveTextContent(
    defaultOfferOptionFallbackContent.savingAmountPostText.value
  );
  expect(descriptionLimiter(container)).toHaveAttribute("data-lines", "2");
});

it("lets finance terms form one phrase with a shared line limit", () => {
  const { container } = render(
    <OfferOptionBlock
      preset="160x600"
      aPR={{ value: "0.99" }}
      maxTermLabelsText={3}
    />
  );
  const terms = container.querySelector(".term-labels");
  expect(terms).toHaveTextContent("APR up to 60 months with $0 down");
  expect(terms.querySelectorAll('[data-testid="limiter"]')).toHaveLength(1);
  expect(terms.querySelector('[data-testid="limiter"]')).toHaveAttribute(
    "data-lines",
    "3"
  );
  expect(terms.querySelector(".text-type--payment-months").tagName).toBe(
    "SPAN"
  );
});

it("keeps component defaults unless a template explicitly supplies dummyData", () => {
  expect(Object.keys(data).sort()).toEqual(Object.keys(dimensions).sort());
  const { container, rerender } = render(<OfferOptionBlock preset="160x600" />);
  expect(container.querySelector(".text-type--offerAPR")).toHaveTextContent(
    "0.99"
  );
  rerender(<OfferOptionBlock preset="160x600" dummyData={data["160x600"]} />);
  expect(container.querySelector(".text-type--offerAPR")).toHaveTextContent(
    "0"
  );
  expect(container.querySelector(".term-labels")).toHaveTextContent(
    "financing available"
  );
  rerender(<OfferOptionBlock preset="300x600" dummyData={data["300x600"]} />);
  expect(container.querySelector(".text-type--offerAPR")).toHaveTextContent(
    "1.99"
  );
  expect(container.querySelector(".term-labels")).toHaveTextContent(/^APR /);
  rerender(<OfferOptionBlock preset="300x600" />);
  expect(container.querySelector(".text-type--offerAPR")).toHaveTextContent(
    "0.99"
  );
  expect(data["300x600"].aPR.value).toBe("1.99");
});

it("lets template dummyData override defaults while explicit inputs keep precedence", () => {
  const dummyData = {
    aPR: { value: "2.99" },
    savingAmount: { value: "5000" },
  };
  const { container, rerender } = render(
    <OfferOptionBlock preset="160x600" dummyData={dummyData} />
  );
  expect(container.querySelector(".text-type--offerAPR")).toHaveTextContent(
    "2.99"
  );
  rerender(
    <OfferOptionBlock
      preset="160x600"
      dummyData={dummyData}
      aPR={{ value: "" }}
      savingAmount={{ value: 0 }}
    />
  );
  expect(container.querySelector(".financingContent")).toHaveAttribute(
    "hidden"
  );
  expect(
    container.querySelector(".text-type--saving-amount")
  ).toHaveTextContent("0");
});

it("keeps the CTA default when shared dummyData has no button text", () => {
  const { container, rerender } = render(
    <ButtonCTA dummyData={data["160x600"]} />
  );
  expect(container).toHaveTextContent("View offer");
  rerender(<ButtonCTA dummyData={{ buttonText: { value: "Learn more" } }} />);
  expect(container).toHaveTextContent("Learn more");
  rerender(
    <ButtonCTA
      dummyData={{ buttonText: { value: "Learn more" } }}
      buttonText={{ value: "" }}
    />
  );
  expect(container.textContent).toBe("");
});

it("preserves valid zeroes and removes omitted sections without leftover labels", () => {
  const { container, rerender } = render(
    <OfferOptionBlock savingAmount={{ value: 0 }} />
  );
  expect(
    container.querySelector(".text-type--saving-amount")
  ).toHaveTextContent("0");
  rerender(
    <OfferOptionBlock
      aPR={{ value: "available" }}
      paymentMonths={{ value: "notApplicable" }}
      downPayment={{ value: "" }}
      savingAmount={{ value: "" }}
      savingAmountPreText={{ value: "" }}
    />
  );
  expect(container.querySelector(".term-labels")).toHaveTextContent(
    /^financing available$/
  );
  expect(container.querySelector(".payment-months-wrapper")).toBeNull();
  expect(container.querySelector(".down-payment-wrapper")).toBeNull();
  expect(container.querySelector(".text-type--saving-amount")).toBeNull();
  expect(container.querySelector(".offerOptionContent-top")).toHaveAttribute(
    "hidden"
  );
  expect(container.querySelector(".connectorWrapper")).toHaveAttribute(
    "hidden"
  );
  expect(container.querySelector(".offerOptionContent")).not.toHaveAttribute(
    "hidden"
  );
  rerender(<OfferOptionBlock aPR={{ value: "notApplicable" }} />);
  expect(container.querySelector(".financingContent")).toHaveAttribute(
    "hidden"
  );
  expect(container.querySelector(".connectorWrapper")).toHaveAttribute(
    "hidden"
  );
});

it("uses the selected preset independently of measured aspect or missing overrides", () => {
  const { container, rerender } = render(<OfferOptionBlock preset="160x600" />);
  expect(descriptionLimiter(container)).toHaveAttribute("data-lines", "3");
  expect(descriptionLimiter(container)).toHaveAttribute("data-min", "90");
  expect(descriptionLimiter(container)).toHaveAttribute("data-max", "100");
  rerender(
    <OfferOptionBlock preset="160x600" maxSavingAmountPostText={{ min: 80 }} />
  );
  expect(descriptionLimiter(container)).toHaveAttribute("data-lines", "3");
  expect(descriptionLimiter(container)).toHaveAttribute("data-min", "80");
  expect(descriptionLimiter(container)).toHaveAttribute("data-max", "100");
  rerender(<OfferOptionBlock preset="print" />);
  expect(descriptionLimiter(container)).toHaveAttribute("data-lines", "2");
});

it("supports explicit outlier limits without changing shared defaults", () => {
  const { container, rerender } = render(
    <OfferOptionBlock preset="print" maxSavingAmountPostText={{ lines: 4 }} />
  );
  expect(descriptionLimiter(container)).toHaveAttribute("data-lines", "4");
  rerender(
    <OfferOptionBlock
      preset="print"
      maxSavingAmountPostText={{ lines: 5, textfit: false }}
      fallbackContent={{ savingAmountPostText: { value: "" } }}
    />
  );
  expect(descriptionLimiter(container)).toHaveAttribute("data-lines", "5");
  expect(descriptionLimiter(container)).toHaveAttribute(
    "data-textfit",
    "false"
  );
  expect(
    container.querySelector(".text-type--post-saving-amount")
  ).toBeEmptyDOMElement();
  expect(container.querySelector(".text-type--offerAPR")).toHaveTextContent(
    "0.99"
  );
  expect(offerOptionBlockV2TextSettings.print.savingAmountPostText.lines).toBe(
    2
  );
});
