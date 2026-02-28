# frozen_string_literal: true

require "fileutils"

# Base class for all Kiso CLI commands.
#
# Provides file generation helpers used by subcommands like {Make}.
class Kiso::Cli::Base < Thor
  def self.exit_on_failure? = true

  private

  # @return [String] absolute path to the kiso gem root directory
  def gem_root
    File.expand_path("../../..", __dir__)
  end

  # Creates a file at +path+ (relative to gem root) with +content+.
  # Skips if the file already exists.
  #
  # @param path [String] relative path from gem root
  # @param content [String] file contents to write
  # @return [Boolean] +true+ if created, +false+ if skipped
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

  # Appends +line+ to an existing file unless it already contains that line.
  #
  # @param path [String] relative path from gem root
  # @param line [String] the line to append
  # @return [void]
  def append_to_file(path, line)
    full_path = File.join(gem_root, path)
    content = File.read(full_path)

    unless content.include?(line)
      File.write(full_path, content.rstrip + "\n#{line}\n")
      say "  update  #{path}", :green
    end
  end
end
