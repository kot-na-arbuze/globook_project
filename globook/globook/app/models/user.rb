class User < ApplicationRecord
  # Devise — только :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  belongs_to :role
  has_many :bookings, dependent: :destroy

  validates :first_name, :last_name, presence: true

  # Полное ФИО (Фамилия Имя Отчество)
  def full_name
    [last_name, first_name, patronymic].compact.join(' ')
  end

  # Проверка конкретного права через роль
  def can?(permission_key)
    role.permissions.exists?(key: permission_key)
  end
end