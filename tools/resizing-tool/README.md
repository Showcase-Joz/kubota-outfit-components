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

Keep artwork image URLs in the existing `<Placeholder>` block in
`src/components/Container.jsx`. Uncomment one image at a time and remove `hide`
(or use `hide={false}`) to show it. An optional `opacity={0.3}` makes comparison
easier. Export artwork to the component rectangle without its angled edge.

The same Container and artwork block are used by Outfit and the local comparison
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
