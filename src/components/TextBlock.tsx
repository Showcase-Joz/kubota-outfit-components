/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { TextElement } from "./TextElement.js";
import { checkInputExists, onceADummyText } from "../utils/helpers.js";

export type TextField = {
  value: string;
};

export type TextBlockFallbackContent = {
  copyText?: TextField;
  copyTextPlacement?: TextField;
  baseFontSize?: TextField;
  hideTextOption?: boolean;
  maxLines?: number | null;
  maxChars?: number | null;
  maxWidthInParent?: TextField;
};
export type TextBlockField = {
  value: string;
  ids?: unknown;
};

const defaultTextFallbackContent: TextBlockFallbackContent = {
  copyText: {
    value: "Text should be added here.",
  },
  copyTextPlacement: {
    value: "start start",
  },
  baseFontSize: {
    value: "1em",
  },
  hideTextOption: false,
  maxLines: 10,
  maxChars: undefined,
  maxWidthInParent: {
    value: "70%",
  },
};

export interface TextProps {
  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   copyText: { value: "Text should be added here." }
   *   copyTextPlacement: { value: "start start" }
   *   baseFontSize: { value: "1em" }
   *   hideTextOption: { value: false }
   *   maxLines: {  3 }
   *   maxChars: {  undefined }
   *   maxWidthInParent: { value: "70%" }
   *   baseFontSize: { value: "1em" }
   *   hideTextOption: { value: false }
   * }
   */
  fallbackContent?: TextBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: TextBlockFallbackContent;
  /** Text to display. */
  copyText?: string[];
  /**
   * Additional class name for the button, which can be used for styling or targeting in container queries.
   */
  dynamicClassName?: string;
  /**
   * Maximum number of lines allowed in the button text. If the text exceeds this limit, it will be set with a warning.
   */
  maxLines?: number | null;
  /**
   * Maximum number of characters allowed in the button text. If the text exceeds this limit, it will be set with a warning.
   */
  maxChars?: number | null;
  /**
   * Optional CSS string to control text wrapping behavior, it controls how text inside an element is wrapped, providing alternate ways of determining where to create line breaks in order to fit the content within a block element. options include "auto", "balance", "pretty", etc.
   */
  copyTextPlacement?: TextBlockField;
  /**
   * Optional CSS string to control text wrapping behavior, it controls how text inside an element is wrapped, providing alternate ways of determining where to create line breaks in order to fit the content within a block element. options include "auto", "balance", "pretty", etc.
   */
  copyTextWrapStyle?: string;
  //* Allows you to set a maximum width for the headline block relative to its parent container, which can help maintain design consistency and prevent the headline from becoming too wide on larger screens. Accepts any valid CSS width value (e.g., "70%", "500px", "50vw", etc.).
  maxWidthInParent?: string;
  //* Prop to control text visibility, when set to true, it will apply a class that hides the headline text after initial 'dummy data' view, allowing for layout testing or scenarios where the headline is not needed but the space should be preserved.
  hideTextOption?: boolean; // New prop to control text visibility
  /**
   * The base font size for the text.
   */
  baseFontSize?: string;
}

const TextBlockWrapper = styled.div<{
  baseFontSize?: string;
  copyTextPlacement?: string;
  copyTextWrapStyle?: string;
  maxWidthInParent?: string;
}>`
  container-name: textBlock;
  --base-font-size: ${(props) => props.baseFontSize || "inherit"};
  container-type: size;
  height: 100cqb;
  width: 100cqi;
  display: grid;
  font-family: var(--font-family-inter-default);
  font-size: var(
    --clamp-size-1,
    clamp(0.45em, calc(-0.875rem + 7.333cqi), 1.5rem)
  );
  .copy-text-wrapper {
    height: fit-content;
    max-width: ${(props) => props.maxWidthInParent || "100%"};
    place-self: ${(props) => props.copyTextPlacement || "inherit"};
    position: relative;
    &.copy-text--hide {
      display: none;
    }
    .text-type--copy-text {
      position: relative;
      line-height: 1.4;
      font-size: var(--base-font-size, 1rem);
      text-wrap-style: ${(props) => props.copyTextWrapStyle || "auto"};

      span.tinymce_style--dark {
        color: var(--color-black);
      }

      span.tinymce_style--light {
        color: var(--color-white);
      }

      span.tinymce_style--dark.tinymce_style--light {
        color: var(--color-orange);
      }
    }
  }
`;

const TextBlock = ({
  baseFontSize,
  fallbackContent,
  dummyData,
  copyText,
  dynamicClassName,
  maxWidthInParent,
  copyTextPlacement,
  copyTextWrapStyle,
  hideTextOption,
  maxLines,
  maxChars,
}: TextProps) => {
  const content = fallbackContent || dummyData || defaultTextFallbackContent;

  const copyTextValue = onceADummyText(copyText, content.copyText?.value);
  const copyTextPlacementValue = checkInputExists(
    copyTextPlacement,
    content.copyTextPlacement?.value,
  );
  return (
    <TextBlockWrapper
      copyTextPlacement={copyTextPlacementValue || "inherit"}
      copyTextWrapStyle={copyTextWrapStyle}
      maxWidthInParent={maxWidthInParent}
      baseFontSize={baseFontSize}
      className={`${dynamicClassName || ""}`}
    >
      <div
        className={`copy-text-wrapper  ${
          hideTextOption ? `copy-text--${copyTextValue.class}` : ""
        }`}
      >
        <TextElement
          dummyData={content?.copyText?.value || ""}
          destructedProp={copyText}
          dynamicClassName={`copy-text`}
          height={undefined}
          lines={maxLines || undefined}
          chars={maxChars || undefined}
          textfit={false}
          textfitConfig={undefined}
        ></TextElement>{" "}
      </div>
    </TextBlockWrapper>
  );
};

export { TextBlock };
