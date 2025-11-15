import { useState } from "react";
import { Calendar, Check, X, Clock } from "lucide-react";

export default function BookingsTab({ bookings, onUpdateStatus, loading }) {
  const [filter, setFilter] = useState("all");

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Подтверждено",
          color: "bg-[#8B70F6]/10 text-[#8B70F6]",
          icon: Clock,
        };
      case "completed":
        return {
          label: "Завершено",
          color: "bg-[#10B981]/10 text-[#10B981]",
          icon: Check,
        };
      case "canceled":
        return {
          label: "Отменено",
          color: "bg-[#EF4444]/10 text-[#EF4444]",
          icon: X,
        };
      default:
        return {
          label: status,
          color: "bg-[#666666]/10 text-[#666666]",
          icon: Clock,
        };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#666666] dark:text-[#AAAAAA]">
          Загрузка записей...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
          Записи клиентов
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === "all"
                ? "bg-[#8B70F6] text-white"
                : "bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#AAAAAA] border border-[#E0E0E0] dark:border-[#404040]"
            }`}
          >
            Все ({bookings.length})
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === "confirmed"
                ? "bg-[#8B70F6] text-white"
                : "bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#AAAAAA] border border-[#E0E0E0] dark:border-[#404040]"
            }`}
          >
            Подтверждённые
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === "completed"
                ? "bg-[#8B70F6] text-white"
                : "bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#AAAAAA] border border-[#E0E0E0] dark:border-[#404040]"
            }`}
          >
            Завершённые
          </button>
          <button
            onClick={() => setFilter("canceled")}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === "canceled"
                ? "bg-[#8B70F6] text-white"
                : "bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#AAAAAA] border border-[#E0E0E0] dark:border-[#404040]"
            }`}
          >
            Отменённые
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar
            size={48}
            className="mx-auto mb-4 text-[#666666] dark:text-[#AAAAAA] opacity-50"
          />
          <p className="text-[#666666] dark:text-[#AAAAAA]">
            {filter === "all"
              ? "Записей пока нет"
              : `Нет записей со статусом "${getStatusConfig(filter).label}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#404040]"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">
                        {booking.client}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusConfig.color}`}
                      >
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-[#666666] dark:text-[#AAAAAA] mb-1">
                      {booking.service}
                    </p>
                    <p className="text-sm text-[#666666] dark:text-[#AAAAAA]">
                      📅 {formatDate(booking.date)} в {booking.time}
                    </p>
                    <p className="text-lg font-semibold text-[#0D0D0D] dark:text-white mt-2">
                      {booking.price} ₽
                    </p>
                  </div>

                  {booking.status === "confirmed" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(booking.id, "completed")}
                        className="px-4 py-2 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-colors flex items-center gap-2"
                      >
                        <Check size={16} />
                        Завершить
                      </button>
                      <button
                        onClick={() => onUpdateStatus(booking.id, "canceled")}
                        className="px-4 py-2 bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626] transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Отменить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
