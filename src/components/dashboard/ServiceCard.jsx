import { Edit3, Trash2 } from "lucide-react";

export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#404040]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <span className="text-xs text-[#FF6F3C] bg-[#FF6F3C]/10 px-2 py-1 rounded-full">
            {service.category}
          </span>
          <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white mt-2">
            {service.name}
          </h3>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onEdit?.(service)}
            className="text-[#666666] dark:text-[#AAAAAA] hover:text-[#0D0D0D] dark:hover:text-white"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={() => onDelete?.(service.id)}
            className="text-[#E03B3B] hover:text-[#B11F1F]"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-[#0D0D0D] dark:text-white">
            {service.price} ₽
          </span>
          <span className="text-sm text-[#666666] dark:text-[#AAAAAA]">
            {service.duration} мин
          </span>
        </div>
      </div>
    </div>
  );
}
