# Section 179 working component

This is a functional starting layout, ready for your CSS and markup design pass.
Your authored defaults and preset styles are in `src/components/Section179Block.tsx`.
The AG print headline uses the Figma 28px Arial Black treatment.

## Reading the component

The file is arranged in this order:

1. **Types** describe the accepted fields and text-limit settings.
2. **Defaults** supply starting values for every field.
3. **Styled wrapper** holds shared CSS and the empty dimension-specific sections.
4. **Field resolution** combines defaults, optional starting data, and live inputs.
5. **Limits and visibility** control fitting and which content regions appear.
6. **Return block** renders finance, savings, connectors and Section 179 content.

Each field has an explicit `<TextElement>` in the return markup, including both
connectors. Its `destructedProp`, `dynamicClassName`, character limits and
`limits("fieldName")` settings are visible beside the content you are styling.
Resolved fields preserve inline-edit IDs and the existing fallback behaviour.
Finance uses the familiar `term-labels-content`, `payment-months-wrapper` and
`down-payment-wrapper` classes. Font sizes belong on the parent wrapper so fitted
sizes can inherit. Text fitting starts off.

The existing `checkInputExists` helper uses starting content for omitted inputs
and null/undefined values, matching Offer V2. Explicit empty strings clear
content; numeric zero remains valid. As in Offer Options V2, savings pre-text
and amount render independently; clearing the amount removes its currency marker. A connector only appears when both neighbouring regions
have content; `hide-text` keeps its lines and `hide-element` removes it entirely.
APR `available` displays 0% financing available; `notApplicable` hides financing.

The offer area matches Offer Options V2: `offerOptionContent` contains
`offerOptionContent-top` (pre-text and amount TextElements) and
`offerOptionContent-bottom` (description TextElement). Empty regions use `hidden`.
The amount's `$` and `*` come from the existing CSS pseudo-elements, with no extra
currency span or savings wrapper between the top region and its TextElements.

## Text-only savings (AG)

Clear `savingAmount` to an explicit empty string and enter the campaign wording
in `savingAmountPreText`. The existing offer wrapper gets
`data-offer-mode="text-only"`: pre-text becomes a large orange headline, while the
amount and its currency/asterisk disappear. Its description and connectors remain.
Entering an amount restores the usual smaller pre-text; zero is still an amount.
Null/undefined retain the existing first-pass fallback behaviour.

Print supports the three-line `2-Year<br/>Orange<br/>Protection*` heading at 28px,
with an 8px gap before the description. Every other dimension has a marked
text-only CSS section to finish as its artwork is developed. The separate
`savingAmountPreTextNoAmount` entry in `Section179BlockTextSettings.json` controls
the headline's line limit per dimension without changing the normal pre-text.
It also accepts a `textSettings.savingAmountPreTextNoAmount` prop override.

The AG artwork needs approximately 600 × 118px; the current print preview is
558 × 96px. The sizing decision is pending, so the three-line heading can overflow
the existing box. No dimension changes have been applied.

These changes live in the shared library. The Editions template uses a pinned
release and needs that release updated before it receives the new behaviour.

## Grouping and stacking

The outer `.section179-block-content` grid has three children: `.financeOfferGroup`,
the campaign connector, and `.section179Content`. The group keeps finance, its
connector, and savings together in their own grid. `connectorLinesText` renders between finance and savings inside the bordered
`.connectorWrapper`; `section179connectorLinesText` renders before Section 179
inside `.section179connectorWrapper`, with its two connector lines.

Print, Tractru and 728x90 use a horizontal outer layout. Web banner, 300x600,
160x600 and 300x250 stack the campaign connector and content below the
finance/offer group. The outer grid controls this arrangement:

```css
.section179-block-content {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "financeOfferGroup"
    "section179ConnectorContent"
    "section179OptionContent";
}
```

Style `.financeOfferGroup` separately to adjust the finance/savings columns.
The group is hidden when both finance and savings/description are empty.

## Where each piece lives

| Purpose                               | File                                                           |
| ------------------------------------- | -------------------------------------------------------------- |
| Field types, defaults, markup and CSS | `src/components/Section179Block.tsx`                           |
| Limits by dimension                   | `src/utils/Section179BlockTextSettings.json`                   |
| Package exports                       | `src/index.ts`                                                 |
| Preview controls                      | `tools/resizing-tool/public/inputs.json`                       |
| Optional starting values by dimension | `tools/resizing-tool/src/dummy/section179Data.js`              |
| Preview model and field visibility    | `tools/resizing-tool/src/utils/workspace.js`                   |
| Input-to-prop wiring                  | `tools/resizing-tool/src/components/Container.jsx`             |
| Artwork by dimension                  | `tools/resizing-tool/src/utils/artwork.js`, under `section179` |
| Copyable template usage               | `examples/Section179Block/usage.jsx`                           |

Use the existing library-root `npm run start` / `pnpm dev:preview` workflow and
select Section 179. The public export is `Section179Block` (without V2); the preview
label and saved-data key retain your V2 naming. It opens at `print`.

The control named `offerTheming` maps to the component prop `backgroundColor`.
Use `white` or `black`. Finance inputs contain values without units: `3.99`, `60`,
`0`, `1000`. The markup supplies %, months, currency and down-payment labels.
Section 179 copy is plain editable text, so supply its complete wording.

The component is not a finished advert. Preset styling, final copy and export
checks remain your design work. Production templates have not been updated or
deployed by this repair.
