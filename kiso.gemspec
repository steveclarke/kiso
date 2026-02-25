require_relative "lib/kiso/version"

Gem::Specification.new do |spec|
  spec.name = "kiso"
  spec.version = Kiso::VERSION
  spec.authors = ["Steve Clarke"]
  spec.email = ["steve@sevenview.ca"]
  spec.homepage = "https://github.com/steveclarke/kiso"
  spec.summary = "A Rails component library inspired by shadcn/ui"
  spec.description = "Accessible, themeable UI components for Rails + Hotwire. ERB partials, data-attribute CSS, progressive Stimulus."
  spec.license = "MIT"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,data,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.add_dependency "rails", ">= 8.0"
  spec.add_dependency "tailwindcss-rails"
  spec.add_dependency "class_variants", "~> 1.1"
  spec.add_dependency "tailwind_merge", "~> 1.0"
end
