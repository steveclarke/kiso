pin_all_from Kiso::Engine.root.join("app/javascript/controllers"),
  under: "controllers"

pin_all_from Kiso::Engine.root.join("app/javascript/kiso/utils"),
  under: "kiso-ui/utils",
  to: "kiso/utils"

# Floating UI — vendored browser ESM builds for smart positioning
pin "@floating-ui/core", to: "kiso/vendor/floating-ui-core.js"
pin "@floating-ui/dom", to: "kiso/vendor/floating-ui-dom.js"

# Cally — vendored web component calendar (single bundle includes Atomico)
pin "cally", to: "kiso/vendor/cally.js"
