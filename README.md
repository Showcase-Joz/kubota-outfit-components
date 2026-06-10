# kubota-outfit-components

Kubota-specific reusable UI components for Outfit template projects.

This package provides several reusable components tailored for Kubota templates: responsive `WarrantyBlock`, monthly `OfferBlock`, `AnnouncementBanner`, plus `ButtonCTA` (simple CTA anchor), `LeaseOfferBlock` (a lease-specific payment block), and `ImageBlock` (a full-bleed background image wrapper with optional overlay content). The components ship with sensible preview fallback content and are written to consume Outfit-style inputs.

This package starts with three primary exports: the responsive `WarrantyBlock`
component, the monthly `OfferBlock` component, and the skewed
`AnnouncementBanner` component. The current version is
intentionally Kubota-shaped: it includes Kubota-oriented defaults, responsive
layout rules, and Outfit input guidance. Future versions can separate theming
more aggressively if the same component patterns need to be forked for another
client.

## Install

This repo is private/package-in-progress. For now, consume it from source or use
it as the source of truth for copying components into a Kubota Outfit template.

Install directly from a tagged GitHub release in a template project:

```bash
npm i git+ssh://git@github.com/Showcase-Joz/kubota-outfit-components.git#v0.2.0
```

Check the [tag history](https://github.com/Showcase-Joz/kubota-outfit-components/tags)

Or add it to `package.json` dependencies:

```json
{
  "dependencies": {
    "kubota-outfit-components": "git+ssh://github:Showcase-Joz/kubota-outfit-components#v0.2.0"
  }
}
```

## Exports

Primary exports (from `src/index.ts`):

- WarrantyBlock
- AnnouncementBanner
- OfferBlock
- ButtonCTA
- LeaseOfferBlock
- ImageBlock


## Usage

Warranty block example:

```tsx
import { WarrantyBlock } from "kubota-outfit-components";

<WarrantyBlock
  aPR={inputs?.aPR}
  incentiveConnectorText={inputs?.incentiveConnectorText}
  incentivePreText={inputs?.incentivePreText}
  incentiveText={inputs?.incentiveText}
  connectorLinesText={inputs?.connectorLinesText}
  warrantyText={inputs?.warrantyText}
  warrantyConnectorText={inputs?.warrantyConnectorText}
/>;
```

Offer block example:

```tsx
import { OfferBlock } from "kubota-outfit-components";

<OfferBlock
  incentiveAmount={inputs?.incentiveAmount}
  downPayment={inputs?.downPayment}
  aPR={inputs?.aPR}
  paymentMonths={inputs?.paymentMonths}
/>;
```

Button CTA example:

```tsx
import { ButtonCTA } from "kubota-outfit-components";

<ButtonCTA
  buttonText={inputs?.buttonText}
  fallbackContent={{ buttonText: { value: "Learn more" } }}
/>
```

Lease offer block example:

```tsx
import { LeaseOfferBlock } from "kubota-outfit-components";

<LeaseOfferBlock
  paymentPreText={inputs?.paymentPreText}
  paymentAmount={inputs?.paymentAmount}
  hoursOfUse={inputs?.hours}
  aPR={inputs?.aPR}
  paymentMonths={inputs?.paymentMonths}
  downPayment={inputs?.downPayment}
>
  {/* optional children, e.g. a ButtonCTA instance for smaller containers */}
</LeaseOfferBlock>
```


Announcement banner example:

`AnnouncementBanner` is a lightweight single-line banner for short template
messages. It accepts Outfit-style text input objects, plus preview/default
content through `fallbackContent` or the compatibility alias `dummyData`.


```tsx
import { AnnouncementBanner } from "kubota-outfit-components";

<AnnouncementBanner
  announcementMessage={announcementMessage}
  fallbackContent={{
    announcementMessage: { value: "this is an announcement" },
  }}
/>
```

The preferred preview/default content prop is `fallbackContent`. The
`dummyData` prop is still supported as a compatibility alias and uses the same
shape:

```js
{
  announcementMessage: { value: "announcement" }
}
```

`announcementMessage` should stay short. One or two words work best because the
banner is constrained to a single line and is styled as a compact label.

## AnnouncementBanner usage notes

`src/components/AnnouncementBanner.tsx` renders a single-line announcement
banner for short template messages.

### Positioning modes

`AnnouncementBanner` supports relative positioning by default and absolute
positioning when the `absolute` prop is supplied.

#### Relative mode

Relative mode is used when no `absolute` prop is passed:

```tsx
<AnnouncementBanner
  announcementMessage={announcementMessage}
  maxWidth="78vw"
/>
```

In relative mode the banner stays in normal document flow. The `maxWidth` prop
limits both the wrapper and the message label, with the component's left banner
offset accounted for internally.

If `maxWidth` is not supplied, the banner falls back to `calc(100% - 6vw)`.

#### Absolute mode

If you want to place this component inside another component, such as a
background image wrapper, the absolute positioning mode lets you place the
banner inside the nearest positioned parent.

Pass an `absolute` object to position the banner absolutely:

```tsx
<AnnouncementBanner
  announcementMessage={announcementMessage}
  maxWidth="78vw"
  absolute={{
    top: "12mm",
    left: "8mm",
  }}
/>
```

Supported offsets are `top`, `right`, `bottom`, and `left`. Values should
include CSS units such as `mm`, `px`, `%`, or `em`.

In absolute mode, `maxWidth` is adjusted using the supplied left offset, print
offset, and border offset so the visible banner can line up with the positioned
placement while keeping its background extension.

When `absolute.left` is supplied, the banner background extension uses the
inverse of that value so the left-side fill can continue back toward the page
edge:

```css
left: calc(-1 * (<absolute.left>) - 3mm);
```

For example, `left: "8mm"` gives the background extension a calculated left
offset of `calc(-1 * (8mm) - 3mm)`.

### TextElement association

The banner displays its message through `src/components/TextElement.jsx`.

`TextElement` handles the shared Outfit text behaviour: fallback text resolution
via `checkInputExists`, inline editing via `onInlineEditClick`, limiter
support, HTML parsing, and money formatting for the existing finance-related
text classes.

`AnnouncementBanner` uses `onceADummyText` from `src/utils/helpers.js` to decide
whether the fallback preview text should be shown or whether an empty/null live
input should hide the banner.

## AnnouncementBanner Props

- `announcementMessage`: Outfit-style text input object for the banner copy.
- `fallbackContent`: Preferred preview/default content.
- `dummyData`: Compatibility alias for `fallbackContent`.
- `absolute`: Optional positioning object with `top`, `right`, `bottom`, and
  `left` offsets.
- `maxWidth`: Optional width limit for the wrapper and label.

`WarrantyBlock` props expect an Outfit-style text or choice input object:

```ts
{ value: string; ids?: unknown }
```

## WarrantyBlock Props

- `aPR`: APR percentage value. Keep to 5 characters or fewer. Use `available`
  to render the fallback `0% available` treatment.
- `incentiveConnectorText`: Short connector between APR and incentive copy.
  Recommended max: 5 characters, for example `or`, `plus`, or `with`.
- `incentivePreText`: Small label shown above the main incentive. Recommended
  max: 22 characters.
- `incentiveText`: Main incentive headline. Recommended max: 20 characters.
- `connectorLinesText`: Connector label rendered between the incentive and
  warranty sections. Recommended max: 20 characters.
- `warrantyText`: Main warranty headline. Recommended max: 30 characters.
- `warrantyConnectorText`: Warranty support text. Recommended max: 55
  characters.
- `fallbackContent`: Optional preview/default content using the same field
  shape.

Example `fallbackContent` value:

```tsx
<WarrantyBlock
  fallbackContent={{
    aPR: { value: "available" },
    incentiveConnectorText: { value: "or" },
    incentivePreText: { value: "instant" },
    incentiveText: { value: "cash discount" },
    connectorLinesText: { value: "plus" },
    warrantyText: { value: "4,000 Hours up to 4 Years" },
    warrantyConnectorText: {
      value: "2 year standard warranty + 2 year extended warranty",
    },
  }}
/>
```

Usage example:

```tsx
import { WarrantyBlock } from "kubota-outfit-components";

<WarrantyBlock
  aPR={inputs?.aPR}
  incentiveConnectorText={inputs?.incentiveConnectorText}
  incentivePreText={inputs?.incentivePreText}
  incentiveText={inputs?.incentiveText}
  connectorLinesText={inputs?.connectorLinesText}
  warrantyText={inputs?.warrantyText}
  warrantyConnectorText={inputs?.warrantyConnectorText}
/>
```

## OfferBlock Props

- `incentiveAmount`: Main monthly offer amount. Rendered as the large value in
  `$XXXX /MO`. Placeholder `XXXX` is supported for previews.
- `downPayment`: Down payment value. Rendered in the finance terms row.
- `aPR`: APR percentage value. Use `available` to render the fallback
  `0% available` treatment, or `notApplicable` to hide APR.
- `paymentMonths`: Payment term in months. Use `notApplicable` to hide the
  payment term.
- `fallbackContent`: Optional preview/default content using the same field
  shape.

Example `fallbackContent` value:

```tsx
<OfferBlock
  fallbackContent={{
    incentiveAmount: { value: "XXXX" },
    downPayment: { value: "0" },
    aPR: { value: "4.99" },
    paymentMonths: { value: "84" },
  }}
/>
```

Usage example:

```tsx
import { OfferBlock } from "kubota-outfit-components";

<OfferBlock
  incentiveAmount={inputs?.incentiveAmount}
  downPayment={inputs?.downPayment}
  aPR={inputs?.aPR}
  paymentMonths={inputs?.paymentMonths}
  fallbackContent={{ incentiveAmount: { value: "XXXX" } }}
/>
```

---

## LeaseOfferBlock Props

- `paymentPreText`: Small label shown before the payment amount.
- `paymentAmount`: Main payment amount value.
- `hoursOfUse`: Hours or usage indicator (optional).
- `aPR`: APR string for lease finance if applicable.
- `paymentMonths`: Lease term in months.
- `downPayment`: Down payment value.
- `fallbackContent`: Optional preview/default content.

Usage example:

```tsx
import { LeaseOfferBlock } from "kubota-outfit-components";

<LeaseOfferBlock
  paymentPreText={inputs?.paymentPreText}
  paymentAmount={inputs?.paymentAmount}
  hoursOfUse={inputs?.hours}
  aPR={inputs?.aPR}
  paymentMonths={inputs?.paymentMonths}
  downPayment={inputs?.downPayment}
>
  {/* optional children, e.g. a ButtonCTA instance for smaller containers */}
</LeaseOfferBlock>
```

---

## ButtonCTA Props

- `buttonText`: Outfit-style text input for the button label.
- `href`: Optional destination URL.
- `fallbackContent`: Optional preview/default content.

Usage example:

```tsx
import { ButtonCTA } from "kubota-outfit-components";

<ButtonCTA
  buttonText={inputs?.buttonText}
  fallbackContent={{ buttonText: { value: "Learn more" } }}
/>
```

---

## ImageBlock Props

- `sourceImage`: Image input object or URL.
- `dynamicSourceImageClassName`: Additional class names applied to the dynamic image container.
- `altTag`: Alt text for accessibility.
- `imageType`: Used to set the image type on 'required' statements.
- `imageLayout`: Layout mode (cover, contain, etc.).
- `imagePosition`: Positioning string (e.g. `center top`).
- `lang`: Used to set the language automatically on the class name.
- `position`: Sets the position value, defaults to 'relative'.
- `height`: Sets the height value in conjunction with 'position'.
- `width`: Sets the width value in conjunction with 'position'.
- `top`: Sets the top value in conjunction with absolute position, defaults to 'unset'.
- `left`: Sets the left value in conjunction with absolute position, defaults to 'unset'.
- `right`: Sets the right value in conjunction with absolute position, defaults to 'unset'.
- `bottom`: Sets the bottom value in conjunction with absolute position, defaults to 'unset'.
- `fallbackContent`: Optional preview/default content.


example. usage:

```tsx
import { ImageBlock } from "kubota-outfit-components";

<ImageBlock
  sourceImage={inputs?.sourceImage}
  dynamicSourceImageClassName="additional class names"
  altTag="altTag string"
  imageType="Studio"
  imageLayout="cover || contain etc"
  imagePosition="center top || left bottom etc"
  lang="fr"
  position="absolute"
  height="20cqb"
  width="35%"
  top="2em"
  left="50px"
  bottom="6cqb"
  right="24%" 
>
  {/* optional children, e.g. a ButtonCTA instance for smaller containers */}
</ImageBlock>
```

## Styling

The component ships with internal fallback values for fonts and colors, so it
can render without global CSS variables. Kubota template projects can still
override these variables:

```css
:root {
  --clamp-size-1: clamp(0.65em, calc(-0.875rem + 7.333cqi), 8.5rem);
  --font-family-inter-default: "Inter", Arial, sans-serif;
  --font-family-arial-black-default: "Arial Black", Arial, Helvetica, sans-serif;
  --color-orange: #ff6600;
  --color-black-tint-55: rgba(0, 0, 0, 0.55);
}
```

## Outfit Inputs

See [`examples/inputs.json`](examples/inputs.json) for suggested input
definitions and hints. Each outer object in inputs.json hosts the suggested inputs, choices, hints and definitions. ie...

```json
[
  {
    "warrantyBlock Inputs": [**...use these**]
  },
  {
    "offerBlock Inputs": [**...use these**]
  }
]
```

## Local Checks

```bash
npm run typecheck
npm run build
```

`build` emits JavaScript and TypeScript declaration files into `dist`.

## Version + Tag Release

Use one of these scripts to bump the package version, create a git commit, create
the matching tag, and push branch plus tags to `origin/main`:

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

Each release script runs `preversion` first, which performs:

```bash
npm run typecheck
npm run build
```

Example patch release flow:

```bash
# 1) Ensure you are on main and up to date
git checkout main
git pull origin main

# 2) Run a patch release (e.g. 0.1.2 -> 0.1.3)
npm run release:patch

# 3) Verify
git tag --list | tail -n 5
git log --oneline -n 3
git show --no-patch --decorate HEAD
```

Example minor release flow:

```bash
# e.g. 0.1.3 -> 0.2.0
npm run release:minor
```

Example major release flow:

```bash
# e.g. 0.2.0 -> 1.0.0
npm run release:major
```

## GitHub Release

After pushing the tag, create a GitHub release from that tag so the version has a
human-readable changelog and install instructions.

Steps:

1. Go to the repository on GitHub.
2. Open the `Releases` page.
3. Click `Draft a new release`.
4. Select the tag you just pushed, for example `v0.2.0`.
5. Set the release title to the same version, for example `v0.2.0`.
6. Paste the release notes template below.
7. Publish the release.

Suggested release body:

```md
## v0.2.0

- Added `WarrantyBlock` as the primary export.
- Added `AnnouncementBanner` as a secondary export for short callout banners
  with relative and absolute positioning modes, preview fallback content, and
  TextElement-based rendering.
- Supports Outfit-style inputs for APR, incentive copy, connector lines, and warranty copy.
- Ships with responsive layout rules and fallback preview content.
- Intended for direct consumption from template projects via a pinned Git tag.

## Install
npm i git+ssh://git@github.com/Showcase-Joz/kubota-outfit-components.git#v0.2.0

Or add this to `package.json`:

"dependencies": {
  "kubota-outfit-components": "git+ssh://git@github.com/Showcase-Joz/kubota-outfit-components.git#v0.2.0"
}
```

If you want a release checklist, keep this order:

1. Finish code changes.
2. Optional sanity check: run `npm run preversion` (release scripts run this automatically).
3. Run the appropriate release script __(npm run release:patch, npm run release:minor, npm run release:major)__.
4. Create the GitHub release and paste the notes.

## Consume a Release in Template Projects

When a new release is published, template projects should pin to that exact tag.

Install a specific release directly:

```bash
npm i git+ssh://git@github.com/Showcase-Joz/kubota-outfit-components.git#v0.2.0
```

Or pin in `package.json` and then run install:

```json
{
  "dependencies": {
    "kubota-outfit-components": "git+ssh://git@github.com/Showcase-Joz/kubota-outfit-components.git#v0.2.0"
  }
}
```

```bash
npm install
```

To move to a newer release later, update the tag (for example `#v0.2.1`) and run
`npm install` again.
