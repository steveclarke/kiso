Rails.application.routes.draw do
  mount Kiso::Engine => "/kiso"

  if defined?(Lookbook)
    mount Lookbook::Engine, at: "/lookbook"
  end

  root "pages#home"
end
