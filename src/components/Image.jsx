/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { checkInputExists } from "../utils/helpers.js";
import { onInlineEditClick } from "@outfit.io/react";

const ImageWrapper = styled.div`
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
    content: attr(data-before);
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: hsl(from var(--color-orange, green) h s calc(l + 20));
    background-color: rgba(0, 255, 0, 1);
    z-index: 1;
  }
  &::after {
    content: attr(data-after);
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
      content: attr(data-before-fr);
    }
  }

  [class*="-fr"] & {
    &::after {
      content: attr(data-after-fr);
    }
  }
  &.background-image--hide > img {
    display: none;
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
 *   imageType?: string
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
  imageType,
}) => {
  const handleInlineEditClick = (e) => {
    const ids = imageProp?.ids;
    const inlineEditId = ids?.value_id || ids?.id || ids?.input_id;

    if (!inlineEditId || typeof onInlineEditClick !== "function") {
      return;
    }

    onInlineEditClick({ ...ids, id: inlineEditId }, e);
  };
  return (
    <ImageWrapper
      data-before={`Add a ${imageType || "Lifestyle"} Image`}
      data-after={`${imageType || "Lifestyle"} Image REQUIRED!`}
      data-before-fr={`Ajouter une image de ${imageType || "style de vie"}`}
      data-after-fr={`Image de ${imageType || "style de vie"} REQUISE!`}
      imageType={imageType}
      imageLayout={imageLayout}
      imagePosition={imagePosition}
      theme={theme}
      onClick={handleInlineEditClick}
      className={dynamicClassName}
    >
      <img src={checkInputExists(imageProp, dummyImg)} alt={alt} />
    </ImageWrapper>
  );
};

export { Image };
