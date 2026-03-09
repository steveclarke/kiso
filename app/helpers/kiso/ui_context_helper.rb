# frozen_string_literal: true

module Kiso
  # Manages request-scoped context stacks for component communication.
  #
  # This is ERB's equivalent of Vue's provide/inject pattern. Two stacks:
  #
  # - **ui:** — per-slot CSS class overrides. When a parent component is
  #   rendered with +ui:+, the hash is pushed onto a stack. Sub-parts read
  #   their slot override automatically.
  # - **scope:** — domain locals shared from parent to sub-parts. When a
  #   parent is rendered with +scope:+, the hash is pushed onto a stack.
  #   Sub-parts receive scope values as kwargs, with explicit kwargs
  #   taking priority. One level deep only — no ancestor resolution.
  #
  # Thread-safe because Rails creates a fresh view context (and therefore
  # fresh instance variables) per request.
  #
  # @example ui: stack flow
  #   # Parent pushes:
  #   kiso_push_ui_context(:card, { header: "p-8", title: "text-xl" })
  #
  #   # Sub-part reads:
  #   kiso_current_ui(:card)  #=> { header: "p-8", title: "text-xl" }
  #
  #   # After parent renders:
  #   kiso_pop_ui_context(:card)
  #
  # @example scope: stack flow
  #   # Parent pushes:
  #   kiso_push_scope(:room_card, { room: room })
  #
  #   # Sub-part reads (merged into kwargs before render):
  #   kiso_current_scope(:room_card)  #=> { room: room }
  #
  #   # After parent renders:
  #   kiso_pop_scope(:room_card)
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

    # Push a scope hash onto the context stack for a component.
    #
    # Scope shares domain locals from a parent component with its sub-parts
    # so callers don't have to repeat the same locals on every sub-part call.
    #
    # @param component [Symbol] the component name (e.g. +:room_card+)
    # @param scope [Hash] domain locals to share with sub-parts
    # @return [void]
    def kiso_push_scope(component, scope)
      kiso_scope_stack[component] ||= []
      kiso_scope_stack[component].push(scope || {})
    end

    # Pop the most recent scope hash for a component.
    #
    # @param component [Symbol] the component name
    # @return [Hash, nil] the popped scope hash
    def kiso_pop_scope(component)
      kiso_scope_stack[component]&.pop
    end

    # Read the current scope hash for a component (top of stack).
    #
    # @param component [Symbol] the component name
    # @return [Hash] the current scope, or empty hash
    def kiso_current_scope(component)
      kiso_scope_stack.dig(component, -1) || {}
    end

    private

    # @return [Hash{Symbol => Array<Hash>}] per-component ui stacks
    def kiso_ui_stack
      @kiso_ui_stack ||= {}
    end

    # @return [Hash{Symbol => Array<Hash>}] per-component scope stacks
    def kiso_scope_stack
      @kiso_scope_stack ||= {}
    end
  end
end
