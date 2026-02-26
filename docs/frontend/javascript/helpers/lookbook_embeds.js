/**
 * Swap the theme param in all Lookbook embed iframe srcs.
 * The _display param is URL-encoded JSON: %7B%22theme%22%3A%22light%22%7D
 */
export function syncLookbookEmbeds(isDark) {
  const theme = isDark ? "dark" : "light"
  const opposite = isDark ? "light" : "dark"
  const from = encodeURIComponent(JSON.stringify({ theme: opposite }))
  const to = encodeURIComponent(JSON.stringify({ theme }))

  document.querySelectorAll("iframe[data-lookbook-embed]").forEach((iframe) => {
    if (iframe.src.includes(from)) {
      iframe.src = iframe.src.replace(from, to)
    }
  })
}
