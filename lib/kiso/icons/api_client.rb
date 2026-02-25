# frozen_string_literal: true

require "net/http"
require "uri"
require "json"

module Kiso
  module Icons
    class ApiClient
      API_BASE = "https://api.iconify.design"
      TIMEOUT = 5

      class << self
        def fetch_icon(set_prefix, icon_name)
          start_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)

          uri = URI("#{API_BASE}/#{set_prefix}/#{icon_name}.json")
          response = make_request(uri)
          return nil unless response

          data = JSON.parse(response.body)
          return nil unless data["body"]

          elapsed_ms = ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - start_time) * 1000).round

          warn_to_pin(set_prefix, icon_name, elapsed_ms)

          {
            body: data["body"],
            width: data["width"] || 24,
            height: data["height"] || 24
          }
        rescue JSON::ParserError => e
          warn "[Kiso::Icons] Failed to parse API response for #{set_prefix}:#{icon_name}: #{e.message}"
          nil
        end

        private

        def make_request(uri)
          http = Net::HTTP.new(uri.host, uri.port)
          http.use_ssl = true
          http.open_timeout = TIMEOUT
          http.read_timeout = TIMEOUT

          request = Net::HTTP::Get.new(uri)
          request["Accept"] = "application/json"

          response = http.request(request)

          case response
          when Net::HTTPSuccess then response
          when Net::HTTPNotFound then nil
          else
            warn "[Kiso::Icons] API returned #{response.code} for #{uri}"
            nil
          end
        rescue Net::OpenTimeout, Net::ReadTimeout
          warn "[Kiso::Icons] API timeout for #{uri} (#{TIMEOUT}s)"
          nil
        rescue SocketError, Errno::ECONNREFUSED => e
          warn "[Kiso::Icons] Network error: #{e.message}"
          nil
        end

        def warn_to_pin(set_prefix, icon_name, elapsed_ms)
          message = "[Kiso::Icons] Fetched #{set_prefix}:#{icon_name} from Iconify API (#{elapsed_ms}ms).\n" \
            "  Pin this set for offline use: bin/kiso icons pin #{set_prefix}"

          if defined?(Rails) && defined?(Rails.logger)
            Rails.logger.debug { message }
          else
            warn message
          end
        end
      end
    end
  end
end
