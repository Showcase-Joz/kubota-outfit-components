/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { onceADummyText } from "../utils/helpers.js";
import { TextElement } from "./TextElement.js";

export type AnnouncementBannerField = {
  value: string;
  ids?: unknown;
};

export type AnnouncementBannerFallbackContent = {
  announcementMessage?: AnnouncementBannerField;
};

export type AnnouncementBannerAbsolute = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

const defaultAnnouncementBannerFallbackContent: AnnouncementBannerFallbackContent =
  {
    announcementMessage: {
      value: "announcement",
    },
  };

interface AnnouncementBannerWrapperProps {
  $absolute?: AnnouncementBannerAbsolute;
  $isAbsolute: boolean;
  $maxWidth: string;
}

const AnnouncementBannerWrapper = styled.div<AnnouncementBannerWrapperProps>`
  --banner-offset: 1em;
  --banner-print-offset: 3mm;
  --banner-border-offset: 1em;

  container-name: announcementBanner;
  container-type: inline-size;

  display: flex;
  position: ${(props) => (props.$isAbsolute ? "absolute" : "relative")};
  left: ${(props) => {
    if (!props.$isAbsolute) return "-1em";

    return props.$absolute?.left
      ? `calc(-1 * (${props.$absolute.left}) - var(--banner-print-offset))`
      : "0";
  }};
  top: ${(props) =>
    props.$isAbsolute ? props.$absolute?.top || "auto" : "auto"};
  right: ${(props) =>
    props.$isAbsolute ? props.$absolute?.right || "auto" : "auto"};
  bottom: ${(props) =>
    props.$isAbsolute ? props.$absolute?.bottom || "auto" : "auto"};
  width: fit-content;
  max-width: ${(props) =>
    props.$isAbsolute && props.$absolute?.left
      ? `calc(${props.$maxWidth} - ${props.$absolute.left} - var(--banner-print-offset) - var(--banner-border-offset))`
      : props.$maxWidth};
  font-size: 1.1em;

  &.announcementBanner--hide {
    display: none;
  }

  .message {
    position: relative;
    z-index: 0;
    isolation: isolate;
    width: fit-content;
    min-width: fit-content;
    max-width: inherit;
    background-color: salmon;
    border-left: 1em solid;
    border-color: salmon;
    padding: min(1vh, 3cqb) 2cqi min(1vh, 3cqb) 0;
    margin-bottom: 2cqmax;
    color: white;
    font-size: inherit;
    font-weight: bold;
    text-align: left;
    text-wrap-mode: nowrap;
    z-index: 1;

    ::after {
      content: "";
      transform: skewX(20deg);
      transform-origin: left top;
      position: absolute;
      background-color: inherit;
      top: 0;
      bottom: 0;
      right: calc(-0.5 * var(--banner-offset));
      width: calc(2 * var(--banner-offset));
      height: 100.3%;
      z-index: -1;
    }
  }

  .text-type--announcementMessage {
    width: fit-content;
    min-width: fit-content;
    max-width: inherit;
    color: inherit;
    font: inherit;
    line-height: 1;
  }
`;

export interface AnnouncementBannerProps {
  fallbackContent?: AnnouncementBannerFallbackContent;
  dummyData?: AnnouncementBannerFallbackContent;
  announcementMessage?: AnnouncementBannerField;
  absolute?: AnnouncementBannerAbsolute;
  maxWidth?: string;
}

const AnnouncementBanner = ({
  fallbackContent,
  dummyData,
  announcementMessage,
  absolute,
  maxWidth = "calc(100% - 6vw)",
}: AnnouncementBannerProps) => {
  const content =
    fallbackContent || dummyData || defaultAnnouncementBannerFallbackContent;
  const announcementMessageValue = onceADummyText(
    announcementMessage,
    content?.announcementMessage?.value || "",
  );

  return (
    <AnnouncementBannerWrapper
      className={`announcementBanner announcementBanner--${announcementMessageValue.class}`}
      $absolute={absolute}
      $isAbsolute={Boolean(absolute)}
      $maxWidth={maxWidth}
    >
      <div className="message">
        <TextElement
          dummyData={announcementMessageValue.dummyData || ""}
          destructedProp={announcementMessage}
          dynamicClassName="announcementMessage"
          lines={1}
        />
      </div>
    </AnnouncementBannerWrapper>
  );
};

export { AnnouncementBanner };
