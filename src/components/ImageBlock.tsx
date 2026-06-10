/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Image } from "./Image.js";
import type { ReactNode } from "react";
import { onceADummy } from "../utils/helpers.js";

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
  dynamicBackgroundImageClassName?: string;
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
}

const ImageBlockWrapper = styled.div<{
  $position?: string;
  $height?: string;
  $width?: string;
  $imageType?: string;
}>`
  container-name: ${(props) =>
    props.$imageType ? `${props.$imageType}-image` : "imageBlock"};
  container-type: size;
  /* background-size: cover;
  background-position: center;
 */
  /* width: 100cqi;
  height: 100cqb; */
  position: ${(props) => props.$position || "relative"};
  height: ${(props) => props.$height};
  width: ${(props) => props.$width};
  .image-wrapper:has([data-before]) [data-before]::before {
    background-color: rgba(from blue 200 g b / 0.5);
  }
`;

const ImageBlock = ({
  children,
  fallbackContent,
  dummyData,
  sourceImage,
  imageType = "Lifestyle",
  dynamicBackgroundImageClassName,
  altTag,
  imageLayout = "cover",
  imagePosition = "center",
  lang = "en",
  position = "relative",
  height = "100cqb",
  width = "100cqi",
}: ImageBlockProps) => {
  const content =
    fallbackContent || dummyData || defaultImageBlockFallbackContent;
  const sourceImageValue = onceADummy(sourceImage, content.sourceImage?.value);
  console.log("ImageBlock content:", sourceImageValue);
  return (
    <ImageBlockWrapper
      $imageType={imageType}
      $height={height}
      $width={width}
      $position={position}
      className={`${imageType}${!!lang ? `--${lang}` : ""}`}
    >
      <Image
        alt={altTag || `${imageType} Image`}
        imageProp={sourceImage}
        dummyImg={content.sourceImage?.value}
        dynamicClassName={dynamicBackgroundImageClassName}
        imageLayout={imageLayout}
        imagePosition={imagePosition}
        imageType={imageType}
      ></Image>
      {children}
    </ImageBlockWrapper>
  );
};

export { ImageBlock };
