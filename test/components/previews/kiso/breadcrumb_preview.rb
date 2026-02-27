module Kiso
  # @label Breadcrumb
  class BreadcrumbPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label With Ellipsis
    def with_ellipsis
      render_with_template
    end

    # @label Custom Separator
    def custom_separator
      render_with_template
    end

    # @label Link Only
    def link_only
      render_with_template
    end
  end
end
