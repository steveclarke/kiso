module Kiso
  # @label InputOTP
  # @logical_path kiso/form
  class InputOtpPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [sm, md, lg] }
    # @param length number
    # @param disabled toggle
    def playground(size: :md, length: 6, disabled: false)
      render_with_template(locals: {
        size: size.to_sym,
        length: length.to_i,
        disabled: disabled
      })
    end

    # @label With Separator
    def with_separator
      render_with_template
    end

    # @label Four Digits
    def four_digits
      render_with_template
    end

    # @label With Field
    def with_field
      render_with_template
    end

    # @label Auto Submit
    def auto_submit
      render_with_template
    end

    # @label Disabled
    def disabled
      render_with_template
    end
  end
end
