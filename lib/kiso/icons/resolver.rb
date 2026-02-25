# frozen_string_literal: true

module Kiso
  module Icons
    class Resolver
      def initialize
        @loaded_sets = {}
        @mutex = Mutex.new
      end

      # Returns { body:, width:, height: } or nil
      def resolve(name)
        set_prefix, icon_name = parse_name(name)

        # 1. In-memory cache
        cached = Kiso::Icons.cache.get(set_prefix, icon_name)
        return cached if cached

        # 2. Already-loaded set
        icon_data = resolve_from_loaded_set(set_prefix, icon_name)

        # 3. Vendored JSON
        icon_data ||= resolve_from_vendor(set_prefix, icon_name)

        # 4. Bundled (lucide ships in gem)
        icon_data ||= resolve_from_bundled(set_prefix, icon_name)

        # 5. API fallback (dev only)
        icon_data ||= resolve_from_api(set_prefix, icon_name)

        Kiso::Icons.cache.set(set_prefix, icon_name, icon_data) if icon_data

        icon_data
      end

      def clear!
        @mutex.synchronize { @loaded_sets.clear }
      end

      private

      def parse_name(name)
        name = name.to_s.strip
        if name.include?(":")
          name.split(":", 2)
        else
          [Kiso::Icons.configuration.default_set, name]
        end
      end

      def resolve_from_loaded_set(set_prefix, icon_name)
        set = @mutex.synchronize { @loaded_sets[set_prefix] }
        set&.icon(icon_name)
      end

      def resolve_from_vendor(set_prefix, icon_name)
        set = Set.from_vendor(set_prefix)
        return nil unless set

        @mutex.synchronize { @loaded_sets[set_prefix] = set }
        set.icon(icon_name)
      end

      def resolve_from_bundled(set_prefix, icon_name)
        set = Set.from_bundled(set_prefix)
        return nil unless set

        @mutex.synchronize { @loaded_sets[set_prefix] = set }
        set.icon(icon_name)
      end

      def resolve_from_api(set_prefix, icon_name)
        return nil unless Kiso::Icons.configuration.fallback_to_api

        ApiClient.fetch_icon(set_prefix, icon_name)
      end
    end
  end
end
