import { offerPreview } from "../utils/preview";
import {
  componentStarterPreview,
  warrantyPreview,
  isPreviewInputVisible,
} from "../utils/workspace";
import definitions from "../../public/inputs.json";
import { warrantyData } from "../dummy/warrantyData";

beforeEach(() => window.localStorage.clear());

it("keeps starter edits per layout and exposes only its working controls", () => {
  const tag = "componentStarterPlaceholderText";
  let state = componentStarterPreview.readPreviewState();
  expect(state.preset).toBe("print");
  state = componentStarterPreview.setPreviewInput(state, tag, "");
  window.localStorage.setItem(
    componentStarterPreview.storageKey,
    JSON.stringify(state)
  );
  expect(componentStarterPreview.readPreviewInputs()[tag].value).toBe("");
  state = componentStarterPreview.setPreviewInput(
    state,
    "aspect_selection",
    "300x250"
  );
  expect(componentStarterPreview.getPreviewInputs(state)[tag].value).toBe(
    "Component starter"
  );
  state = componentStarterPreview.setPreviewInput(
    state,
    "aspect_selection",
    "print"
  );
  expect(componentStarterPreview.getPreviewInputs(state)[tag].value).toBe("");
  expect(offerPreview.readPreviewInputs().savingAmount.value).toBeDefined();
  expect(warrantyPreview.readPreviewInputs().serviceType.value).toBe(
    "k-maintenance"
  );
  expect(
    definitions
      .filter((input) =>
        isPreviewInputVisible(input.tag, "componentStarter", "print")
      )
      .map((input) => input.tag)
  ).toEqual(["aspect_selection", "size_model", tag]);
  expect(isPreviewInputVisible(tag, "offer", "print")).toBe(false);
  expect(isPreviewInputVisible(tag, "warranty", "print")).toBe(false);
});

it("opens warranty at 300x600 with the approved available/maintenance baseline", () => {
  const inputs = warrantyPreview.readPreviewInputs();
  expect(inputs.aspect_selection.value).toBe("300x600");
  expect(inputs.aPR.value).toBe("available");
  expect(inputs.paymentMonths.value).toBe("notApplicable");
  expect(inputs.downPayment.value).toBe("");
  expect(inputs.serviceType.value).toBe("k-maintenance");
});

it("preserves offer edits independently of warranty edits and reloads cleared warranty amounts", () => {
  const offer = offerPreview.setPreviewInput(
    offerPreview.readPreviewState(),
    "savingAmount",
    "1234"
  );
  window.localStorage.setItem(offerPreview.storageKey, JSON.stringify(offer));
  let warranty = warrantyPreview.setPreviewInput(
    warrantyPreview.readPreviewState(),
    "savingAmount",
    ""
  );
  warranty = warrantyPreview.setPreviewInput(warranty, "serviceType", "hide");
  warranty = warrantyPreview.setPreviewInput(
    warranty,
    "warrantyText",
    "Service\non us"
  );
  window.localStorage.setItem(
    warrantyPreview.storageKey,
    JSON.stringify(warranty)
  );
  expect(offerPreview.readPreviewInputs().savingAmount.value).toBe("1234");
  expect(warrantyPreview.readPreviewInputs().savingAmount.value).toBe("");
  expect(warrantyPreview.readPreviewInputs().warrantyText.value).toBe(
    "Service\non us"
  );
  expect(warrantyPreview.readPreviewInputs().serviceType.value).toBe("hide");
  warranty = warrantyPreview.setPreviewInput(
    warranty,
    "aspect_selection",
    "160x600"
  );
  expect(warrantyPreview.getPreviewInputs(warranty).savingAmount.value).toBe(
    "3000"
  );
  warranty = warrantyPreview.setPreviewInput(
    warranty,
    "aspect_selection",
    "300x600"
  );
  expect(warrantyPreview.getPreviewInputs(warranty).savingAmount.value).toBe(
    ""
  );
  expect(offerPreview.readPreviewInputs().savingAmount.value).toBe("1234");
});

it("uses editable per-layout warranty baselines while explicit overrides take precedence", () => {
  const original = warrantyData["300x600"];
  try {
    warrantyData["300x600"] = { warrantyText: { value: "1-Year" } };
    let state = warrantyPreview.readPreviewState();
    expect(warrantyPreview.getPreviewInputs(state).warrantyText.value).toBe(
      "1-Year"
    );
    state = warrantyPreview.setPreviewInput(state, "warrantyText", "");
    expect(warrantyPreview.getPreviewInputs(state).warrantyText.value).toBe("");
    state = warrantyPreview.resetPreviewLayout(state);
    expect(warrantyPreview.getPreviewInputs(state).warrantyText.value).toBe(
      "1-Year"
    );
  } finally {
    warrantyData["300x600"] = original;
  }
});

it("shows the additional warranty fields only for warranty and CTA fields only on web banner", () => {
  for (const field of ["discountText", "warrantyText", "serviceType"]) {
    expect(isPreviewInputVisible(field, "offer", "300x600")).toBe(false);
    expect(isPreviewInputVisible(field, "warranty", "300x600")).toBe(true);
  }
  expect(isPreviewInputVisible("callToActionText", "warranty", "300x600")).toBe(
    false
  );
  expect(
    isPreviewInputVisible("callToActionText", "warranty", "web-banner")
  ).toBe(true);
});
