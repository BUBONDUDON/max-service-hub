import { X } from "lucide-react";

export default function BookingModal({
  isOpen,
  onClose,
  selectedService,
  timeSlots,
  selectedSlot,
  onSlotSelect,
  onConfirm,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 max-w-[500px] w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
            Запись на услугу
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-[#666666] dark:text-[#AAAAAA] hover:text-[#0D0D0D] dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {selectedService && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#F8F6F3] dark:bg-[#262626]">
              <h4 className="font-medium text-[#0D0D0D] dark:text-white mb-2">
                {selectedService.name}
              </h4>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-3">
                {selectedService.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-semibold text-[#0D0D0D] dark:text-white">
                  {selectedService.price} ₽
                </span>
                <span className="text-[#666666] dark:text-[#AAAAAA]">
                  {selectedService.duration} мин
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-3">
                Выберите время
              </label>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots
                  .filter((slot) => slot.available)
                  .map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => onSlotSelect(slot)}
                      className={`p-3 rounded-xl border text-sm transition-colors ${
                        selectedSlot === slot
                          ? "border-[#FF6F3C] bg-[#FF6F3C] text-white"
                          : "border-[#E0E0E0] dark:border-[#404040] text-[#0D0D0D] dark:text-white hover:border-[#FF6F3C]"
                      }`}
                    >
                      {slot.date} в {slot.time}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] text-[#666666] dark:text-[#AAAAAA] hover:border-[#C0C0C0] transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={onConfirm}
                disabled={!selectedSlot || isLoading}
                className={`flex-1 py-2 rounded-xl text-white ${
                  selectedSlot && !isLoading
                    ? "bg-[#FF6F3C] hover:bg-[#F55C91]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Запись..." : "Подтвердить"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
