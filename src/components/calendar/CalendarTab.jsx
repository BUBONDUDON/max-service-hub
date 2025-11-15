import { useState } from "react";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import { Plus } from "lucide-react";
import SlotModal from "../modals/SlotModal";

// TODO: не правильно показывает время, делает +5
export default function CalendarTab({
  slots,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateClick = (info) => {
    // Открываем модалку для создания нового слота с выбранной датой
    setSelectedSlot({
      date: info.dateStr,
      time: "10:00",
      duration: 60,
    });
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    // Находим слот по ID из extendedProps
    const slotId = info.event.extendedProps.slotId;
    const slot = slots.find((s) => s.id === slotId);

    if (slot) {
      // Преобразуем формат API в формат формы
      const startDate = new Date(slot.start);
      const endDate = new Date(slot.end);
      const duration = Math.round((endDate - startDate) / 60000); // в минутах

      setSelectedSlot({
        id: slot.id,
        date: startDate.toISOString().split("T")[0],
        time: startDate.toTimeString().slice(0, 5),
        duration: duration,
        available: slot.available,
      });
      setShowModal(true);
    }
  };

  const handleSaveSlot = async (formData) => {
    setIsLoading(true);
    try {
      if (selectedSlot?.id) {
        // Редактирование существующего слота
        await onEditSlot(selectedSlot.id, formData);
      } else {
        // Создание нового слота
        await onAddSlot(formData);
      }
      setShowModal(false);
      setSelectedSlot(null);
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    setIsLoading(true);
    try {
      await onDeleteSlot(slotId);
      setShowModal(false);
      setSelectedSlot(null);
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Преобразуем слоты из API в события для календаря
  const events = slots.map((slot) => {
    console.log("🟣 [Calendar] Преобразуем слот для отображения:", {
      id: slot.id,
      start: slot.start,
      end: slot.end,
      startParsed: new Date(slot.start).toString(),
    });

    return {
      id: slot.id,
      title: slot.available ? "🟢 Свободно" : `🔴 Занято`,
      start: slot.start,
      end: slot.end,
      backgroundColor: slot.available ? "#10B981" : "#F59E0B",
      borderColor: slot.available ? "#059669" : "#D97706",
      extendedProps: {
        slotId: slot.id,
        available: slot.available,
      },
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
          Расписание
        </h2>
        <button
          className="px-4 py-2 bg-[#FF6F3C] text-white rounded-xl hover:bg-[#FF4300] transition-colors flex items-center gap-2"
          onClick={() => {
            setSelectedSlot(null);
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          Добавить слот
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 md:p-6 border border-[#E0E0E0] dark:border-[#404040]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          locale={ruLocale}
          timeZone="local"
          initialView="timeGridWeek"
          views={{
            timeGridDay: {
              buttonText: "День",
            },
            timeGridWeek: {
              buttonText: "Неделя",
            },
            dayGridMonth: {
              buttonText: "Месяц",
            },
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth",
          }}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          nowIndicator={true}
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
        />
      </div>

      <SlotModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSlot(null);
        }}
        onSave={handleSaveSlot}
        onDelete={handleDeleteSlot}
        slot={selectedSlot}
        isLoading={isLoading}
      />
    </div>
  );
}
