# frozen_string_literal: true

module Kiso
  module Presets
    # No border-radius anywhere — geometric, brutalist aesthetic.
    # Applies rounded-none to every component that has border-radius.
    SHARP = {
      # Buttons: rounded-md → rounded-none
      button: {
        variants: {
          size: {
            xs: "rounded-none",
            sm: "rounded-none",
            md: "rounded-none",
            lg: "rounded-none",
            xl: "rounded-none"
          }
        }
      },

      # Badges: rounded-full → rounded-none
      badge: {
        variants: {
          size: {
            xs: "rounded-none",
            sm: "rounded-none",
            md: "rounded-none",
            lg: "rounded-none",
            xl: "rounded-none"
          }
        }
      },

      # Card: rounded-xl → rounded-none
      card: {base: "rounded-none"},

      # StatsCard: rounded-xl → rounded-none
      stats_card: {base: "rounded-none"},

      # Input: rounded-md → rounded-none
      input: {base: "rounded-none"},

      # Textarea: rounded-md → rounded-none
      textarea: {base: "rounded-none"},

      # Select trigger: rounded-md → rounded-none
      select_trigger: {base: "rounded-none"},

      # Select content: rounded-md → rounded-none
      select_content: {base: "rounded-none"},

      # SelectNative: rounded-md → rounded-none
      select_native: {base: "rounded-none"},

      # InputGroup: rounded-md → rounded-none
      input_group: {base: "rounded-none"},

      # InputOTP slot: rounded-l-md/rounded-r-md → rounded-none
      input_otp_slot: {base: "first:rounded-l-none last:rounded-r-none"},

      # Toggle: rounded-md → rounded-none
      toggle: {base: "rounded-none"},

      # ToggleGroup: rounded-md → rounded-none
      toggle_group: {base: "rounded-none"},

      # ToggleGroupItem: rounded-l-md/rounded-r-md → rounded-none
      toggle_group_item: {base: "first:rounded-l-none last:rounded-r-none"},

      # Combobox input wrapper: rounded-md → rounded-none
      combobox_input: {base: "rounded-none"},

      # Combobox content: rounded-md → rounded-none
      combobox_content: {base: "rounded-none"},

      # Combobox chips (multi-select): rounded-md → rounded-none
      combobox_chips: {base: "rounded-none"},

      # Dialog content: rounded-lg → rounded-none
      dialog_content: {base: "rounded-none"},

      # AlertDialog content: rounded-lg → rounded-none
      alert_dialog_content: {base: "rounded-none"},

      # AlertDialog media: rounded-md → rounded-none
      alert_dialog_media: {base: "rounded-none"},

      # Alert: rounded-lg → rounded-none
      alert: {base: "rounded-none"},

      # Command: rounded-md → rounded-none
      command: {base: "rounded-none"},

      # CommandDialog content: rounded-lg → rounded-none
      command_dialog_content: {base: "rounded-none"},

      # Popover: rounded-md → rounded-none
      popover_content: {base: "rounded-none"},

      # DropdownMenu content: rounded-md → rounded-none
      dropdown_menu_content: {base: "rounded-none"},

      # DropdownMenu sub-content: rounded-md → rounded-none
      dropdown_menu_sub_content: {base: "rounded-none"},

      # Kbd: rounded-sm → rounded-none
      kbd: {base: "rounded-none"},

      # Skeleton: rounded-md → rounded-none
      skeleton: {base: "rounded-none"},

      # Checkbox: rounded-[4px] → rounded-none
      checkbox: {base: "rounded-none"},

      # Avatar: rounded-full → rounded-none
      avatar: {base: "rounded-none"},
      avatar_image: {base: "rounded-none"},
      avatar_fallback: {base: "rounded-none"},

      # Switch track: rounded-full → rounded-none
      switch_track: {base: "rounded-none"},
      switch_thumb: {base: "rounded-none"},

      # Slider: rounded-full → rounded-none
      slider_track: {base: "rounded-none"},
      slider_thumb: {base: "rounded-none"},

      # RadioGroup indicator: rounded-full → rounded-none
      radio_group_item: {base: "rounded-none"},

      # Pagination: rounded-md → rounded-none
      pagination_link: {base: "rounded-none"},
      pagination_previous: {base: "rounded-none"},
      pagination_next: {base: "rounded-none"},

      # Empty: rounded-lg → rounded-none
      empty: {base: "rounded-none"},

      # Empty media icon variant: rounded-lg → rounded-none
      empty_media: {
        variants: {
          variant: {
            icon: "rounded-none"
          }
        }
      },

      # Alert close: rounded-md → rounded-none
      alert_close: {base: "rounded-none"},

      # Dialog close: rounded-xs → rounded-none
      dialog_close: {base: "rounded-none"},

      # ColorModeButton: rounded-md → rounded-none
      color_mode_button: {base: "rounded-none"},

      # Nav section title: rounded-md → rounded-none
      nav_section_title: {base: "rounded-none"},

      # Nav item: rounded-md → rounded-none
      nav_item: {base: "rounded-none"},

      # Nav item badge: rounded-md → rounded-none
      nav_item_badge: {base: "rounded-none"}
    }.freeze
  end
end
