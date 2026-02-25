# frozen_string_literal: true

module Kiso
  module Icons
    class Error < StandardError; end
    class IconNotFound < Error; end
    class SetNotFound < Error; end

    class Configuration
      attr_accessor :default_set, :vendor_path, :fallback_to_api

      def initialize
        @default_set = "lucide"
        @vendor_path = "vendor/icons"
        @fallback_to_api = defined?(Rails) ? Rails.env.development? : false
      end
    end

    class << self
      def configuration
        @configuration ||= Configuration.new
      end

      def configure
        yield(configuration)
      end

      def resolver
        @resolver ||= Resolver.new
      end

      def cache
        @cache ||= Cache.new
      end

      def resolve(name)
        resolver.resolve(name)
      end

      def reset!
        @resolver = nil
        @cache = nil
        @configuration = nil
      end
    end
  end
end

require_relative "icons/cache"
require_relative "icons/set"
require_relative "icons/resolver"
require_relative "icons/renderer"
require_relative "icons/api_client"
