import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  ComponentStarter,
  OfferOptionBlockV2,
  WarrantyBlockV2,
  Section179Block,
} from "kubota-outfit-components";
import { PreviewButtonCTA } from "./PreviewButtonCTA";
import dimensions from "../utils/dimension.json";
import { previewComponents, resolveComponent } from "../utils/workspace";
import { ArtworkPlaceholder } from "./ArtworkPlaceholder";
import { getStageSize, getPreviewScale } from "../utils/preview";

const Workspace = styled.main`
  padding: 24px;
  min-width: 0;
  color: #e8e9ed;
  background: #17191d;
  min-height: 100vh;

  .comparison-heading {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    font:
      14px/1.5 Arial,
      sans-serif;
    h1 {
      font-size: 18px;
      font-weight: 700;
    }
    p {
      color: #b9bec8;
    }
    output {
      font-variant-numeric: tabular-nums;
    }
  }
  .comparison-viewport {
    width: 100%;
    overflow: auto;
    padding: 1px;
  }
  .comparison-stage {
    position: relative;
    flex-shrink: 0;
    background: #ddd;
    outline: 1px solid #686d77;
  }
  .component-preview {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: top left;
    overflow: hidden;
  }
  .comparison-note {
    margin-top: 14px;
    font:
      12px/1.5 Arial,
      sans-serif;
    color: #b9bec8;
  }
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

export const Container = ({ inputs = {} }) => {
  const component = resolveComponent(inputs.component_selection?.value);
  const { label, model, data, dimensionOverrides } = previewComponents[component];
  const presetId = model.resolvePreset(inputs.aspect_selection?.value);
  const preset = {
    ...dimensions[presetId],
    ...dimensionOverrides?.[presetId],
  };
  const dummyData = data[presetId];
  const Block =
    component === "section179"
      ? Section179Block
      : component === "warranty"
        ? WarrantyBlockV2
        : OfferOptionBlockV2;
  const mode = inputs.size_model?.value === "exact" ? "exact" : "aspect";
  const size = getStageSize(preset, mode);
  const stageRef = useRef(null);
  const [measured, setMeasured] = useState(preset);
  const previewScale = getPreviewScale(preset, mode, measured.width);

  useEffect(() => {
    let frame;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      cancelAnimationFrame(frame);
      // Report after layout settles; never resize from inside the observer.
      frame = requestAnimationFrame(() => {
        setMeasured((previous) => {
          if (previous.width === width && previous.height === height) {
            return previous;
          }
          return { width, height };
        });
      });
    });
    observer.observe(stageRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const showCTA = presetId === "web-banner" && inputs.showCTA?.value !== "hide";
  return (
    <Workspace>
      <header className="comparison-heading">
        <div>
          <h1>{label} comparison</h1>
          <p>
            {preset.label} · target {preset.width} × {preset.height} px · no
            angled edges
          </p>
        </div>
        <output aria-label="Rendered dimensions">
          {mode === "exact" ? "Exact" : "Aspect"} ·{" "}
          {Number(measured.width.toFixed(1))} ×{" "}
          {Number(measured.height.toFixed(1))} px ·{" "}
          {Math.round(previewScale * 100)}%
        </output>
      </header>
      <div className="comparison-viewport">
        <div
          className="comparison-stage"
          ref={stageRef}
          data-preset={presetId}
          data-mode={mode}
          style={size}
        >
          <ArtworkPlaceholder component={component} preset={presetId} />
          <div
            className="component-preview"
            style={{
              width: preset.width,
              height: preset.height,
              transform: `scale(${previewScale})`,
            }}
          >
            {component === "componentStarter" ? (
              <ComponentStarter
                preset={presetId}
                dummyData={dummyData}
                placeholderText={inputs.componentStarterPlaceholderText}
              />
            ) : (
              <Block
                preset={presetId}
                dummyData={dummyData}
                backgroundColor={inputs.offerTheming}
                aPR={inputs.aPR}
                aprPaymentMonthsConnectorText={
                  inputs.aprPaymentMonthsConnectorText
                }
                paymentMonths={inputs.paymentMonths}
                downPayment={inputs.downPayment}
                connectorLinesText={inputs.connectorLinesText}
                savingAmountPreText={inputs.savingAmountPreText}
                savingAmount={inputs.savingAmount}
                savingAmountPostText={inputs.savingAmountPostText}
                {...(component === "section179"
                  ? {
                      section179connectorLinesText:
                        inputs.section179connectorLinesText,
                      section179Text: inputs.section179Text,
                      section179PostText: inputs.section179PostText,
                    }
                  : {})}
                {...(component === "warranty"
                  ? {
                      discountText: inputs.discountText,
                      warrantyText: inputs.warrantyText,
                      serviceType: inputs.serviceType,
                    }
                  : {})}
              >
                {showCTA && (
                  <PreviewButtonCTA
                    buttonText={inputs.callToActionText}
                    dummyData={dummyData}
                  />
                )}
              </Block>
            )}
          </div>
        </div>
      </div>
      <p className="comparison-note">
        {component === "componentStarter"
          ? "Edit ComponentStarter.tsx in the library. Existing component rectangles are used as your starting canvas."
          : component === "warranty"
            ? "Warranty skeleton: add measured styling in WarrantyBlockV2.tsx, starting with 300×600."
            : "Editing the shared library component. Artwork and inputs belong to this preview."}
        {mode === "aspect" &&
          " Aspect scales the exact-size component uniformly to fit this view."}
      </p>
    </Workspace>
  );
};
