const slotPattern = /\{\{\s*([A-Za-z][A-Za-z0-9_-]*)\s*\}\}/g;

/**
 * Returns the unique slot names referenced by a template, preserving the order
 * in which each name first appears.
 *
 * Slots must use `{{name}}` syntax, with optional whitespace inside the braces.
 * Malformed placeholders are ignored.
 */
export function slots(template: string): string[] {
  const names = new Set<string>();

  for (const match of template.matchAll(slotPattern)) {
    names.add(match[1]);
  }

  return [...names];
}

/**
 * Replaces each matching slot in a template with its corresponding value.
 *
 * String values are rendered as-is. Other present values are rendered as
 * pretty-printed JSON unless `options.format` is provided. Missing, `null`, and
 * `undefined` values throw a `Missing slot` error.
 */
export function renderSlots(
  template: string,
  values: Record<string, unknown>,
  options?: {
    format?: (value: unknown, name: string) => string;
  },
): string {
  return template.replace(slotPattern, (_match, name: string) => {
    if (!Object.hasOwn(values, name)) {
      throw new Error(`Missing slot: ${name}`);
    }

    const value = values[name];

    if (value === null || value === undefined) {
      throw new Error(`Missing slot: ${name}`);
    }

    if (options?.format) {
      return options.format(value, name);
    }

    if (typeof value === "string") {
      return value;
    }

    return JSON.stringify(value, null, 2);
  });
}
