Rails.application.routes.draw do
  # Подключаем Devise для обработки сессий под капотом
  devise_for :users, skip: [:sessions, :registrations, :passwords]

  namespace :api do
    namespace :v1 do
      # Маршруты аутентификации сессий
      post '/auth/register', to: 'authentication#register'
      post '/auth/login',    to: 'authentication#login'
      
      # Эндпоинт профиля для страницы Личного Кабинета
      get  '/account/profile', to: 'accounts#show'

      # Отели и поиск
      resources :hotels, only: [:index, :show] do
        collection do
          get 'search' # /api/v1/hotels/search
        end
      end
      
      # Бронирования
      resources :bookings, only: [:index, :create] do
        member do
          post 'cancel' # /api/v1/bookings/:id/cancel
        end
      end

    end
  end
end