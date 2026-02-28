import { Controller } from "@hotwired/stimulus"

import { highlightItem, wrapIndex } from "kiso-ui/utils/highlight"
import { positionBelow } from "kiso-ui/utils/positioning"

/**
 * Dropdown menu with keyboard navigation, sub-menus, checkbox items, and radio items.
 * Supports nested sub-menus with hover-to-open, type-ahead search, and full
 * arrow-key navigation including ArrowRight/Left for sub-menu enter/exit.
 *
 * @example
 *   <div data-controller="kiso--dropdown-menu" data-slot="dropdown-menu">
 *     <div data-kiso--dropdown-menu-target="trigger"
 *          data-action="click->kiso--dropdown-menu#toggle keydown->kiso--dropdown-menu#triggerKeydown">
 *       <button>Open Menu</button>
 *     </div>
 *     <div data-kiso--dropdown-menu-target="content" role="menu" hidden>
 *       <div data-kiso--dropdown-menu-target="item" data-slot="dropdown-menu-item"
 *            data-action="click->kiso--dropdown-menu#selectItem" role="menuitem">
 *         Profile
 *       </div>
 *     </div>
 *   </div>
 *
 * @property {HTMLElement} triggerTarget - Button that opens/closes the menu
 * @property {HTMLElement} contentTarget - The dropdown panel (menu)
 * @property {HTMLElement[]} itemTargets - Standard menu items (role="menuitem")
 * @property {HTMLElement[]} checkboxItemTargets - Checkbox toggle items (role="menuitemcheckbox")
 * @property {HTMLElement[]} radioGroupTargets - Radio group containers
 * @property {HTMLElement[]} radioItemTargets - Radio selection items (role="menuitemradio")
 * @property {HTMLElement[]} subTargets - Sub-menu wrappers (contain subTrigger + subContent)
 * @property {HTMLElement[]} subTriggerTargets - Elements that open nested sub-menus
 * @property {HTMLElement[]} subContentTargets - Nested sub-menu panels
 *
 * @fires kiso--dropdown-menu:select - When a standard item is selected. Detail: `{ item: HTMLElement }`.
 * @fires kiso--dropdown-menu:checkbox-change - When a checkbox item is toggled. Detail: `{ item: HTMLElement, checked: boolean }`.
 * @fires kiso--dropdown-menu:radio-change - When a radio item is selected. Detail: `{ item: HTMLElement, value: string }`.
 */
export default class extends Controller {
  static targets = [
    "trigger",
    "content",
    "item",
    "checkboxItem",
    "radioGroup",
    "radioItem",
    "sub",
    "subTrigger",
    "subContent",
  ]

  connect() {
    this._open = false
    this._highlightedIndex = -1
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
    this._handleKeydown = this._handleKeydown.bind(this)
    this._handleMouseover = this._handleMouseover.bind(this)
    this._closeSubTimeout = null
  }

  disconnect() {
    this._removeGlobalListeners()
    if (this._closeSubTimeout) {
      clearTimeout(this._closeSubTimeout)
    }
  }

  /**
   * Toggles the dropdown menu open or closed.
   *
   * @param {Event} event
   */
  toggle(event) {
    event.preventDefault()
    event.stopPropagation()
    if (this._open) {
      this.close()
    } else {
      this.open()
    }
  }

  /**
   * Opens the dropdown, positions it below the trigger, highlights the first
   * item, and attaches mouse hover delegation.
   */
  open() {
    if (this._open) return

    this._open = true
    this.contentTarget.hidden = false
    this.triggerTarget.setAttribute("aria-expanded", "true")
    this._positionContent()
    this._addGlobalListeners()
    this._highlightIndex(0)

    // Mouse hover highlighting via event delegation
    this.contentTarget.addEventListener("mouseover", this._handleMouseover)
  }

  /**
   * Closes the dropdown, all sub-menus, removes listeners,
   * and returns focus to the trigger.
   */
  close() {
    if (!this._open) return

    this._open = false
    this._closeAllSubs()
    this.contentTarget.hidden = true
    this.triggerTarget.setAttribute("aria-expanded", "false")
    this._highlightIndex(-1)
    this._removeGlobalListeners()
    this.contentTarget.removeEventListener("mouseover", this._handleMouseover)

    if (this._closeSubTimeout) {
      clearTimeout(this._closeSubTimeout)
      this._closeSubTimeout = null
    }

    // Focus the button inside the trigger wrapper, or the trigger itself
    const btn = this.triggerTarget.querySelector("button, [tabindex]")
    ;(btn || this.triggerTarget).focus()
  }

