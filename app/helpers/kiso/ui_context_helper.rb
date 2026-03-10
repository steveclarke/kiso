# frozen_string_literal: true

module Kiso
  # Manages request-scoped context stacks for parent-to-sub-part
  # communication in composed Kiso components.
  #
  # This is ERB's equivalent of Vue's provide/inject or React's context
  # pattern. It enables parent components to share data with their sub-parts
  # without the caller having to thread locals through every nested call.
  #
  # == Two independent stacks
  #
  # - **ui** -- per-slot CSS class overrides. When a parent component is
  #   rendered with +ui:+, the hash is pushed onto a stack keyed by
  #   component name. Sub-parts read their slot override from the top of
  #   the stack automatically (handled by {ComponentHelper#kiso_render_component}).
  #
  # - **scope** -- domain locals shared from parent to sub-parts. When a
  #   parent is rendered with +scope:+, the hash is pushed onto its own
  #   stack. Sub-parts receive scope values as kwargs, with explicit kwargs
  #   taking priority. One level deep only -- no ancestor resolution.
  #
  # == Thread safety
  #
  # Thread-safe because Rails creates a fresh +ActionView::Base+ instance
  # (and therefore fresh +@kiso_ui_stack+ / +@kiso_scope_stack+ instance
  # variables) for every request. No shared mutable state exists across
  # requests.
  #
  # == Stack vs simple hash
  #
  # A stack (not a simple hash) is necessary because the same component
  # type can be nested. For example, a Card inside a Card must each
  # maintain their own +ui:+ context independently. Push/pop ensures the
  # inner Card's overrides don't leak to the outer Card's sub-parts.
  #
  # @note You should not call these methods directly in application code.
  #   They are used internally by {ComponentHelper#kui} and
  #   {AppComponentHelper#appui}. The public API for passing context is
  #   the +ui:+ and +scope:+ keyword arguments on those helpers.
  #
  # @example ui: context flow (internal)
  #   # Parent pushes when rendering:
  #   kiso_push_ui_context(:card, { header: "p-8", title: "text-xl" })
  #
  #   # Sub-part reads its slot override:
  #   kiso_current_ui(:card)[:header]  #=> "p-8"
  #
  #   # After parent finishes rendering (in ensure block):
  #   kiso_pop_ui_context(:card)
  #
  # @example scope: context flow (internal)
  #   # Parent pushes when rendering:
  #   kiso_push_scope(:room_card, { room: room })
  #
  #   # Sub-part reads (merged into kwargs before render):
  #   kiso_current_scope(:room_card)  #=> { room: room }
  #
  #   # After parent finishes rendering (in ensure block):
  #   kiso_pop_scope(:room_card)
  #
  # @see ComponentHelper#kui  the public API that drives these stacks
  # @see AppComponentHelper#appui  the host app equivalent
  module UiContextHelper
    # Pushes a +ui:+ hash onto the context stack for a component.
    #
    # Called by {ComponentHelper#kiso_render_component} when a parent
    # component is rendered with +ui:+ overrides.
    #
    # @param component [Symbol] the component name (e.g. +:card+, +:alert+)
    # @param ui [Hash{Symbol => String}] slot-name to class-string mapping
    #   (e.g. +{ header: "p-8", title: "text-xl" }+)
    # @return [void]
    def kiso_push_ui_context(component, ui)
      kiso_ui_stack[component] ||= []
      kiso_ui_stack[component].push(ui || {})
    end

    # Pops the most recent +ui:+ hash for a component.
    #
    # Called in the +ensure+ block of {ComponentHelper#kiso_render_component}
    # after the parent component finishes rendering, guaranteeing cleanup
    # even if the partial raises an exception.
    #
    # @param component [Symbol] the component name
    # @return [Hash, nil] the popped ui hash, or +nil+ if the stack was empty
    def kiso_pop_ui_context(component)
      kiso_ui_stack[component]&.pop
    end

    # Reads the current +ui:+ hash for a component (top of stack).
    #
    # Called by {ComponentHelper#kiso_render_component} when rendering a
    # sub-part, to look up the slot override the parent provided.
    #
    # @param component [Symbol] the component name
    # @return [Hash{Symbol => String}] the current ui overrides, or an
    #   empty hash if no context is active
    def kiso_current_ui(component)
      kiso_ui_stack.dig(component, -1) || {}
    end

    # Pushes a +scope:+ hash onto the context stack for a component.
    #
    # Scope shares domain locals from a parent component to its sub-parts
    # so callers don't have to repeat the same locals on every nested
    # +kui(:component, :part)+ call.
    #
    # @param component [Symbol] the component name (e.g. +:room_card+)
    # @param scope [Hash] domain locals to share with sub-parts
    #   (e.g. +{ room: @room, booking: @booking }+)
    # @return [void]
    def kiso_push_scope(component, scope)
      kiso_scope_stack[component] ||= []
      kiso_scope_stack[component].push(scope || {})
    end

    # Pops the most recent +scope:+ hash for a component.
    #
    # Called in the +ensure+ block of {ComponentHelper#kiso_render_component}
    # after the parent component finishes rendering.
    #
    # @param component [Symbol] the component name
    # @return [Hash, nil] the popped scope hash, or +nil+ if the stack was empty
    def kiso_pop_scope(component)
      kiso_scope_stack[component]&.pop
    end

    # Reads the current +scope:+ hash for a component (top of stack).
    #
    # Called by {ComponentHelper#kiso_render_component} when rendering a
    # sub-part. The returned hash is merged into the sub-part's kwargs,
    # with explicit kwargs taking priority over scope values.
    #
    # @param component [Symbol] the component name
    # @return [Hash] the current scope, or an empty hash if no context
    #   is active
    def kiso_current_scope(component)
      kiso_scope_stack.dig(component, -1) || {}
    end

    private

    # Per-component ui context stacks. Each component name maps to an
    # array of ui hashes, used as a LIFO stack.
    #
    # @return [Hash{Symbol => Array<Hash>}]
    def kiso_ui_stack
      @kiso_ui_stack ||= {}
    end

    # Per-component scope context stacks. Each component name maps to an
    # array of scope hashes, used as a LIFO stack.
    #
    # @return [Hash{Symbol => Array<Hash>}]
    def kiso_scope_stack
      @kiso_scope_stack ||= {}
    end
  end
end
