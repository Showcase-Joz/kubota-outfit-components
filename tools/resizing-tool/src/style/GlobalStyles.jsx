/** @jsxImportSource @emotion/react */
import { Global, css } from "@emotion/react";

function GlobalStyles() {
  return (
    <Global
      styles={css`
        /* CSS Reset / Base styles */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html,
        body,
        #root {
          height: 100%;
        }

        html {
          font-size: 16px;
        }

        body {
          quotes: "\\201C""\\201D""\\2018""\\2019";
        }
      `}
    />
  );
}

export default GlobalStyles;
