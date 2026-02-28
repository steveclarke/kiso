import { Controller } from "@hotwired/stimulus"

// Dropdown menu with keyboard navigation, sub-menus, checkbox and radio items.
//
// Targets:
//   trigger: the button that opens/closes the menu
//   content: the dropdown panel (menu)
//   item: standard menu items (role="menuitem")
//   checkboxItem: checkbox toggle items (role="menuitemcheckbox")
//   radioGroup: radio group container
//   radioItem: radio selection items (role="menuitemradio")
//   sub: sub-menu wrapper (contains subTrigger + subContent)
//   subTrigger: opens a nested sub-menu
//   subContent: nested sub-menu panel
//
// Usage:
//   See app/views/kiso/components/_dropdown_menu.html.erb
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
    "subContent"
  ]

  connect() {
    this._open = false
    this._highlightedIndex = -1
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
    this._handleKeydown = this._handleKeydown.bind(this)
    this._closeSubTimeout = null
  }

  disconnect() {
    this._removeGlobalListeners()
  }

  toggle(event) {
    event.preventDefault()
    event.stopPropagation()
    if (this._open) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    if (this._open) return

    this._open = true
    this.contentTarget.hidden = false
    this.triggerTarget.setAttribute("aria-expanded", "true")
    this._positionContent()
    this._addGlobalListeners()
    this._highlightIndex(0)
  }

  close() {
    if (!this._open) return

    this._open = false
    this._closeAllSubs()
    this.contentTarget.hidden = true
    this.triggerTarget.setAttribute("aria-expanded", "false")
    this._highlightIndex(-1)
    this._removeGlobalListeners()
    this.triggerTarget.focus()
  }

  selectItem(event) {
    const item = event.currentTarget
    if (item.hasAttribute("data-disabled")) return

    this.dispatch("select", { detail: { item } })
    this.close()
  }

  toggleCheckboxItem(event) {
    const item = event.currentTarget
    if (item.hasAttribute("data-disabled")) return

    const currentChecked = item.getAttribute("aria-checked") === "true"
    const newChecked = !currentChecked
    item.setAttribute("aria-checked", newChecked)

    // Toggle the check icon
    const indicator = item.querySelector(
      "[data-slot='dropdown-menu-checkbox-item'] > span:first-child, span.pointer-events-none"
    )
    // Find the indicator span (first child span)
    const indicatorSpan = item.children[0]
    if (indicatorSpan) {
      if (newChecked) {
        // Add check icon if not present
        if (!indicatorSpan.querySelector("svg")) {
          indicatorSpan.innerHTML = this._checkIconSvg()
        }
      } else {
        indicatorSpan.innerHTML = ""
      }
    }

    this.dispatch("checkbox-change", {
      detail: { item, checked: newChecked }
    })
  }

  selectRadioItem(event) {
    const item = event.currentTarget
    if (item.hasAttribute("data-disabled")) return

    const value = item.dataset.value
    const group = item.closest("[data-slot='dropdown-menu-radio-group']")

    if (group) {
      // Deselect all radio items in this group
      const radioItems = group.querySelectorAll(
        "[data-slot='dropdown-menu-radio-item']"
      )
      radioItems.forEach((radio) => {
        radio.setAttribute("aria-checked", "false")
        const indicatorSpan = radio.children[0]
        if (indicatorSpan) {
          indicatorSpan.innerHTML = ""
        }
      })

      // Select the clicked item
      item.setAttribute("aria-checked", "true")
      const indicatorSpan = item.children[0]
      if (indicatorSpan) {
        indicatorSpan.innerHTML = this._circleIconSvg()
      }

      // Update group value
      group.dataset.value = value
    }

    this.dispatch("radio-change", { detail: { item, value } })
  }

  toggleSub(event) {
    event.stopPropagation()
    const subTrigger = event.currentTarget
    const sub = subTrigger.closest("[data-slot='dropdown-menu-sub']")
    if (!sub) return

    const subContent = sub.querySelector(
      "[data-slot='dropdown-menu-sub-content']"
    )
    if (!subContent) return

    if (subContent.hidden) {
      this._openSub(sub, subTrigger, subContent)
    } else {
      this._closeSub(sub, subTrigger, subContent)
    }
  }

  openSubOnHover(event) {
    if (this._closeSubTimeout) {
      clearTimeout(this._closeSubTimeout)
      this._closeSubTimeout = null
    }

    const subTrigger = event.currentTarget
    const sub = subTrigger.closest("[data-slot='dropdown-menu-sub']")
    if (!sub) return

    const subContent = sub.querySelector(
      "[data-slot='dropdown-menu-sub-content']"
    )
    if (!subContent || !subContent.hidden) return

    // Close any other open sub-menus at the same level
    const parent = sub.parentElement
    if (parent) {
      parent
        .querySelectorAll(":scope > [data-slot='dropdown-menu-sub']")
        .forEach((otherSub) => {
          if (otherSub !== sub) {
            const otherContent = otherSub.querySelector(
              "[data-slot='dropdown-menu-sub-content']"
            )
            const otherTrigger = otherSub.querySelector(
              "[data-slot='dropdown-menu-sub-trigger']"
            )
            if (otherContent && !otherContent.hidden) {
              this._closeSub(otherSub, otherTrigger, otherContent)
            }
          }
        })
    }

    this._openSub(sub, subTrigger, subContent)
  }

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

  _openSub(sub, subTrigger, subContent) {
    subContent.hidden = false
    subTrigger.setAttribute("data-state", "open")
    this._positionSubContent(subTrigger, subContent)
  }

  _closeSub(sub, subTrigger, subContent) {
    subContent.hidden = true
    subTrigger.removeAttribute("data-state")

    // Close nested sub-menus recursively
    subContent
      .querySelectorAll("[data-slot='dropdown-menu-sub-content']")
      .forEach((nested) => {
        nested.hidden = true
      })
    subContent
      .querySelectorAll("[data-slot='dropdown-menu-sub-trigger']")
      .forEach((nested) => {
        nested.removeAttribute("data-state")
      })
  }

  _closeAllSubs() {
    this.subContentTargets.forEach((subContent) => {
      subContent.hidden = true
    })
    this.subTriggerTargets.forEach((subTrigger) => {
      subTrigger.removeAttribute("data-state")
    })
  }

  _allMenuItems(container) {
    // Get all focusable menu items within a container (not inside hidden sub-contents)
    const items = []
    const walk = (el) => {
      for (const child of el.children) {
        const slot = child.dataset?.slot
        // Skip hidden sub-content
        if (
          slot === "dropdown-menu-sub-content" &&
          child.hidden
        ) {
          continue
        }
        if (
          slot === "dropdown-menu-item" ||
          slot === "dropdown-menu-checkbox-item" ||
          slot === "dropdown-menu-radio-item" ||
          slot === "dropdown-menu-sub-trigger"
        ) {
          if (!child.hasAttribute("data-disabled")) {
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

  _highlightIndex(index) {
    // Remove highlight from all items in the content
    const allItems = this._allMenuItems(this.contentTarget)
    allItems.forEach((item) => {
      item.removeAttribute("data-highlighted")
    })

    this._highlightedIndex = index

    if (index >= 0 && index < allItems.length) {
      allItems[index].setAttribute("data-highlighted", "")
      allItems[index].scrollIntoView({ block: "nearest" })
    }
  }

  _positionContent() {
    const trigger = this.triggerTarget
    const content = this.contentTarget
    const rect = trigger.getBoundingClientRect()

    content.style.position = "absolute"
    content.style.top = `${trigger.offsetHeight + 4}px`
    content.style.left = "0"
    content.style.minWidth = `${rect.width}px`
  }

  _positionSubContent(subTrigger, subContent) {
    subContent.style.position = "absolute"
    subContent.style.top = "0"
    subContent.style.left = `${subTrigger.offsetWidth + 4}px`
  }

  _handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  _handleKeydown(event) {
    if (!this._open) return

    // Find the currently active sub-content (deepest open sub)
    let activeContainer = this.contentTarget
    const openSubs = Array.from(
      this.element.querySelectorAll(
        "[data-slot='dropdown-menu-sub-content']:not([hidden])"
      )
    )
    if (openSubs.length > 0) {
      activeContainer = openSubs[openSubs.length - 1]
    }

    const items = this._allMenuItems(activeContainer)

    // Find current highlighted in active container
    let currentIndex = items.findIndex((item) =>
      item.hasAttribute("data-highlighted")
    )

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        {
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
          // Clear all highlights then set
          this._clearAllHighlights()
          if (items[nextIndex]) {
            items[nextIndex].setAttribute("data-highlighted", "")
            items[nextIndex].scrollIntoView({ block: "nearest" })
          }
        }
        break
      case "ArrowUp":
        event.preventDefault()
        {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
          this._clearAllHighlights()
          if (items[prevIndex]) {
            items[prevIndex].setAttribute("data-highlighted", "")
            items[prevIndex].scrollIntoView({ block: "nearest" })
          }
        }
        break
      case "ArrowRight":
        event.preventDefault()
        // If highlighted item is a sub-trigger, open it
        if (currentIndex >= 0) {
          const current = items[currentIndex]
          if (current.dataset.slot === "dropdown-menu-sub-trigger") {
            const sub = current.closest("[data-slot='dropdown-menu-sub']")
            const subContent = sub?.querySelector(
              "[data-slot='dropdown-menu-sub-content']"
            )
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
          const sub = activeContainer.closest(
            "[data-slot='dropdown-menu-sub']"
          )
          const subTrigger = sub?.querySelector(
            "[data-slot='dropdown-menu-sub-trigger']"
          )
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
          const sub = activeContainer.closest(
            "[data-slot='dropdown-menu-sub']"
          )
          const subTrigger = sub?.querySelector(
            "[data-slot='dropdown-menu-sub-trigger']"
          )
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

  _clearAllHighlights() {
    this.element
      .querySelectorAll("[data-highlighted]")
      .forEach((el) => el.removeAttribute("data-highlighted"))
  }

  _addGlobalListeners() {
    document.addEventListener("click", this._handleOutsideClick, true)
    document.addEventListener("keydown", this._handleKeydown)
  }

  _removeGlobalListeners() {
    document.removeEventListener("click", this._handleOutsideClick, true)
    document.removeEventListener("keydown", this._handleKeydown)
  }

  _checkIconSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 size-4"><path d="M20 6 9 17l-5-5"/></svg>'
  }

  _circleIconSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 size-2"><circle cx="12" cy="12" r="10"/></svg>'
  }
}
