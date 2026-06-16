class Api::V1::AuthenticationController < Api::V1::ApplicationController
  # Отключаем проверку авторизации для входа и регистрации
  skip_before_action :authenticate_user!, only: [:login, :register]

  # POST /api/v1/auth/register
  def register
    user = User.new(user_params)
    user.role = Role.find_by(name: 'Клиент') # По умолчанию назначаем роль клиента

    if user.save
      sign_in(user) # Метод Devise для создания сессии
      render json: { message: 'Регистрация успешна', user: user }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/v1/auth/login
  def login
    user = User.find_for_database_authentication(email: params[:email])
    
    if user&.valid_password?(params[:password])
      sign_in(user)
      render json: { message: 'Вход успешен', user: user.as_json(include: :role) }
    else
      render json: { error: 'Неверный email или пароль' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :first_name, :last_name, :phone)
  end
end