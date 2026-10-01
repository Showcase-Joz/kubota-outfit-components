import { useEffect, useState } from "react";

const useFontsLoaded = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    // Also resolves when fonts were cached before this component mounted.
    Promise.resolve(document.fonts?.ready).then(() => {
      if (active) setFontsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return { fontsLoaded };
};

export default useFontsLoaded;
