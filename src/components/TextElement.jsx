/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Limiter, onInlineEditClick } from "@outfit.io/react";
import parse from "html-react-parser";
import { checkInputExists, formatMoney } from "../utils/helpers.js";
const TextElementWrapper = styled.div``;

/**
 * @typedef {object} TextElementProps
 * @property {*} destructedProp
 * @property {string} dynamicClassName
 * @property {number | undefined} [lines]
 * @property {number | undefined} [chars]
 * @property {number | string | undefined} [height]
 * @property {*} [dummyData]
 * @property {string | undefined} [property]
 * @property {{ name?: * } | undefined} [options]
 * @property {boolean | undefined} [textfit]
 * @property {Record<string, any> | undefined} [textfitConfig]
 * @property {string | undefined} [lang]
 * @property {* | undefined} [overflowMessage]
 */

/**
 * @param {TextElementProps} props
 */
const TextElement = ({
  destructedProp,
  dynamicClassName,
  lines,
  chars,
  height,
  dummyData,
  property,
  options,
  textfit,
  textfitConfig,
  lang = "en",
  overflowMessage = null,
}) => {
  const localOPtions = options === undefined ? dummyData : options.name;
  const text =
    checkInputExists(destructedProp, localOPtions, property) || localOPtions;

  const handleInlineEditClick = (e) => {
    if (!destructedProp?.ids || typeof onInlineEditClick !== "function") {
      return;
    }

    onInlineEditClick(destructedProp.ids, e);
  };

  return (
    <Limiter
      maxLines={lines}
      maxChars={chars}
      maxHeight={height}
      textfit={textfit}
      textfitConfig={textfitConfig}
      overflowMessage={overflowMessage}
    >
      <TextElementWrapper
        className={`text-type--${dynamicClassName}`}
        onClick={handleInlineEditClick}
      >
        {dynamicClassName === "incentive-amount" || dynamicClassName === "aPR"
          ? formatMoney(text, lang, dummyData)
          : parse(String(text ?? ""))}
      </TextElementWrapper>
    </Limiter>
  );
};

export { TextElement };
