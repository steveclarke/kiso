module Kiso
  # @label Icon
  class IconPreview < Lookbook::Preview
    # @label Playground
    # @param name text "lucide:check"
    # @param size select :md { choices: [xs, sm, md, lg, xl] }
    # @param css_class text ""
    def playground(name: "lucide:check", size: :md, css_class: "")
      size_sym = size.to_s.strip.empty? ? :md : size.to_sym
      render_with_template(locals: {
        name: name,
        size: size_sym,
        css_class: css_class
      })
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Common Icons
    def common
      render_with_template
    end
  end
end
