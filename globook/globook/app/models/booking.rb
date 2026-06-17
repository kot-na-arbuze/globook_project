class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :room
  belongs_to :hotel

  STATUSES = ['Ожидает подтверждения', 'Подтверждено', 'Оплачено', 'Отменено', 'Завершено'].freeze
  validates :status, inclusion: { in: STATUSES }
  validates :check_in_date, :check_out_date, presence: true
  validate :dates_are_valid

  def nights
    (check_out_date - check_in_date).to_i
  end

  private

  def dates_are_valid
    return unless check_in_date && check_out_date
    errors.add(:check_out_date, 'должна быть позже даты заезда') if check_out_date <= check_in_date
  end
end