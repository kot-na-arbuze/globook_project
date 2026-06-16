class Api::V1::AccountsController < Api::V1::ApplicationController
  # Метод требует обязательной сессии
  before_action :authenticate_user!

  # GET /api/v1/account/profile
  def show
    # Собираем данные текущего пользователя сессии
    render json: {
      id: current_user.id,
      fullName: current_user.full_name, # Наш кастомный метод из модели User (Сборка ФИО)
      email: current_user.email,
      phone: current_user.phone || 'Не указан',
      createdAt: current_user.created_at.strftime("%d.%m.%Y"),
      roleName: current_user.role.name,
      
      # ВЫГРУЖАЕМ ПРАВА ДЛЯ REACT RBAC: 
      # Возвращает массив строк, например: ['create_hotel', 'book_room', 'pay_booking']
      permissions: current_user.role.permissions.pluck(:key)
    }
  end
end