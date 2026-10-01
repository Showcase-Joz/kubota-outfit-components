/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import { Limiter, onInlineEditClick, runValidation } from "@outfit.io/react";
import parse from "html-react-parser";
import { FitOnOverflowLimiter } from "./FitOnOverflowLimiter.js";
import { checkInputExists, formatMoney } from "../../utils/helpers.js";
const TextElementWrapper = styled.div``;
const InlineCharacterLimitWrapper = styled.span`
  position: relative;
`;

/**
 * Outfit's Limiter renders a block div, so use its public validator on an inline
 * wrapper for character checks. The shared parent Limiter still handles phrase
 * wrapping, text-fit and the standard overflow warning styles.
 *
 * The child is the formatted TextElement span: "99,999" counts as six characters.
 * Surrounding text such as "with $" and "down" stays outside this character count.
 */
const InlineCharacterLimiter = ({ children, maxChars, overflowMessage }) => {
  const limiterRef = useRef(null);
  useEffect(() => {
    runValidation(limiterRef.current, { maxChars, overflowMessage });
  }, [children, maxChars, overflowMessage]);

  return (
    <InlineCharacterLimitWrapper ref={limiterRef}>
      {children}
    </InlineCharacterLimitWrapper>
  );
};

/**
 * Block text has its own Limiter. Inline text shares its parent's line/text-fit
 * settings, but `chars` can still validate this field's formatted characters.
 * Character limits report overflow; they do not truncate text or block input.
 * `fitOnlyOnOverflow` preserves the authored font size when it already fits.
 * Its fitting bounds are percentages, like the V2 text settings.
 *
 * @param {{
 *   destructedProp?: any,
 *   dynamicClassName?: string,
 *   lines?: number,
 *   chars?: number,
 *   height?: number,
 *   dummyData?: string | number,
 *   property?: any,
 *   options?: any,
 *   textfit?: boolean,
 *   fitOnlyOnOverflow?: boolean,
 *   textfitConfig?: any,
 *   lang?: string,
 *   overflowMessage?: string | null,
 *   inline?: boolean,
 * }} props
 */
const TextElement = ({
  destructedProp,
  dynamicClassName,
  lines,
  chars,
  height,
  dummyData,
  property = undefined,
  options = undefined,
  textfit = false,
  fitOnlyOnOverflow = false,
  textfitConfig,
  lang = "en",
  overflowMessage = null,
  inline = false,
}) => {
  const localOPtions = options === undefined ? dummyData : options.name;
  const text =
    checkInputExists(destructedProp, localOPtions, property) ?? localOPtions;

  const element = (
    <TextElementWrapper
      as={inline ? "span" : "div"}
      className={`text-type--${dynamicClassName}`}
      onClick={(e) => {
        if (destructedProp?.ids) onInlineEditClick(destructedProp.ids, e);
      }}
    >
      {dynamicClassName === "incentive-amount" ||
      dynamicClassName === "aPR" ||
      dynamicClassName === "offerAPR" ||
      dynamicClassName === "down-payment" ||
      dynamicClassName === "paymentAmount" ||
      dynamicClassName === "hours" ||
      dynamicClassName === "saving-amount"
        ? formatMoney(text, lang, dummyData)
        : parse(String(text ?? ""))}
    </TextElementWrapper>
  );

  // Keep both routes: inline fields must not introduce a block into the phrase.
  if (inline) {
    return chars ? (
      <InlineCharacterLimiter
        maxChars={chars}
        overflowMessage={overflowMessage}
      >
        {element}
      </InlineCharacterLimiter>
    ) : (
      element
    );
  }
  const BlockLimiter = textfit && fitOnlyOnOverflow ? FitOnOverflowLimiter : Limiter;
  return (
    <BlockLimiter
      maxLines={lines}
      maxChars={chars}
      maxHeight={height}
      textfit={textfit}
      textfitConfig={textfitConfig}
      overflowMessage={overflowMessage}
    >
      {element}
    </BlockLimiter>
  );
};

export { TextElement };
