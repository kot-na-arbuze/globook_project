class Api::V1::PermissionsController < Api::V1::ApplicationController
  def index
    render json: Permission.all.map { |p| { id: p.id, key: p.key, description: p.description } }
  end
end