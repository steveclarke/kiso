# frozen_string_literal: true

require "kiso/icons/commands"

# Delegates +bin/kiso icons+ subcommands to the kiso-icons gem's Commands class.
# @see https://github.com/steveclarke/kiso-icons
Kiso::Cli::Icons = Kiso::Icons::Commands
