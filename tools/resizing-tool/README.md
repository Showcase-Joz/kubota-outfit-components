# Shared component preview

WarrantyBlockV2 is the default selection in the standalone preview. It uses the
same seven boxes as OfferOptionBlockV2, which remains available in the Component
selector. Inputs persist separately per component and layout.

Start styling in `../../src/components/WarrantyBlockV2.tsx`, in the `300x600`
preset block. Its starting sizes and spacing are provisional. See the
[warranty guide](../../docs/warranty-block-v2.md) for the savings/discount switch,
service choices, and component-owned text settings.

Artwork URLs listed by component and dimension type go in
`src/utils/artwork.js`. One `ArtworkPlaceholder` renders the selected image,
using the same Outfit `hide`, `opacity` and `offset={false}` behaviour.
Optional per-layout starting values go in
`src/dummy/warrantyData.js`.

The new Outfit fields are listed in `public/inputs.json`. Run `npm run deploy`
from the library root or this folder to upload the resizing template and these
inputs to the existing Outfit testing workspace. Deployment builds the shared
library first. The standalone preview reads the same definitions locally.
Production template repositories have not been changed.

# Resizing tool

This is the component library's nested comparison workspace. It imports
`OfferOptionBlockV2` from the local library package; it has no private copy of the
offer implementation or its text settings.

From the **repository root**, run:

```sh
pnpm install
pnpm dev          # Outfit / single-spa, port 8081
# Or:
pnpm dev:preview  # local comparison page, port 8088
```

The root commands build/watch the library as well as serving this app. See the
[development and release workflow](../../docs/component-workspace.md) for where
to edit and how to release changes.

[Existing Outfit resizing template](https://jolyon-demo.outfit.io/templates/101327)

## Component boxes

| Preset | Width | Height |
| --- | ---: | ---: |
| Print advert | 598 | 181 |
| Tractru | 750.2 | 192.2 |
| Website banner | 584 | 600 |
| Digital ad 300 × 600 | 300 | 164 |
| Digital ad 160 × 600 | 160 | 198 |
| Digital ad 300 × 250 | 144 | 194 |
| Digital ad 728 × 90 | 240 | 90 |

Dimensions are CSS pixels, include internal padding and exclude angled edges.
The boxes stay the same when savings or connector inputs are omitted. The website
banner's optional CTA is passed as a child inside the 584 × 600 box.

`src/utils/dimension.json` owns these preview dimensions; `public/inputs.json`
owns the matching input choices. **Exact** renders these dimensions, including
fractional values. A wide Exact box scrolls. **Aspect** uniformly scales the same
component to the available width without changing its layout or line wrapping.

## Artwork comparison

Edit `src/utils/artwork.js`. Under each component, the dimension types are listed
explicitly: `print`, `tractru`, `web-banner`, `300x600`, `160x600`, `300x250` and
`728x90`. Put the image URL directly in the matching section. Existing offer and
warranty URLs are kept as commented image lines above their sections, ready for
you to sort. All sections start blank and hidden.

For example, under `offer`:

```js
"300x600": {
  image: "https://files.outfit.io/media_library_items/696363/300x600.png",
  hide: false,
  opacity: 0.3,
},
```

Keep alternative `image` lines commented out within the same dimension section;
uncomment one at a time to compare different treatments. Set `hide: true` to hide
the overlay, or adjust `opacity` from 0 to 1. Changing the component or size
automatically uses its own section. An empty image renders nothing.

For a new component, copy the `componentStarter` entry and
use the same key as its registration in `src/utils/workspace.js`. No new renderer
or condition in `Container.jsx` is needed. Export artwork to the component
rectangle without its angled edge; `offset={false}` remains fixed in the shared
`src/components/ArtworkPlaceholder.jsx`.

The same Container and artwork configuration are used by Outfit and the local comparison
page. Final typography must be checked with the brand fonts supplied by Outfit.

## Inputs and starting values

`src/dummy/data.js` supplies this preview template's optional baseline data per
layout. The shared component keeps its own defaults. Input values win over
`dummyData`, which wins over component defaults; explicit empty strings stay
empty and numeric zero is valid. The `fallbackContent` prop is an alternative
name and takes precedence over `dummyData` when both are supplied.

The local comparison page remembers selected size, sizing mode and edits per
layout between full refreshes. **Use layout defaults** clears the selected
layout's local edits. Outfit continues to supply its own inputs.

Edit line limits and text-fit settings in the library's
`src/utils/offerOptionBlockV2TextSettings.json`. Edit padding, spacing and
typography in `src/components/OfferOptionBlockV2.tsx`. Both update this preview
through the root development command.

Standard and no-savings layouts use the same component. With both savings heading
and amount blank, the connector disappears while any financing and description
remain. Component-owned `data-has-financing`, `data-has-offer` and
`data-has-savings` attributes control the relevant layouts.

The small `PreviewButtonCTA.tsx` fixture supplies optional child content. It is
separate from the library's production ButtonCTA; real templates choose the
button they need.
