# Section 179 working component

This is a functional starting layout, ready for your CSS and markup design pass.
Your authored defaults are in `src/components/Section179Block.tsx`; no Figma
matching or final typography has been applied.

## Reading the component

The file is arranged in this order:

1. **Types** describe the accepted fields and text-limit settings.
2. **Defaults** supply starting values for every field.
3. **Styled wrapper** holds shared CSS and the empty dimension-specific sections.
4. **Field resolution** combines defaults, optional starting data, and live inputs.
5. **Limits and visibility** control fitting and which content regions appear.
6. **Return block** renders finance, savings, connectors and Section 179 content.

The `text(...)` helper renders the shared V2 TextElement, preserving inline-edit
IDs and applying the named field's text limits. Font sizes belong on its parent
wrapper so fitted sizes can inherit. Text fitting starts off.

The existing `checkInputExists` helper uses starting content for omitted inputs
and null/undefined values, matching Offer V2. Explicit empty strings clear
content; numeric zero remains valid. Savings pre-text/currency hide with
an empty savings amount. A connector only appears when both neighbouring regions
have content; `hide-text` keeps its lines and `hide-element` removes it entirely.
APR `available` displays 0% financing available; `notApplicable` hides financing.

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
