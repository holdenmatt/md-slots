import { describe, expect, it } from "vitest";

import { renderSlots, slots } from "../src/index.js";

describe("slots", () => {
  it("returns unique slot names in order of first appearance", () => {
    expect(slots("Hello {{name}}, {{ thing_1 }} and {{name}} from {{city-2}}")).toEqual([
      "name",
      "thing_1",
      "city-2",
    ]);
  });

  it("ignores malformed or non-matching braces", () => {
    expect(slots("{{}} {{ 1bad }} {{bad space}} {name} {{_bad}} {{ok}}")).toEqual(["ok"]);
  });
});

describe("renderSlots", () => {
  it("replaces matching slots with string values as-is", () => {
    expect(renderSlots("Hello {{ name }}.", { name: "Ada" })).toBe("Hello Ada.");
  });

  it("formats non-string values with pretty JSON by default", () => {
    expect(renderSlots("Data:\n{{data}}", { data: { count: 2, ok: true } })).toBe(
      'Data:\n{\n  "count": 2,\n  "ok": true\n}',
    );
  });

  it("uses a custom formatter when provided", () => {
    expect(
      renderSlots(
        "{{count}} {{name}}",
        { count: 3, name: "items" },
        {
          format: (value, name) => `${name}=${String(value)}`,
        },
      ),
    ).toBe("count=3 name=items");
  });

  it("throws for missing, null, or undefined slots", () => {
    expect(() => renderSlots("{{name}}", {})).toThrow("Missing slot: name");
    expect(() => renderSlots("{{name}}", { name: null })).toThrow("Missing slot: name");
    expect(() => renderSlots("{{name}}", { name: undefined })).toThrow("Missing slot: name");
  });

  it("throws when a slot is only inherited", () => {
    const values = Object.create({ name: "Ada" }) as Record<string, unknown>;

    expect(() => renderSlots("{{name}}", values)).toThrow("Missing slot: name");
  });

  it("renders repeated slots each time", () => {
    expect(renderSlots("{{name}}/{{ name }}/{{name}}", { name: "x" })).toBe("x/x/x");
  });

  it("leaves malformed or non-matching braces unchanged", () => {
    expect(renderSlots("{{}} {{ 1bad }} {{bad space}} {name} {{ok}}", { ok: "yes" })).toBe(
      "{{}} {{ 1bad }} {{bad space}} {name} yes",
    );
  });
});
