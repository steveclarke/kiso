threads_count = ENV.fetch("RAILS_MAX_THREADS", 3)
threads threads_count, threads_count

bind "tcp://0.0.0.0:#{ENV.fetch("PORT", 3000)}"

workers ENV.fetch("WEB_CONCURRENCY", 0)

pidfile ENV["PIDFILE"] if ENV["PIDFILE"]

plugin :tmp_restart
