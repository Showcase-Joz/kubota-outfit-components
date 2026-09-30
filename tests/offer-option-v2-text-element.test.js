import { fireEvent, render } from "@testing-library/react";
import { Limiter, onInlineEditClick } from "@outfit.io/react";
import { TextElement } from "../src/components/offerOptionBlockV2/TextElement";

// Test our input semantics independently of Outfit's layout measurement.
jest.mock("@outfit.io/react", () => ({
  Limiter: jest.fn(({ children }) => children),
  onInlineEditClick: jest.fn(),
  runValidation: jest.requireActual("@outfit.io/react").runValidation,
}));

beforeEach(() => jest.clearAllMocks());

// Outfit counts innerText. JSDOM does not implement it; these plain numeric
// spans have the same visible text as textContent, including formatted commas.
const innerTextDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "innerText"
);
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "innerText", {
    configurable: true,
    get() {
      return this.textContent;
    },
  });
});
afterAll(() => {
  if (innerTextDescriptor) {
    Object.defineProperty(
      HTMLElement.prototype,
      "innerText",
      innerTextDescriptor
    );
  } else {
    delete HTMLElement.prototype.innerText;
  }
});

it("renders an editable formatted span in inline mode without a nested Limiter", () => {
  const ids = { variable: "down-payment" };
  const { getByText } = render(
    <TextElement
      inline
      dynamicClassName="down-payment"
      destructedProp={{ value: "1500", ids }}
    />
  );
  const text = getByText("1,500");
  expect(text.tagName).toBe("SPAN");
  expect(Limiter).not.toHaveBeenCalled();
  fireEvent.click(text);
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
});

it.each([
  ["down-payment", 6, "99999", "99,999", "100000", "100,000"],
  ["payment-months", 2, "99", "99", "100", "100"],
])(
  "validates inline %s at the character boundary and clears corrected overflow",
  (
    dynamicClassName,
    chars,
    validValue,
    validText,
    invalidValue,
    invalidText
  ) => {
    const props = { inline: true, dynamicClassName, chars };
    const { getByText, rerender } = render(
      <TextElement {...props} destructedProp={{ value: validValue }} />
    );
    expect(getByText(validText).parentElement).not.toHaveAttribute(
      "data-overflow"
    );
    rerender(
      <TextElement {...props} destructedProp={{ value: invalidValue }} />
    );
    const invalidField = getByText(invalidText);
    expect(invalidField.parentElement.tagName).toBe("SPAN");
    expect(invalidField.parentElement).toHaveAttribute(
      "data-overflow",
      `There can't be more than ${chars} characters here`
    );
    expect(invalidField.parentElement).toHaveAttribute(
      "data-total-calculated-char-count",
      String(invalidText.length)
    );
    expect(Limiter).not.toHaveBeenCalled();
    rerender(<TextElement {...props} destructedProp={{ value: validValue }} />);
    expect(getByText(validText).parentElement).not.toHaveAttribute(
      "data-overflow"
    );
  }
);

it("keeps inline editing and custom warnings, and removes a disabled limit", () => {
  const ids = { variable: "payment-months" };
  const props = {
    inline: true,
    dynamicClassName: "payment-months",
    destructedProp: { value: "100", ids },
    overflowMessage: "Use no more than two characters",
  };
  const { getByText, container, rerender } = render(
    <TextElement {...props} chars={2} />
  );
  expect(getByText("100").parentElement).toHaveAttribute(
    "data-overflow",
    props.overflowMessage
  );
  fireEvent.click(getByText("100"));
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
  rerender(<TextElement {...props} chars={3} />);
  expect(container.querySelector("[data-overflow]")).toBeNull();
  rerender(<TextElement {...props} />);
  expect(container.querySelector("[data-set-char-limit]")).toBeNull();
  expect(container).toHaveTextContent("100");
});

it("uses example content only for missing input, preserving blanks and zero", () => {
  const props = { dynamicClassName: "saving-amount", dummyData: "2500" };
  const { container, rerender } = render(<TextElement {...props} />);
  expect(container.textContent).toBe("2,500");
  rerender(<TextElement {...props} destructedProp={{ value: "" }} />);
  expect(container.textContent).toBe("");
  rerender(<TextElement {...props} destructedProp={{ value: 0 }} />);
  expect(container.textContent).toBe("0");
});

it("allows local text clicks and retains Outfit inline editing when IDs exist", () => {
  const { getByText, rerender } = render(
    <TextElement destructedProp={{ value: "Local example" }} />
  );
  fireEvent.click(getByText("Local example"));
  expect(onInlineEditClick).not.toHaveBeenCalled();
  const ids = { variable: "example" };
  rerender(<TextElement destructedProp={{ value: "Outfit example", ids }} />);
  fireEvent.click(getByText("Outfit example"));
  expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
});
