# frozen_string_literal: true

module Kiso
  # Filters tailwindcss-rails engine CSS stubs from Propshaft's :app stylesheet
  # resolution. Prepended onto +Propshaft::Helper+ by the engine initializer.
  #
  # Engine stubs have logical paths like "tailwind/kiso.css" -- always under the
  # "tailwind/" prefix. The compiled output is "tailwind.css" (no slash) and
  # passes through unaffected.
  #
  # @see Engine the initializer that prepends this module
  module PropshaftTailwindStubFilter
    # Filters out Tailwind engine stubs from the list of app stylesheet paths.
    #
    # @return [Array<String>] stylesheet logical paths with engine stubs removed
    def app_stylesheets_paths
      super.reject { |path| path.start_with?("tailwind/") }
    end
  end
end
