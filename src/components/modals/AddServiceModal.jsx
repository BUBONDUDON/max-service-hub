import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddServiceModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category_id: categories[0]?.id || "",
      });
    }
  }, [isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 max-w-[500px] w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
            Добавить услугу
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
              Категория
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
              required
              disabled={categories.length === 0}
            >
              {categories.length === 0 ? (
                <option value="">Нет доступных категорий</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-[#FF6F3C] mt-1">
                Сначала создайте категорию, нажав кнопку "Категория"
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
              Название услуги
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
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
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent resize-none"
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
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
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
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
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
              disabled={isLoading || categories.length === 0}
              className={`flex-1 py-3 rounded-xl text-white ${
                isLoading || categories.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FF6F3C] hover:bg-[#7E64F2]"
              }`}
            >
              {isLoading ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
