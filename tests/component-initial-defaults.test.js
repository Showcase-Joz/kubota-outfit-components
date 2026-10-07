import { fireEvent, render } from "@testing-library/react";
import { onInlineEditClick } from "@outfit.io/react";
import { Section179Block, WarrantyBlockV2 } from "kubota-outfit-components";

jest.mock("@outfit.io/react", () => ({
  Limiter: ({ children }) => <div>{children}</div>,
  onInlineEditClick: jest.fn(),
  runValidation: jest.fn(),
}));

describe.each([
  ["Warranty V2", WarrantyBlockV2, ".text-type--saving-amount"],
  ["Section 179", Section179Block, ".text-type--saving-amount"],
])("%s initial inputs", (_name, Component, selector) => {
  it.each([null, undefined])(
    "uses dummy data for value %p and preserves inline editing IDs",
    (value) => {
      onInlineEditClick.mockClear();
      const ids = { input_id: "saving-amount" };
      const { container } = render(
        <Component
          dummyData={{ savingAmount: { value: 12000 } }}
          savingAmount={{ value, ids }}
        />
      );
      expect(container.querySelector(selector)).toHaveTextContent("12,000");
      fireEvent.click(container.querySelector(selector));
      expect(onInlineEditClick).toHaveBeenCalledWith(ids, expect.anything());
    }
  );

  it("shows defaults first, then honours a blank choice and zero", () => {
    const props = { fallbackContent: { savingAmount: { value: 12000 } } };
    const { container, rerender, unmount } = render(
      <Component {...props} savingAmount={{ value: null }} />
    );
    expect(container.querySelector(selector)).toHaveTextContent("12,000");
    rerender(<Component {...props} savingAmount={{ value: 4500 }} />);
    expect(container.querySelector(selector)).toHaveTextContent("4,500");
    rerender(<Component {...props} savingAmount={{ value: "" }} />);
    expect(container.querySelector(selector)).toBeNull();
    rerender(<Component {...props} savingAmount={{ value: 0 }} />);
    expect(container.querySelector(selector)).toHaveTextContent("0");
    unmount();
    const reloaded = render(
      <Component {...props} savingAmount={{ value: "" }} />
    );
    expect(reloaded.container.querySelector(selector)).toBeNull();
  });
});
