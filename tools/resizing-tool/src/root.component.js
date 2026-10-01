import { OutfitProvider } from "@outfit.io/react";
import { Template } from "./components/template";
import GlobalStyles from "./style/GlobalStyles.jsx";

import { Minireset } from "./components/minireset";

export default function Root({ templateProps = window.payload }) {
  return (
    <OutfitProvider templateProps={templateProps}>
      <GlobalStyles />
      <Minireset />

      <Template />
    </OutfitProvider>
  );
}
