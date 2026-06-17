Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
        origins 'http://localhost:3001', 'http://localhost:5173'  # Vite dev server
        resource '*',
            headers: :any,
            methods: [:get, :post, :put, :patch, :delete, :options, :head],
            credentials: true   # ВАЖНО: для передачи кук сессии
    end
end