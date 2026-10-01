/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Limiter, onInlineEditClick } from "@outfit.io/react";
import parse from "html-react-parser";

export type ButtonCTAField = {
  value: string;
  ids?: Record<string, unknown>;
};

/**
 * Fallback content fields use the same Outfit-style input shape as live props:
 * `{ value: "..." }`.
 */
export type ButtonCTAFallbackContent = {
  buttonText?: ButtonCTAField;
};

export const defaultButtonCTAFallbackContent: ButtonCTAFallbackContent = {
  buttonText: { value: "View offer" },
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
   * Optional template starting content: `{ buttonText: { value: "..." } }`.
   * Missing fields use component defaults; an explicit buttonText input wins.
   */
  dummyData?: ButtonCTAFallbackContent;
  /** Text to display on the button. */
  buttonText?: ButtonCTAField;
}

const ButtonCTAWrapper = styled.a`
  display: block;
  background-color: var(--offer-foreground, white);
  color: var(--offer-background, black);
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  text-decoration: none;
  text-transform: uppercase;
  max-width: 100%;
  min-width: 0;
`;

// Preview-only child content; production templates choose their own CTA.
const PreviewButtonCTA = ({
  fallbackContent,
  dummyData,
  buttonText,
}: ButtonCTAProps) => {
  const content = {
    ...defaultButtonCTAFallbackContent,
    ...(fallbackContent ?? dummyData),
  };

  return (
    <ButtonCTAWrapper className="buttonCTA">
      <Limiter maxLines={1} textfit={false}>
        <div
          className="text-type--buttonText"
          onClick={(event) => {
            if (buttonText?.ids) onInlineEditClick(buttonText.ids, event);
          }}
        >
          {parse(String(buttonText?.value ?? content.buttonText?.value ?? ""))}
        </div>
      </Limiter>
    </ButtonCTAWrapper>
  );
};

export { PreviewButtonCTA };
