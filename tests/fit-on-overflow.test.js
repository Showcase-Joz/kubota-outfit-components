import { act, render } from "@testing-library/react";
import { runValidation } from "@outfit.io/react";
import {
  fitOnOverflow,
  FitOnOverflowLimiter,
} from "../dist/components/sharedV2/FitOnOverflowLimiter";
import { TextElement } from "../dist/components/sharedV2/TextElement";

jest.mock("@outfit.io/react", () => ({
  Limiter: jest
    .requireActual("react")
    .forwardRef(({ children, textfit }, ref) => (
      <div ref={ref} data-testid="limiter" data-textfit={String(textfit)}>
        {children}
      </div>
    )),
  runValidation: jest.fn(),
  onInlineEditClick: jest.fn(),
}));

const limits = {
  maxLines: 2,
  textfit: true,
  textfitConfig: { minFontSize: 85, maxFontSize: 100 },
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(120);
  jest.spyOn(window, "getComputedStyle").mockReturnValue({ fontSize: "8px" });
  runValidation.mockImplementation(() => false);
});
afterEach(() => jest.restoreAllMocks());

it("keeps the authored size when two lines already fit", () => {
  const node = document.createElement("div");
  fitOnOverflow(node, limits);
  expect(node.style.fontSize).toBe("");
  expect(runValidation).toHaveBeenCalledTimes(1);
  expect(runValidation).toHaveBeenCalledWith(node, {
    ...limits,
    textfit: false,
  });
});

it("fits overflowing copy without letting integer rounding cross the minimum", () => {
  const node = document.createElement("div");
  const originalSettings = JSON.stringify(limits);
  runValidation.mockImplementation((element, settings) => {
    if (settings.textfit) {
      element.style.fontSize = "6px";
      // The vendor mutates the config passed to it.
      settings.textfitConfig.textfitMaxLines = settings.maxLines;
    }
    const overflows =
      !element.style.fontSize || parseFloat(element.style.fontSize) > 6;
    if (overflows) element.dataset.overflow = "Too many lines";
    else delete element.dataset.overflow;
    return overflows;
  });
  fitOnOverflow(node, limits);
  expect(runValidation).toHaveBeenCalledTimes(3);
  expect(runValidation.mock.calls[1][1]).toEqual(
    expect.objectContaining({ textfit: true, maxLines: 2 })
  );
  expect(parseFloat(node.style.fontSize)).toBeCloseTo(6.8);
  expect(node).toHaveAttribute("data-overflow", "Too many lines");
  expect(JSON.stringify(limits)).toBe(originalSettings);
});

it("keeps a successful fitted size and restores authored size after a shorter edit", () => {
  const node = document.createElement("div");
  runValidation.mockImplementation((element, settings) => {
    if (settings.textfit) element.style.fontSize = "7px";
    return !element.style.fontSize;
  });
  fitOnOverflow(node, limits);
  expect(node.style.fontSize).toBe("7px");
  runValidation.mockReturnValue(false);
  fitOnOverflow(node, limits);
  expect(node.style.fontSize).toBe("");
});

it("checks the configured maximum before considering fitting", () => {
  const node = document.createElement("div");
  fitOnOverflow(node, {
    ...limits,
    textfitConfig: { minFontSize: 85, maxFontSize: 95 },
  });
  expect(node.style.fontSize).toBe("95%");
  expect(runValidation).toHaveBeenCalledTimes(1);
});

it("does not fit an unmeasurable hidden element", () => {
  jest.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(0);
  fitOnOverflow(document.createElement("div"), limits);
  expect(runValidation).not.toHaveBeenCalled();
});

it("waits for fonts, checks edits, and removes resize listeners on unmount", async () => {
  const previousFonts = document.fonts;
  let resolveFonts;
  const addFontListener = jest.fn();
  const removeFontListener = jest.fn();
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: {
      ready: new Promise((resolve) => {
        resolveFonts = resolve;
      }),
      addEventListener: addFontListener,
      removeEventListener: removeFontListener,
    },
  });
  const removeListener = jest.spyOn(window, "removeEventListener");
  try {
    const { rerender, unmount } = render(
      <FitOnOverflowLimiter {...limits}>
        <div>Original copy</div>
      </FitOnOverflowLimiter>
    );
    expect(runValidation).not.toHaveBeenCalled();
    await act(async () => {
      resolveFonts();
    });
    expect(runValidation).toHaveBeenCalledTimes(1);
    await act(async () => {
      rerender(
        <FitOnOverflowLimiter {...limits}>
          <div>Edited copy</div>
        </FitOnOverflowLimiter>
      );
    });
    expect(runValidation).toHaveBeenCalledTimes(2);
    unmount();
    expect(removeFontListener).toHaveBeenCalledWith(
      "loadingdone",
      expect.any(Function)
    );
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
  } finally {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: previousFonts,
    });
  }
});

it("does not run a pending font check after unmount", async () => {
  const { unmount } = render(
    <FitOnOverflowLimiter {...limits}>
      <div>Copy</div>
    </FitOnOverflowLimiter>
  );
  unmount();
  await act(async () => {});
  expect(runValidation).not.toHaveBeenCalled();
});

it.each([
  [false, true, "true"],
  [true, false, "false"],
  [true, true, "false"],
])(
  "only opts block text into custom fitting when enabled (%s, %s)",
  async (fitOnlyOnOverflow, textfit, stockFitting) => {
    const { getByTestId } = render(
      <TextElement
        destructedProp={{ value: "Offer description" }}
        dynamicClassName="post-saving-amount"
        lines={2}
        textfit={textfit}
        fitOnlyOnOverflow={fitOnlyOnOverflow}
      />
    );
    await act(async () => {});
    expect(getByTestId("limiter")).toHaveAttribute(
      "data-textfit",
      stockFitting
    );
    expect(runValidation).toHaveBeenCalledTimes(
      fitOnlyOnOverflow && textfit ? 1 : 0
    );
  }
);
