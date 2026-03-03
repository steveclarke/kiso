module Kiso
  # Filters tailwindcss-rails engine CSS stubs from Propshaft's :app stylesheet
  # resolution. Prepended onto Propshaft::Helper by the engine initializer.
  #
  # Engine stubs have logical paths like "tailwind/kiso.css" — always under the
  # "tailwind/" prefix. The compiled output is "tailwind.css" (no slash) and
  # passes through unaffected.
  module PropshaftTailwindStubFilter
    def app_stylesheets_paths
      super.reject { |path| path.start_with?("tailwind/") }
    end
  end
end
