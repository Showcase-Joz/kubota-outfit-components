import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { TextElement } from "./sharedV2/TextElement.js";
import rawComponentStarterTextSettings from "../utils/componentStarterTextSettings.json" with { type: "json" };

// Copy this file and its companion files using docs/component-starter.md.
// Keep declarations self-contained for templates that do not import JSON.
export const componentStarterTextSettings = rawComponentStarterTextSettings;
export type ComponentStarterPreset = keyof typeof componentStarterTextSettings;

export type ComponentStarterField = {
  value: string | number | null;
  ids?: Record<string, unknown>;
};

export type ComponentStarterFallbackContent = {
  // TODO: Replace this sample field with your component's content fields.
  placeholderText?: ComponentStarterField;
};

export type ComponentStarterTextSettings = {
  placeholderText?: {
    lines?: number;
    textfit?: boolean;
    min?: number;
    max?: number;
  };
};

export interface ComponentStarterProps {
  preset?: ComponentStarterPreset;
  placeholderText?: ComponentStarterField;
  fallbackContent?: ComponentStarterFallbackContent;
  /** Existing template alias; fallbackContent takes priority. */
  dummyData?: ComponentStarterFallbackContent;
  /** Optional overrides for the selected preset's placeholder limits. */
  textSettings?: ComponentStarterTextSettings;
  className?: string;
  children?: ReactNode;
}

export const defaultComponentStarterFallbackContent: ComponentStarterFallbackContent =
  {
    placeholderText: { value: "Component starter" },
  };

const ComponentStarterWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  color: var(--color-black, #000);
  font-family: var(--font-family-inter-default, Inter, Arial, sans-serif);

  /* Set font sizes on the parent so TextElement can inherit fitted sizes. */
  .component-starter-content {
    font-size: 1rem;
  }

  /* TODO: Add each layout's CSS as you work through the designs. */
  &[data-preset="print"] {
  }
  &[data-preset="tractru"] {
  }
  &[data-preset="web-banner"] {
  }
  &[data-preset="300x600"] {
  }
  &[data-preset="160x600"] {
  }
  &[data-preset="300x250"] {
  }
  &[data-preset="728x90"] {
  }
`;

export const ComponentStarter = ({
  preset = "print",
  placeholderText,
  fallbackContent,
  dummyData,
  textSettings,
  className,
  children,
}: ComponentStarterProps) => {
  // Explicit fields win over starting content. Null/blank clears; zero is valid.
  // Keep the complete field object so Outfit inline-edit ids survive.
  const field =
    placeholderText ??
    fallbackContent?.placeholderText ??
    dummyData?.placeholderText ??
    defaultComponentStarterFallbackContent.placeholderText;
  const resolvedField = { ...field, value: field?.value ?? "" };
  const presetSettings: ComponentStarterTextSettings =
    componentStarterTextSettings[preset];
  const limits = {
    ...presetSettings.placeholderText,
    ...textSettings?.placeholderText,
  };

  return (
    <ComponentStarterWrapper className={className} data-preset={preset}>
      {/* TODO: Build your markup here; this is one editable text example only. */}
      <div className="component-starter-content">
        <TextElement
          destructedProp={resolvedField}
          dynamicClassName="component-starter-placeholder"
          lines={limits.lines}
          textfit={limits.textfit ?? false}
          fitOnlyOnOverflow
          textfitConfig={{
            minFontSize: limits.min ?? 100,
            maxFontSize: limits.max ?? 100,
          }}
        />
      </div>
      {children}
    </ComponentStarterWrapper>
  );
};
