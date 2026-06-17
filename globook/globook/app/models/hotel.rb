class Hotel < ApplicationRecord
  has_many :rooms, dependent: :destroy
  has_many :bookings, dependent: :destroy

  validates :name, presence: true

  # Считаем доступные комнаты
  def available_rooms_count
    rooms.where(available: true).count
  end
end