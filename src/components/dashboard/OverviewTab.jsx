import { Calendar, DollarSign, Clock, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import BookingCard from "./BookingCard";
import TimeSlotCard from "./TimeSlotCard";

export default function OverviewTab({ stats, recentBookings, upcomingSlots }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Calendar}
          value={stats.totalBookings}
          label="Записей всего"
          trend="+12%"
          gradient="from-[#8B70F6] to-[#9D7DFF]"
        />
        <StatCard
          icon={Clock}
          value={stats.monthlyBookings}
          label="Записей за месяц"
          gradient="from-[#FF6B9D] to-[#FF8FB3]"
        />
        <StatCard
          icon={TrendingUp}
          value={stats.completedServices}
          label="Услуг выполнено"
          gradient="from-[#10B981] to-[#059669]"
        />
        <StatCard
          icon={DollarSign}
          value={`${stats.monthlyRevenue.toLocaleString()} ₽`}
          label="Выручка за месяц"
          trend="+8%"
          gradient="from-[#FF6B9D] to-[#FF8FB3]"
        />
        <StatCard
          icon={Clock}
          value={stats.upcomingAppointments}
          label="Ближайшие записи"
          gradient="from-[#F59E0B] to-[#F97316]"
        />
        <StatCard
          icon={TrendingUp}
          value={stats.activeServices}
          label="Активных услуг"
          gradient="from-[#8B70F6] to-[#9D7DFF]"
        />
        <StatCard
          icon={Calendar}
          value={stats.availableSlots}
          label="Свободных слотов"
          gradient="from-[#10B981] to-[#059669]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#404040]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">
              Последние записи
            </h3>
            <button className="text-[#FF6F3C] hover:text-[#7E64F2] text-sm font-medium">
              Показать все
            </button>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#404040]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">
              Ближайшие слоты
            </h3>
            <button className="text-[#FF6F3C] hover:text-[#7E64F2] text-sm font-medium">
              Настроить
            </button>
          </div>

          <div className="space-y-3">
            {upcomingSlots.map((slot, index) => (
              <TimeSlotCard key={index} slot={slot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
