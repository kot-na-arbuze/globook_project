class Api::V1::AuthenticationController < Api::V1::ApplicationController
  skip_before_action :authenticate_user!, only: [:login, :register]
 
  # POST /api/v1/auth/register
  def register
    user = User.new(register_params)
    user.role = Role.find_by(name: 'Клиент') || Role.first
 
    if user.save
      sign_in(user)
      render json: profile_json(user), status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  # POST /api/v1/auth/login
  def login
    user = User.find_for_database_authentication(email: params[:email])
 
    if user&.valid_password?(params[:password])
      sign_in(user)
      render json: profile_json(user)
    else
      render json: { error: 'Неверный email или пароль' }, status: :unauthorized
    end
  end
 
  # DELETE /api/v1/auth/logout
  def logout
    sign_out(current_user)
    render json: { message: 'Выход выполнен' }
  end
 
  private
 
  def register_params
    params.require(:user).permit(:email, :password, :first_name, :last_name, :patronymic, :phone)
  end
 
  def profile_json(user)
    {
      id: user.id,
      fullName: user.full_name,
      firstName: user.first_name,
      lastName: user.last_name,
      patronymic: user.patronymic,
      email: user.email,
      phone: user.phone || 'Не указан',
      createdAt: user.created_at.strftime("%d.%m.%Y"),
      roleName: user.role.name,
      permissions: user.role.permissions.pluck(:key)
    }
  end
end