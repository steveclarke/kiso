# frozen_string_literal: true

require "net/http"
require "uri"
require "json"
require "fileutils"

class Kiso::Cli::Icons < Kiso::Cli::Base
  SETS_URL = "https://raw.githubusercontent.com/iconify/icon-sets/master/json"

  desc "pin SETS...", "Download icon sets to vendor/icons/"
  long_desc <<~DESC
    Downloads Iconify JSON files for the specified icon sets to vendor/icons/.
    Commit these files to git for production use (like importmap-rails vendor pattern).

    Example:
      $ bin/kiso icons pin lucide
      $ bin/kiso icons pin heroicons mdi tabler
  DESC
  def pin(*sets)
    if sets.empty?
      say "Usage: bin/kiso icons pin SET [SET...]", :red
      say ""
      say "Example: bin/kiso icons pin lucide heroicons"
      say "Browse sets: https://icon-sets.iconify.design/"
      exit 1
    end

    vendor_dir = vendor_path
    FileUtils.mkdir_p(vendor_dir)

    sets.each { |set_name| pin_set(set_name, vendor_dir) }
  end

  desc "unpin SET", "Remove a vendored icon set"
  def unpin(set_name)
    path = File.join(vendor_path, "#{set_name}.json")

    unless File.exist?(path)
      say "  not found  #{set_name} is not pinned", :red
      return
    end

    File.delete(path)
    say "  remove  vendor/icons/#{set_name}.json", :green
  end

  desc "pristine", "Re-download all pinned icon sets"
  def pristine
    sets = vendored_sets
    if sets.empty?
      say "No icon sets pinned. Pin one with: bin/kiso icons pin lucide", :yellow
      return
    end

    vendor_dir = vendor_path
    say "Re-downloading #{sets.size} pinned set(s)..."
    sets.each { |set_name| pin_set(set_name, vendor_dir, overwrite: true) }
  end

  desc "list", "Show pinned icon sets"
  def list
    sets = vendored_sets
    if sets.empty?
      say "No icon sets pinned.", :yellow
      say ""
      say "Pin a set:  bin/kiso icons pin lucide"
      return
    end

    say "Pinned icon sets (vendor/icons/):", :cyan
    say ""

    sets.each do |set_name|
      path = File.join(vendor_path, "#{set_name}.json")
      size_kb = (File.size(path) / 1024.0).round(1)
      data = JSON.parse(File.read(path))
      icon_count = (data["icons"] || {}).size
      display_name = data.dig("info", "name") || set_name

      say "  #{set_name.ljust(20)} #{icon_count.to_s.rjust(6)} icons  #{size_kb.to_s.rjust(8)} KB  (#{display_name})"
    end
  end

  private

  def pin_set(set_name, vendor_dir, overwrite: false)
    dest = File.join(vendor_dir, "#{set_name}.json")

    if File.exist?(dest) && !overwrite
      say "  exists  vendor/icons/#{set_name}.json (use `pristine` to re-download)", :yellow
      return
    end

    url = "#{SETS_URL}/#{set_name}.json"
    say "  fetch   #{url}"

    body = download(url)
    if body.nil?
      say "  error   Could not download #{set_name}. Check the set name.", :red
      say "          Browse sets: https://icon-sets.iconify.design/"
      return
    end

    data = JSON.parse(body)
    unless data["icons"]
      say "  error   #{set_name}.json has no 'icons' key — invalid Iconify format", :red
      return
    end

    File.write(dest, body)
    icon_count = data["icons"].size
    size_kb = (body.bytesize / 1024.0).round(1)
    say "  pin     vendor/icons/#{set_name}.json (#{icon_count} icons, #{size_kb} KB)", :green
  end

  def download(url)
    uri = URI(url)
    response = Net::HTTP.get_response(uri)
    case response
    when Net::HTTPSuccess then response.body
    when Net::HTTPRedirection then download(response["location"])
    end
  rescue SocketError, Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED => e
    say "  error   Network error: #{e.message}", :red
    nil
  end

  def vendor_path
    File.join(Dir.pwd, "vendor/icons")
  end

  def vendored_sets
    Dir.glob(File.join(vendor_path, "*.json"))
      .map { |f| File.basename(f, ".json") }
      .sort
  end
end
