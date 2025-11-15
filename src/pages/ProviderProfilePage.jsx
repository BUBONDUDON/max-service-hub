import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useProviderById } from "../hooks/useProviderById";
import { createBooking } from "../Api/booking";
import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/common/PageHeader";
import ProviderInfo from "../components/profile/ProviderInfo";
import ServicesList from "../components/profile/ServicesList";
import TimeSlotsList from "../components/profile/TimeSlotsList";
import BookingModal from "../components/modals/BookingModal";

export default function ProviderProfilePage() {
  const { id } = useParams();
  const { provider, loading, error, refetch } = useProviderById(id);
  const { user } = useAuth();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedSlot(null);
    setShowBooking(true);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedSlot || !user) {
      toast.error("Ошибка: не удалось определить пользователя");
      return;
    }

    setBookingLoading(true);
    try {
      console.log("Booking data:", {
        customer_id: user.id,
        performer_id: provider.id,
        service_id: selectedService.id,
        slot_id: selectedSlot.id,
      });

      await createBooking({
        customer_id: user.id,
        performer_id: provider.id,
        service_id: selectedService.id,
        slot_id: selectedSlot.id,
      });

      refetch();

      toast.success("Вы успешно записаны!");

      setShowBooking(false);
      setSelectedService(null);
      setSelectedSlot(null);
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] to-[#ECE9E5] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
        <PageHeader backTo="/customer/browse" backLabel="К списку" />

        <main className="p-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 mb-8 border border-[#E0E0E0] dark:border-[#404040] animate-pulse">
              <div className="flex items-start md:flex-row flex-col gap-8">
                <div className="w-32 h-32 rounded-3xl bg-gray-200 dark:bg-gray-700"></div>

                <div className="flex-1 space-y-4">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>

                  <div className="flex items-center gap-6">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 border border-[#E0E0E0] dark:border-[#404040] animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6"></div>

                <div className="space-y-6">
                  {Array.from({ length: 2 }).map((_, categoryIndex) => (
                    <div key={categoryIndex}>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, serviceIndex) => (
                          <div
                            key={serviceIndex}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-2xl"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 border border-[#E0E0E0] dark:border-[#404040] animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>

                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] to-[#ECE9E5] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
        <PageHeader backTo="/customer/browse" backLabel="К списку" />

        <main className="p-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 border border-[#E0E0E0] dark:border-[#404040] text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white mb-2">
                Ошибка загрузки
              </h2>
              <p className="text-[#666666] dark:text-[#AAAAAA]">
                {error || "Мастер не найден"}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] to-[#ECE9E5] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
      <PageHeader backTo="/customer/browse" backLabel="К списку" />

      <main className="p-6">
        <div className="max-w-[1000px] mx-auto">
          <ProviderInfo provider={provider} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ServicesList
              services={provider.services}
              onServiceSelect={handleServiceSelect}
            />
            <TimeSlotsList
              timeSlots={provider.timeSlots}
              onSlotSelect={handleSlotSelect}
            />
          </div>
        </div>
      </main>

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        selectedService={selectedService}
        timeSlots={provider.timeSlots}
        selectedSlot={selectedSlot}
        onSlotSelect={handleSlotSelect}
        onConfirm={handleBooking}
        isLoading={bookingLoading}
      />
    </div>
  );
}
