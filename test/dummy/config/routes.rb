Rails.application.routes.draw do
  mount Kiso::Engine => "/kiso"

  if defined?(Lookbook)
    mount Lookbook::Engine, at: "/lookbook"
  end

  get "dashboard", to: "dashboard#index"
  get "smoke/layout", to: "smoke#layout"
  get "smoke/page", to: "smoke#page"
  get "smoke/appui", to: "smoke#appui"

  root "dashboard#index"
end
