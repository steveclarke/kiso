# frozen_string_literal: true

module Kiso
  module Presets
    # Pill-shaped buttons, fully rounded badges, more rounded cards/inputs.
    # Applies rounded-full where possible, rounded-2xl on containers.
    #
    # Components left unchanged:
    # - Avatar, Switch, Slider, RadioGroup — already rounded-full
    # - Checkbox — uses rounded-[4px] for checkmark alignment
    # - Shared::CHECKABLE_ITEM — uses rounded-sm for menu items (structural)
    ROUNDED = {
      # Buttons: rounded-md → rounded-full (pill shape)
      button: {
        variants: {
          size: {
            xs: "rounded-full",
            sm: "rounded-full",
            md: "rounded-full",
            lg: "rounded-full",
            xl: "rounded-full"
          }
        }
      },

      # Badges: already rounded-full — no change needed

      # Card: rounded-xl → rounded-2xl
      card: {base: "rounded-2xl"},

      # StatsCard: rounded-xl → rounded-2xl
      stats_card: {base: "rounded-2xl"},

      # Input: rounded-md → rounded-full
      input: {base: "rounded-full"},

      # Textarea: rounded-md → rounded-xl (full doesn't work for multiline)
      textarea: {base: "rounded-xl"},

      # Select trigger: rounded-md → rounded-full
      select_trigger: {base: "rounded-full"},

      # Select content: rounded-md → rounded-xl
      select_content: {base: "rounded-xl"},

      # SelectNative: rounded-md → rounded-full
      select_native: {base: "rounded-full"},

      # InputGroup: rounded-md → rounded-full
      input_group: {base: "rounded-full"},

      # InputOTP slot: first:rounded-l-md last:rounded-r-md → first:rounded-l-xl last:rounded-r-xl
      input_otp_slot: {base: "first:rounded-l-xl last:rounded-r-xl"},

      # Toggle: rounded-md → rounded-full
      toggle: {base: "rounded-full"},

      # ToggleGroup: rounded-md → rounded-full
      toggle_group: {base: "rounded-full"},

      # ToggleGroupItem: first:rounded-l-md last:rounded-r-md → first:rounded-l-full last:rounded-r-full
      toggle_group_item: {base: "first:rounded-l-full last:rounded-r-full"},

      # Combobox input wrapper: rounded-md → rounded-full
      combobox_input: {base: "rounded-full"},

      # Combobox content: rounded-md → rounded-xl
      combobox_content: {base: "rounded-xl"},

      # Combobox chips (multi-select): rounded-md → rounded-xl
      combobox_chips: {base: "rounded-xl"},

      # Dialog content: rounded-lg → rounded-2xl
      dialog_content: {base: "rounded-2xl"},

      # AlertDialog content: rounded-lg → rounded-2xl
      alert_dialog_content: {base: "rounded-2xl"},

      # AlertDialog media: rounded-md → rounded-xl
      alert_dialog_media: {base: "rounded-xl"},

      # Alert: rounded-lg → rounded-2xl
      alert: {base: "rounded-2xl"},

      # Command: rounded-md → rounded-xl
      command: {base: "rounded-xl"},

      # CommandDialog content: rounded-lg → rounded-2xl
      command_dialog_content: {base: "rounded-2xl"},

      # Popover: rounded-md → rounded-xl
      popover_content: {base: "rounded-xl"},

      # DropdownMenu content: rounded-md → rounded-xl
      dropdown_menu_content: {base: "rounded-xl"},

      # DropdownMenu sub-content: rounded-md → rounded-xl
      dropdown_menu_sub_content: {base: "rounded-xl"},

      # Kbd: rounded-sm → rounded-md
      kbd: {base: "rounded-md"},

      # Skeleton: rounded-md → rounded-xl
      skeleton: {base: "rounded-xl"},

      # Pagination: rounded-md → rounded-full
      pagination_link: {base: "rounded-full"},
      pagination_previous: {base: "rounded-full"},
      pagination_next: {base: "rounded-full"},

      # Empty: rounded-lg → rounded-2xl
      empty: {base: "rounded-2xl"},

      # Empty media icon variant: rounded-lg → rounded-xl
      empty_media: {
        variants: {
          variant: {
            icon: "rounded-xl"
          }
        }
      },

      # ColorModeButton: rounded-md → rounded-full
      color_mode_button: {base: "rounded-full"},

      # Nav section title: rounded-md → rounded-full
      nav_section_title: {base: "rounded-full"},

      # Nav item: rounded-md → rounded-full
      nav_item: {base: "rounded-full"},

      # Nav item badge: rounded-md → rounded-full
      nav_item_badge: {base: "rounded-full"}
    }.freeze
  end
end
