/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { TextElement } from "./TextElement.js";
import { checkInputExists, onceADummyText } from "../utils/helpers.js";

export type TextField = {
  value: string;
};

export type TextBlockFallbackContent = {
  headingText?: TextBlockField;
  headingTextWrapStyle?: string;
  headingMaxHeight?: number | undefined;
  headingMaxWidthInParent?: string;
  copyText?: TextBlockField;
  copyTextWrapStyle?: string;
  textPlacement?: TextBlockField;
  baseFontSize?: string;
  hideHeadingTextOption?: boolean;
  hideCopyTextOption?: boolean;
  maxLines?: number | undefined;
  maxChars?: number | undefined;
  maxWidthInParent?: string;
  dynamicClassName?: string;
};
export type TextBlockField = {
  value: string;
  ids?: unknown;
};

const defaultTextFallbackContent: TextBlockFallbackContent = {
  headingText: {
    value: "Headline should be added here.",
  },
  headingTextWrapStyle: "auto",
  headingMaxWidthInParent: "100%",
  copyText: {
    value: "Text should be added here.",
  },
  copyTextWrapStyle: "auto",
  textPlacement: {
    value: "end start",
  },
  baseFontSize: "1em",
  hideHeadingTextOption: false,
  hideCopyTextOption: false,
  maxLines: 10,
  maxChars: undefined,
  dynamicClassName: "custom-class",
};

export interface TextProps {
  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   headingText: { value: "Headline should be added here." }
   *   headingTextWrapStyle: "auto" | "balance" | "pretty"
   *   headingMaxHeight: 200 | 250 | undefined
   *   headingMaxWidthInParent: "100%"
   *   textPlacement: { value: "start start" }
   *   copyText: { value: "Text should be added here." }
   *   dynamicClassName: "custom-class"
   *   hideHeadingTextOption: false | true
   *   hideCopyTextOption: false | true
   *   maxLines: 3 | 5 | 10 | undefined
   *   maxChars: undefined | 10 | 20 | 500
   *   copyTextWrapStyle: "auto" | "balance" | "pretty"
   *   maxWidthInParent: "70%" | "500px" | "50vw" | null
   *   baseFontSize: "1em" | "16px" | "1rem" | null
   * }
   */
  fallbackContent?: TextBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: TextBlockFallbackContent;
  /** heading text to display, can be h1 and/or h2 */
  headingText?: TextBlockField;
  /**
   * Optional CSS string to control heading text wrapping behavior, it controls how text inside an element is wrapped, providing alternate ways of determining where to create line breaks in order to fit the content within a block element. options include "auto", "balance", "pretty", etc.
   */
  headingTextWrapStyle?: string;
  /** Maximum heading height in pixels. */
  headingMaxHeight?: number | undefined;
  /**
   * Maximum width for the heading relative to its parent container. Accepts any
   * valid CSS width value, such as "70%", "500px", or "50vw".
   */
  headingMaxWidthInParent?: string;
  /** Copy text to display in the text block. */
  copyText?: TextBlockField;
  /**
   * Optional CSS string to control text wrapping behavior, it controls how text inside an element is wrapped, providing alternate ways of determining where to create line breaks in order to fit the content within a block element. options include "auto", "balance", "pretty", etc.
   */
  copyTextWrapStyle?: string;
  /** allows the user to specify the placement of both the heading and the copy text within the component's area. */
  textPlacement?: TextBlockField;
  /**
   * The base font size for the block. Heading 2 is 1.65 times smaller and copy
   * text is half the base size.
   */
  baseFontSize?: string;
  /** Hide the heading while preserving its layout area. */
  hideHeadingTextOption?: boolean;
  /** Hide the copy while preserving its layout area. */
  hideCopyTextOption?: boolean;
  /**
   * Maximum number of lines allowed in the copy text. If the text exceeds this
   * limit, TextElement applies its limiter behavior.
   */
  maxLines?: number | undefined;
  /**
   * Maximum number of characters allowed in the copy text. If the text exceeds
   * this limit, TextElement applies its limiter behavior.
   */
  maxChars?: number | undefined;

  /** Maximum width for the text block relative to its parent container. */
  maxWidthInParent?: string;
  /**
   * Additional class name for styling or targeting in container queries. It can
   * also be used to customize the heading and copy font families.
   */
  dynamicClassName?: string;
}

