import dimensions from "../utils/dimension.json";
import definitions from "../../public/inputs.json";
import {
  getStageSize,
  getPreviewScale,
  PREVIEW_STORAGE_KEY,
  readPreviewInputs,
  readPreviewState,
  getPreviewInputs,
  setPreviewInput,
  resetPreviewLayout,
} from "../utils/preview";
import { data } from "../dummy/data";

beforeEach(() => window.localStorage.clear());

it("scales the complete exact-size canvas without changing its design dimensions", () => {
  const preset = dimensions.tractru;
  expect(getPreviewScale(preset, "aspect", preset.width * 2)).toBe(2);
  expect(getPreviewScale(preset, "aspect", preset.width / 2)).toBe(0.5);
  expect(getPreviewScale(preset, "exact", preset.width * 2)).toBe(1);
  expect(getPreviewScale(preset, "aspect", 0)).toBe(1);
  expect(getStageSize(preset, "exact")).toEqual({
    width: 750.2,
    height: 192.2,
  });
});

it("offers exactly the seven agreed component rectangles", () => {
  const expected = {
    print: [598, 181],
    tractru: [750.2, 192.2],
    "web-banner": [584, 600],
    "300x600": [300, 164],
    "160x600": [160, 198],
    "300x250": [144, 194],
    "728x90": [240, 90],
  };
  const choices = definitions.find((input) => input.tag === "aspect_selection")
    .definition.choices;
  expect(choices.map((choice) => choice.value).sort()).toEqual(
    Object.keys(expected).sort()
  );
  expect(Object.keys(dimensions).sort()).toEqual(Object.keys(expected).sort());
  for (const [key, [width, height]] of Object.entries(expected)) {
    expect(getStageSize(dimensions[key], "exact")).toEqual({
      width,
      height,
    });
    expect(getStageSize(dimensions[key], "aspect")).toEqual({
      width: "100%",
      aspectRatio: `${width} / ${height}`,
    });
  }
});

it("restores the working view without replacing empty content or numeric zero", () => {
  window.localStorage.setItem(
    PREVIEW_STORAGE_KEY,
    JSON.stringify({
      aspect_selection: { value: "tractru" },
      size_model: { value: "exact" },
      savingAmount: { value: "" },
      downPayment: { value: 0 },
      aprPaymentMonthsConnectorText: { value: "upTo" },
      formatFamily: { value: "obsolete" },
    })
  );
  const restored = readPreviewInputs();
  expect(restored.aspect_selection.value).toBe("tractru");
  expect(restored.size_model.value).toBe("exact");
  expect(restored.savingAmount.value).toBe("");
  expect(restored.downPayment.value).toBe(0);
  expect(restored.aprPaymentMonthsConnectorText.value).toBe("up to");
  expect(restored).not.toHaveProperty("formatFamily");
  expect(restored.aPR.value).toBe("0.99");
});

it("recovers from corrupt storage and obsolete size selections", () => {
  window.localStorage.setItem(PREVIEW_STORAGE_KEY, "not json");
  expect(readPreviewInputs().aspect_selection.value).toBe("print");
  window.localStorage.setItem(
    PREVIEW_STORAGE_KEY,
    JSON.stringify({
      aspect_selection: { value: "__proto__" },
      size_model: { value: "obsolete" },
    })
  );
  const restored = readPreviewInputs();
  expect(restored.aspect_selection.value).toBe("print");
  expect(restored.size_model.value).toBe("aspect");
});

it("switches layout baselines while preserving each layout's edits after reload", () => {
  let state = setPreviewInput(
    readPreviewState(),
    "aspect_selection",
    "160x600"
  );
  expect(getPreviewInputs(state).aPR.value).toBe("available");
  state = setPreviewInput(state, "aPR", "4.99");
  state = setPreviewInput(state, "savingAmount", "");
  state = setPreviewInput(state, "downPayment", 0);
  state = setPreviewInput(state, "size_model", "exact");
  state = setPreviewInput(state, "aspect_selection", "300x600");
  expect(getPreviewInputs(state).aPR.value).toBe("1.99");
  expect(getPreviewInputs(state).savingAmount.value).toBe("2500");
  window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(state));
  state = setPreviewInput(readPreviewState(), "aspect_selection", "160x600");
  const restored = getPreviewInputs(state);
  expect(restored.aPR.value).toBe("4.99");
  expect(restored.savingAmount.value).toBe("");
  expect(restored.downPayment.value).toBe(0);
  expect(restored.size_model.value).toBe("exact");
});

it("resets only the current layout and follows updated defaults for unedited fields", () => {
  let state = setPreviewInput(readPreviewState(), "aPR", "3.99");
  state = setPreviewInput(state, "aspect_selection", "300x600");
  state = setPreviewInput(state, "aPR", "4.99");
  const originalValue = data["300x600"].aPR.value;
  try {
    data["300x600"].aPR.value = "2.99";
    expect(getPreviewInputs(state).aPR.value).toBe("4.99");
    state = resetPreviewLayout(state);
    expect(getPreviewInputs(state).aPR.value).toBe("2.99");
    state = setPreviewInput(state, "aspect_selection", "print");
    expect(getPreviewInputs(state).aPR.value).toBe("3.99");
  } finally {
    data["300x600"].aPR.value = originalValue;
  }
});

it("migrates the previous flat form without applying its edits to other layouts", () => {
  window.localStorage.setItem(
    PREVIEW_STORAGE_KEY,
    JSON.stringify({
      aspect_selection: { value: "160x600" },
      aPR: { value: "0.99" },
      downPayment: { value: "" },
    })
  );
  let state = readPreviewState();
  expect(getPreviewInputs(state).aPR.value).toBe("0.99");
  expect(getPreviewInputs(state).downPayment.value).toBe("");
  state = setPreviewInput(state, "aspect_selection", "300x600");
  expect(getPreviewInputs(state).aPR.value).toBe("1.99");
  expect(getPreviewInputs(state).downPayment.value).toBe("0");
});
