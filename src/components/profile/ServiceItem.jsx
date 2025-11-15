import { Clock, DollarSign } from "lucide-react";

export default function ServiceItem({ service, onSelect }) {
  return (
    <div
      className="p-4 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] hover:border-[#FF4300] dark:hover:border-[#FF4300] transition-colors cursor-pointer"
      onClick={() => onSelect(service)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-[#0D0D0D] dark:text-white">
          {service.name}
        </h4>
        <button className="px-3 py-1 bg-[#FF6F3C] text-white rounded-xl text-sm hover:bg-[#FF4300] transition-colors">
          Записаться
        </button>
      </div>
      <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-3">
        {service.description}
      </p>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <DollarSign size={16} className="text-[#10B981]" />
          <span className="font-semibold text-[#0D0D0D] dark:text-white">
            {service.price} ₽
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#666666] dark:text-[#AAAAAA]">
          <Clock size={16} />
          <span>{service.duration} мин</span>
        </div>
      </div>
    </div>
  );
}
