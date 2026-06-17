class Api::V1::RolesController < Api::V1::ApplicationController
  before_action -> { require_permission!('create_role_type') }
 
  def index
    roles = Role.includes(:permissions).all
    render json: roles.map { |r|
      { id: r.id, name: r.name, permissions: r.permissions.pluck(:key) }
    }
  end
 
  def show
    role = Role.includes(:permissions).find(params[:id])
    render json: { id: role.id, name: role.name, permissions: role.permissions.map { |p| { id: p.id, key: p.key, description: p.description } } }
  end
 
  def create
    role = Role.new(name: params[:role][:name])
    if role.save
      render json: { id: role.id, name: role.name }, status: :created
    else
      render json: { errors: role.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  def update
    require_permission!('edit_role_permissions')
    role = Role.find(params[:id])
    role.update!(name: params[:role][:name]) if params[:role][:name].present?
    render json: { id: role.id, name: role.name }
  end
 
  def destroy
    require_permission!('delete_role_type')
    role = Role.find(params[:id])
    if role.users.any?
      render json: { error: 'Нельзя удалить роль, пока есть пользователи с ней' }, status: :conflict
    else
      role.destroy
      render json: { message: 'Роль удалена' }
    end
  end
 
  def assign_permission
    require_permission!('edit_role_permissions')
    role = Role.find(params[:id])
    perm = Permission.find(params[:permission_id])
    RolePermission.find_or_create_by!(role: role, permission: perm)
    render json: { message: 'Право назначено' }
  end
 
  def remove_permission
    require_permission!('edit_role_permissions')
    role = Role.find(params[:id])
    perm = Permission.find(params[:permission_id])
    RolePermission.where(role: role, permission: perm).destroy_all
    render json: { message: 'Право снято' }
  end
end