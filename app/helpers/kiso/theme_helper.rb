# frozen_string_literal: true

module Kiso
  # View helper for dark mode FOUC (Flash of Unstyled Content) prevention.
  #
  # Provides {#kiso_theme_script}, which outputs a tiny inline +<script>+
  # that synchronously applies the +.dark+ class to +<html>+ before the
  # browser paints. This eliminates the bright flash that occurs when a
  # dark-mode user loads a page and the stylesheet hasn't applied yet.
  #
  # Kiso's dark mode system uses CSS variable swapping inside a +.dark {}+
  # block (not Tailwind +dark:+ prefixes), so the +.dark+ class on +<html>+
  # is the single toggle that activates the entire dark palette.
  #
  # == Theme resolution order
  #
  # 1. +localStorage.getItem("theme")+ -- fastest, set by the Stimulus
  #    +kiso--theme+ controller on toggle.
  # 2. Cookie named +"theme"+ -- fallback for server-side rendering
  #    scenarios. Also set by the Stimulus controller.
  # 3. +matchMedia("(prefers-color-scheme: dark)")+ -- OS-level preference
  #    when no explicit choice has been stored.
  #
  # Included in all views automatically by {Kiso::Engine}.
  #
  # @see file:app/javascript/controllers/kiso/theme_controller.js
  #   the Stimulus controller that handles toggling and persistence
  module ThemeHelper
    # Minified inline JavaScript that reads the user's theme preference and
    # sets +.dark+ on +<html>+ synchronously. Frozen to prevent mutation.
    #
    # @return [String] minified JavaScript source
    THEME_SCRIPT = <<~JS.squish.freeze
      (function(){
        var k="theme";
        var t=localStorage.getItem(k);
        if(!t){var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)"));t=m&&m[1]}
        if(t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme:dark)").matches)){
          document.documentElement.classList.add("dark")
        }
      })()
    JS

    # Outputs a blocking inline +<script>+ that prevents dark mode FOUC.
    #
    # The script runs synchronously in +<head>+ before stylesheets load,
    # reading the user's stored theme preference and applying +.dark+ to
    # +<html>+ if appropriate. This ensures the first paint uses the correct
    # color scheme.
    #
    # The script tag is rendered with +nonce: true+ for Content Security
    # Policy (CSP) compatibility. Rails automatically sets the nonce from
    # +content_security_policy_nonce+.
    #
    # @note Place this call in +<head>+ *before* stylesheet links. The
    #   script must execute before the browser encounters CSS that uses
    #   the +.dark+ selector, otherwise the first paint will flash.
    #
    # @return [ActiveSupport::SafeBuffer] an HTML +<script>+ tag
    #
    # @example Minimal layout setup
    #   <head>
    #     <%= kiso_theme_script %>
    #     <%= stylesheet_link_tag "tailwind" %>
    #   </head>
    #
    # @example With Turbo and other head elements
    #   <head>
    #     <meta charset="utf-8">
    #     <%= csrf_meta_tags %>
    #     <%= kiso_theme_script %>
    #     <%= stylesheet_link_tag "tailwind" %>
    #     <%= javascript_importmap_tags %>
    #   </head>
    def kiso_theme_script
      javascript_tag(THEME_SCRIPT, nonce: true)
    end
  end
end
