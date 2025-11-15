export default function TimeSlotsList({ timeSlots, onSlotSelect }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 border border-[#E0E0E0] dark:border-[#404040]">
      <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white mb-6">
        Доступные слоты
      </h2>

      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            className={`p-4 rounded-2xl border transition-colors ${
              slot.available
                ? "border-[#E0E0E0] dark:border-[#404040] hover:border-[#10B981] cursor-pointer"
                : "border-[#F87171]/20 bg-[#F87171]/5 cursor-not-allowed"
            }`}
            onClick={() => slot.available && onSlotSelect(slot)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#0D0D0D] dark:text-white">
                  {slot.date} в {slot.time}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  slot.available
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "bg-[#F87171]/10 text-[#F87171]"
                }`}
              >
                {slot.available ? "Свободен" : "Занят"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
