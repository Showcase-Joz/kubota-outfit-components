/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { checkInputExists } from "../utils/helpers";
import { onInlineEditClick } from "@outfit.io/react";

const ImageWrapper = styled.div`
  &.image-type--background-image {
    width: inherit;
    height: inherit;
    position: fixed;
    img {
      object-fit: ${({ imageLayout }) => imageLayout || "cover"};
      object-position: ${({ imagePosition }) => imagePosition || "center"};
      width: inherit;
      height: inherit;
      z-index: 2;
      position: relative;
      &[src=""]:empty {
        display: none;
      }
    }
    &::before {
      display: grid;
      place-items: center;
      color: var(--color-white);
      font-family: var(--font-family-inter-default);
      font-weight: 600;
      font-size: clamp(16px, 5cqw, 7.5vw);
      content: "Add Lifestyle Image";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: var(--color-orange);
      z-index: 1;
    }
    &::after {
      content: "Lifestyle Image REQUIRED!";
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      color: var(--color-white);
      font-family: var(--font-family-inter-default);
      font-weight: 600;
      font-size: clamp(8px, 3cqw, 4vw);
      z-index: 1;
      align-content: center;
      text-align: center;
      margin-top: 1.6em;
    }
    [class*="-fr"] & {
      &::before {
        content: "Ajouter une image de style de vie";
      }
    }

    [class*="-fr"] & {
      &::after {
        content: "Image de style de vie REQUISE!";
      }
    }
    &.background-image--hide > img {
      display: none;
    }
  }
`;

/**
 * @param {{
 *   imageProp?: any,
 *   dynamicClassName?: string,
 *   theme?: any,
 *   property?: any,
 *   dummyImg?: string,
 *   alt: string
 *   imageLayout?: string,
 *   imagePosition?: string
 * }} props
 */

const Image = ({
  imageProp,
  dummyImg,
  dynamicClassName,
  theme,
  property,
  alt,
  imageLayout,
  imagePosition,
}) => {
  return (
    <ImageWrapper
      imageLayout={imageLayout}
      imagePosition={imagePosition}
      theme={theme}
      onClick={(e) => onInlineEditClick(imageProp.ids, e)}
      className={`image-type--${dynamicClassName}`}
    >
      <img src={checkInputExists(imageProp, dummyImg)} alt={alt} />
    </ImageWrapper>
  );
};

export { Image };
