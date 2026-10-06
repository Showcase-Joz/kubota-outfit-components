# Component development workspace

The resizing tool now lives in `tools/resizing-tool` in this repository. It imports
the real `kubota-outfit-components` package through a pnpm workspace link. There is
one implementation of each V2 component, with a shared inline-capable TextElement.
WarrantyBlockV2 is now available alongside OfferOptionBlockV2.

## Daily workflow

Open this repository in VS Code. From the repository root:

```sh
pnpm install
pnpm dev
```

`npm run start` works from this root too; it runs the same command as `pnpm dev`.

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
existing artwork Placeholder workflow are retained. Choose WarrantyBlockV2 or
OfferOptionBlockV2 in the Component selector; edits are saved separately per
component and layout. Warranty opens at 300×600 by default. Brand typography still needs
checking in Outfit with the actual brand fonts.

If `pnpm dev` is already running and you want the comparison page as well, run
`pnpm --dir tools/resizing-tool preview` in a second terminal; it uses the already
running library watcher. Override a port with `pnpm dev -- --port 8091` when needed.

## Formatting in VS Code

Open this library as a workspace folder. The root `.vscode/settings.json` enables
Prettier on save for JavaScript, JSX, TypeScript and TSX, using the library's local
Prettier 3 installation. This supports the JSON import attributes in the V2
components; older Prettier 2 installations do not parse that syntax.

Formatting rules live in `.prettierrc.json`. Generated files, dependency folders,
lockfiles and Outfit deployment credentials are excluded by `.prettierignore`.
Use **Format Document** for one file, or `npm run format` / `npm run check-format`
from the root when you intentionally want a repository-wide format or check.
After installing the formatter, reload the VS Code window if it still has the
previous Prettier version cached.

## Deploy the resizing workspace to Outfit

From the library root, the existing command is available again:

```sh
npm run deploy
```

It forwards to `tools/resizing-tool`, builds the library first, builds and packages
the resizing template, then uploads that template and its `public/inputs.json`
to the existing `resizing_tool` on `jolyon-demo.outfit.io`. It uses the nested
`.outfit/config.json` and ignored `.outfit/.env` settings. Running `npm run deploy`
inside `tools/resizing-tool` also works.

Refresh the Outfit resizing template after the upload to see the updated input
sidebar. This deploys the development template; it does not publish a component
library version or update the separate production template repositories.

## Where to edit

For a new component, start with [ComponentStarter](component-starter.md).
It is also selectable in the nested preview, with its own saved inputs and the
existing component rectangles. Its markup and preset styles are intentionally
minimal so you can build them yourself.

| Concern | File in this repository |
| --- | --- |
| Offer layout, CSS, defaults and rendering | `src/components/OfferOptionBlockV2.tsx` |
| Warranty layout, CSS, defaults and rendering | `src/components/WarrantyBlockV2.tsx` |
| Warranty line limits and text-fit settings | `src/utils/warrantyBlockV2TextSettings.json` |
| V2 text formatting, validation and inline editing | `src/components/sharedV2/TextElement.jsx` |
| Preset line limits and text-fit settings | `src/utils/offerOptionBlockV2TextSettings.json` |
| Public component/type exports | `src/index.ts` |
| Artwork Placeholder and preview composition | `tools/resizing-tool/src/components/Container.jsx` |
| Warranty artwork Placeholder | `tools/resizing-tool/src/components/WarrantyPlaceholder.jsx` |
| Warranty preview starting values | `tools/resizing-tool/src/dummy/warrantyData.js` |
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

This checks both TypeScript projects, runs the offer, warranty and preview regression tests,
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

## WarrantyBlockV2 styling pass

The additive skeleton uses the same seven component rectangles and build/watch
loop. Start with the `300x600` CSS block in `src/components/WarrantyBlockV2.tsx`.
Its temporary type sizes and spacing are ready for measured styling; see the
[warranty guide](warranty-block-v2.md) for the agreed layout and input behaviour.

The nested input definitions include the new warranty fields. The standalone
preview uses them immediately. The Outfit resizing template needs these input
definitions added to expose them in its sidebar; no production template or
Outfit inputs have been deployed as part of this skeleton.
