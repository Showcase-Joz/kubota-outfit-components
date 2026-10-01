# OfferOptionBlockV2

`OfferOptionBlockV2` is a separate export alongside `OfferOptionBlock`. It contains
the completed preset styles for standard offers and offers without a savings
heading or amount. Existing components continue using their original text helper.
Both V2 components share the inline-capable helper in `src/components/sharedV2`.
The original `OfferOptionBlock` remains available.

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

## Template input wiring

The [copyable usage example](../examples/offerOptionBlockV2/usage.jsx) maps all nine
fields from [inputs.json](../examples/offerOptionBlockV2/inputs.json) and shows how
to pass [per-layout starting data](../examples/offerOptionBlockV2/data.js).
The example keeps omitted savings props undefined for defaults, while normalizing
explicit null field values to empty strings so clearing them does not restore
sample savings.

```tsx
<OfferOptionBlockV2
  preset={dimensions}
  backgroundColor={inputs.offerTheming}
  aPR={inputs.aPR}
  aprPaymentMonthsConnectorText={inputs.aprPaymentMonthsConnectorText}
  paymentMonths={inputs.paymentMonths}
  downPayment={inputs.downPayment}
  connectorLinesText={inputs.connectorLinesText}
  savingAmountPreText={inputs.savingAmountPreText}
  savingAmount={inputs.savingAmount}
  savingAmountPostText={inputs.savingAmountPostText}
/>
```

`dimensions` is a preset key such as `300x600`, not the component's measured width
and height. The input tag `offerTheming` maps to `backgroundColor`; map any existing
suffixed tags such as `aPR_1` explicitly. Preserve each field's inline-edit `ids`.

## Presets and sizing

The component fills its containing box. Choose the preset explicitly and size the
box to the dimensions below; it does not infer a preset from an aspect ratio.
Dimensions exclude the decorative left or right edge.

| Preset       | Width × height, CSS pixels | Without savings                     |
| ------------ | -------------------------- | ----------------------------------- |
| `print`      | 598 × 181                  | APR beside terms; description below |
| `tractru`    | 750.2 × 192.2              | APR beside terms; description below |
| `web-banner` | 584 × 600                  | APR, terms, description stacked     |
| `300x600`    | 300 × 164                  | APR beside terms; description below |
| `160x600`    | 160 × 198                  | APR, terms, description stacked     |
| `300x250`    | 144 × 194                  | APR, terms, description stacked     |
| `728x90`     | 240 × 90                   | APR beside terms; description below |

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
the remaining section. No additional layout prop is needed. Clearing only the amount leaves a populated
savings heading visible, so it does not select the no-savings layout. This differs
from WarrantyBlockV2, where the amount also controls the heading and discount text.

## Text limits

The source settings live in `src/utils/offerOptionBlockV2TextSettings.json`. The
build includes the JSON, which is exposed both through the named
`offerOptionBlockV2TextSettings` export and the
`kubota-outfit-components/utils/offerOptionBlockV2TextSettings.json` subpath.
The component imports its settings internally; templates do not need a separate
JSON import. The public override props below are used instead of WarrantyBlockV2's
`textSettings` prop. V2 does not use `square` / `landscape` line settings.

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

Make V2 changes in `src/components/OfferOptionBlockV2.tsx` and the V2-shared
`src/components/sharedV2/TextElement.jsx`. Shared layout rules appear
above preset-specific `&[data-has-savings="false"]` overrides. Font sizes remain
on the wrapper above each fitted text element so Outfit's Limiter can resize it.

Run `npm run typecheck` and `npm run build` to regenerate the package in `dist`.
V2's public types and constants are named separately from the original component.

## Installing in a template

Install the library's pinned release, for example:

```sh
pnpm add 'github:Showcase-Joz/kubota-outfit-components#v1.1.0'
```

Map the template's offer selection to `OfferOptionBlockV2`, pass `preset`, add or
reuse its nine input definitions and remove obsolete internal V1 style overrides
from the cloned template. Keep decorative edges and surrounding composition in
the template. The original live templates can continue using `OfferOptionBlock`.
Restart the local template server after the dependency update, test both offer
modes, then deploy the template and its input definitions through Outfit.
The package supplies component styles and text settings; it does not automatically
update the template's sidebar or replace the component it renders.
