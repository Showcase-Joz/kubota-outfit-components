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
      savingAmount={{ value: 12000 }}
      section179Text={{ value: "Campaign heading", ids }}
    />
  );
  expect(container.querySelector(".financingContent")).toHaveTextContent(
    "0%financing available for 60 months with $0 down"
  );
  expect(container.querySelector(".savingAmount")).toHaveTextContent("$12,000");
  fireEvent.click(screen.getByText("Campaign heading"));
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
});

it("preserves null and blank clears over fallback content, while zero remains valid", () => {
  const { container, rerender } = render(
    <Section179Block
      fallbackContent={{
        savingAmount: { value: 9999 },
        section179Text: { value: "Fallback" },
      }}
      savingAmount={{ value: null }}
      savingAmountPostText={{ value: "" }}
      section179Text={{ value: "" }}
      section179PostText={{ value: null }}
    />
  );
  expect(container.querySelector(".offerContent")).toBeNull();
  expect(container.querySelector(".section179Content")).toBeNull();
  expect(container.querySelector(".connectorWrapper")).toBeNull();
  rerender(<Section179Block savingAmount={{ value: 0 }} />);
  expect(container.querySelector(".savingAmount")).toHaveTextContent("$0");
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
