import { render } from "@testing-library/react";
import { Container } from "../components/Container";

jest.mock("@outfit.io/react", () => ({
  Limiter: ({ children }) => <div>{children}</div>,
  Placeholder: () => null,
  onInlineEditClick: jest.fn(),
  runValidation: jest.fn(),
}));

const originalResizeObserver = global.ResizeObserver;
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
});
afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
});

const preview = (component, preset, mode) => (
  <Container
    inputs={{
      component_selection: { value: component },
      aspect_selection: { value: preset },
      size_model: { value: mode },
    }}
  />
);

it("switches to the Section 179 print area and restores standard sizes for other components", () => {
  const { container, rerender } = render(preview("offer", "print", "exact"));
  const stage = () => container.querySelector(".comparison-stage");
  expect(stage()).toHaveStyle({ width: "598px", height: "181px" });
  rerender(preview("section179", "print", "exact"));
  expect(stage()).toHaveStyle({ width: "638px", height: "107px" });
  expect(container.querySelector(".component-preview")).toHaveStyle({
    width: "638px",
    height: "107px",
  });
  for (const component of ["warranty", "componentStarter", "offer"]) {
    rerender(preview(component, "print", "exact"));
    expect(stage()).toHaveStyle({ width: "598px", height: "181px" });
  }
});

it("uses the campaign ratio in Aspect mode and preserves fractional heights in Exact mode", () => {
  const { container, rerender } = render(
    preview("section179", "728x90", "aspect")
  );
  const stage = () => container.querySelector(".comparison-stage");
  expect(stage().style.aspectRatio).toBe("171 / 73.7");
  expect(container.querySelector(".component-preview")).toHaveStyle({
    width: "171px",
    height: "73.7px",
  });
  rerender(preview("section179", "728x90", "exact"));
  expect(stage()).toHaveStyle({ width: "171px", height: "73.7px" });
  rerender(preview("offer", "728x90", "aspect"));
  expect(stage().style.aspectRatio).toBe("240 / 90");
});
