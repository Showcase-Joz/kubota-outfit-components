/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Limiter, onInlineEditClick } from "@outfit.io/react";
import parse from "html-react-parser";
import { checkInputExists, formatMoney } from "../utils/helpers";
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
        onClick={(e) => onInlineEditClick(destructedProp?.ids, e)}
      >
        {dynamicClassName === "incentive-amount" || dynamicClassName === "aPR"
          ? formatMoney(text, lang, dummyData)
          : parse(String(text ?? ""))}
      </TextElementWrapper>
    </Limiter>
  );
};

export { TextElement };
