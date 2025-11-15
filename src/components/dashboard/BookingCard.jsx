export default function BookingCard({ booking }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Подтверждено",
          className: "bg-[#8B70F6]/10 text-[#8B70F6]",
        };
      case "completed":
        return {
          label: "Завершено",
          className: "bg-[#10B981]/10 text-[#10B981]",
        };
      case "canceled":
        return {
          label: "Отменено",
          className: "bg-[#EF4444]/10 text-[#EF4444]",
        };
      default:
        return {
          label: status,
          className: "bg-[#666666]/10 text-[#666666]",
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F3] dark:bg-[#262626]">
      <div className="flex-1">
        <p className="font-medium text-[#0D0D0D] dark:text-white text-sm">
          {booking.client}
        </p>
        <p className="text-xs text-[#666666] dark:text-[#AAAAAA]">
          {booking.service}
        </p>
        <p className="text-xs text-[#666666] dark:text-[#AAAAAA]">
          {booking.date} в {booking.time}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-[#0D0D0D] dark:text-white text-sm">
          {booking.price} ₽
        </p>
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>
      </div>
    </div>
  );
}
