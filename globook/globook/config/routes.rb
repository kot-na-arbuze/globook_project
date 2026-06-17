Rails.application.routes.draw do

  devise_for :users, skip: [:sessions, :registrations, :passwords]

  namespace :api do
    namespace :v1 do
      # Аутентификация
      post 'auth/login',    to: 'authentication#login'
      post 'auth/register', to: 'authentication#register'
      delete 'auth/logout', to: 'authentication#logout'

      # Аккаунт
      get 'account/profile', to: 'accounts#show'
      patch 'account/profile', to: 'accounts#update'

      # Пользователи (для администраторов)
      resources :users, only: [:index, :show, :create, :update, :destroy]

      # Роли и права (для администраторов)
      resources :roles, only: [:index, :show, :create, :update, :destroy] do
        member do
          post :assign_permission
          delete :remove_permission
        end
      end
      resources :permissions, only: [:index]

      # Отели
      resources :hotels, only: [:index, :show, :create, :update, :destroy] do
        collection { get :search }
        resources :rooms, only: [:index, :show, :create, :update, :destroy]
      end

      # Бронирования
      resources :bookings, only: [:index, :show, :create, :update] do
        member do
          post :cancel
          post :confirm
          post :pay
        end
        collection { get :all }  # менеджеры — все брони
      end
    end
  end
end