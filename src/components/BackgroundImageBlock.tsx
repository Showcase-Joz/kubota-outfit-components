/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Image } from "./Image.js";
import type { ReactNode } from "react";

export type BackgroundImageBlockField = {
  value: string;
};
/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type BackgroundImageBlockFallbackContent = {
  backgroundImage?: BackgroundImageBlockField;
};

const defaultBackgroundImageBlockFallbackContent: BackgroundImageBlockFallbackContent =
  {
    backgroundImage: {
      value: "", // You can set a default image URL here for local development or preview purposes
    },
  };

export interface BackgroundImageBlockProps {
  children?: ReactNode;

  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   backgroundImage: { value: "https://example.com/image.jpg" }
   * }
   */
  fallbackContent?: BackgroundImageBlockFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: BackgroundImageBlockFallbackContent;
  /** Optional nested structure for client-specific content/layout. */
  /**
   * If no image is provided through props, the component will fall back to using the `value` from `fallbackContent` or `dummyData` for preview purposes. This allows you to set a default image for local development or when live data is unavailable.
   */
  backgroundImage?: BackgroundImageBlockField;
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
}

const BackgroundImageBlockWrapper = styled.div`
  container-name: backgroundImage;
  container-type: size;
  /* background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%; */
  width: 100cqi;
  height: 100cqb;
`;

const BackgroundImageBlock = ({
  children,
  fallbackContent,
  dummyData,
  backgroundImage,
  dynamicBackgroundImageClassName,
  altTag,
  imageLayout = "cover",
  imagePosition = "center",
  lang = "en",
}: BackgroundImageBlockProps) => {
  const content =
    fallbackContent || dummyData || defaultBackgroundImageBlockFallbackContent;

  return (
    <BackgroundImageBlockWrapper
      className={`backgroundImage${!!lang ? `--${lang}` : ""}`}
    >
      <Image
        alt={altTag || "Background image"}
        imageProp={backgroundImage}
        dummyImg={content.backgroundImage?.value}
        dynamicClassName={`background-image ${dynamicBackgroundImageClassName} `}
        imageLayout={imageLayout}
        imagePosition={imagePosition}
      ></Image>
      {children}
    </BackgroundImageBlockWrapper>
  );
};

export { BackgroundImageBlock };
