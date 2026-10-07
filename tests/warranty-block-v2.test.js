import { fireEvent, render } from "@testing-library/react";
import { onInlineEditClick } from "@outfit.io/react";
import {
  WarrantyBlockV2,
  defaultWarrantyBlockV2FallbackContent,
  warrantyBlockV2TextSettings,
} from "kubota-outfit-components";

jest.mock("@outfit.io/react", () => ({
  Limiter: jest.requireActual("react").forwardRef(({ children, maxLines, textfit, textfitConfig }, ref) => (
    <div
      ref={ref}
      data-testid="limiter"
      data-lines={maxLines}
      data-textfit={String(textfit)}
      data-min={textfitConfig?.minFontSize}
    >
      {children}
    </div>
  )),
  onInlineEditClick: jest.fn(),
  runValidation: jest.fn(),
}));

it("starts with the approved financing-available example and lets savings win", () => {
  const { container } = render(<WarrantyBlockV2 />);
  expect(container.querySelector(".warrantyBlockV2")).toHaveAttribute(
    "data-preset",
    "300x600"
  );
  expect(container.querySelector(".warrantyBlockV2")).toHaveAttribute(
    "data-offer-mode",
    "savings"
  );
  expect(container.querySelector(".financingContent")).toHaveTextContent(
    "0%financing available"
  );
  expect(container.querySelector(".payment-months-wrapper")).toBeNull();
  expect(container.querySelector(".down-payment-wrapper")).toBeNull();
  expect(
    container.querySelector(".text-type--saving-amount")
  ).toHaveTextContent("3,000");
  expect(container.querySelector(".text-type--discount-text")).toBeNull();
  expect(container.querySelector(".connectorWrapper")).not.toHaveAttribute(
    "hidden"
  );
});

it.each(["", "   "])(
  "clearing amount (%p) hides its pre-text and reveals discount without losing description",
  (value) => {
    const { container, rerender } = render(
      <WarrantyBlockV2 savingAmount={{ value }} />
    );
    expect(container.querySelector(".warrantyBlockV2")).toHaveAttribute(
      "data-offer-mode",
      "discount"
    );
    expect(container.querySelector(".text-type--pre-saving-amount")).toBeNull();
    expect(container.querySelector(".text-type--saving-amount")).toBeNull();
    expect(
      container.querySelector(".text-type--discount-text")
    ).toHaveTextContent("or instant cash discount");
    expect(container.querySelector(".offerDescription")).toHaveTextContent(
      "on select Kubota L02 Series equipment"
    );
    expect(container.querySelector(".connectorWrapper")).not.toHaveAttribute(
      "hidden"
    );
    rerender(<WarrantyBlockV2 savingAmount={{ value: "45" }} />);
    expect(
      container.querySelector(".text-type--saving-amount")
    ).toHaveTextContent("45");
    expect(
      container.querySelector(".text-type--pre-saving-amount")
    ).toHaveTextContent("or save up to");
    expect(container.querySelector(".text-type--discount-text")).toBeNull();
  }
);

it("keeps zero as savings and lets an independently blank pre-text stay blank", () => {
  const { container } = render(
    <WarrantyBlockV2
      savingAmount={{ value: 0 }}
      savingAmountPreText={{ value: "" }}
    />
  );
  expect(container.querySelector(".warrantyBlockV2")).toHaveAttribute(
    "data-offer-mode",
    "savings"
  );
  expect(
    container.querySelector(".text-type--saving-amount")
  ).toHaveTextContent("0");
  expect(container.querySelector(".text-type--pre-saving-amount")).toBeNull();
  expect(container.querySelector(".text-type--discount-text")).toBeNull();
});

it("leaves description, finance and warranty visible when both offer treatments are empty", () => {
  const { container } = render(
    <WarrantyBlockV2
      savingAmount={{ value: "" }}
      discountText={{ value: "" }}
    />
  );
  expect(container.querySelector(".warrantyBlockV2")).toHaveAttribute(
    "data-offer-mode",
    "empty"
  );
  expect(container.querySelector(".offerValue")).toHaveAttribute("hidden");
  expect(container.querySelector(".offerDescription")).toBeVisible();
  expect(container.querySelector(".financingContent")).not.toHaveAttribute(
    "hidden"
  );
  expect(container.querySelector(".warrantyContent")).not.toHaveAttribute(
    "hidden"
  );
});

