import { render, screen } from "@testing-library/react";
import { ArtworkPlaceholder } from "../components/ArtworkPlaceholder";

jest.mock("../utils/artwork", () => ({
  artwork: {
    offer: {
      print: { image: "/offer.png", hide: false, opacity: 0.3 },
      "300x600": { image: "/offer-alternate.png", hide: false, opacity: 0 },
      "160x600": { image: "", hide: false },
    },
    warranty: {
      print: { image: "/warranty.png", hide: false },
      "300x600": { image: "/warranty.png", hide: true },
      "160x600": { image: "/warranty.png" },
    },
    componentStarter: { print: { image: "" } },
  },
}));

jest.mock("@outfit.io/react", () => ({
  Placeholder: ({ image, hide, opacity, offset }) =>
    hide ? null : (
      <img
        alt="Comparison artwork"
        src={image}
        data-opacity={opacity}
        data-offset={String(offset)}
      />
    ),
}));

it("switches images by both component and dimension without leaking the previous artwork", () => {
  const { rerender } = render(
    <ArtworkPlaceholder component="offer" preset="print" />
  );
  expect(screen.getByRole("img")).toHaveAttribute("src", "/offer.png");
  expect(screen.getByRole("img")).toHaveAttribute("data-offset", "false");
  rerender(<ArtworkPlaceholder component="warranty" preset="print" />);
  expect(screen.getByRole("img")).toHaveAttribute("src", "/warranty.png");
  rerender(<ArtworkPlaceholder component="offer" preset="300x600" />);
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    "/offer-alternate.png"
  );
  expect(screen.getByRole("img")).toHaveAttribute("data-opacity", "0");
  rerender(<ArtworkPlaceholder component="componentStarter" preset="print" />);
  expect(screen.queryByRole("img")).toBeNull();
});

it.each([
  ["offer", "160x600"],
  ["offer", "unknown"],
  ["unknown", "print"],
  ["warranty", "300x600"],
  ["warranty", "160x600"],
])(
  "renders no overlay for missing or hidden selection %s / %s",
  (component, preset) => {
    const { container } = render(
      <ArtworkPlaceholder component={component} preset={preset} />
    );
    expect(container).toBeEmptyDOMElement();
  }
);
