# WarrantyBlockV2

`WarrantyBlockV2` was added in **v1.1.0**, alongside the original `WarrantyBlock`
and `OfferOptionBlockV2`. The four digital layouts have completed component-level
styling for savings and cash-discount designs. Test them in the destination
template with its actual fonts and surrounding artwork before deployment.
Print, Tractru and web-banner presets retain their structural starting layouts;
their measured design passes are still pending.

## Usage

```tsx
import { WarrantyBlockV2 } from "kubota-outfit-components";

<div style={{ width: 300, height: 164 }}>
  <WarrantyBlockV2
    preset="300x600"
    backgroundColor={inputs.offerTheming}
    aPR={inputs.aPR}
    aprPaymentMonthsConnectorText={inputs.aprPaymentMonthsConnectorText}
    paymentMonths={inputs.paymentMonths}
    downPayment={inputs.downPayment}
    savingAmountPreText={inputs.savingAmountPreText}
    savingAmount={inputs.savingAmount}
    discountText={inputs.discountText}
    savingAmountPostText={inputs.savingAmountPostText}
    connectorLinesText={inputs.connectorLinesText}
    warrantyText={inputs.warrantyText}
    serviceType={inputs.serviceType}
  />
</div>;
```

Pass complete Outfit field objects, including their `ids`, to retain inline
editing. The input tag `offerTheming` maps to the component's `backgroundColor`
prop. Existing template tags such as `aPR_2` can be mapped to the same props.
See the copyable [usage example](../examples/warrantyBlockV2/usage.jsx),
[Outfit input definitions](../examples/warrantyBlockV2/inputs.json) and
[optional starting data](../examples/warrantyBlockV2/data.js).

## Presets and sizing

The component fills its parent box. Pass the advert layout key as `preset`; the
component does not infer the layout from its dimensions. The default preset is
`300x600`. These component rectangles exclude decorative left/right edges, which
belong in the template.

| Preset       | Component width × height, CSS pixels | Styling status                         |
| ------------ | ------------------------------------ | -------------------------------------- |
| `300x600`    | 300 × 164                            | Digital design pass complete           |
| `160x600`    | 160 × 198                            | Digital design pass complete           |
| `300x250`    | 144 × 194                            | Digital design pass complete           |
| `728x90`     | 240 × 90                             | Digital design pass complete           |
| `print`      | 598 × 181                            | Structural layout; design pass pending |
| `tractru`    | 750.2 × 192.2                        | Structural layout; design pass pending |
| `web-banner` | 584 × 600                            | Structural layout; design pass pending |

Styles use **1rem = 16 CSS pixels**. For an enlarged comparison, scale the whole
box uniformly, as the preview's Aspect mode does. Changing only the parent width
and height does not scale all text. The first rollout uses **0% financing
available** without months or down payment; other finance combinations remain
supported by the inputs and need visual checking for the intended copy.

Digital backgrounds remain **80% opaque**, allowing artwork behind the block to
show through. `backgroundColor={{ value: "white" }}` selects the light theme;
`black` selects the default dark theme. The component uses the template's
`--font-family-inter-default`, `--font-family-arial-black-default`, `--color-black`,
`--color-white` and `--color-orange`, with internal fallbacks. It does not load fonts.

## Props and input values

Content fields use this shape:

```ts
{ value: string | number | null; ids?: Record<string, unknown> }
```

| Prop                            | Example value                                        | Behaviour                                                                                                                         |
| ------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `backgroundColor`               | `{ value: "black" }`                                 | `black` or `white`; maps from the `offerTheming` input.                                                                           |
| `aPR`                           | `{ value: "available" }`                             | Shows 0% financing available. Numeric text shows APR. Blank or `notApplicable` hides financing.                                   |
| `aprPaymentMonthsConnectorText` | `{ value: "up to" }`                                 | `up to` or `for`, rendered with payment months.                                                                                   |
| `paymentMonths`                 | `{ value: "60" }`                                    | Two displayed characters; blank or `notApplicable` hides the months phrase.                                                       |
| `downPayment`                   | `{ value: "2500" }`                                  | Renders $2,500 down. Six displayed characters including commas; blank hides it, zero stays visible.                               |
| `savingAmountPreText`           | `{ value: "or save up to" }`                         | Visible only when both this text and the savings amount are populated.                                                            |
| `savingAmount`                  | `{ value: "3000" }`                                  | Renders $3,000 with the savings asterisk. Six displayed characters; any supplied amount, including zero, wins over discount text. |
| `discountText`                  | `{ value: "or instant cash discount" }`              | Replaces the savings heading and amount when the amount is empty.                                                                 |
| `savingAmountPostText`          | `{ value: "on select Kubota L02 Series equipment" }` | Shared offer description; can remain when savings and discount text are empty.                                                    |
| `connectorLinesText`            | `{ value: "plus" }`                                  | Joins offer and warranty/service regions; accepts the connector choices below.                                                    |
| `warrantyText`                  | `{ value: "2-Year" }`                                | Large heading; preserves newlines and uses preset line limits.                                                                    |
| `serviceType`                   | `{ value: "k-maintenance" }`                         | Service choice; see labels below.                                                                                                 |