  /**
   * Dispatches a "select" event for a standard menu item and closes the menu.
   *
   * @param {Event} event - Click event from an item element
   */
  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled === "true") return

    this.dispatch("select", { detail: { item } })
    this.close()
  }

  /**
   * Toggles a checkbox menu item's checked state and updates its indicator icon.
   *
   * @param {Event} event - Click event from a checkbox item element
   */
  toggleCheckboxItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled === "true") return

    const currentChecked = item.getAttribute("aria-checked") === "true"
    const newChecked = !currentChecked
    item.setAttribute("aria-checked", newChecked)

    // Toggle the indicator visibility
    const indicator = item.querySelector("[data-slot='dropdown-menu-item-indicator']")
    if (indicator) {
      indicator.hidden = !newChecked
    }

    this.dispatch("checkbox-change", {
      detail: { item, checked: newChecked },
    })
  }

  /**
   * Selects a radio item within its group, deselecting all siblings.
   * Updates aria-checked and indicator icons.
   *
   * @param {Event} event - Click event from a radio item element
   */
  selectRadioItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled === "true") return

    const value = item.dataset.value
    const group = item.closest("[data-slot='dropdown-menu-radio-group']")

    if (group) {
      // Deselect all radio items in this group
      const radioItems = group.querySelectorAll("[data-slot='dropdown-menu-radio-item']")
      radioItems.forEach((radio) => {
        radio.setAttribute("aria-checked", "false")
        const indicator = radio.querySelector("[data-slot='dropdown-menu-item-indicator']")
        if (indicator) indicator.hidden = true
      })

      // Select the clicked item
      item.setAttribute("aria-checked", "true")
      const indicator = item.querySelector("[data-slot='dropdown-menu-item-indicator']")
      if (indicator) indicator.hidden = false

      // Update group value
      group.dataset.value = value
    }

    this.dispatch("radio-change", { detail: { item, value } })
  }

  /**
   * Toggles a sub-menu open or closed when its trigger is clicked.
   *
   * @param {Event} event - Click event from a sub-trigger element
   */
  toggleSub(event) {
    event.stopPropagation()
    const subTrigger = event.currentTarget
    const sub = subTrigger.closest("[data-slot='dropdown-menu-sub']")
    if (!sub) return

    const subContent = sub.querySelector("[data-slot='dropdown-menu-sub-content']")
    if (!subContent) return

    if (subContent.hidden) {
      this._openSub(sub, subTrigger, subContent)
    } else {
      this._closeSub(sub, subTrigger, subContent)
    }
  }

  /**
   * Opens a sub-menu on hover, closing sibling sub-menus first.
   * Cancels any pending close timeout.
   *
   * @param {Event} event - Mouseenter event from a sub-trigger element
   */
  openSubOnHover(event) {
    if (this._closeSubTimeout) {
      clearTimeout(this._closeSubTimeout)
      this._closeSubTimeout = null
    }

    const subTrigger = event.currentTarget
    const sub = subTrigger.closest("[data-slot='dropdown-menu-sub']")
    if (!sub) return

    const subContent = sub.querySelector("[data-slot='dropdown-menu-sub-content']")
    if (!subContent || !subContent.hidden) return

    // Close any other open sub-menus at the same level
    const parent = sub.parentElement
    if (parent) {
      parent.querySelectorAll(":scope > [data-slot='dropdown-menu-sub']").forEach((otherSub) => {
        if (otherSub !== sub) {
          const otherContent = otherSub.querySelector("[data-slot='dropdown-menu-sub-content']")
          const otherTrigger = otherSub.querySelector("[data-slot='dropdown-menu-sub-trigger']")
          if (otherContent && !otherContent.hidden) {
            this._closeSub(otherSub, otherTrigger, otherContent)
          }
        }
      })
    }

    this._openSub(sub, subTrigger, subContent)
  }

  /**
   * Opens the dropdown on ArrowDown, Space, Enter, or ArrowUp when
   * the trigger is focused. ArrowUp highlights the last item.
   *
   * @param {KeyboardEvent} event
   */
  triggerKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
      case " ":
      case "Enter":
        event.preventDefault()
        if (!this._open) {
          this.open()
        }
        break
      case "ArrowUp":
        event.preventDefault()
        if (!this._open) {
          this.open()
          // Highlight last item
          const items = this._allMenuItems(this.contentTarget)
          this._highlightIndex(items.length - 1)
        }
        break
    }
  }

  // --- Private ---

  /**
   * Opens a sub-menu, positions it, and attaches mouseenter/mouseleave
   * listeners for auto-close with a delay for gap crossing.
   *
   * @param {HTMLElement} sub - The sub wrapper element
   * @param {HTMLElement} subTrigger - The sub-trigger element
   * @param {HTMLElement} subContent - The sub-content panel
   * @private
   */
  _openSub(sub, subTrigger, subContent) {
    subContent.hidden = false
    subTrigger.setAttribute("data-state", "open")
    this._positionSubContent(subTrigger, subContent)

    // Auto-close when mouse leaves sub-content (with delay for gap crossing)
    subContent._enterHandler = () => {
      if (this._closeSubTimeout) {
        clearTimeout(this._closeSubTimeout)
        this._closeSubTimeout = null
      }
    }
    subContent._leaveHandler = () => {
      this._closeSubTimeout = setTimeout(() => {
        if (!subContent.hidden) {
          this._closeSub(sub, subTrigger, subContent)
        }
      }, 150)
    }
    subContent.addEventListener("mouseenter", subContent._enterHandler)
    subContent.addEventListener("mouseleave", subContent._leaveHandler)
  }

  /**
   * Closes a sub-menu, cleans up hover listeners, and recursively
   * closes any nested sub-menus.
   *
   * @param {HTMLElement} sub - The sub wrapper element
   * @param {HTMLElement} subTrigger - The sub-trigger element
   * @param {HTMLElement} subContent - The sub-content panel
   * @private
   */
  _closeSub(sub, subTrigger, subContent) {
    subContent.hidden = true
    subTrigger.removeAttribute("data-state")

    // Clean up hover listeners
    this._removeSubContentListeners(subContent)

    // Close nested sub-menus recursively
    subContent.querySelectorAll("[data-slot='dropdown-menu-sub-content']").forEach((nested) => {
      nested.hidden = true
      this._removeSubContentListeners(nested)
    })
    subContent.querySelectorAll("[data-slot='dropdown-menu-sub-trigger']").forEach((nested) => {
      nested.removeAttribute("data-state")
    })
  }

  /**
   * Closes all open sub-menus and cleans up their listeners.
   *
   * @private
   */
  _closeAllSubs() {
    this.subContentTargets.forEach((subContent) => {
      subContent.hidden = true
      this._removeSubContentListeners(subContent)
    })
    this.subTriggerTargets.forEach((subTrigger) => {
      subTrigger.removeAttribute("data-state")
    })
  }

  /**
   * Removes mouseenter/mouseleave handlers from a sub-content element.
   *
   * @param {HTMLElement} subContent
   * @private
   */
  _removeSubContentListeners(subContent) {
    if (subContent._enterHandler) {
      subContent.removeEventListener("mouseenter", subContent._enterHandler)
      subContent._enterHandler = null
    }
    if (subContent._leaveHandler) {
      subContent.removeEventListener("mouseleave", subContent._leaveHandler)
      subContent._leaveHandler = null
    }
  }

  /**
   * Collects all focusable menu items within a container, skipping hidden
   * sub-content panels and disabled items. Walks the DOM tree recursively.
   *
   * @param {HTMLElement} container - The menu or sub-content container to search
   * @returns {HTMLElement[]} Ordered list of focusable items
   * @private
   */
  _allMenuItems(container) {
    const items = []
    const walk = (el) => {
      for (const child of el.children) {
        const slot = child.dataset?.slot
        // Skip hidden sub-content
        if (slot === "dropdown-menu-sub-content" && child.hidden) {
          continue
        }
        if (
          slot === "dropdown-menu-item" ||
          slot === "dropdown-menu-checkbox-item" ||
          slot === "dropdown-menu-radio-item" ||
          slot === "dropdown-menu-sub-trigger"
        ) {
          if (child.dataset.disabled !== "true") {
            items.push(child)
          }
        }
        // Recurse into groups, subs, radio-groups, etc.
        if (child.children && child.children.length > 0) {
          walk(child)
        }
      }
    }
    walk(container)
    return items
  }

  /**
   * Highlights a menu item at the given index and scrolls it into view.
   * Pass -1 to clear all highlights.
   *
   * @param {number} index - Index within all menu items, or -1 to clear
   * @private
   */
  _highlightIndex(index) {
    const allItems = this._allMenuItems(this.contentTarget)
    this._highlightedIndex = index
    highlightItem(allItems, allItems, index)
  }

  /**
   * Positions the dropdown content below the trigger with matching min-width
   * and a dynamic max-height based on viewport space.
   *
   * @private
   */
  _positionContent() {
    const content = this.contentTarget
    positionBelow(this.triggerTarget, content)

    // Dynamic max-height based on available viewport space
    requestAnimationFrame(() => {
      const contentRect = content.getBoundingClientRect()
      const availableHeight = window.innerHeight - contentRect.top - 8
      if (availableHeight > 0) {
        content.style.maxHeight = `${availableHeight}px`
      }
    })
  }

  /**
   * Positions a sub-content panel to the right of its trigger using
   * fixed positioning. Flips horizontally or adjusts vertically
   * if the panel overflows the viewport.
   *
   * @param {HTMLElement} subTrigger - The sub-trigger element
   * @param {HTMLElement} subContent - The sub-content panel to position
   * @private
   */
  _positionSubContent(subTrigger, subContent) {
    // Use fixed positioning to escape parent overflow clipping
    const rect = subTrigger.getBoundingClientRect()
    subContent.style.position = "fixed"
    subContent.style.top = `${rect.top}px`
    subContent.style.left = `${rect.right + 4}px`

    // Check viewport bounds after rendering
    requestAnimationFrame(() => {
      const subRect = subContent.getBoundingClientRect()
      // Flip horizontally if overflowing right edge
      if (subRect.right > window.innerWidth) {
        subContent.style.left = `${rect.left - subRect.width - 4}px`
      }
      // Adjust vertically if overflowing bottom edge
      if (subRect.bottom > window.innerHeight) {
        subContent.style.top = `${window.innerHeight - subRect.height - 8}px`
      }
    })
  }

  /**
   * Handles mouseover events via delegation on the content panel.
   * Highlights hovered items and closes sibling sub-menus when hovering
   * non-sub-trigger items.
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleMouseover(event) {
    const item = event.target.closest(
      "[data-slot='dropdown-menu-item'], " +
        "[data-slot='dropdown-menu-checkbox-item'], " +
        "[data-slot='dropdown-menu-radio-item'], " +
        "[data-slot='dropdown-menu-sub-trigger']",
    )
    if (!item || !this.element.contains(item)) return
    if (item.dataset.disabled === "true") return

    this._clearAllHighlights()
    item.setAttribute("data-highlighted", "")

    // When hovering a regular item, close open subs at the same level
    if (item.dataset.slot !== "dropdown-menu-sub-trigger") {
      const parentContainer = item.closest(
        "[data-slot='dropdown-menu-content'], [data-slot='dropdown-menu-sub-content']",
      )
      if (parentContainer) {
        parentContainer.querySelectorAll("[data-slot='dropdown-menu-sub']").forEach((sub) => {
          // Only close subs whose nearest content ancestor is this container
          if (
            sub.closest(
              "[data-slot='dropdown-menu-content'], [data-slot='dropdown-menu-sub-content']",
            ) === parentContainer
          ) {
            const sc = sub.querySelector("[data-slot='dropdown-menu-sub-content']")
            const st = sub.querySelector("[data-slot='dropdown-menu-sub-trigger']")
            if (sc && !sc.hidden) {
              this._closeSub(sub, st, sc)
            }
          }
        })
      }
    }
  }

  /**
   * Closes the dropdown when clicking outside the component,
   * including outside any open fixed-positioned sub-content.
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleOutsideClick(event) {
    // Check both the root element and any open fixed-positioned sub-contents
    if (this.element.contains(event.target)) return
    for (const subContent of this.subContentTargets) {
      if (!subContent.hidden && subContent.contains(event.target)) return
    }
    this.close()
  }

  /**
   * Handles keyboard navigation while the dropdown is open.
   * Operates on the deepest open sub-menu container.
   * Supports ArrowDown/Up, ArrowRight (enter sub), ArrowLeft (exit sub),
   * Enter/Space (activate), Escape, Home, End, Tab, and type-ahead.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _handleKeydown(event) {
    if (!this._open) return

    // Find the currently active sub-content (deepest open sub)
    let activeContainer = this.contentTarget
    const openSubs = Array.from(
      this.element.querySelectorAll("[data-slot='dropdown-menu-sub-content']:not([hidden])"),
    )
    if (openSubs.length > 0) {
      activeContainer = openSubs[openSubs.length - 1]
    }

    const items = this._allMenuItems(activeContainer)

    // Find current highlighted in active container
    let currentIndex = items.findIndex((item) => item.hasAttribute("data-highlighted"))

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        highlightItem(items, items, wrapIndex(currentIndex, 1, items.length))
        break
      case "ArrowUp":
        event.preventDefault()
        highlightItem(items, items, wrapIndex(currentIndex, -1, items.length))
        break
      case "ArrowRight":
        event.preventDefault()
        // If highlighted item is a sub-trigger, open it
        if (currentIndex >= 0) {
          const current = items[currentIndex]
          if (current.dataset.slot === "dropdown-menu-sub-trigger") {
            const sub = current.closest("[data-slot='dropdown-menu-sub']")
            const subContent = sub?.querySelector("[data-slot='dropdown-menu-sub-content']")
            if (sub && subContent && subContent.hidden) {
              this._openSub(sub, current, subContent)
              // Highlight first item in sub
              const subItems = this._allMenuItems(subContent)
              this._clearAllHighlights()
              if (subItems[0]) {
                subItems[0].setAttribute("data-highlighted", "")
              }
            }
          }
        }
        break
      case "ArrowLeft":
        event.preventDefault()
        // Close the current sub-menu if we're in one
        if (activeContainer !== this.contentTarget) {
          const sub = activeContainer.closest("[data-slot='dropdown-menu-sub']")
          const subTrigger = sub?.querySelector("[data-slot='dropdown-menu-sub-trigger']")
          if (sub && subTrigger) {
            this._closeSub(sub, subTrigger, activeContainer)
            this._clearAllHighlights()
            subTrigger.setAttribute("data-highlighted", "")
          }
        }
        break
      case "Enter":
      case " ":
        event.preventDefault()
        if (currentIndex >= 0 && currentIndex < items.length) {
          const current = items[currentIndex]
          // Trigger click on the highlighted item
          current.click()
        }
        break
      case "Escape":
        event.preventDefault()
        // If in a sub-menu, close just that sub
        if (activeContainer !== this.contentTarget) {
          const sub = activeContainer.closest("[data-slot='dropdown-menu-sub']")
          const subTrigger = sub?.querySelector("[data-slot='dropdown-menu-sub-trigger']")
          if (sub && subTrigger) {
            this._closeSub(sub, subTrigger, activeContainer)
            this._clearAllHighlights()
            subTrigger.setAttribute("data-highlighted", "")
          }
        } else {
          this.close()
        }
        break
      case "Home":
        event.preventDefault()
        this._clearAllHighlights()
        if (items[0]) {
          items[0].setAttribute("data-highlighted", "")
        }
        break
      case "End":
        event.preventDefault()
        this._clearAllHighlights()
        if (items[items.length - 1]) {
          items[items.length - 1].setAttribute("data-highlighted", "")
        }
        break
      case "Tab":
        this.close()
        break
      default:
        // Type-ahead
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          const char = event.key.toLowerCase()
          const startIndex = currentIndex + 1
          for (let i = 0; i < items.length; i++) {
            const idx = (startIndex + i) % items.length
            const text = items[idx].textContent?.trim().toLowerCase()
            if (text?.startsWith(char)) {
              this._clearAllHighlights()
              items[idx].setAttribute("data-highlighted", "")
              items[idx].scrollIntoView({ block: "nearest" })
              break
            }
          }
        }
        break
    }
  }

  /**
   * Removes `data-highlighted` from all elements in the dropdown.
   *
   * @private
   */
  _clearAllHighlights() {
    this.element
      .querySelectorAll("[data-highlighted]")
      .forEach((el) => el.removeAttribute("data-highlighted"))
  }

  /** @private */
  _addGlobalListeners() {
    document.addEventListener("click", this._handleOutsideClick, true)
    document.addEventListener("keydown", this._handleKeydown)
  }

  /** @private */
  _removeGlobalListeners() {
    document.removeEventListener("click", this._handleOutsideClick, true)
    document.removeEventListener("keydown", this._handleKeydown)
  }
}
