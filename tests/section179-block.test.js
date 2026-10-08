import { fireEvent, render, screen } from "@testing-library/react";
import { onInlineEditClick } from "@outfit.io/react";
import { Section179Block } from "kubota-outfit-components";

jest.mock("@outfit.io/react", () => ({
  Limiter: ({ children, maxLines }) => (
    <div data-lines={maxLines}>{children}</div>
  ),
  onInlineEditClick: jest.fn(),
  runValidation: jest.fn(),
}));

it("renders finance, formatted savings and independently editable campaign copy", () => {
  const ids = { input_id: "section179-heading" };
  const { container } = render(
    <Section179Block
      aPR={{ value: "available" }}
      aprPaymentMonthsConnectorText={{ value: "for" }}
      downPayment={{ value: "0" }}
      savingAmount={{ value: 12000 }}
      section179Text={{ value: "Campaign heading", ids }}
    />
  );
  expect(container.querySelector(".financingContent")).toHaveTextContent(
    "0%financing available for 60 months with $0 down"
  );
  expect(container.querySelector(".offerOptionContent-top .text-type--saving-amount")).toHaveTextContent("12,000");
  const group = container.querySelector(".financeOfferGroup");
  expect(container.querySelector(".financingContent").parentElement).toBe(group);
  expect(container.querySelector(".connectorWrapper").parentElement).toBe(group);
  expect(container.querySelector(".offerOptionContent").parentElement).toBe(group);
  expect(container.querySelector(".section179connectorWrapper").parentElement).toBe(group.parentElement);
  expect(container.querySelector(".section179Content").parentElement).toBe(group.parentElement);
  fireEvent.click(screen.getByText("Campaign heading"));
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
});

it("preserves explicit blank clears over fallback content, while zero remains valid", () => {
  const { container, rerender } = render(
    <Section179Block
      fallbackContent={{
        savingAmount: { value: 9999 },
        section179Text: { value: "Fallback" },
      }}
      savingAmountPreText={{ value: "" }}
      savingAmount={{ value: "" }}
      savingAmountPostText={{ value: "" }}
      section179Text={{ value: "" }}
      section179PostText={{ value: "" }}
    />
  );
  expect(container.querySelector(".offerOptionContent")).not.toBeVisible();
  expect(container.querySelector(".section179Content")).toBeNull();
  expect(container.querySelector(".connectorWrapper")).toBeNull();
  rerender(<Section179Block savingAmount={{ value: 0 }} />);
  expect(container.querySelector(".offerOptionContent-top .text-type--saving-amount")).toHaveTextContent("0");
});

it("uses line limits by field and handles connector choices without printing their sentinel values", () => {
  const { container, rerender } = render(
    <Section179Block
      section179connectorLinesText={{ value: "hide-text" }}
      textSettings={{ section179Text: { lines: 4 } }}
    />
  );
  expect(
    container.querySelector(
      ".section179connectorLinesText .text-type--section179connectorLinesText"
    )
  ).toBeNull();
  expect(
    container.querySelectorAll(".section179connectorLinesText .connector-line")
  ).toHaveLength(2);
  expect(
    container.querySelector(".section179Heading [data-lines]")
  ).toHaveAttribute("data-lines", "4");
  rerender(
    <Section179Block
      aPR={{ value: "notApplicable" }}
      section179connectorLinesText={{ value: "hide-element" }}
    />
  );
  expect(container.querySelector(".financingContent")).toBeNull();
  expect(container.querySelector(".section179connectorLinesText")).toBeNull();
});


it("promotes pre-text when the amount is cleared and restores normal treatment for zero", () => {
  const ids = { input_id: "saving-heading" };
  const props = { savingAmountPreText: { value: "2-Year<br/>Orange<br/>Protection*", ids } };
  const { container, rerender } = render(<Section179Block {...props} savingAmount={{ value: 12000 }} />);
  const offer = () => container.querySelector(".offerOptionContent");
  const heading = () => container.querySelector(".text-type--pre-saving-amount");
  expect(offer()).toHaveAttribute("data-offer-mode", "amount");
  expect(heading().closest("[data-lines]")).toHaveAttribute("data-lines", "1");
  rerender(<Section179Block {...props} savingAmount={{ value: "" }} />);
  expect(offer()).toHaveAttribute("data-offer-mode", "text-only");
  expect(container.querySelector(".text-type--saving-amount")).toBeNull();
  expect(heading().querySelectorAll("br")).toHaveLength(2);
  expect(heading().closest("[data-lines]")).toHaveAttribute("data-lines", "3");
  fireEvent.click(heading());
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
  expect(container.querySelector(".connectorWrapper")).not.toBeNull();
  expect(container.querySelector(".section179connectorWrapper")).not.toBeNull();
  rerender(<Section179Block {...props} savingAmount={{ value: 0 }} />);
  expect(offer()).toHaveAttribute("data-offer-mode", "amount");
  expect(container.querySelector(".text-type--saving-amount")).toHaveTextContent("0");
  expect(heading().closest("[data-lines]")).toHaveAttribute("data-lines", "1");
});

it("allows dimension-specific text-only limits and preserves empty heading behaviour", () => {
  const { container, rerender } = render(
    <Section179Block preset="300x600" savingAmount={{ value: "" }}
      savingAmountPreText={{ value: "Cash rebates" }}
      textSettings={{ savingAmountPreTextNoAmount: { lines: 4 } }} />
  );
  expect(container.querySelector(".text-type--pre-saving-amount").closest("[data-lines]")).toHaveAttribute("data-lines", "4");
  rerender(<Section179Block savingAmount={{ value: "" }} savingAmountPreText={{ value: "" }} />);
  expect(container.querySelector(".text-type--pre-saving-amount")).toBeNull();
  expect(container.querySelector(".text-type--saving-amount")).toBeNull();
  expect(container.querySelector(".offerOptionContent-bottom")).toBeVisible();
});
