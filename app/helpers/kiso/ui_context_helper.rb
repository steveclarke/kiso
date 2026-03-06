module Kiso
  # Manages a request-scoped context stack for per-slot +ui:+ overrides.
  #
  # This is ERB's equivalent of Vue's provide/inject pattern. When a parent
  # component is rendered with +ui:+, the hash is pushed onto a stack.
  # Sub-parts rendered inside the parent's block read their slot override
  # from the stack automatically.
  #
  # Thread-safe because Rails creates a fresh view context (and therefore
  # fresh instance variables) per request.
  #
  # @example How the stack flows
  #   # Parent pushes:
  #   kiso_push_ui_context(:card, { header: "p-8", title: "text-xl" })
  #
  #   # Sub-part reads:
  #   kiso_current_ui(:card)  #=> { header: "p-8", title: "text-xl" }
  #
  #   # After parent renders:
  #   kiso_pop_ui_context(:card)
  #
  # @see ComponentHelper#kui
  module UiContextHelper
    # Push a ui hash onto the context stack for a component.
    #
    # @param component [Symbol] the component name (e.g. +:card+)
    # @param ui [Hash{Symbol => String}] slot-name to class-string mapping
    # @return [void]
    def kiso_push_ui_context(component, ui)
      kiso_ui_stack[component] ||= []
      kiso_ui_stack[component].push(ui || {})
    end

    # Pop the most recent ui hash for a component.
    #
    # @param component [Symbol] the component name
    # @return [Hash, nil] the popped ui hash
    def kiso_pop_ui_context(component)
      kiso_ui_stack[component]&.pop
    end

    # Read the current ui hash for a component (top of stack).
    #
    # @param component [Symbol] the component name
    # @return [Hash{Symbol => String}] the current ui overrides, or empty hash
    def kiso_current_ui(component)
      kiso_ui_stack.dig(component, -1) || {}
    end

    private

    # @return [Hash{Symbol => Array<Hash>}] per-component stacks
    def kiso_ui_stack
      @kiso_ui_stack ||= {}
    end
  end
end
