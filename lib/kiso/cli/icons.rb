# frozen_string_literal: true

require "kiso/icons/commands"

# Delegate bin/kiso icons → kiso-icons gem's Commands class
Kiso::Cli::Icons = Kiso::Icons::Commands
