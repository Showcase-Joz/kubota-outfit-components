# OfferOptionBlockV2

`OfferOptionBlockV2` is a separate export alongside `OfferOptionBlock`. It contains
the completed preset styles for standard offers and offers without a savings
heading or amount. Existing components continue using their original text helper;
V2's inline text and character validation live in its own private helper.

```tsx
import {
  OfferOptionBlockV2,
  offerOptionBlockV2TextSettings,
  type OfferOptionBlockV2Props,
} from "kubota-outfit-components";

const offer: OfferOptionBlockV2Props = {
  preset: "print",
  aPR: { value: "1.99" },
  paymentMonths: { value: "60" },
  downPayment: { value: "0" },
};

<OfferOptionBlockV2 {...offer} />;
```

## Presets and sizing

The component fills its containing box. Choose the preset explicitly and size the
box to the dimensions below; it does not infer a preset from an aspect ratio.
Dimensions exclude the decorative left or right edge.

| Preset | Width × height, CSS pixels | Without savings |
| --- | --- | --- |
| `print` | 598 × 181 | APR beside terms; description below |
| `tractru` | 750.2 × 192.2 | APR beside terms; description below |
| `web-banner` | 584 × 600 | APR, terms, description stacked |
| `300x600` | 300 × 164 | APR beside terms; description below |
| `160x600` | 160 × 198 | APR, terms, description stacked |
| `300x250` | 144 × 194 | APR, terms, description stacked |
| `728x90` | 240 × 90 | APR beside terms; description below |

Styles were authored with **1rem = 16 CSS pixels**. A different document root font
size changes their physical size. A larger comparison view can scale the complete
box uniformly. Arbitrarily resizing the containing box does not scale all text.

The component uses `--font-family-inter-default`, `--font-family-arial-black-default`,
`--color-black`, `--color-white` and `--color-orange`, with internal fallbacks.
It does not load fonts or install global resets. `backgroundColor={{ value: "white" }}`
selects the light theme; the default is dark.

## Inputs and defaults

Fields use Outfit's `{ value, ids? }` shape. Values can be strings, numbers or null;
pass the complete field object to preserve inline-edit IDs.

- Missing fields and null/undefined field values use fallback content.
- Explicit empty strings remain empty. Numeric `0` remains a valid value.
- `aPR: { value: "available" }` displays 0% with “financing available”.
- `aPR: { value: "notApplicable" }` or an explicit blank hides financing.
- `paymentMonths: { value: "notApplicable" }` hides the months phrase.
- An explicit blank `downPayment` hides the down-payment phrase.
- Connector `hide-text` keeps the divider lines while hiding its wording.
  `hide-element` hides the whole connector. A blank connector also hides it.

Built-in defaults belong to the component. Supply optional `dummyData` to change
starting values; see [data.js](../examples/offerOptionBlockV2/data.js). Missing
entries retain component defaults, and explicit input props take precedence.
`fallbackContent` is an alternative prop; when both are provided it takes priority
over `dummyData`.

Suggested field definitions are provided in
[inputs.json](../examples/offerOptionBlockV2/inputs.json).

## Offers without savings

Clear both savings inputs and retain the description:

```tsx
<OfferOptionBlockV2
  preset="print"
  savingAmountPreText={{ value: "" }}
  savingAmount={{ value: "" }}
  savingAmountPostText={{ value: "on select Kubota BX Series equipment" }}
/>
```

The connector hides automatically. The component selects the preset's layout via
`data-has-savings="false"`. If the description is also empty, financing occupies
the remaining section. No additional layout prop is needed.

## Text limits

The source settings live in `src/utils/offerOptionBlockV2TextSettings.json`. The
build includes the JSON, which is exposed both through the named
`offerOptionBlockV2TextSettings` export and the
`kubota-outfit-components/utils/offerOptionBlockV2TextSettings.json` subpath.

Use props for individual overrides rather than mutating the shared settings:

```tsx
<OfferOptionBlockV2
  preset="160x600"
  maxSavingAmountPostText={{ lines: 4, min: 80 }}
  maxTermLabelsText={4}
/>
```

- `maxSavingAmountPostText` accepts `lines`, `textfit`, `min` and `max`.
  Unspecified values retain their preset settings.
- `min`/`max` are font-size percentages used by Outfit's fitter, not pixel sizes.
- `maxTermLabelsText` applies to the complete finance phrase.
- `maxSavingAmountText` overrides the savings **heading's** line limit.
- Character limits validate the displayed text without truncating it: down payment
  allows six characters (for example `99,999`) and payment months allows two.

## Children

Optional `children` render below the offer content, for example a caller-supplied
button. The `web-banner` design reserves space for that child inside its box.
V2 does not create or replace a CTA component.

## Source ownership

Make V2 changes in `src/components/OfferOptionBlockV2.tsx` and its private
`src/components/sharedV2/TextElement.jsx`. Shared layout rules appear
above preset-specific `&[data-has-savings="false"]` overrides. Font sizes remain
on the wrapper above each fitted text element so Outfit's Limiter can resize it.

Run `npm run typecheck` and `npm run build` to regenerate the package in `dist`.
V2's public types and constants are named separately from the original component.
