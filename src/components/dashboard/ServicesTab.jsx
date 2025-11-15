import { Plus, FolderPlus } from "lucide-react";
import ServiceCard from "./ServiceCard";

export default function ServicesTab({
  services,
  onAddService,
  onAddCategory,
  onEditService,
  onDeleteService,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
          Мои услуги
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onAddCategory}
            className="px-4 py-2 bg-[#FF6F3C] text-white rounded-xl hover:bg-[#F55C91] transition-colors flex items-center gap-2"
          >
            <FolderPlus size={20} />
            <span className="hidden sm:inline">Категория</span>
          </button>
          <button
            onClick={onAddService}
            className="px-4 py-2 bg-[#FF6F3C] text-white rounded-xl hover:bg-[#7E64F2] transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Услуга</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            service={service}
            onEdit={onEditService}
            onDelete={onDeleteService}
          />
        ))}
      </div>
    </div>
  );
}
