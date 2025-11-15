import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditServiceModal({
  isOpen,
  onClose,
  service,
  onSave,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
        duration: service.duration || "",
      });
    }
  }, [service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 max-w-[500px] w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
            Редактировать услугу
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-[#666666] dark:text-[#AAAAAA] hover:text-[#0D0D0D] dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
              Название услуги
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent"
              placeholder="Например: Классический маникюр"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent resize-none"
              placeholder="Краткое описание услуги..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
                Цена (₽)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent"
                placeholder="1200"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
                Время (мин)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent"
                placeholder="60"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] text-[#666666] dark:text-[#AAAAAA] hover:border-[#C0C0C0] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#8B70F6] hover:bg-[#7E64F2]"
              }`}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