it("uses template baselines only for omitted inputs and honors fallbackContent precedence", () => {
  const dummyData = {
    savingAmount: { value: "5000" },
    warrantyText: { value: "1-Year" },
  };
  const { container, rerender } = render(
    <WarrantyBlockV2 dummyData={dummyData} />
  );
  expect(
    container.querySelector(".text-type--saving-amount")
  ).toHaveTextContent("5,000");
  expect(
    container.querySelector(".text-type--warranty-text")
  ).toHaveTextContent("1-Year");
  rerender(
    <WarrantyBlockV2 dummyData={dummyData} savingAmount={{ value: "" }} />
  );
  expect(container.querySelector(".text-type--saving-amount")).toBeNull();
  rerender(
    <WarrantyBlockV2
      dummyData={dummyData}
      fallbackContent={{ warrantyText: { value: "4-Year" } }}
    />
  );
  expect(
    container.querySelector(".text-type--warranty-text")
  ).toHaveTextContent("4-Year");
  expect(
    container.querySelector(".text-type--saving-amount")
  ).toHaveTextContent("3,000");
});

it("removes hidden service markup, preserves the heading and retains choice inline-edit IDs", () => {
  const ids = { variable: "serviceType" };
  const { container, rerender } = render(
    <WarrantyBlockV2 serviceType={{ value: "orange-protection", ids }} />
  );
  const service = container.querySelector(".text-type--service-type");
  expect(service).toHaveTextContent("Orange Protection Extended Warranty");
  fireEvent.click(service);
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
  rerender(<WarrantyBlockV2 serviceType={{ value: "hide" }} />);
  expect(container.querySelector(".serviceType")).toBeNull();
  expect(container.querySelector(".warrantyContent")).toHaveAttribute(
    "data-has-service-type",
    "false"
  );
  expect(
    container.querySelector(".text-type--warranty-text")
  ).toHaveTextContent("2-Year");
  expect(container.querySelector(".connectorWrapper")).not.toHaveAttribute(
    "hidden"
  );
  rerender(
    <WarrantyBlockV2
      serviceType={{ value: "hide" }}
      warrantyText={{ value: "" }}
    />
  );
  expect(container.querySelector(".warrantyContent")).toHaveAttribute("hidden");
  expect(container.querySelector(".connectorWrapper")).toHaveAttribute(
    "hidden"
  );
});

it("supports text-only and whole-connector hiding, and removes it when its offer region is empty", () => {
  const { container, rerender } = render(
    <WarrantyBlockV2
      savingAmount={{ value: "" }}
      connectorLinesText={{ value: "hide-text" }}
    />
  );
  expect(container.querySelector(".connectorWrapper")).not.toHaveAttribute(
    "hidden"
  );
  expect(container.querySelector(".text-type--connectorLines")).toBeNull();
  expect(container.querySelectorAll(".connector-line")).toHaveLength(2);
  rerender(<WarrantyBlockV2 connectorLinesText={{ value: "hide-element" }} />);
  expect(container.querySelector(".connectorWrapper")).toHaveAttribute(
    "hidden"
  );
  rerender(
    <WarrantyBlockV2
      aPR={{ value: "notApplicable" }}
      savingAmount={{ value: "" }}
      discountText={{ value: "" }}
      savingAmountPostText={{ value: "" }}
    />
  );
  expect(container.querySelector(".warrantyOfferContent")).toHaveAttribute(
    "hidden"
  );
  expect(container.querySelector(".connectorWrapper")).toHaveAttribute(
    "hidden"
  );
  expect(container.querySelector(".warrantyContent")).not.toHaveAttribute(
    "hidden"
  );
});

it("keeps fitting off by default and merges outlier settings without mutating the preset", () => {
  const originalSettings = JSON.stringify(warrantyBlockV2TextSettings);
  const { container, rerender } = render(<WarrantyBlockV2 />);
  const headingLimiter = () =>
    container
      .querySelector(".text-type--warranty-text")
      .closest('[data-testid="limiter"]');
  expect(headingLimiter()).toHaveAttribute("data-textfit", "false");
  rerender(<WarrantyBlockV2 textSettings={{ warrantyText: { lines: 2 } }} />);
  expect(headingLimiter()).toHaveAttribute("data-textfit", "false");
  expect(headingLimiter()).toHaveAttribute("data-lines", "2");
  expect(JSON.stringify(warrantyBlockV2TextSettings)).toBe(originalSettings);
  expect(defaultWarrantyBlockV2FallbackContent.warrantyText.value).toBe(
    "2-Year"
  );
});

