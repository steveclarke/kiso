# frozen_string_literal: true

module Kiso
  # View helper for dark mode FOUC prevention.
  #
  # Included in all views automatically by {Engine}.
  module ThemeHelper
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

    # Outputs an inline script that prevents dark mode FOUC.
    #
    # Reads the theme preference from localStorage (primary) or cookie
    # (fallback), respects +prefers-color-scheme+ as default, and sets
    # +.dark+ on +<html>+ synchronously before first paint.
    #
    # Call in +<head>+, ideally before stylesheet links.
    #
    # @example In a layout
    #   <head>
    #     <%= kiso_theme_script %>
    #     <%= stylesheet_link_tag "tailwind" %>
    #   </head>
    #
    # @return [ActiveSupport::SafeBuffer]
    def kiso_theme_script
      javascript_tag(THEME_SCRIPT, nonce: true)
    end
  end
end
