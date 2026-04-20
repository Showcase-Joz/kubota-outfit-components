/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Limiter, onInlineEditClick } from "@outfit.io/react";
import parse from "html-react-parser";
import { checkInputExists, formatMoney } from "../utils/helpers.js";
const TextElementWrapper = styled.div``;

const TextElement = ({
  destructedProp,
  dynamicClassName,
  lines,
  chars,
  height,
  dummyData,
  property = undefined,
  options = undefined,
  textfit = undefined,
  textfitConfig = undefined,
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

    const rawIds =
      inlineEditIds?.input && typeof inlineEditIds.input === "object"
        ? inlineEditIds.input
        : inlineEditIds;

    if (rawIds?.variable?.tag) {
      return rawIds;
    }

    const variableTag =
      rawIds?.variable?.tag ||
      rawIds?.variable?.variableTag ||
      rawIds?.variable?.variable_tag ||
      (typeof rawIds?.variable === "string" ? rawIds.variable : undefined) ||
      rawIds?.variableTag ||
      rawIds?.variable_tag ||
      rawIds?.tag;

    if (!variableTag) {
      return null;
    }

    return {
      ...rawIds,
      variable: {
        ...(typeof rawIds?.variable === "object" ? rawIds.variable : {}),
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
