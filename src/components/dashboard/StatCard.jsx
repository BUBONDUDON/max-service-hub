export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  gradient,
}) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#404040]">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}
        >
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
          {value}
        </p>
        <p className="text-sm text-[#666666] dark:text-[#AAAAAA]">{label}</p>
      </div>
    </div>
  );
}
