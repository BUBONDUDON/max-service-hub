import { useState } from "react";
import {
  Calendar,
  BarChart3,
  Settings,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import { toast } from "react-toastify";
import PageHeader from "../components/common/PageHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import OverviewTab from "../components/dashboard/OverviewTab";
import ServicesTab from "../components/dashboard/ServicesTab";
import BookingsTab from "../components/dashboard/BookingsTab";
import EmptyState from "../components/common/EmptyState";
import EditServiceModal from "../components/modals/EditServiceModal";
import AddServiceModal from "../components/modals/AddServiceModal";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import { usePerformerServicesFlat } from "../hooks/usePerformerServicesFlat";
import { useDeleteService } from "../hooks/useDeleteService";
import CalendarTab from "../components/calendar/CalendarTab";
import { useTimeSlots } from "../hooks/useTimeSlots";
import { useAuth } from "../hooks/useAuth";
import { useOverviewStats } from "../hooks/useOverviewStats";
import { useBookings } from "../hooks/useBookings";

export default function ProviderDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const id = user?.id;

  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { removeService } = useDeleteService();

  const {
    services,
    categories,
    loading,
    editService,
    addService,
    addCategory,
  } = usePerformerServicesFlat(id);

  const {
    stats,
    recentBookings,
    upcomingSlots,
    loading: statsLoading,
  } = useOverviewStats(id);

  const {
    bookings,
    loading: bookingsLoading,
    updateBookingStatus,
    refetch: refetchBookings,
  } = useBookings(id);

  const {
    slots,
    loading: slotsLoading,
    addSlot,
    editSlot,
    removeSlot,
  } = useTimeSlots(id);

  const tabs = [
    { id: "overview", label: "Обзор", icon: BarChart3 },
    { id: "bookings", label: "Записи", icon: ClipboardList },
    { id: "services", label: "Услуги", icon: Settings },
    { id: "calendar", label: "Расписание", icon: Calendar },
    { id: "analytics", label: "Аналитика", icon: TrendingUp },
  ];

  const handleAddSlot = async (formData) => {
    try {
      console.log("🔵 [1] Данные из формы:", formData);

      const startTime = `${formData.date}T${formData.time}:00`;

      const [datePart, timePart] = startTime.split("T");
      const [hours, minutes] = timePart.split(":").map(Number);

      const totalMinutes = hours * 60 + minutes + formData.duration;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;

      const endTime = `${datePart}T${String(endHours).padStart(
        2,
        "0"
      )}:${String(endMinutes).padStart(2, "0")}:00`;

      console.log("🔵 [2] Отправляем в API:", {
        start_time: startTime,
        end_time: endTime,
      });

      const result = await addSlot({
        performer_id: id,
        start_time: startTime,
        end_time: endTime,
      });

      console.log("🔵 [3] Получили из API:", result);

      toast.success("Слот успешно добавлен!");
    } catch (err) {
      console.error("❌ Ошибка добавления слота:", err);
      toast.error(`Ошибка: ${err.message}`);
    }
  };

  const handleEditSlot = async (slotId, formData) => {
    try {
      const startTime = `${formData.date}T${formData.time}:00`;

      const [datePart, timePart] = startTime.split("T");
      const [hours, minutes] = timePart.split(":").map(Number);

      const totalMinutes = hours * 60 + minutes + formData.duration;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;

      const endTime = `${datePart}T${String(endHours).padStart(
        2,
        "0"
      )}:${String(endMinutes).padStart(2, "0")}:00`;

      await editSlot(slotId, {
        start_time: startTime,
        end_time: endTime,
      });

      toast.success("Слот успешно обновлён!");
    } catch (err) {
      console.error("Ошибка обновления слота:", err);
      toast.error(`Ошибка: ${err.message}`);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await removeSlot(slotId);
      toast.success("Слот успешно удалён!");
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    }
  };

  const renderCalendar = () => (
    <CalendarTab
      slots={slots}
      onAddSlot={handleAddSlot}
      onEditSlot={handleEditSlot}
      onDeleteSlot={handleDeleteSlot}
    />
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">
        Аналитика
      </h2>
      <EmptyState
        icon={BarChart3}
        title="Детальная аналитика будет доступна после создания базы данных"
      />
    </div>
  );

  const handleEditService = (service) => {
    setEditingService(service);
  };

  const handleDeleteService = async (id) => {
    await removeService(id);
    const index = services.findIndex((s) => s.id === id);
    if (index !== -1) services.splice(index, 1);
  };

  const handleSaveService = async (formData) => {
    if (!editingService) return;

    setIsSaving(true);
    try {
      await editService(editingService.id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        duration: Number(formData.duration),
      });

      setEditingService(null);
      toast.success("Услуга успешно обновлена!");
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddService = async (formData) => {
    setIsSaving(true);
    try {
      await addService({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        duration: Number(formData.duration),
        category_id: Number(formData.category_id),
      });

      setShowAddModal(false);
      toast.success("Услуга успешно добавлена!");
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async (formData) => {
    setIsSaving(true);
    try {
      await addCategory({
        name: formData.name,
        description: formData.description,
      });

      setShowAddCategoryModal(false);
      toast.success("Категория успешно добавлена!");
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);

      const statusLabels = {
        completed: "завершённой",
        canceled: "отменённой",
      };

      toast.success(`Запись отмечена ${statusLabels[newStatus]}!`);

      refetchBookings();
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        if (statsLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <p className="text-[#666666] dark:text-[#AAAAAA]">
                Загрузка статистики...
              </p>
            </div>
          );
        }
        return (
          <OverviewTab
            stats={stats}
            recentBookings={recentBookings}
            upcomingSlots={upcomingSlots}
          />
        );
      case "services":
        if (loading) {
          return <div>Загрузка...</div>;
        }

        return (
          <ServicesTab
            services={services}
            onAddService={() => setShowAddModal(true)}
            onAddCategory={() => setShowAddCategoryModal(true)}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
          />
        );

      case "bookings":
        return (
          <BookingsTab
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            loading={bookingsLoading}
          />
        );

      case "calendar":
        return renderCalendar();
      case "analytics":
        return renderAnalytics();
      default:
        return (
          <OverviewTab
            stats={stats}
            recentBookings={recentBookings}
            upcomingSlots={upcomingSlots}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#666666] dark:text-[#AAAAAA]">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] to-[#ECE9E5] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
      <PageHeader
        backTo="/"
        backLabel="На главную"
        showUser
        userName={user?.full_name || "Мастер"}
        userCity={user?.city || "Не указан"}
        userAvatar={user?.photo_url}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex">
        <DashboardSidebar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 md:p-8 w-full">
          <div className="max-w-[1000px] mx-auto">{renderContent()}</div>
        </main>
      </div>

      <EditServiceModal
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        service={editingService}
        onSave={handleSaveService}
        isLoading={isSaving}
      />

      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddService}
        isLoading={isSaving}
        categories={categories}
      />

      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={handleAddCategory}
        isLoading={isSaving}
      />
    </div>
  );
}
