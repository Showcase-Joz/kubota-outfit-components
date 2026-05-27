/**
 * Ensure there is a usable value inside an Outfit input object, else return a fallback.
 *
 * @param {object|null|undefined} input Outfit input object, e.g. { value, ids }.
 * @param {*} fallbackValue Value to return if no valid input is found.
 * @param {string} [type="value"] Key to check inside the input object.
 * @returns {*} The resolved input value or the fallback.
 */
export const checkInputExists = (input, fallbackValue, type = "value") => {
  if (
    input === undefined ||
    input?.[type] === undefined ||
    input?.[type] === null
  ) {
    return fallbackValue;
  }

  if (type === "" || type === "value") {
    return input?.value;
  }

  return input?.[type];
};

/**
 * Copy Outfit inline-edit ids from a source input object onto a replacement value.
 *
 * @param {object} source Outfit input object, usually containing an ids property.
 * @param {object} target Replacement input-shaped object, e.g. { value: "0" }.
 * @returns {object} Target with ids copied across.
 */
export const cloneInlineClick = (source, target) => {
  const idsPair = Object.entries(source || {}).find(([key]) => key === "ids");

  return {
    ids: { ...(idsPair?.[1] || {}) },
    ...target,
  };
};

/**
 * Format a numeric value as a locale-aware decimal string without a currency symbol.
 *
 * @param {string|number|null|undefined} value Input value to format.
 * @param {string} [lang="en"] Language code.
 * @param {string} [fallback=""] Value to return when parsing fails.
 * @returns {string}
 */
export const formatMoney = (value, lang = "en", fallback = "") => {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "string" && /^\s*X+\s*$/i.test(value)) {
    return value.trim();
  }

  const baseLang = (lang || "en").toLowerCase().split("-")[0];
  const locale =
    baseLang === "fr" ? "fr-CA" : baseLang === "ca" ? "en-CA" : "en-US";

  let s = String(value)
    .replace(/\u00A0/g, " ")
    .trim()
    .replace(/[^\d.,\- ]/g, "")
    .replace(/\s+/g, "");

  if (!s || s === "-" || s === "." || s === ",") return fallback;

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");

  if (hasDot && hasComma) {
    const lastDot = s.lastIndexOf(".");
    const lastComma = s.lastIndexOf(",");
    const decimalSep = lastComma > lastDot ? "," : ".";

    if (decimalSep === ",") {
      s = s.replace(/\./g, "");
      s = s.replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (hasComma) {
    if (baseLang === "fr") {
      s = s.replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (hasDot && baseLang === "fr") {
    const looksLikeDecimal = /^\-?\d+\.\d{1,4}$/.test(s);
    if (!looksLikeDecimal) {
      s = s.replace(/\./g, "");
    }
  }

  const num = Number(s);
  if (Number.isNaN(num)) return fallback;

  const decPart = s.split(".")[1] || "";
  const fractionDigits = Math.min(decPart.length, 4);

  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(num);
};
export const onceADummy = (input, dummyData) => {
  /*
    Usage: 
    const checkDummy = onceADummy(inputName, data?.fakeItem?.value)
    OR: onceADummy(inputName, data?.fakeItem?.value).dummyData || .class
    prop={checkDummy.dummyData} -- adds return value of dummyData property
    className={`some-element--${checkDummy.class}`} -- adds 'show' or 'hide'

    If the input has not been used yet, there won't be a value property;
    otherwise, the input's value is used. If all else fails, the dummy
    data will still be used.
  */

  // TODO maybe improve to include an optional image for a state!

  let hideADummy = "hide";
  let isItADummy = dummyData;

  if (!onceADummy.inputsWithValue) {
    onceADummy.inputsWithValue = new Set();
  }

  const inputsWithValue = onceADummy.inputsWithValue;
  const inputKey =
    input?.ids?.value_id || input?.ids?.id || input?.ids?.input_id;
  const hasHadValue = inputKey && inputsWithValue.has(inputKey);

  if (input && input?.value !== undefined && input?.value !== null) {
    hideADummy = "show";
    if (inputKey) {
      inputsWithValue.add(inputKey);
    }
    // console.log("input value exists", input?.value); // eslint-disable-line no-console
  } else if (!input?.value) {
    hideADummy = "show";
    // console.warn(
    //   "The input value is undefined or null, using dummy data instead.",
    //   input
    // );
    if (input?.value === null && (!inputKey || hasHadValue)) {
      hideADummy = "hide";
      // console.warn("The input value is null, using dummy data instead.", input);
    }
  }
  return { dummyData: isItADummy, class: hideADummy };
};
/**
 * Decide whether to show dummy text and (optionally) auto-translate it.
 *
 * Behavior (unchanged by default):
 * - Returns { dummyData, class: "show" | "hide" }.
 * - "show" when the input is undefined OR has a non-empty value; otherwise "hide".
 * - If `opts.translate` is not set, dummyData is returned untouched (exactly as before).
 *
 * Optional translation (only when opts.translate === true):
 * - If dummyData is an Outfit-style field object { value, lang?: { [xx]: string } }:
 *     use .lang[lang] (if available) → else .value.
 * - Else if dummyData is a string that looks like an i18n key ("ns.path"):
 *     try i18n.t(key); if not found, fall back to the original string.
 * - Else return dummyData as-is.
 *
 * @param {*} input
 *   The Outfit input (or similar) you check for presence.
 * @param {*} dummyData
 *   The fallback content (string OR Outfit-style { value, lang } object OR i18n key).
 * @param {{ translate?: boolean, lang?: string, fallback?: string }} [opts]
 *   translate: enable auto-translation (default: false).
 *   lang: language override like "fr" (defaults to i18n.language → "en").
 *   fallback: final fallback string if nothing resolves (default: "").
 * @returns {{ dummyData: *, class: "show" | "hide" }}
 */
export const onceADummyText = (input, dummyData, opts = {}) => {
  const localInput = checkInputExists(input, undefined);

  let hideADummy = "hide";
  if (localInput === undefined) hideADummy = "show";
  else if (localInput && localInput.length > 0) hideADummy = "show";

  let resolved = dummyData;

  if (opts.translate) {
    const lang = (opts.lang || i18n?.language || "en")
      .toLowerCase()
      .split("-")[0];

    // Case 1: Outfit-style object with { value, lang }
    if (dummyData && typeof dummyData === "object") {
      const byLang = dummyData?.lang?.[lang];
      if (byLang != null && byLang !== "") resolved = byLang;
      else if (dummyData?.value != null && dummyData.value !== "")
        resolved = dummyData.value;
      else resolved = opts.fallback ?? "";
    }
    // Case 2: i18n key string like "ns.path"
    else if (typeof dummyData === "string" && dummyData.includes(".")) {
      const t = i18n.t(dummyData, { defaultValue: "" });
      resolved = t && t !== dummyData ? t : opts.fallback ?? dummyData;
    }
    // Case 3: primitives/other → leave as-is (or fallback if empty)
    else if (resolved == null || resolved === "") {
      resolved = opts.fallback ?? "";
    }
  }

  return { dummyData: resolved, class: hideADummy };
};
