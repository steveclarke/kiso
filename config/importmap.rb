# Disable modulepreload for controllers. The controllers/kiso/index.js
# bundler entry point uses relative imports (./alert_controller.js) that
# resolve to undigested Propshaft URLs during modulepreload dependency
# resolution. Firefox strictly enforces MIME types and blocks the 404
# text/plain responses. Controllers load fine via eagerLoadControllersFrom
# which resolves bare specifiers through the importmap.
pin_all_from Kiso::Engine.root.join("app/javascript/controllers"),
  under: "controllers",
  preload: false

pin_all_from Kiso::Engine.root.join("app/javascript/kiso/utils"),
  under: "kiso-ui/utils",
  to: "kiso/utils"

# Floating UI — vendored browser ESM builds for smart positioning
pin "@floating-ui/core", to: "kiso/vendor/floating-ui-core.js"
pin "@floating-ui/dom", to: "kiso/vendor/floating-ui-dom.js"
