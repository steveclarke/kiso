# frozen_string_literal: true

module Kiso
  module Icons
    class Cache
      def initialize
        @store = {}
        @mutex = Mutex.new
      end

      def get(set_prefix, name)
        @mutex.synchronize { @store["#{set_prefix}:#{name}"] }
      end

      def set(set_prefix, name, data)
        @mutex.synchronize { @store["#{set_prefix}:#{name}"] = data.freeze }
      end

      def clear!
        @mutex.synchronize { @store.clear }
      end

      def size
        @mutex.synchronize { @store.size }
      end
    end
  end
end
