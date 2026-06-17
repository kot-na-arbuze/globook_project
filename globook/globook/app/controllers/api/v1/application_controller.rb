class Api::V1::ApplicationController < ActionController::API
  include Devise::Controllers::Helpers

  skip_before_action :verify_authenticity_token, raise: false
  before_action :authenticate_user!

  def current_user
    @current_user ||= request.env['warden']&.user(:user)
  end

  private

  def require_permission!(permission_key)
    unless current_user&.can?(permission_key)
      render json: { error: 'Недостаточно прав (RBAC)', required: permission_key }, status: :forbidden
    end
  end

  # Переопределяем Devise — для API возвращаем JSON вместо редиректа
  def authenticate_user!
    unless current_user
      render json: { error: 'Требуется авторизация' }, status: :unauthorized
    end
  end
end