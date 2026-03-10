# frozen_string_literal: true

require "thor"
require "active_support/core_ext/string/inflections"

module Kiso
  # Command-line interface for the Kiso gem, invoked via +bin/kiso+.
  #
  # Routes to subcommands:
  # - +kiso icons+ -- icon set management (delegated to kiso-icons gem)
  # - +kiso make+  -- component scaffolding
  # - +kiso version+ -- print gem version
  #
  # @see Cli::Main the top-level entry point
  # @see Cli::Make component generator subcommand
  # @see Cli::Icons icon management subcommand
  module Cli
  end
end

require_relative "cli/base"
require_relative "cli/icons"
require_relative "cli/make"
require_relative "cli/main"