const TextBlockWrapper = styled.div<{
  headingTextWrapStyle?: string;
  headingMaxHeight?: number | null;
  headingMaxWidthInParent?: string;
  baseFontSize?: string;
  textPlacement?: string;
  copyTextWrapStyle?: string;
  maxWidthInParent?: string;
}>`
  container-name: textBlock;
  --gap: 0.5em;
  --base-font-size: ${(props) => props.baseFontSize || "inherit"};
  container-type: inline-size;
  height: inherit;
  width: 100cqi;
  display: grid;

  font-family: var(--font-family-inter-default);
  font-size: var(
    --clamp-size-1,
    clamp(0.45em, calc(-0.875rem + 7.333cqi), 1.5rem)
  );
  .text-wrapper {
    height: 100%;
    width: 100%;
    display: grid;
    gap: var(--gap);
    grid-template-areas:
      "heading"
      "copy";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    align-content: end;
    max-width: ${(props) => props.maxWidthInParent || "100%"};
    place-self: ${(props) => props.textPlacement || "inherit"};
    position: relative;
    font-size: inherit;
    .heading-text--hide,
    .copy-text--hide {
      display: none;
    }
    .heading-text-wrapper {
      grid-area: heading;
      font-family: var(--font-family-arial-black-default);
      font-size: inherit;
      .text-type--heading-text {
        max-height: ${(props) => props.headingMaxHeight || 200}px;
        text-wrap-style: ${(props) => props.headingTextWrapStyle || "auto"};
        max-width: ${(props) => props.headingMaxWidthInParent || "100%"};
        display: grid;
        row-gap: var(--gap);
        span.tinymce_style--dark {
          color: var(--color-black);
        }

        span.tinymce_style--light {
          color: var(--color-white);
        }

        span.tinymce_style--dark.tinymce_style--light {
          color: var(--color-orange);
        }

        > h1 {
          line-height: 1.4;
          font-size: var(--base-font-size, 2rem);
        }
        > h2 {
          line-height: 1.2;
          font-size: calc(var(--base-font-size, 2rem) / 1.65);
        }
      }
    }
    .copy-text-wrapper {
      grid-area: copy;
      font-size: inherit;
      .text-type--copy-text {
        line-height: 1.2;
        font-size: calc(var(--base-font-size, 1rem) / 2);
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
    .text-type--heading-text,
    .text-type--copy-text {
      .gradient-overlay--black & {
        color: var(--color-white);
      }

      .gradient-overlay--white & {
        color: var(--color-black);
      }
    }
  }
`;

const TextBlock = ({
  fallbackContent,
  dummyData,
  headingText,
  headingTextWrapStyle,
  headingMaxHeight,
  headingMaxWidthInParent,
  textPlacement,
  copyText,
  dynamicClassName,
  maxLines,
  maxChars,
  copyTextWrapStyle,
  maxWidthInParent,
  hideHeadingTextOption,
  hideCopyTextOption,
  baseFontSize,
}: TextProps) => {
  const content = fallbackContent || dummyData || defaultTextFallbackContent;

  const headingTextValue = onceADummyText(
    headingText,
    content.headingText?.value,
  );
  const copyTextValue = onceADummyText(copyText, content.copyText?.value);
  const textPlacementValue = checkInputExists(
    textPlacement,
    content.textPlacement?.value,
  );
  const resolvedCopyTextWrapStyle =
    copyTextWrapStyle ?? content.copyTextWrapStyle;
  const resolvedBaseFontSize = baseFontSize ?? content.baseFontSize;
  const resolvedMaxLines = maxLines ?? content.maxLines;
  const resolvedMaxChars = maxChars ?? content.maxChars;
  const resolvedMaxWidthInParent = maxWidthInParent ?? content.maxWidthInParent;
  const resolvedDynamicClassName = dynamicClassName ?? content.dynamicClassName;
  return (
    <TextBlockWrapper
      headingTextWrapStyle={
        headingTextWrapStyle || content.headingTextWrapStyle
      }
      headingMaxWidthInParent={
        headingMaxWidthInParent || content.headingMaxWidthInParent
      }
      headingMaxHeight={headingMaxHeight ?? content.headingMaxHeight}
      textPlacement={textPlacementValue || "inherit"}
      copyTextWrapStyle={resolvedCopyTextWrapStyle}
      maxWidthInParent={resolvedMaxWidthInParent}
      baseFontSize={resolvedBaseFontSize}
      className={`${resolvedDynamicClassName || ""}`}
    >
      <div className="text-wrapper">
        <div
          className={`heading-text-wrapper  ${
            hideHeadingTextOption ?? content.hideHeadingTextOption
              ? "heading-text--hide"
              : `heading-text--${headingTextValue.class}`
          }`}
        >
          <TextElement
            dummyData={content?.headingText?.value || ""}
            destructedProp={headingText}
            dynamicClassName={`heading-text`}
            height="self"
            lines={undefined}
            chars={undefined}
            textfit={false}
            textfitConfig={undefined}
          ></TextElement>
        </div>
        <div
          className={`copy-text-wrapper  ${
            hideCopyTextOption ?? content.hideCopyTextOption
              ? "copy-text--hide"
              : `copy-text--${copyTextValue.class}`
          }`}
        >
          <TextElement
            dummyData={content?.copyText?.value || ""}
            destructedProp={copyText}
            dynamicClassName={`copy-text`}
            height={undefined}
            lines={resolvedMaxLines}
            chars={resolvedMaxChars}
            textfit={false}
            textfitConfig={undefined}
          ></TextElement>
        </div>
      </div>
    </TextBlockWrapper>
  );
};

export { TextBlock };
