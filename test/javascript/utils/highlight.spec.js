import { beforeEach, describe, it, expect, vi } from "vitest"

import { wrapIndex, highlightItem } from "../../../app/javascript/kiso/utils/highlight.js"

describe("wrapIndex", () => {
  it("returns -1 when length is 0", () => {
    expect(wrapIndex(0, 1, 0)).toBe(-1)
  })

  it("advances forward", () => {
    expect(wrapIndex(0, 1, 5)).toBe(1)
    expect(wrapIndex(3, 1, 5)).toBe(4)
  })

  it("wraps from last to first", () => {
    expect(wrapIndex(4, 1, 5)).toBe(0)
  })

  it("advances backward", () => {
    expect(wrapIndex(3, -1, 5)).toBe(2)
  })

  it("wraps from first to last", () => {
    expect(wrapIndex(0, -1, 5)).toBe(4)
  })

  it("handles single-item list", () => {
    expect(wrapIndex(0, 1, 1)).toBe(0)
    expect(wrapIndex(0, -1, 1)).toBe(0)
  })
})

describe("highlightItem", () => {
  let items

  beforeEach(() => {
    items = Array.from({ length: 3 }, () => {
      const el = document.createElement("li")
      el.scrollIntoView = vi.fn()
      return el
    })
  })

  it("sets data-highlighted on the target item", () => {
    highlightItem(items, items, 1)
    expect(items[1].hasAttribute("data-highlighted")).toBe(true)
  })

  it("clears data-highlighted from all clearItems", () => {
    items[0].setAttribute("data-highlighted", "")
    items[2].setAttribute("data-highlighted", "")

    highlightItem(items, items, 1)

    expect(items[0].hasAttribute("data-highlighted")).toBe(false)
    expect(items[2].hasAttribute("data-highlighted")).toBe(false)
  })

  it("calls scrollIntoView on the highlighted item", () => {
    highlightItem(items, items, 2)
    expect(items[2].scrollIntoView).toHaveBeenCalledWith({ block: "nearest" })
  })

  it("clears all when index is out of bounds (negative)", () => {
    items.forEach((el) => el.setAttribute("data-highlighted", ""))
    highlightItem(items, items, -1)
    items.forEach((el) => expect(el.hasAttribute("data-highlighted")).toBe(false))
  })

  it("clears all when index is out of bounds (>= length)", () => {
    items.forEach((el) => el.setAttribute("data-highlighted", ""))
    highlightItem(items, items, 5)
    items.forEach((el) => expect(el.hasAttribute("data-highlighted")).toBe(false))
  })

  it("supports a custom attr option", () => {
    highlightItem(items, items, 0, { attr: "data-active" })
    expect(items[0].hasAttribute("data-active")).toBe(true)
    expect(items[0].hasAttribute("data-highlighted")).toBe(false)
  })

  it("uses separate clearItems and items arrays", () => {
    const extraItems = [document.createElement("li"), document.createElement("li")]
    extraItems.forEach((el) => {
      el.scrollIntoView = vi.fn()
      el.setAttribute("data-highlighted", "")
    })

    highlightItem(extraItems, items, 0)

    extraItems.forEach((el) => expect(el.hasAttribute("data-highlighted")).toBe(false))
    expect(items[0].hasAttribute("data-highlighted")).toBe(true)
  })
})
