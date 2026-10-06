# Component starter

`ComponentStarter` is a copyable, unfinished component. It provides one editable
text field, optional starting content, per-preset text limits, an Emotion CSS
wrapper and a place for your markup. It does not contain the Section 179 artwork.
All seven preset names match the existing V2 components; their CSS is empty.
It follows the existing project workflow: edit the library directly, preview in
its nested resizer, then release and update the selected template dependencies.

## Copy and rename

For the temporary campaign, `Section179Block` would be a suitable name. Copy:

| Source                                        | New copy                                             |
| --------------------------------------------- | ---------------------------------------------------- |
| `src/components/ComponentStarter.tsx`         | `src/components/Section179Block.tsx`                 |
| `src/utils/componentStarterTextSettings.json` | `src/utils/section179BlockTextSettings.json`         |
| `examples/componentStarter/`                  | `examples/section179Block/`                          |
| `docs/component-starter.md`                   | `docs/section179-block.md` (replace with your notes) |

In your **copied files only**, replace these strings (case-sensitive):

- `ComponentStarter` → `Section179Block` (component and type names)
- `componentStarter` → `section179Block` (imports, settings and input tags)
- `component-starter` → `section179-block` (CSS class and guide links)

Then register the new files:

1. In `src/index.ts`, copy the starter's value and type export blocks and rename
   their identifiers and component import paths using the substitutions above.
2. In `package.json`, copy the starter JSON entry in `exports` and rename it.
   Add your new guide and example directory to `files`. Compiled source is already
   included through `dist`.
3. Run `npm run typecheck` and `npm run build` from this repository root.

For the preview, rename its starter import/render in
`tools/resizing-tool/src/components/Container.jsx`, registration/storage key in
`tools/resizing-tool/src/utils/workspace.js`, companion
`tools/resizing-tool/src/dummy/componentStarterData.js`, and the selector/input
tags in `tools/resizing-tool/public/inputs.json`. If keeping both preview entries,
duplicate those starter sections and use a unique storage key. Also copy/update
the starter entries in `examples/usage.jsx` and `examples/inputs.json`.

Keep the original starter for the next component. You can also work directly in
it first; the same rename checklist applies when you give it its final name.

## Build your content

Edit the styled wrapper for CSS and the return block for markup. Replace
`placeholderText` in the props, fallback type/default, rendering, settings JSON,
and example files as you introduce real fields. Reuse `sharedV2/TextElement`
for Outfit inline editing and limits; pass complete `{ value, ids }` objects.
An omitted field uses starting content; `{ value: "" }` or `{ value: null }`
clears it. Numeric zero remains content. The sample keeps an empty text wrapper
when cleared; add conditional rendering if an entire section should disappear.

Settings are placeholder line limits, not measured artwork specifications.
Text fitting is off by default. If you enable it, `min` and `max` are percentages
of your authored font size; the shared V2 overflow fitter keeps that size until
shrinking is needed. Put font sizes on the parent content wrapper, not the inner
TextElement, so fitted sizes inherit correctly. `dummyData` remains supported
alongside `fallbackContent`. The wrapper starts with black text and no background.

For Section 179, reuse the established finance field conventions from
`OfferOptionBlockV2.tsx` as you add APR, term, savings and connector markup.
The supplied Figma reference is
[1585404_KTC_Section179](https://www.figma.com/design/HhBTvlw0PWVkehmQDstA2m/1585404_KTC_Section179?node-id=12009-3).
It could not be inspected through the connected Figma account during setup;
no design dimensions or assets have been assumed.

## Preview and use later

From the library root, run `npm run start` for your existing Outfit/single-spa
workflow or `pnpm dev:preview` for the local comparison page on port 8088.
Select **ComponentStarter** in the Component control. It starts at `print`, using
the existing 598×181 component rectangle and the usual Exact/Aspect controls.
The other existing preset rectangles remain available as starting canvases.
Saving the library component rebuilds the preview automatically. Starter inputs
are saved separately by layout in the local comparison page.

For the Outfit sidebar to expose the new selector choice and sample field, use
the existing root `npm run deploy` workflow to upload the nested resizer inputs,
then refresh Outfit. No upload has been performed as part of this setup.
The local comparison page reads the new inputs directly. There is no Section 179
comparison image yet; add your reference via the existing Placeholder workflow.
`examples/componentStarter/usage.jsx` shows the equivalent template wiring.

The parent template owns component dimensions, fonts, decorative edges, legal
copy and campaign selection. The temporary component will be selected by the
new Section 179 template variants, following the existing component/template split.
Print and digital need separate sizing and overflow checks, especially 728×90.

When ready, add your input definitions to the new template variants without
duplicating existing tags, map their inputs to your component, and pin those
templates to a released library tag. This scaffold does not update, deploy or
release any production template.