Additional props:

- `preset`: one of the seven layout keys above.
- `dummyData`: optional starting values using the content-field shape above.
- `fallbackContent`: alternative to `dummyData`; takes precedence when both are supplied.
- `textSettings`: per-field line and fitting overrides, described below.
- `children`: optional template content rendered below the main block, such as a CTA.
  Account for its space inside the same component rectangle.

### Savings versus discount

Savings amount controls the treatment; no separate mode input is required.
Clearing the amount automatically hides its pre-text even if that pre-text is
still populated. Discount text then becomes visible. Returning an amount hides
discount text without deleting it. A value of `0` is an amount, not an empty input.
Any leading “or” belongs in the user's savings pre-text or discount text.

```tsx
// Two-year maintenance with savings.
<WarrantyBlockV2
  preset="300x600"
  savingAmountPreText={{ value: "or save up to" }}
  savingAmount={{ value: "3000" }}
  warrantyText={{ value: "2-Year" }}
  serviceType={{ value: "k-maintenance" }}
/>;

// One-year maintenance uses the same treatment and a different heading.
<WarrantyBlockV2
  preset="300x250"
  warrantyText={{ value: "1-Year" }}
  serviceType={{ value: "k-maintenance" }}
/>;

// Cash discount: explicitly empty the amount so defaults cannot restore it.
<WarrantyBlockV2
  preset="160x600"
  savingAmount={{ value: "" }}
  discountText={{ value: "or instant cash discount" }}
  warrantyText={{ value: "2-Year" }}
  serviceType={{ value: "orange-protection" }}
/>;
```

If savings and discount text are both empty, any populated description, financing
and warranty content remains. APR has no automatic asterisk; savings has one.

### Service choices and hiding

| Choice value        | Displayed label                     |
| ------------------- | ----------------------------------- |
| `orange-protection` | Orange Protection Extended Warranty |
| `k-maintenance`     | K-MAINTENANCE Service on Us         |
| `hide`              | No service label                    |

`serviceType={{ value: "hide" }}` removes the service element and releases its
space to the warranty heading. It does not automatically enlarge the font.
The current warranty heading limits are:

| Preset    | Service visible | Service hidden                    |
| --------- | --------------- | --------------------------------- |
| `300x600` | 1 line          | 1 line across the available width |
| `160x600` | 1 line          | 2 lines                           |
| `300x250` | 1 line          | 2 lines                           |
| `728x90`  | 1 line          | 3 lines                           |

These limits validate overflow; they do not force line breaks or truncate copy.
Showing service again restores the normal limit without changing the text.

### Connector choices

The supplied definitions include `or`, `and`, `with`, `plus`, `from`, `at`,
`hide-text` and `hide-element`. `hide-text` hides only the words and retains the
lines. `hide-element` or a blank value hides the entire connector. The connector
also hides when either neighboring region has no content; discount text counts
as offer content, just like savings.

## Defaults and per-layout starting data

The component owns its baseline values: 0% financing available, no months/down
payment, “or save up to” $3,000, the L02 equipment description, “plus”, “2-Year” and
K-MAINTENANCE Service on Us. The stored discount default is “or instant cash
discount”, revealed only when savings is empty.

The existing `checkInputExists` helper resolves omitted inputs and null/undefined
values using `dummyData` or `fallbackContent`, then the component default for
fields absent from that entry. An explicit `value: ""` stays empty, including
after editing or reloading. Numeric zero remains valid. Null means fallback,
not an intentional clear, matching Offer V2.
Pass cleared fields through intact; do not convert them to `undefined` or use
`value || fallback`, which can bring the example content back.

```tsx
import { WarrantyBlockV2 } from "kubota-outfit-components";
import { data } from "./data.js"; // Copy the example into your template.

<WarrantyBlockV2
  preset="728x90"
  dummyData={data["728x90"]}
  savingAmount={inputs.savingAmount}
  discountText={inputs.discountText}
  warrantyText={inputs.warrantyText}
  serviceType={inputs.serviceType}
/>;
```

