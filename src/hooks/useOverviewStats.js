import { useState, useEffect } from "react";
import { supabase } from "../lib/createClient";

export function useOverviewStats(performerId) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    monthlyBookings: 0,
    activeServices: 0,
    availableSlots: 0,
    completedServices: 0,
    monthlyRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingSlots, setUpcomingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!performerId) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const { count: totalBookings } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("performer_id", performerId);

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];

        const { count: monthlyBookings } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("performer_id", performerId)
          .gte("created_at", firstDayOfMonth);

        const { count: activeServices } = await supabase
          .from("services")
          .select("service_categories!inner(performer_id)", {
            count: "exact",
            head: true,
          })
          .eq("service_categories.performer_id", performerId);

        const { count: availableSlots } = await supabase
          .from("time_slots")
          .select("*", { count: "exact", head: true })
          .eq("performer_id", performerId)
          .eq("is_available", true);

        const { count: completedServices } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("performer_id", performerId)
          .eq("status", "completed");

        const { data: completedBookings } = await supabase
          .from("bookings")
          .select("service:services(price)")
          .eq("performer_id", performerId)
          .eq("status", "completed")
          .gte("created_at", firstDayOfMonth);

        const monthlyRevenue = (completedBookings || []).reduce(
          (sum, booking) => sum + (booking.service?.price || 0),
          0
        );

        setStats({
          totalBookings: totalBookings || 0,
          monthlyBookings: monthlyBookings || 0,
          activeServices: activeServices || 0,
          availableSlots: availableSlots || 0,
          completedServices: completedServices || 0,
          monthlyRevenue: monthlyRevenue || 0,
        });

        const { data: bookingsData } = await supabase
          .from("bookings")
          .select(
            `
            id,
            created_at,
            status,
            customer:profiles!customer_id(full_name),
            service:services(name, price),
            slot:time_slots(start_time)
          `
          )
          .eq("performer_id", performerId)
          .order("created_at", { ascending: false })
          .limit(5);

        const formattedBookings = (bookingsData || []).map((booking) => ({
          id: booking.id,
          client: booking.customer?.full_name || "Неизвестно",
          service: booking.service?.name || "Неизвестно",
          date: booking.slot?.start_time?.split("T")[0] || "",
          time: booking.slot?.start_time?.split("T")[1]?.slice(0, 5) || "",
          price: booking.service?.price || 0,
          status: booking.status,
        }));

        setRecentBookings(formattedBookings);

        const today = new Date().toISOString();

        const { data: slotsData } = await supabase
          .from("time_slots")
          .select(
            `
            id,
            start_time,
            is_available,
            bookings(customer:profiles!customer_id(full_name))
          `
          )
          .eq("performer_id", performerId)
          .gte("start_time", today)
          .order("start_time", { ascending: true })
          .limit(5);

        const formattedSlots = (slotsData || []).map((slot) => ({
          date: slot.start_time.split("T")[0],
          time: slot.start_time.split("T")[1].slice(0, 5),
          available: slot.is_available,
          client: slot.bookings?.[0]?.customer?.full_name || null,
        }));

        setUpcomingSlots(formattedSlots);
      } catch (err) {
        console.error("[useOverviewStats] Ошибка загрузки:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [performerId]);

  return { stats, recentBookings, upcomingSlots, loading, error };
}
