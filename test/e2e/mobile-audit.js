/**
 * Mobile audit tool — visits every Kiso component at mobile viewport,
 * runs structural checks, takes screenshots, and generates a self-contained
 * HTML report at tmp/mobile-audit.html.
 *
 * Usage:
 *   node test/e2e/mobile-audit.js
 *
 * Requires Lookbook running on localhost:4001 (or LOOKBOOK_PORT env var).
 *
 * @module mobile-audit
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"

import { chromium } from "playwright"

import { COMPONENTS } from "./fixtures/components.js"

const PORT = process.env.LOOKBOOK_PORT ?? 4001
const BASE_URL = `http://localhost:${PORT}`
const VIEWPORT = { width: 375, height: 667 }
const MAX_SCREENSHOT_HEIGHT = 2000
const NAV_TIMEOUT = 10_000

/**
 * Check if the page has horizontal overflow beyond the viewport width.
 *
 * @param {import("playwright").Page} page
 * @returns {Promise<Object|null>} Finding object or null
 */
async function checkHorizontalOverflow(page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  if (scrollWidth > VIEWPORT.width) {
    return {
      type: "overflow",
      severity: "error",
      message: `Horizontal overflow: ${scrollWidth - VIEWPORT.width}px beyond ${VIEWPORT.width}px viewport`,
    }
  }
  return null
}

/**
 * Check if any data-slot elements extend past the right edge of the viewport.
 *
 * @param {import("playwright").Page} page
 * @returns {Promise<Object[]>} Array of finding objects
 */
async function checkElementsOutsideViewport(page) {
  const findings = []
  const slots = await page.locator("[data-slot]").all()

  for (const slot of slots) {
    const box = await slot.boundingBox()
    if (box && box.x + box.width > VIEWPORT.width + 1) {
      const slotName = await slot.getAttribute("data-slot")
      findings.push({
        type: "clipping",
        severity: "warning",
        message: `[data-slot="${slotName}"] extends ${Math.round(box.x + box.width - VIEWPORT.width)}px past viewport`,
      })
    }
  }

  return findings
}

/**
 * Check if interactive elements meet the 44x44px minimum touch target size.
 * Uses boundingBox() which measures the CSS box — may produce false positives
 * for elements with adequate padding on a parent. Results are for human triage.
 *
 * @param {import("playwright").Page} page
 * @returns {Promise<Object[]>} Array of finding objects
 */
async function checkTouchTargets(page) {
  const findings = []
  const selector =
    "button, a, input, select, textarea, " +
    "[role='button'], [role='checkbox'], [role='radio'], [role='switch'], " +
    "[role='tab'], [role='menuitem'], [role='option']"

  const elements = await page.locator(selector).all()

  for (const el of elements) {
    if (!(await el.isVisible())) continue
    const box = await el.boundingBox()
    if (box && (box.width < 44 || box.height < 44)) {
      // Skip hidden native inputs — slider, switch, checkbox, radio use styled
      // visual targets that are larger than the underlying <input>
      const isHiddenNative = await el.evaluate((e) => {
        if (e.tagName !== "INPUT") return false
        const style = getComputedStyle(e)
        // Hidden inputs used by Stimulus controllers (slider, switch)
        if (e.offsetWidth <= 1 && e.offsetHeight <= 1) return true
        // Checkbox/radio inputs styled via appearance:none with a visual label
        if (["checkbox", "radio"].includes(e.type) && style.appearance === "none") return true
        return false
      })
      if (isHiddenNative) continue

      const tag = await el.evaluate(
        (e) =>
          `<${e.tagName.toLowerCase()}${e.dataset.slot ? ` data-slot="${e.dataset.slot}"` : ""}>`,
      )
      findings.push({
        type: "touch-target",
        severity: "warning",
        message: `${tag} is ${Math.round(box.width)}\u00d7${Math.round(box.height)}px (minimum 44\u00d744)`,
      })
    }
  }

  return findings
}

/**
 * Check for text content overflowing its container without overflow handling.
 * Checks data-slot elements for scrollWidth > clientWidth without
 * overflow-x: hidden/scroll/auto/clip set.
 *
 * @param {import("playwright").Page} page
 * @returns {Promise<Object[]>} Array of finding objects
 */
