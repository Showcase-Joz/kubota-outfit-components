import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { OfferOptionBlockV2, WarrantyBlockV2 } from "kubota-outfit-components";
import { PreviewButtonCTA } from "./PreviewButtonCTA";
import { Placeholder } from "@outfit.io/react";
import dimensions from "../utils/dimension.json";
import { previewComponents, resolveComponent } from "../utils/workspace";
import { WarrantyPlaceholder } from "./WarrantyPlaceholder";
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
  const { label, model, data } = previewComponents[component];
  const presetId = model.resolvePreset(inputs.aspect_selection?.value);
  const preset = dimensions[presetId];
  const dummyData = data[presetId];
  const Block = component === "warranty" ? WarrantyBlockV2 : OfferOptionBlockV2;
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
          {component === "warranty" ? (
            <WarrantyPlaceholder />
          ) : (
            <Placeholder
              // image="https://files.outfit.io/media_library_items/696363/300x600.png"
              // image="https://files.outfit.io/media_library_items/696550/Financing%252BTerm%252B_Stacked.png"
              // image="https://files.outfit.io/media_library_items/696359/160x600.png"
              // image="https://files.outfit.io/media_library_items/696551/Financing%252BTerm%252B_StackedNarrow.png"
              // image="https://files.outfit.io/media_library_items/696361/300x250.png"
              // image="https://files.outfit.io/media_library_items/696552/Financing%252BTerm%252B_StackedNarrow.png"
              // image="https://files.outfit.io/media_library_items/696362/728x90.png"
              // image="https://files.outfit.io/media_library_items/696553/Financing%252BTerm_WideNarrow.png"
              // image="https://files.outfit.io/media_library_items/696364/tractru.png"
              // image="https://files.outfit.io/media_library_items/696365/non-tractru.png"
              // image="https://files.outfit.io/media_library_items/696532/Frame%25207%2520%25281%2529.png"
              // image="https://files.outfit.io/media_library_items/696360/print-ad.png"
              // image="https://files.outfit.io/media_library_items/696540/Frame%25207.png"
              // offerOptionBlockV2TextSettings={rawOfferOptionBlockV2TextSettings} ^^

              hide
              offset={false}
            />
          )}
          <div
            className="component-preview"
            style={{
              width: preset.width,
              height: preset.height,
              transform: `scale(${previewScale})`,
            }}
          >
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
          </div>
        </div>
      </div>
      <p className="comparison-note">
        {component === "warranty"
          ? "Warranty skeleton: add measured styling in WarrantyBlockV2.tsx, starting with 300×600."
          : "Editing the shared library component. Artwork and inputs belong to this preview."}
        {mode === "aspect" &&
          " Aspect scales the exact-size component uniformly to fit this view."}
      </p>
    </Workspace>
  );
};
