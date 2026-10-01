import { useEffect } from "react";
import useFontsLoaded from "./useFontsLoaded";

const DEFAULT_DELAY_MS = 300;

export const hasHtmlAsync = () => {
  return document.documentElement.hasAttribute("async");
};

const usePrintready = (delayMs = DEFAULT_DELAY_MS) => {
  const { fontsLoaded } = useFontsLoaded();

  useEffect(() => {
    if (hasHtmlAsync() && !fontsLoaded) return;

    const timeoutId = setTimeout(() => {
      const event = new Event("printready");
      document.dispatchEvent(event);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [fontsLoaded, delayMs]);
};

export default usePrintready;
