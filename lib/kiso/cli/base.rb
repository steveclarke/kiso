# frozen_string_literal: true

require "fileutils"

class Kiso::Cli::Base < Thor
  def self.exit_on_failure? = true

  private

  def gem_root
    File.expand_path("../../..", __dir__)
  end

  def write_file(path, content)
    full_path = File.join(gem_root, path)

    if File.exist?(full_path)
      say "  exists  #{path}", :yellow
      return false
    end

    FileUtils.mkdir_p(File.dirname(full_path))
    File.write(full_path, content)
    say "  create  #{path}", :green
    true
  end

  def append_to_file(path, line)
    full_path = File.join(gem_root, path)
    content = File.read(full_path)

    unless content.include?(line)
      File.write(full_path, content.rstrip + "\n#{line}\n")
      say "  update  #{path}", :green
    end
  end
end
