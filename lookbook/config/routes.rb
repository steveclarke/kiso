Rails.application.routes.draw do
  get "up" => proc { [200, {}, ["OK"]] }

  mount Kiso::Engine => "/kiso"

  if defined?(Lookbook)
    mount Lookbook::Engine, at: "/"
  end
end
