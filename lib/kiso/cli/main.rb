# frozen_string_literal: true

# Top-level CLI entry point. Routes to subcommands ({Icons}, {Make}).
#
# @example
#   $ bin/kiso version
#   $ bin/kiso make component alert
#   $ bin/kiso icons list
class Kiso::Cli::Main < Kiso::Cli::Base
  desc "version", "Show Kiso version"
  def version
    puts Kiso::VERSION
  end

  desc "icons SUBCOMMAND", "Manage icon sets (pin, unpin, pristine, list)"
  subcommand "icons", Kiso::Cli::Icons

  desc "make SUBCOMMAND", "Generate component files"
  subcommand "make", Kiso::Cli::Make
end