it.each([
  ["160x600", 2],
  ["300x600", 1],
])(
  "updates %s warranty limits as service visibility changes",
  (preset, hiddenLines) => {
    const warrantyText = { value: "Extended\nWarranty" };
    const { container, rerender } = render(
      <WarrantyBlockV2 preset={preset} warrantyText={warrantyText} />
    );
    for (const value of [
      "k-maintenance",
      "hide",
      "orange-protection",
      "",
      "k-maintenance",
    ]) {
      const visible =
        value === "k-maintenance" || value === "orange-protection";
      rerender(
        <WarrantyBlockV2
          preset={preset}
          warrantyText={warrantyText}
          serviceType={{ value }}
        />
      );
      const heading = container.querySelector(".text-type--warranty-text");
      const limiter = heading.closest('[data-testid="limiter"]');
      expect(limiter).toHaveAttribute(
        "data-lines",
        String(visible ? 1 : hiddenLines)
      );
      expect(limiter).toHaveAttribute("data-textfit", "false");
      expect(heading.textContent).toBe(warrantyText.value);
      expect(container.querySelector(".serviceType") !== null).toBe(visible);
    }
  }
);

it("lets manual warranty settings override preset visibility limits and supports conditional fit settings", () => {
  const originalSettings = JSON.stringify(warrantyBlockV2TextSettings);
  const textSettings = {
    warrantyText: { lines: 3, textfit: true, min: 80, max: 100 },
  };
  const { container, rerender } = render(
    <WarrantyBlockV2
      preset="160x600"
      serviceType={{ value: "hide" }}
      textSettings={textSettings}
    />
  );
  const limiter = () =>
    container
      .querySelector(".text-type--warranty-text")
      .closest('[data-testid="limiter"]');
  expect(limiter()).toHaveAttribute("data-lines", "3");
  const conditionalSettings = {
    warrantyText: {
      ...textSettings.warrantyText,
      withoutServiceType: { lines: 4, min: 90 },
    },
  };
  rerender(
    <WarrantyBlockV2
      preset="160x600"
      serviceType={{ value: "hide" }}
      textSettings={conditionalSettings}
    />
  );
  expect(limiter()).toHaveAttribute("data-lines", "4");
  expect(limiter()).toHaveAttribute("data-textfit", "true");
  expect(limiter()).toHaveAttribute("data-min", "90");
  rerender(
    <WarrantyBlockV2 preset="160x600" textSettings={conditionalSettings} />
  );
  expect(limiter()).toHaveAttribute("data-lines", "3");
  expect(limiter()).toHaveAttribute("data-min", "80");
  expect(JSON.stringify(warrantyBlockV2TextSettings)).toBe(originalSettings);
});

it.each([
  ["orange-protection", ["Orange Protection", "Extended Warranty"]],
  ["k-maintenance", ["K-MAINTENANCE", "Service on Us"]],
])("groups the print %s service label into phrases without enabling fitting", (value, phrases) => {
  const ids = { value_id: "service" };
  const { container, rerender } = render(<WarrantyBlockV2
    preset="print"
    serviceType={{ value, ids }}
  />);
  const label = container.querySelector(".text-type--service-type");
  expect([...label.querySelectorAll(".service-type-phrase")].map(node => node.textContent)).toEqual(phrases);
  expect(label.textContent).toBe(phrases.join(" "));
  expect(label.closest('[data-testid="limiter"]')).toHaveAttribute("data-textfit", "false");
  fireEvent.click(label.querySelector(".service-type-phrase"));
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());

  rerender(<WarrantyBlockV2 preset="300x600" serviceType={{ value, ids }} />);
  expect(container.querySelector(".service-type-phrase")).toBeNull();
  expect(container.querySelector(".text-type--service-type").textContent).toBe(phrases.join(" "));

  rerender(<WarrantyBlockV2 preset="print" serviceType={{ value: "hide", ids }} />);
  expect(container.querySelector(".serviceType")).toBeNull();
});
