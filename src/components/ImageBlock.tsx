/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Image } from "./Image.js";
import type { ReactNode } from "react";

export type ImageBlockField = {
  value: string;
};
/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type ImageBlockFallbackContent = {
  sourceImage?: ImageBlockField;
};

const defaultImageBlockFallbackContent: ImageBlockFallbackContent = {
  sourceImage: {
    value: "", // You can set a default image URL here for local development or preview purposes
  },
};

export interface ImageBlockProps {
  children?: ReactNode;

  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   sourceImage: { value: "https://example.com/image.jpg" }
   * }
   */
  fallbackContent?: ImageBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: ImageBlockFallbackContent;
  /** Optional nested structure for client-specific content/layout. */
  /**
   * If no image is provided through props, the component will fall back to using the `value` from `fallbackContent` or `dummyData` for preview purposes. This allows you to set a default image for local development or when live data is unavailable.
   */
  sourceImage?: ImageBlockField;
  /**
   * e.g. "studio", "editorial", etc., used for the 'image required' message.
   */
  imageType?: string;
  /**
   * Class name applied to the inner Image component, which can be targeted by container queries for dynamic styling based on layout conditions.
   */
  dynamicSourceImageClassName?: string;
  /**
   * alt text for the image, used for accessibility. If not provided, it will default to "Background image".
   */
  altTag?: string;
  /**
   * CSS `background-size` value to control how the background image fills the container.
   * Examples: "cover", "contain", "100% auto", etc.
   */

  imageLayout?: string;
  /**
   * CSS `background-position` value to control the focal point of the background image.
   * Examples: "center", "top", "left center", "50% 50%", etc.
   */
  imagePosition?: string;
  /**
   * Background color used for the image placeholder pseudo-element.
   */
  beforeBackgroundColor?: string;
  /**
   * Optional language code to apply language-specific container query styles. When required image is missing, message will be displayed in the specified language.
   */
  lang?: string;

  /**
   * // e.g. "absolute", "relative", etc., used to control the positioning of the image within the layout. This can be used in conjunction with container queries to create dynamic layouts where the image position changes based on the available space or aspect ratio.
   */
  position?: string;
  /**
   * Optional max-height and max-width constraints for the image, which can be used to prevent the image from exceeding certain dimensions within dynamic layouts. These can be specified in any valid CSS unit (e.g., "100cqb", "500px", "50%", etc.) and can help maintain design consistency and prevent overflow issues.
   */

  height?: string;
  width?: string;
  /**
   * When using absolute positioning, the `top`, `left`, `right`, and `bottom` properties can be used to specify the offset of the image from its containing block. These values can be set in any valid CSS unit (e.g., "10px", "5%", "2em", etc.) and will determine the final position of the image within the layout. For example, setting `top: "10px"` and `left: "20px"` would position the image 10 pixels from the top and 20 pixels from the left of its containing block. Ideally these are locked in at development time to ensure consistent layouts, but they can also be dynamically adjusted based on layout conditions using range slider inputs.
   */
  top: string;
  left: string;
  right: string;
  bottom: string;
}

const ImageBlockWrapper = styled.div<{
  $position?: string;
  $height?: string;
  $width?: string;
  $imageType?: string;
  $top?: string;
  $left?: string;
  $right?: string;
  $bottom?: string;
}>`
  container-name: ${(props) =>
    props.$imageType ? `${props.$imageType}-image` : "imageBlock"};
  container-type: size;
  // INFO if set to absolute, the image will be taken out of the normal document flow and positioned according to the top, right, bottom, and left properties. This allows for more flexible layouts, but requires careful handling to ensure that the image is positioned correctly across different screen sizes and content arrangements. When using absolute positioning, it's important to consider the containing block and how it affects the layout of other elements on the page.
  position: ${(props) => props.$position || "relative"};
  height: ${(props) => props.$height};
  width: ${(props) => props.$width};
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
  right: ${(props) => props.$right};
  bottom: ${(props) => props.$bottom};
`;

const ImageBlock = ({
  children,
  fallbackContent,
  dummyData,
  sourceImage,
  imageType = "Lifestyle",
  dynamicSourceImageClassName,
  altTag,
  imageLayout = "cover",
  imagePosition = "center",
  lang = "en",
  position = "relative",
  height = "100cqb",
  width = "100cqi",
  top = "unset",
  left = "unset",
  right = "unset",
  bottom = "unset",
  beforeBackgroundColor = "rgba(from blue 200 g b / 0.5)",
}: ImageBlockProps) => {
  const content =
    fallbackContent || dummyData || defaultImageBlockFallbackContent;

  return (
    <ImageBlockWrapper
      $imageType={imageType}
      $height={height}
      $width={width}
      $position={position}
      $top={top}
      $left={left}
      $right={right}
      $bottom={bottom}
      className={`${imageType}${!!lang ? `--${lang}` : ""} image-wrapper ${
        !!sourceImage?.value ? "image--present" : "image--missing"
      }`}
    >
      <Image
        alt={altTag || `${imageType} Image`}
        imageProp={sourceImage}
        dummyImg={content.sourceImage?.value}
        dynamicClassName={dynamicSourceImageClassName}
        imageLayout={imageLayout}
        imagePosition={imagePosition}
        imageType={imageType}
        beforeBackgroundColor={beforeBackgroundColor}
      ></Image>
      {children}
    </ImageBlockWrapper>
  );
};

export { ImageBlock };
