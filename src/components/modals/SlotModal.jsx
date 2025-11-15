import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";

export default function SlotModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  slot = null,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: 60,
  });

  useEffect(() => {
    if (slot) {
      setFormData({
        date: slot.date || "",
        time: slot.time || "",
        duration: slot.duration || 60,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        date: today,
        time: "10:00",
        duration: 60,
      });
    }
  }, [slot, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот слот?")) {
      onDelete(slot.id);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!slot;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 max-w-[500px] w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
            {isEditing ? "Редактировать слот" : "Добавить слот"}
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
              Дата
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
              Время начала
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
              Длительность
            </label>
            <select
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  duration: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
            >
              <option value={30}>30 минут</option>
              <option value={60}>1 час</option>
              <option value={90}>1.5 часа</option>
              <option value={120}>2 часа</option>
              <option value={180}>3 часа</option>
            </select>
          </div>

          {isEditing && slot && (
            <div className="p-4 rounded-xl bg-[#F8F6F3] dark:bg-[#262626]">
              <div className="flex items-center gap-2 text-sm">
                <Clock
                  size={16}
                  className="text-[#666666] dark:text-[#AAAAAA]"
                />
                <span className="text-[#666666] dark:text-[#AAAAAA]">
                  Статус:{" "}
                  <span
                    className={
                      slot.available
                        ? "text-[#10B981] font-medium"
                        : "text-[#F59E0B] font-medium"
                    }
                  >
                    {slot.available ? "Свободен" : `Занят (${slot.client})`}
                  </span>
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 rounded-2xl border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Удалить
              </button>
            )}
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
                  : "bg-[#FF6F3C] hover:bg-[#F55C91]"
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
