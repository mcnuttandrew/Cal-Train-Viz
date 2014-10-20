Rails.application.routes.draw do
  resources :trains, defaults: {format: 'json'}, only: [:index, :show]
  resources :stops, defaults: {format: 'json'}, only: [:index, :show]
end
