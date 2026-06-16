Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173' # URL вашего React-приложения (Vite/Webpack)
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true # КРИТИЧЕСКИ ВАЖНО для классических сессий
  end
end