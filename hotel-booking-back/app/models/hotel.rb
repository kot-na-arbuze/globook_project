class Hotel < ApplicationRecord
  # Говорим рельсам, по какому полю искать координаты
  geocoded_by :full_address

  # Автоматически запускать поиск координат в сети при сохранении отеля,
  # если адрес изменился
  after_validation :geocode, if: ->(obj){ obj.address_changed? || obj.city_changed? }

  def full_address
    "#{city}, #{address}"
  end
end