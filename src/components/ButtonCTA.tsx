/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { TextElement } from "./TextElement.js";

export type ButtonCTAField = {
  value: string;
};

/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type ButtonCTAFallbackContent = {
  buttonText?: ButtonCTAField;
};

const defaultButtonCTAFallbackContent: ButtonCTAFallbackContent = {
  buttonText: {
    value: "Button Text",
  },
};

export interface ButtonCTAProps {
  /**
   * Overrides the built-in preview fallback content.
   * Use this for project-specific local previews, template defaults, or empty-state copy.
   *
   * @example
   * {
   *   buttonText: { value: "Button Text" }
   * }
   */
  fallbackContent?: ButtonCTAFallbackContent;
  /**
   * @deprecated Use fallbackContent instead.
   * Kept as a compatibility alias for existing templates and expects the same
   * `{ fieldName: { value: "..." } }` shape.
   */
  dummyData?: ButtonCTAFallbackContent;
  /** Text to display on the button. */
  buttonText?: ButtonCTAField;
}

const ButtonCTAWrapper = styled.a`
  display: inline-block;
  padding: 1.2em 1.5em;
  background-color: var(--color-white, white);
  color: var(--color-black, black);
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  justify-self: center;
  min-width: 80cqi;
  text-decoration: none;
  text-transform: uppercase;
  max-width: 100cqi;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ButtonCTA = ({
  fallbackContent,
  dummyData,
  buttonText,
}: ButtonCTAProps) => {
  const content =
    fallbackContent || dummyData || defaultButtonCTAFallbackContent;

  return (
    <ButtonCTAWrapper className="buttonCTA">
      <TextElement
        dummyData={content?.buttonText?.value || ""}
        destructedProp={buttonText}
        dynamicClassName={`buttonText`}
        height={undefined}
        lines={1}
        chars={undefined}
        textfit={false}
        textfitConfig={undefined}
      ></TextElement>
    </ButtonCTAWrapper>
  );
};

export { ButtonCTA };
