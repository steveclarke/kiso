module Kiso
  # @label Pagination
  class PaginationPreview < Lookbook::Preview
    # @label Playground
    # @param current_page number 5
    # @param total_pages number 10
    def playground(current_page: 5, total_pages: 10)
      render_with_template(locals: {
        current_page: current_page.to_i,
        total_pages: total_pages.to_i
      })
    end

    # @label Default
    def default
      render_with_template
    end

    # @label First Page
    def first_page
      render_with_template
    end

    # @label Last Page
    def last_page
      render_with_template
    end

    # @label Few Pages
    def few_pages
      render_with_template
    end

    # @label Prev / Next Only
    def prev_next_only
      render_with_template
    end
  end
end
