class Api::V1::ApplicationController < ActionController::API
  # Встроенный метод Devise, проверяет куку сессии перед любым действием
  before_action :authenticate_user!

  private

  # Наш кастомный метод проверки прав (Guard)
  def require_permission!(permission_key)
    unless current_user&.can?(permission_key)
      render json: { error: 'Недостаточно прав для выполнения операции (RBAC)' }, status: :forbidden
    end
  end
end