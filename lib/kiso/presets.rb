# frozen_string_literal: true

module Kiso
  # Loads pre-built style presets that override ClassVariants for all
  # components at boot time. Presets are monolithic, not composable —
  # each preset is a complete, coherent set of overrides.
  #
  # @example Loading a preset
  #   Kiso.configure do |config|
  #     config.apply_preset(:rounded)
  #   end
  #
  # @see Configuration#apply_preset
  module Presets
    PRESET_DIR = File.expand_path("presets", __dir__).freeze

    class << self
      # Loads a preset by name and returns its override hash.
      #
      # @param name [Symbol, String] the preset name (e.g. +:rounded+, +:sharp+)
      # @return [Hash{Symbol => Hash}] component overrides keyed by component name
      # @raise [ArgumentError] if the preset does not exist
      def load(name)
        name = name.to_sym
        file = File.join(PRESET_DIR, "#{name}.rb")

        unless File.exist?(file)
          available = available_presets
          msg = "Unknown preset :#{name}."
          msg += " Available presets: #{available.map { |p| ":#{p}" }.join(", ")}" if available.any?
          raise ArgumentError, msg
        end

        require file
        const_name = name.to_s.upcase
        const_get(const_name)
      end

      # Lists all available preset names.
      #
      # @return [Array<Symbol>] sorted list of preset names
      def available_presets
        Dir[File.join(PRESET_DIR, "*.rb")]
          .map { |f| File.basename(f, ".rb").to_sym }
          .sort
      end
    end
  end
end
