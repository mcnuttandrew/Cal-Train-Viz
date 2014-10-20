Rails.application.routes.draw do
  namespace :api, defaults: {format: 'json'} do
    resources :trains, only: [:index, :show]
    resources :stops, only: [:index, :show]
  end
end
