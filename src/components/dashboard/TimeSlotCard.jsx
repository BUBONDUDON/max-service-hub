export default function TimeSlotCard({ slot }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F3] dark:bg-[#262626]">
      <div>
        <p className="font-medium text-[#0D0D0D] dark:text-white text-sm">
          {slot.date} в {slot.time}
        </p>
        {slot.client && (
          <p className="text-xs text-[#666666] dark:text-[#AAAAAA]">
            {slot.client}
          </p>
        )}
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          slot.available
            ? "bg-[#10B981]/10 text-[#10B981]"
            : "bg-[#FF6F3C]/10 text-[#FF6F3C]"
        }`}
      >
        {slot.available ? "Свободен" : "Занят"}
      </span>
    </div>
  );
}
