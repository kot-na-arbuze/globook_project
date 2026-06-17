class Api::V1::AccountsController < Api::V1::ApplicationController
 
  # GET /api/v1/account/profile
  def show
    render json: profile_json(current_user)
  end
 
  # PATCH /api/v1/account/profile
  def update
    if current_user.update(update_params)
      render json: profile_json(current_user)
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  private
 
  def update_params
    params.require(:user).permit(:first_name, :last_name, :patronymic, :phone)
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