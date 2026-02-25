module Kiso
  # @label Stats Card
  class StatsCardPreview < Lookbook::Preview
    # @label Playground
    # @param variant select { choices: [outline, soft, subtle] }
    # @param label text "Total Revenue"
    # @param value text "$45,231.89"
    # @param description text "+20.1% from last month"
    def playground(variant: :outline, label: "Total Revenue", value: "$45,231.89", description: "+20.1% from last month")
      render_with_template(locals: {
        variant: variant.to_sym,
        label: label,
        value: value,
        description: description
      })
    end

    # @label Variants
    def variants
      render_with_template
    end

    # @label With Icon
    def with_icon
      render_with_template
    end

    # @label Stats Grid
    def stats_grid
      render_with_template
    end
  end
end
