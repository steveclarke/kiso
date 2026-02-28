# frozen_string_literal: true

module Kiso
  # Applies global theme overrides from {Configuration#theme} to
  # the corresponding {Themes} constants at boot time.
  #
  # Each override hash is passed to +ClassVariants::Instance#merge+,
  # which appends base/variant classes (TailwindMerge resolves conflicts
  # at render time) and replaces defaults via +Hash#merge!+.
  #
  # @example Overriding button defaults
  #   Kiso.configure do |config|
  #     config.theme[:button] = { base: "rounded-full", defaults: { variant: :outline } }
  #   end
  #   # At boot, ThemeOverrides.apply! merges these into Kiso::Themes::Button
  #
  # @see Configuration#theme
  module ThemeOverrides
    class << self
      # Apply all theme overrides to theme constants.
      # Called once during the +kiso.theme_overrides+ engine initializer.
      # Guarded against double application.
      #
      # @raise [ArgumentError] if any key does not map to a valid theme constant
      # @return [void]
      def apply!
        return if @applied

        overrides = Kiso.config.theme
        return if overrides.empty?

        validate_keys!(overrides.keys)

        overrides.each do |key, options|
          resolve_constant(key).merge(**options)
        end

        @applied = true
      end

      # Clears the applied flag so {.apply!} can run again.
      # Used in test teardown.
      #
      # @return [void]
      def reset!
        @applied = false
      end

      private

      # Maps a snake_case symbol to its PascalCase theme constant.
      #
      # @param key [Symbol] e.g. +:card_header+
      # @return [ClassVariants::Instance] e.g. +Kiso::Themes::CardHeader+
      def resolve_constant(key)
        Kiso::Themes.const_get(camelize(key))
      end

      # Validates that all keys map to ClassVariants::Instance constants.
      #
      # @param keys [Array<Symbol>]
      # @raise [ArgumentError] with typo suggestion for invalid keys
      def validate_keys!(keys)
        keys.each do |key|
          name = camelize(key)
          unless Kiso::Themes.const_defined?(name) &&
              Kiso::Themes.const_get(name).is_a?(ClassVariants::Instance)
            suggestion = find_closest(key)
            msg = "Unknown theme key :#{key}."
            msg += " Did you mean :#{suggestion}?" if suggestion
            raise ArgumentError, msg
          end
        end
      end

      # Converts a snake_case symbol to PascalCase string.
      #
      # @param key [Symbol]
      # @return [String]
      def camelize(key)
        key.to_s.split("_").map(&:capitalize).join
      end

      # Finds the closest valid theme key by edit distance.
      #
      # @param key [Symbol]
      # @return [Symbol, nil] closest match within distance 3, or nil
      def find_closest(key)
        valid = valid_theme_keys
        closest = valid.min_by { |vk| levenshtein(key.to_s, vk.to_s) }
        closest if closest && levenshtein(key.to_s, closest.to_s) <= 3
      end

      # Lists all valid snake_case theme keys.
      #
      # @return [Array<Symbol>]
      def valid_theme_keys
        Kiso::Themes.constants
          .select { |name| Kiso::Themes.const_get(name).is_a?(ClassVariants::Instance) }
          .map { |name| name.to_s.gsub(/([a-z])([A-Z])/, '\1_\2').downcase.to_sym }
          .sort
      end

      # Minimal Levenshtein distance for typo detection.
      #
      # @param a [String]
      # @param b [String]
      # @return [Integer]
      def levenshtein(a, b)
        m = a.length
        n = b.length
        d = Array.new(m + 1) { |i| i }
        (1..n).each do |j|
          prev = d[0]
          d[0] = j
          (1..m).each do |i|
            temp = d[i]
            d[i] = if a[i - 1] == b[j - 1]
              prev
            else
              [d[i] + 1, d[i - 1] + 1, prev + 1].min
            end
            prev = temp
          end
        end
        d[m]
      end
    end
  end
end
