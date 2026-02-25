# frozen_string_literal: true

require "thor"
require "active_support/core_ext/string/inflections"

module Kiso
  module Cli
  end
end

require_relative "cli/base"
require_relative "cli/make"
require_relative "cli/main"