async function checkTextTruncation(page) {
  const findings = []
  const slots = await page.locator("[data-slot]").all()

  for (const slot of slots) {
    const overflow = await slot.evaluate((e) => {
      const style = getComputedStyle(e)
      return {
        scrollWidth: e.scrollWidth,
        clientWidth: e.clientWidth,
        overflowX: style.overflowX,
        slot: e.dataset.slot,
      }
    })

    if (
      overflow.scrollWidth > overflow.clientWidth + 1 &&
      overflow.overflowX !== "hidden" &&
      overflow.overflowX !== "scroll" &&
      overflow.overflowX !== "auto" &&
      overflow.overflowX !== "clip"
    ) {
      findings.push({
        type: "truncation",
        severity: "warning",
        message: `[data-slot="${overflow.slot}"] text overflows by ${overflow.scrollWidth - overflow.clientWidth}px without overflow handling`,
      })
    }
  }

  return findings
}

/**
 * Run all structural checks against the current page.
 *
 * @param {import("playwright").Page} page
 * @returns {Promise<Object[]>} All findings
 */
async function runChecks(page) {
  const findings = []

  const overflow = await checkHorizontalOverflow(page)
  if (overflow) findings.push(overflow)

  findings.push(...(await checkElementsOutsideViewport(page)))
  findings.push(...(await checkTouchTargets(page)))
  findings.push(...(await checkTextTruncation(page)))

  return findings
}

/**
 * Generate the self-contained HTML report.
 *
 * @param {Object[]} results - Array of { name, url, findings, screenshot, error }
 * @returns {string} HTML string
 */
