import { useEffect, useRef } from "react";
import { Limiter, runValidation } from "@outfit.io/react";

/**
 * Outfit's fitter rounds down even when the authored size already fits.
 * Validate at the configured maximum first; fit only on overflow. Bounds here
 * are percentages of the authored size, as in the V2 text settings.
 */
export const fitOnOverflow = (node, limits) => {
  node.style.fontSize = "";
  if (!node.clientWidth) return;

  const baseSize = parseFloat(getComputedStyle(node).fontSize);
  const config = limits.textfitConfig ?? {};
  const maximum = config.maxFontSize ?? 100;
  const minimumSize = (baseSize * (config.minFontSize ?? 0)) / 100;
  const maximumSize = (baseSize * maximum) / 100;
  if (maximum !== 100) node.style.fontSize = `${maximum}%`;

  const validation = { ...limits, textfit: false };
  if (!runValidation(node, validation)) return;

  runValidation(node, {
    ...limits,
    textfit: true,
    textfitConfig: { ...config },
  });
  // Keep the configured lower bound when the vendor's integer rounding would
  // make text smaller. Unfittable content must retain its overflow warning.
  const fittedSize = parseFloat(node.style.fontSize);
  if (Number.isFinite(fittedSize) && Number.isFinite(baseSize)) {
    node.style.fontSize = `${Math.min(maximumSize, Math.max(minimumSize, fittedSize))}px`;
    runValidation(node, validation);
  }
};

/** Opt-in fitting policy for the narrow warranty descriptions. */
export const FitOnOverflowLimiter = ({ children, ...limits }) => {
  const ref = useRef(null);

  // Recheck edited copy and changed presets as well as newly loaded fonts.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let active = true;
    let frame;
    const validate = () => {
      if (active && node.isConnected) fitOnOverflow(node, limits);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(validate);
    };

    Promise.resolve(document.fonts?.ready).then(validate);
    document.fonts?.addEventListener?.("loadingdone", schedule);
    window.addEventListener("resize", schedule);

    // Watch the available width, not the height which fitting itself changes.
    let width = node.parentElement?.clientWidth;
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            const nextWidth = node.parentElement?.clientWidth;
            if (nextWidth !== width) {
              width = nextWidth;
              schedule();
            }
          });
    if (node.parentElement) observer?.observe(node.parentElement);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      document.fonts?.removeEventListener?.("loadingdone", schedule);
      window.removeEventListener("resize", schedule);
      node.style.fontSize = "";
    };
  });

  return (
    <Limiter {...limits} textfit={false} ref={ref}>
      {children}
    </Limiter>
  );
};
