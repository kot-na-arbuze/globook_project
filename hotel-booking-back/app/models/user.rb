class User < ApplicationRecord
  # Devise включает :database_authenticatable, :registerable, :validatable и др.
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  belongs_to :role
  has_many :bookings, dependent: :destroy

  # Метод проверки прав (RBAC)
  def can?(permission_key)
    role.permissions.exists?(key: permission_key)
  end
end