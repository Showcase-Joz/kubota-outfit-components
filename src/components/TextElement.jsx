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
  const inlineEditIds = destructedProp?.ids;

  const normalizedInlineEditIds = (() => {
    if (!inlineEditIds || typeof inlineEditIds !== "object") {
      return null;
    }

    if (inlineEditIds?.variable?.tag) {
      return inlineEditIds;
    }

    const variableTag =
      inlineEditIds?.variable?.tag ||
      inlineEditIds?.variable?.variableTag ||
      inlineEditIds?.variable?.variable_tag ||
      (typeof inlineEditIds?.variable === "string"
        ? inlineEditIds.variable
        : undefined) ||
      inlineEditIds?.variableTag ||
      inlineEditIds?.variable_tag ||
      inlineEditIds?.input?.variable?.tag ||
      inlineEditIds?.input?.variableTag ||
      inlineEditIds?.input?.variable_tag;

    if (!variableTag) {
      return null;
    }

    return {
      ...inlineEditIds,
      variable: {
        ...(typeof inlineEditIds?.variable === "object"
          ? inlineEditIds.variable
          : {}),
        tag: variableTag,
      },
    };
  })();

  const handleInlineEditClick = (e) => {
    if (!normalizedInlineEditIds || typeof onInlineEditClick !== "function") {
      return;
    }

    onInlineEditClick(normalizedInlineEditIds, e);
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
