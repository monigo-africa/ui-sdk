# @monigo/tokens

Design tokens and theming helpers for Monigo UI packages. Framework-agnostic.

## Install

```bash
npm install @monigo/tokens
```

## Usage

Import the CSS once:

```ts
import '@monigo/tokens/monigo.css'
// optional:
import '@monigo/tokens/monigo-dark.css'
```

Apply dark mode by setting an attribute on any ancestor element:

```html
<section data-monigo-theme="dark">…</section>
```

Generate a scoped theme CSS string at runtime (e.g. for per-tenant theming):

```ts
import { createTheme } from '@monigo/tokens'

const css = createTheme({ primary: '#6366f1', accent: '#f43f5e', mode: 'dark' })
document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }))
```

See `monigo.css` for the full list of tokens.
