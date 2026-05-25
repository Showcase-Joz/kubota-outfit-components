/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

export interface AnnouncementBannerProps {
  announcementMessage?: string;
}

const AnnouncementBannerWrapper = styled.div`
  --banner-offset: 1em;
  container-name: announcementBanner;
  container-type: inline-size;

  display: flex;
  position: relative;
  left: -1em;
  font-size: 1.1em;

  .message {
    position: relative;
    z-index: 0;
    isolation: isolate;
    width: fit-content;
    min-width: fit-content;
    max-width: calc(70% + var(--banner-offset));
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
`;

const AnnouncementBanner = ({
  announcementMessage,
}: AnnouncementBannerProps) => {
  return (
    <AnnouncementBannerWrapper>
      <div className="message">{announcementMessage}</div>
    </AnnouncementBannerWrapper>
  );
};

export { AnnouncementBanner };
