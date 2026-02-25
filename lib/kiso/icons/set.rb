# frozen_string_literal: true

require "json"
require "pathname"
require "zlib"
require "stringio"

module Kiso
  module Icons
    class Set
      attr_reader :prefix, :default_width, :default_height

      def initialize(prefix:, data:)
        @prefix = prefix
        @icons = data["icons"] || {}
        @aliases = data["aliases"] || {}
        @default_width = data["width"] || 24
        @default_height = data["height"] || 24
        @info = data["info"] || {}
      end

      # Returns { body:, width:, height: } or nil
      def icon(name)
        if (icon_data = @icons[name])
          return build_icon_data(icon_data)
        end

        resolved_name = resolve_alias(name)
        if resolved_name && (icon_data = @icons[resolved_name])
          alias_data = @aliases[name]
          return build_icon_data(icon_data, alias_transforms: alias_data)
        end

        nil
      end

      def icon_names
        @icons.keys + @aliases.keys
      end

      def icon_count
        @icons.size
      end

      def display_name
        @info["name"] || @prefix
      end

      class << self
        def from_vendor(prefix)
          path = vendor_path_for(prefix)
          return nil unless File.exist?(path)

          data = JSON.parse(File.read(path))
          new(prefix: prefix, data: data)
        end

        def from_bundled(prefix)
          path = bundled_path_for(prefix)
          return nil unless File.exist?(path)

          gz_data = File.binread(path)
          json_str = Zlib::GzipReader.new(StringIO.new(gz_data)).read
          data = JSON.parse(json_str)
          new(prefix: prefix, data: data)
        end

        def vendor_path_for(prefix)
          base = if defined?(Rails) && Rails.root
            Rails.root
          else
            Pathname.new(Dir.pwd)
          end
          base.join(Kiso::Icons.configuration.vendor_path, "#{prefix}.json").to_s
        end

        def bundled_path_for(prefix)
          File.join(gem_data_path, "#{prefix}.json.gz")
        end

        def gem_data_path
          File.expand_path("../../../../data", __FILE__)
        end

        def vendored_sets
          pattern = if defined?(Rails) && Rails.root
            Rails.root.join(Kiso::Icons.configuration.vendor_path, "*.json").to_s
          else
            File.join(Dir.pwd, Kiso::Icons.configuration.vendor_path, "*.json")
          end

          Dir.glob(pattern).map { |f| File.basename(f, ".json") }.sort
        end
      end

      private

      def resolve_alias(name, depth: 0)
        return nil if depth > 5
        alias_entry = @aliases[name]
        return nil unless alias_entry

        parent = alias_entry["parent"]
        return parent if @icons.key?(parent)

        resolve_alias(parent, depth: depth + 1)
      end

      def build_icon_data(icon_data, alias_transforms: nil)
        body = icon_data["body"]
        width = icon_data["width"] || @default_width
        height = icon_data["height"] || @default_height

        if alias_transforms
          body = apply_transforms(body, alias_transforms, width, height)
          width = alias_transforms["width"] || width
          height = alias_transforms["height"] || height
        end

        {body: body, width: width, height: height}
      end

      def apply_transforms(body, transforms, width, height)
        parts = []

        if transforms["rotate"]
          degrees = transforms["rotate"] * 90
          parts << "rotate(#{degrees} #{width / 2.0} #{height / 2.0})"
        end

        scale_x = transforms["hFlip"] ? -1 : 1
        scale_y = transforms["vFlip"] ? -1 : 1

        if scale_x != 1 || scale_y != 1
          tx = transforms["hFlip"] ? width : 0
          ty = transforms["vFlip"] ? height : 0
          parts << "translate(#{tx} #{ty})" if tx != 0 || ty != 0
          parts << "scale(#{scale_x} #{scale_y})"
        end

        if parts.any?
          %(<g transform="#{parts.join(" ")}">#{body}</g>)
        else
          body
        end
      end
    end
  end
end
