# kubota-outfit-components

Kubota-specific reusable UI components for Outfit template projects.

This package starts with the responsive `WarrantyBlock` component. The current
version is intentionally Kubota-shaped: it includes Kubota-oriented defaults,
responsive layout rules, and Outfit input guidance. Future versions can separate
theming more aggressively if the same component patterns need to be forked for
another client.

## Install

This repo is private/package-in-progress. For now, consume it from source or use
it as the source of truth for copying components into a Kubota Outfit template.

## Usage

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

Each prop expects an Outfit-style text or choice input object:

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
definitions and hints.

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
