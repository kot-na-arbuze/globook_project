class Api::V1::UsersController < Api::V1::ApplicationController
 
  before_action :check_admin_permission
 
  def index
    users = User.includes(:role).all
    render json: users.map { |u| user_json(u) }
  end
 
  def show
    user = User.find(params[:id])
    render json: user_json(user)
  end
 
  def create
    user = User.new(create_params)
    user.role = Role.find(params[:user][:role_id])
 
    if user.save
      render json: user_json(user), status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  def update
    user = User.find(params[:id])
    user.role = Role.find(params[:user][:role_id]) if params[:user][:role_id].present?
 
    if user.update(update_params)
      render json: user_json(user)
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  def destroy
    user = User.find(params[:id])
    if user == current_user
      render json: { error: 'Нельзя удалить собственный аккаунт' }, status: :forbidden
    else
      user.destroy
      render json: { message: 'Аккаунт удалён' }
    end
  end
 
  private
 
  def check_admin_permission
    require_permission!('create_account')
  end
 
  def create_params
    params.require(:user).permit(:email, :password, :first_name, :last_name, :patronymic, :phone)
  end
 
  def update_params
    params.require(:user).permit(:first_name, :last_name, :patronymic, :phone)
  end
 
  def user_json(user)
    {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      roleName: user.role.name,
      roleId: user.role_id,
      createdAt: user.created_at.strftime("%d.%m.%Y")
    }
  end
end