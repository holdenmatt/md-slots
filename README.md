# md-slots

Tiny `{{slot}}` renderer for markdown text.

## Install

```sh
npm install md-slots
```

## Usage

```ts
import { renderSlots, slots } from "md-slots";

const template = "Hello {{ name }}.\n\n{{body}}";

slots(template);
// ["name", "body"]

renderSlots(template, {
  name: "Ada",
  body: "Welcome.",
});
// "Hello Ada.\n\nWelcome."
```

## API

### `slots(template: string): string[]`

Returns unique slot names in order of first appearance. Slots look like `{{name}}`, with ignored whitespace inside the braces.

### `renderSlots(template, values, options?): string`

Replaces matching slots with `values[name]`. Strings render as-is; other values render with `JSON.stringify(value, null, 2)`. Pass `options.format(value, name)` to customize formatting.

Missing, `null`, and `undefined` values throw `Error("Missing slot: <name>")`.
