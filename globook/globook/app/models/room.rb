class Room < ApplicationRecord
  belongs_to :hotel
  has_many :bookings, dependent: :destroy

  validates :room_number, :room_type, presence: true
  validates :room_number, uniqueness: { scope: :hotel_id }

  ROOM_TYPES = %w[single double suite].freeze
  validates :room_type, inclusion: { in: ROOM_TYPES }

  # Удобства как массив
  def amenities_array
    amenities.to_s.split(',').map(&:strip)
  end

  # Проверка доступности в период
  def available_for?(check_in, check_out)
    !bookings.where(status: ['Ожидает подтверждения', 'Подтверждено', 'Оплачено'])
             .where('check_in_date < ? AND check_out_date > ?', check_out, check_in)
             .exists?
  end
end