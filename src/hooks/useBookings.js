import { useState, useEffect } from "react";
import { supabase } from "../lib/createClient";

export function useBookings(performerId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    if (!performerId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          `
          id,
          status,
          created_at,
          customer:profiles!customer_id(full_name),
          service:services(name, price),
          slot:time_slots(start_time)
        `
        )
        .eq("performer_id", performerId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const formattedBookings = (data || []).map((booking) => ({
        id: booking.id,
        client: booking.customer?.full_name || "Неизвестно",
        service: booking.service?.name || "Неизвестно",
        date: booking.slot?.start_time?.split("T")[0] || "",
        time: booking.slot?.start_time?.split("T")[1]?.slice(0, 5) || "",
        price: booking.service?.price || 0,
        status: booking.status,
        createdAt: booking.created_at,
      }));

      setBookings(formattedBookings);
    } catch (err) {
      console.error("[useBookings] Ошибка загрузки:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [performerId]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (updateError) throw updateError;

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      return true;
    } catch (err) {
      console.error("[useBookings] Ошибка обновления статуса:", err);
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    updateBookingStatus,
    refetch: loadBookings,
  };
}
