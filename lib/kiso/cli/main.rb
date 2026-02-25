# frozen_string_literal: true

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
