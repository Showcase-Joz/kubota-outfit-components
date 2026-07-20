/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { TextElement } from "./TextElement.js";
import { checkInputExists, onceADummyText } from "../utils/helpers.js";
import { ReactNode } from "react";

export type HeadlineBlockField = {
  value: string;
  ids?: unknown;
};

export type HeadlineBlockFallbackContent = {
  headlineText?: HeadlineBlockField;
  headlinePlacement?: HeadlineBlockField;
};
const defaultHeadlineBlockFallbackContent: HeadlineBlockFallbackContent = {
  headlineText: {
    value: "multi line headline here - Required!", // You can set a default image URL here for local development or preview purposes
  },
  headlinePlacement: {
    value: "inherit", // You can set a default image URL here for local development or preview purposes
  },
};

export interface HeadlineBlockProps {
  children?: ReactNode;

  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   headlineText: { value: "Your headline text here" }
   *   headlinePlacement: { value: "center" }
   *   maxLines: 3
   *   textWrapStyle: "balance"
   *   maxWidthInParent: { value: "70%" }
   *   hideTextOption: true
   *   additional CSS properties for headline styling and placement can be added as needed within the parent container or through dynamicClassName
   * }
   */
  fallbackContent?: HeadlineBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: HeadlineBlockFallbackContent;
  /** Optional nested structure for client-specific content/layout. */
  /**
   * If no image is provided through props, the component will fall back to using the `value` from `fallbackContent` or `dummyData` for preview purposes. This allows you to set a default image for local development or when live data is unavailable.
   */
  headlineText?: HeadlineBlockField;
  /**
   * Class name applied to the inner Image component, which can be targeted by container queries for dynamic styling based on layout conditions.
   */
  dynamicClassName?: string;
  /**
   * updates the position of the headline text within the container, allowing for dynamic placement based on layout conditions or client preferences. Accepts values like "start center", "end center", "center", "start end", etc.
   */
  headlinePlacement?: HeadlineBlockField;
  /**
   * Limits the headline to a specified number of lines. This is useful for maintaining design consistency and preventing overflow in dynamic layouts. Accepts a number representing the maximum lines to display.
   */
  maxLines?: number;
  /**
   * Optional CSS string to control text wrapping behavior, it controls how text inside an element is wrapped, providing alternate ways of determining where to create line breaks in order to fit the content within a block element. options include "auto", "balance", "pretty", etc.
   */
  textWrapStyle?: string;
  //* Allows you to set a maximum width for the headline block relative to its parent container, which can help maintain design consistency and prevent the headline from becoming too wide on larger screens. Accepts any valid CSS width value (e.g., "70%", "500px", "50vw", etc.).
  maxWidthInParent?: string;
  //* Prop to control text visibility, when set to true, it will apply a class that hides the headline text after initial 'dummy data' view, allowing for layout testing or scenarios where the headline is not needed but the space should be preserved.
  hideTextOption?: boolean; // New prop to control text visibility
}

const HeadlineBlockWrapper = styled.div<{
  headlinePlacementValue?: string;
  textWrapStyle?: string;
  maxWidthInParent?: string;
}>`
  container-name: headlineBlock;
  container-type: size;
  height: 100cqb;
  width: 100cqi;
  display: grid;
  font-size: var(
    --clamp-size-1,
    clamp(0.65em, calc(-0.875rem + 7.333cqi), 8.5rem)
  );
  font-family: var(--font-family-arial-black-default);
  .headline-wrapper {
    text-transform: uppercase;
    height: fit-content;
    max-width: ${(props) => props.maxWidthInParent || "100%"};
    place-self: ${(props) => props.headlinePlacementValue || "inherit"};
    position: relative;
    &.headline--hide {
      display: none;
    }
    .text-type--headline {
      position: relative;
      text-wrap: ${(props) => props.textWrapStyle || "auto"};

      span.tinymce_style--dark {
        color: var(--color-orange);
      }

      span.tinymce_style--light {
        color: var(--color-white);
      }

      span.tinymce_style--dark.tinymce_style--light {
        color: var(--color-sub-text-gray);
      }
    }
  }
`;

const HeadlineBlock = ({
  fallbackContent,
  dummyData,
  headlineText,
  maxLines,
  dynamicClassName,
  headlinePlacement,
  textWrapStyle,
  maxWidthInParent,
  hideTextOption,
}: HeadlineBlockProps) => {
  const content =
    fallbackContent || dummyData || defaultHeadlineBlockFallbackContent;

  const headlineTextValue = onceADummyText(
    headlineText,
    content.headlineText?.value,
  );
  const headlinePlacementValue = checkInputExists(
    headlinePlacement,
    content.headlinePlacement?.value,
  );

  return (
    <HeadlineBlockWrapper
      className={`${dynamicClassName} headline-block-wrapper`}
      headlinePlacementValue={headlinePlacementValue || "inherit"}
      textWrapStyle={textWrapStyle}
      maxWidthInParent={maxWidthInParent}
    >
      <div
        className={`headline-wrapper  ${
          hideTextOption ? `headline--${headlineTextValue.class}` : ""
        }`}
      >
        <TextElement
          dummyData={headlineTextValue?.dummyData || ""}
          destructedProp={headlineText}
          dynamicClassName={`headline`}
          height={undefined}
          lines={maxLines}
          chars={undefined}
          textfit={false}
          textfitConfig={undefined}
        ></TextElement>
      </div>
    </HeadlineBlockWrapper>
  );
};

export { HeadlineBlock };
