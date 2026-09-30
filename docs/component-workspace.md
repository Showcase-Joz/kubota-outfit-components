# Component development workspace

The resizing tool now lives in `tools/resizing-tool` in this repository. It imports
the real `kubota-outfit-components` package through a pnpm workspace link. There is
one implementation of OfferOptionBlockV2, its TextElement and its text settings.

## Daily workflow

Open this repository in VS Code. From the repository root:

```sh
pnpm install
pnpm dev
```

`pnpm dev` builds the library, starts its TypeScript watcher, and serves the nested
resizing tool on port **8081**. Keep using the existing Outfit resizing template
and its local single-spa connection. The module name remains
`@jolyon-demo/resizing_tool` and the bundle remains
`http://localhost:8081/jolyon-demo-resizing_tool.js`.

Edit the library source and save. TypeScript updates `dist`, webpack rebuilds the
preview, and the browser refreshes. No copying or package version bump is needed
for this local loop. Stop the command with Ctrl+C to stop both watchers.

For the local comparison page with input controls instead of Outfit:

```sh
pnpm dev:preview
```

Open `http://127.0.0.1:8088/`. Exact/aspect sizing, saved per-layout edits and the
existing artwork Placeholder block are retained. Brand typography still needs
checking in Outfit with the actual brand fonts.

If `pnpm dev` is already running and you want the comparison page as well, run
`pnpm --dir tools/resizing-tool preview` in a second terminal; it uses the already
running library watcher. Override a port with `pnpm dev -- --port 8091` when needed.

## Where to edit

| Concern | File in this repository |
| --- | --- |
| Offer layout, CSS, defaults and rendering | `src/components/OfferOptionBlockV2.tsx` |
| Offer text formatting, validation and inline editing | `src/components/offerOptionBlockV2/TextElement.jsx` |
| Preset line limits and text-fit settings | `src/utils/offerOptionBlockV2TextSettings.json` |
| Public component/type exports | `src/index.ts` |
| Artwork Placeholder and preview composition | `tools/resizing-tool/src/components/Container.jsx` |
| Component rectangle dimensions | `tools/resizing-tool/src/utils/dimension.json` |
| Preview input definitions | `tools/resizing-tool/public/inputs.json` |
| Preview template's optional starting values | `tools/resizing-tool/src/dummy/data.js` |

`dummyData` remains optional template data. The library keeps its own defaults;
explicit inputs take precedence, including intentional empty strings and zero.
Production templates can supply their own starting values in the same shape.

`PreviewButtonCTA.tsx` is a small preview child fixture. Production templates still
choose their own CTA. The existing library `ButtonCTA` and V1 offer component have
not been replaced. Angled edges and surrounding template composition remain
template responsibilities.

## Check and release

```sh
pnpm check
```

This checks both TypeScript projects, runs the offer and preview regression tests,
and builds the Outfit bundle and local comparison page.

After visual checks in the resizer, commit the changes in this repository. Merge
the development branch into `main` before using the existing release scripts:

```sh
pnpm run release:patch
```

The current release scripts push `main` and its version tag. A normal code commit
and push does not create a new release. Choose a minor/major release when the
change calls for one.

Then update the pinned library tag in the separate V2 template, install its
dependencies, restart its local server and test in situ. Deploy that template
through the normal Outfit workflow when ready. Templates continue to consume
released library versions; they do not receive unpublished local edits.

The package remains at the repository root, with the same exports, build output
and Git-tag install structure. The nested resizing tool is private and excluded
from the release package. `pnpm-lock.yaml` controls workspace development; the
existing root `package-lock.json` is retained for the npm/Git install workflow.

## Parity audit before nesting

Compared resizing-tool `9fec3fc` with library `d8fd8fc` (version 1.0.6):

- The seven offer preset layouts and standard/no-savings rendering agree after
  accounting for the library's V2 names and package imports.
- The text settings JSON files are identical, as is the TextElement runtime
  behaviour. The library has richer exported input types and numeric JSDoc.
- The old resizer contained an invalid orange fallback, `##dc4405`; the library
  already uses `#dc4405`. The copied comparison page's matching typo is corrected.
- The original preview CTA has different defaults/styles from the production
  ButtonCTA. It stays an explicitly named preview fixture.
- No V1 components or production template repositories were changed by nesting.

The old resizing-tool checkout is retained as a reference. Continue development
from this repository's nested preview so there is no second offer implementation
to synchronise.

## Adding WarrantyBlockV2 next

Create the new component and any component-owned settings in this library's
`src`, export it from `src/index.ts`, then add its preview composition, dimensions
and inputs inside `tools/resizing-tool`. It will use the same build/watch loop.
Keep WarrantyBlockV2 additive; the existing WarrantyBlock remains available.
