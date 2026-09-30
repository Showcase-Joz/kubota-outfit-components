# WarrantyBlockV2: styling skeleton

This is an additive component. The existing WarrantyBlock and OfferOptionBlockV2
remain available. The structure and input behaviour are ready; the measured
typography, padding and spacing still need the design pass.

## Start with 300 × 600

Run `pnpm dev:preview` from the library root, or use the already running local
comparison page at http://127.0.0.1:8088/. Select **WarrantyBlock V2** and
**Digital ad 300x600**, whose component box is **300 × 164**. Warranty is the
default component on a fresh visit. Use Exact to measure and Aspect to enlarge.

Edit `src/components/WarrantyBlockV2.tsx`. Shared rules come first; the
`&[data-preset="300x600"]` block is marked as the first place to add measured
overrides. Each of the other six presets has its own block below it. Simple
shared rem values keep the skeleton legible; these are working values, not a
claim that the styling pass is finished. Digital backgrounds remain 80% opaque.

All seven component boxes are unchanged from OfferOptionBlockV2. Angled edges
belong to templates. Print, Tractru and 728×90 place offer and warranty regions
side by side with a vertical connector. Digital 300×600, 160×600, 300×250 and the
web banner stack those regions with a horizontal connector. Finance itself is
side by side for 300×600 and 728×90, and stacked for 160×600 and 300×250, in both
savings and discount modes. Print/Tractru use a finance row as well.

The first rollout defaults to **0% financing available**, no payment months and
no down payment. The cloned inputs/formatting remain available, but fitting more
complex APR/term/deposit content is a later design task. Web-banner structure is
provisional until its wide artwork is supplied; CTA content is an optional child.

## Input behaviour

- A populated `savingAmount`, including numeric zero, displays the savings
  treatment. `savingAmountPreText` appears only if it also contains text.
- Clearing the amount hides both savings fields and reveals `discountText`.
  Entering an amount again restores the savings treatment without erasing any
  input values. No automatic OR prefix is added.
- If amount and discount text are both empty, other populated content stays.
  `savingAmountPostText` remains the shared offer description.
- `connectorLinesText` joins the populated offer and warranty/service regions.
  `hide-text` retains the lines; `hide-element` hides the whole connector. Missing
  content on either side also hides it.
- `warrantyText` is a plain textarea rendered as the large heading; newlines are
  preserved. Text fitting is initially off.
- `serviceType` accepts `orange-protection`, `k-maintenance`, or `hide`. Hiding
  service type removes its grid cell so warranty text can use the available
  region. It does not automatically enlarge the font.
- The savings amount keeps its currency sign and asterisk. APR has no asterisk.
- Omitted props use component defaults or optional `dummyData` / `fallbackContent`.
  Supplied empty strings and null field values stay empty. Zero stays valid.

The wrapper exposes `data-preset` and `data-offer-mode` (`savings`, `discount`,
`empty`). The inner wrapper exposes the financing, offer, savings, connector and
warranty presence flags. The warranty region additionally exposes
`data-has-warranty-text` and `data-has-service-type`.

## Settings, examples and artwork

`src/utils/warrantyBlockV2TextSettings.json` owns the per-preset line/fit settings.
No line limits have been guessed, and fitting starts disabled. Add settings as
each layout is styled. The `textSettings` prop can override individual fields:

```tsx
<WarrantyBlockV2
  preset="300x600"
  textSettings={{ savingAmountPostText: { lines: 2, textfit: false } }}
  {...inputs}
/>
```

`tools/resizing-tool/src/dummy/warrantyData.js` is the preview template's optional
per-layout starting data. The real defaults remain in the component. To see the
cash-discount example, clear Saving Amount and choose Orange Protection Extended
Warranty. To see one-year maintenance, enter `1-Year` as Warranty text.

Keep warranty artwork URLs in
`tools/resizing-tool/src/components/WarrantyPlaceholder.jsx`, uncomment one
`image` prop at a time, and remove `hide` to show it. Use component-only artwork
without angled edges. The existing offer artwork list is unchanged in Container.

The local preview stores warranty and offer edits separately, including per-size
edits. The shared block/inline TextElement now lives at
`src/components/sharedV2/TextElement.jsx`; the legacy TextElement is unchanged.

The Outfit/single-spa preview uses the same Container. Its additional input
definitions are in `tools/resizing-tool/public/inputs.json`. Run `npm run deploy`
from the library root to upload the resizing template and those definitions,
then refresh Outfit to expose the new fields in its sidebar. This command targets
the existing testing workspace; it does not release the component library.

Run `pnpm check` before committing design changes. This skeleton has not been
released or installed into production templates.