The example `data.js` provides all seven layout keys and three starting scenarios.
These are optional template baselines, not automatically applied component settings.
The nested preview uses the same pattern in
`tools/resizing-tool/src/dummy/warrantyData.js`.

## Text settings

`src/utils/warrantyBlockV2TextSettings.json` owns per-preset limits. The component
imports it internally, and the build includes it in the package. A template only
needs to import `WarrantyBlockV2` and pass `preset`; no separate JSON import is
required. The settings are also available as the named `warrantyBlockV2TextSettings`
export and the `kubota-outfit-components/utils/warrantyBlockV2TextSettings.json`
subpath for inspection. Avoid mutating the shared export.

The configurable fields are `termLabels`, `savingAmountPreText`,
`savingAmountPostText`, `discountText`, `warrantyText` and `serviceType`.
Each accepts `lines`, `textfit`, `min` and `max`. `min`/`max` are percentages of the
authored font size, not pixels, and only apply with `textfit: true`. Fitted text
must inherit its font size from the parent rather than have a fixed size on the
inner text element. Warranty heading fitting remains off in the current presets.

For the 160×600 and 300×250 offer descriptions, fitting runs only when the
text exceeds its limits. Copy that already fits keeps its authored `0.5rem` size;
longer copy can shrink within the configured percentage bounds.

For one template outlier, supply only the settings to change:

```tsx
<WarrantyBlockV2
  preset="300x600"
  textSettings={{
    savingAmountPostText: { lines: 3, textfit: true, min: 85, max: 100 },
  }}
/>
```

`warrantyText.withoutServiceType` supplies conditional limits when service is
hidden or empty. For example, the narrow digital presets use:

```json
{
  "warrantyText": {
    "lines": 1,
    "textfit": false,
    "withoutServiceType": { "lines": 2 }
  }
}
```

The resolver merges in this order: preset base, preset `withoutServiceType` when
applicable, explicit `textSettings`, then its `withoutServiceType` when applicable.
The conditional block supports the same four limit properties. A manual
`textSettings={{ warrantyText: { lines: 3 } }}` therefore overrides the preset
limit in both visibility states.

## Template integration and release

Install a Git tag containing the block (v1.1.0 or later) in the template repo:

```sh
pnpm add 'github:Showcase-Joz/kubota-outfit-components#v1.1.0'
```

Use [inputs.json](../examples/warrantyBlockV2/inputs.json) as the definition array
for your template's warranty block. Reuse existing fields where appropriate and
map renamed tags explicitly; the component reads props, not Outfit tags. Keep
service choice values unchanged. The example excludes preview-only controls such
as the component picker, dimensions, sizing mode and placeholder artwork.

Wire the template's warranty selection to `WarrantyBlockV2`, pass its dimension
key as `preset`, and map all twelve content fields as in the usage example.
Keep any live V1 templates on their existing implementation. Check the surrounding
container, actual fonts and decorative edges in situ; remove obsolete internal
warranty style overrides when migrating a cloned V2 template.

Restart the template's local server after installing the updated package, test
its layouts and input clearing, then deploy that template and its input definitions
through its normal Outfit workflow. Installing the library brings component CSS
and text settings; it does not create Outfit sidebar fields or switch the template's
component automatically. Future library changes require a new tag, a template
dependency update/install and a template rebuild/deploy.

## Local development

Run `pnpm dev` / `npm run start` at the library root for Outfit's single-spa preview
on port 8081, or `pnpm dev:preview` for the comparison page on port 8088. Select
WarrantyBlock V2 and the required layout. Exact measures the authored rectangle;
Aspect scales it uniformly. Edit shared styles in `src/components/WarrantyBlockV2.tsx`
and limits in `src/utils/warrantyBlockV2TextSettings.json`; the preview rebuilds.
The wrapper exposes `data-preset` and `data-offer-mode` (`savings`, `discount`,
`empty`), and the warranty region exposes `data-has-service-type` and
`data-has-warranty-text` for its layout rules.

Keep artwork URLs under `artwork.warranty` in
`tools/resizing-tool/src/utils/artwork.js`. Put the URL directly in the `image`
field of the matching dimension section and set `hide: false` to display it. The
shared `ArtworkPlaceholder` handles all components. Run `npm run deploy`
from the root to upload the nested resizing template and its inputs to the testing
workspace. This is separate from releasing the component library or deploying a
production template. Run `pnpm check` before committing design changes; see the
[workspace and release guide](component-workspace.md) for the full workflow.
