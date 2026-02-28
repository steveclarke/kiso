import { describe, it, expect } from "vitest"

import { FOCUSABLE_SELECTOR } from "../../../app/javascript/kiso/utils/focusable.js"

describe("FOCUSABLE_SELECTOR", () => {
  it("is a non-empty string", () => {
    expect(typeof FOCUSABLE_SELECTOR).toBe("string")
    expect(FOCUSABLE_SELECTOR.length).toBeGreaterThan(0)
  })

  it("includes a[href]", () => {
    expect(FOCUSABLE_SELECTOR).toContain("a[href]")
  })

  it("includes enabled buttons", () => {
    expect(FOCUSABLE_SELECTOR).toContain("button:not([disabled])")
  })

  it("includes enabled inputs", () => {
    expect(FOCUSABLE_SELECTOR).toContain("input:not([disabled])")
  })

  it("includes enabled selects", () => {
    expect(FOCUSABLE_SELECTOR).toContain("select:not([disabled])")
  })

  it("includes enabled textareas", () => {
    expect(FOCUSABLE_SELECTOR).toContain("textarea:not([disabled])")
  })

  it("includes elements with tabindex but excludes tabindex=-1", () => {
    expect(FOCUSABLE_SELECTOR).toContain('[tabindex]:not([tabindex="-1"])')
  })

  it("matches focusable elements in the DOM", () => {
    document.body.innerHTML = `
      <a href="/link">Link</a>
      <button>Click</button>
      <button disabled>Disabled</button>
      <input type="text" />
      <input type="text" disabled />
      <div tabindex="0">Focusable div</div>
      <div tabindex="-1">Not focusable</div>
      <div>Not focusable either</div>
    `

    const matches = document.querySelectorAll(FOCUSABLE_SELECTOR)
    expect(matches).toHaveLength(4)
  })
})