function generateReport(results) {
  const timestamp = new Date().toLocaleString()
  const totalComponents = results.length
  const errorCount = results.filter((r) => r.error).length
  const issueComponents = results.filter((r) => r.findings.length > 0 && !r.error)

  const counts = {
    overflow: 0,
    clipping: 0,
    "touch-target": 0,
    truncation: 0,
  }

  for (const r of results) {
    for (const f of r.findings) {
      counts[f.type] = (counts[f.type] || 0) + 1
    }
  }

  const totalIssues = Object.values(counts).reduce((a, b) => a + b, 0)

  // Sort: errors first, then components with findings, then clean
  const sorted = [...results].sort((a, b) => {
    if (a.error && !b.error) return -1
    if (!a.error && b.error) return 1
    return b.findings.length - a.findings.length
  })

  const severityBadge = (severity) =>
    severity === "error"
      ? '<span style="background:#ef4444;color:white;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">ERROR</span>'
      : '<span style="background:#f59e0b;color:white;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">WARNING</span>'

  const typeBadge = (type) => {
    const colors = {
      overflow: "#dc2626",
      clipping: "#d97706",
      "touch-target": "#7c3aed",
      truncation: "#2563eb",
    }
    const color = colors[type] || "#6b7280"
    return `<span style="background:${color}20;color:${color};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase">${type}</span>`
  }

  const componentCards = sorted
    .map((r) => {
      const id = r.name.replace(/[^a-z0-9-]/g, "-")

      if (r.error) {
        return `
        <div id="${id}" style="border:1px solid #fca5a5;border-radius:8px;padding:20px;margin-bottom:16px;background:#fef2f2">
          <h3 style="margin:0 0 8px 0;font-size:16px">${r.name}</h3>
          <p style="color:#dc2626;margin:0;font-size:14px">Failed to load: ${escapeHtml(r.error)}</p>
        </div>`
      }

      const findingsHtml =
        r.findings.length > 0
          ? r.findings
              .map(
                (f) => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f3f4f6">
              ${severityBadge(f.severity)}
              ${typeBadge(f.type)}
              <span style="font-size:13px;color:#374151;font-family:monospace">${escapeHtml(f.message)}</span>
            </div>`,
              )
              .join("")
          : '<span style="background:#22c55e;color:white;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">NO ISSUES</span>'

      const screenshotHtml = r.screenshot
        ? `<img src="data:image/jpeg;base64,${r.screenshot}" style="width:375px;border:1px solid #e5e7eb;border-radius:4px;margin-top:12px" />`
        : '<p style="color:#9ca3af;font-style:italic">No screenshot captured</p>'

      return `
      <div id="${id}" style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:16px;background:white">
        <h3 style="margin:0 0 12px 0;font-size:16px;display:flex;align-items:center;gap:8px">
          ${r.name}
          ${r.findings.length > 0 ? `<span style="color:#9ca3af;font-size:13px;font-weight:normal">${r.findings.length} issue${r.findings.length === 1 ? "" : "s"}</span>` : ""}
        </h3>
        <div style="margin-bottom:12px">${findingsHtml}</div>
        ${screenshotHtml}
      </div>`
    })
    .join("")

  const jumpLinks = sorted
    .filter((r) => r.findings.length > 0 || r.error)
    .map((r) => {
      const id = r.name.replace(/[^a-z0-9-]/g, "-")
      const count = r.error ? "error" : `${r.findings.length}`
      return `<a href="#${id}" style="color:#2563eb;text-decoration:none;font-size:13px">${r.name} (${count})</a>`
    })
    .join(" &middot; ")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kiso Mobile Audit Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 24px; background: #f9fafb; color: #111827; }
    h1 { font-size: 24px; margin: 0 0 8px 0; }
    h2 { font-size: 18px; margin: 32px 0 16px 0; color: #374151; }
  </style>
</head>
<body>
  <h1>Kiso Mobile Audit Report</h1>
  <p style="color:#6b7280;margin:0 0 24px 0">Generated ${escapeHtml(timestamp)} &middot; Viewport ${VIEWPORT.width}&times;${VIEWPORT.height}</p>

  <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:24px">
    <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:16px">
      <div><strong>${totalComponents}</strong> <span style="color:#6b7280">components</span></div>
      <div><strong style="color:${totalIssues > 0 ? "#dc2626" : "#22c55e"}">${totalIssues}</strong> <span style="color:#6b7280">total issues</span></div>
      ${errorCount > 0 ? `<div><strong style="color:#dc2626">${errorCount}</strong> <span style="color:#6b7280">load failures</span></div>` : ""}
    </div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:${jumpLinks ? "16px" : "0"}">
      <div style="font-size:13px;color:#6b7280">
        <span style="color:#dc2626;font-weight:600">${counts.overflow}</span> overflow &middot;
        <span style="color:#d97706;font-weight:600">${counts.clipping}</span> clipping &middot;
        <span style="color:#7c3aed;font-weight:600">${counts["touch-target"]}</span> touch target &middot;
        <span style="color:#2563eb;font-weight:600">${counts.truncation}</span> truncation
      </div>
    </div>
    ${jumpLinks ? `<div style="line-height:1.8">Jump to: ${jumpLinks}</div>` : ""}
  </div>

  <h2>All Components</h2>
  ${componentCards}
</body>
</html>`
}

/**
 * Escape HTML special characters.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  // Pre-flight: check Lookbook is running
  try {
    const response = await fetch(`${BASE_URL}/up`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  } catch {
    console.error(`\nLookbook is not running at ${BASE_URL}`)
    console.error("Start it with: bin/dev\n")
    process.exit(1)
  }

  console.log(`\nKiso Mobile Audit`)
  console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`)
  console.log(`Components: ${COMPONENTS.length}`)
  console.log(`Server: ${BASE_URL}\n`)

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: VIEWPORT })
  const page = await context.newPage()

  const results = []

  for (const component of COMPONENTS) {
    process.stdout.write(`  ${component.name}...`)

    try {
      await page.goto(`${BASE_URL}${component.url}`, { timeout: NAV_TIMEOUT })
      await page.waitForSelector("[data-slot]", { timeout: 5000 }).catch(() => {
        // Some previews may not have data-slot (layout components), continue anyway
      })

      // Small delay for any CSS transitions/animations to settle
      await page.waitForTimeout(200)

      const findings = await runChecks(page)

      // Screenshot with height clipping
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
      const clipHeight = Math.min(bodyHeight, MAX_SCREENSHOT_HEIGHT)
      const screenshot = await page.screenshot({
        type: "jpeg",
        quality: 80,
        clip: { x: 0, y: 0, width: VIEWPORT.width, height: clipHeight },
      })

      results.push({
        name: component.name,
        url: component.url,
        findings,
        screenshot: screenshot.toString("base64"),
        error: null,
      })

      const issueCount = findings.length
      if (issueCount > 0) {
        console.log(` ${issueCount} issue${issueCount === 1 ? "" : "s"}`)
      } else {
        console.log(" ok")
      }
    } catch (err) {
      results.push({
        name: component.name,
        url: component.url,
        findings: [],
        screenshot: null,
        error: err.message,
      })
      console.log(` FAILED: ${err.message}`)
    }
  }

  await browser.close()

  // Generate report
  const html = generateReport(results)
  const outDir = resolve("tmp")
  mkdirSync(outDir, { recursive: true })
  const outPath = resolve(outDir, "mobile-audit.html")
  writeFileSync(outPath, html)

  // Summary
  const totalIssues = results.reduce((sum, r) => sum + r.findings.length, 0)
  const failedCount = results.filter((r) => r.error).length
  const issueComponents = results.filter((r) => r.findings.length > 0).length

  console.log(`\n──────────────────────────────────`)
  console.log(`Components scanned: ${results.length}`)
  console.log(`Components with issues: ${issueComponents}`)
  console.log(`Total issues: ${totalIssues}`)
  if (failedCount > 0) console.log(`Load failures: ${failedCount}`)
  console.log(`\nReport: ${outPath}`)
  console.log(`──────────────────────────────────\n`)
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
