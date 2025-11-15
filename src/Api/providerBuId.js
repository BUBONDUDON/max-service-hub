import { supabase } from "../lib/createClient";

/**
 * Загружает профиль мастера по ID
 * @param {string} providerId UUID мастера
 * @returns {Promise<Object>} данные мастера
 */
export async function fetchProviderById(providerId) {
  console.log("[API] Запрос профиля мастера с ID:", providerId);

  const profileResult = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      city,
      photo_url,
      performer_profiles!inner(
        bio,
        performer_tags!inner(tag)
      )
    `
    )
    .eq("id", providerId)
    .single();

  if (profileResult.error) {
    console.error("[API] Ошибка загрузки профиля:", profileResult.error);
    throw profileResult.error;
  }

  const profile = profileResult.data;

  const servicesResult = await supabase
    .from("services")
    .select(
      `
      id,
      name,
      description,
      price,
      duration_minutes,
      service_categories(name)
    `
    )
    .eq("service_categories.performer_id", providerId)
    .order("name", { ascending: true });

  if (servicesResult.error) {
    console.error("[API] Ошибка загрузки услуг:", servicesResult.error);
    throw servicesResult.error;
  }

  const services = servicesResult.data || [];

  const categoriesMap = {};
  services.forEach((s) => {
    const catName = s.service_categories?.name;
    if (!catName) return;
    if (!categoriesMap[catName]) categoriesMap[catName] = [];
    categoriesMap[catName].push({
      id: s.id,
      name: s.name,
      description: s.description || "",
      price: s.price,
      duration: s.duration_minutes,
    });
  });

  const servicesByCategory = Object.entries(categoriesMap).map(
    ([category, items]) => ({
      category,
      items,
    })
  );

  const slotsResult = await supabase
    .from("time_slots")
    .select("id, start_time, end_time, is_available")
    .eq("performer_id", providerId)
    .order("start_time", { ascending: true });

  if (slotsResult.error) {
    throw slotsResult.error;
  }

  const slots = slotsResult.data || [];

  const formattedSlots = slots.map((slot) => ({
    id: slot.id,
    date: slot.start_time.split("T")[0],
    time: slot.start_time.split("T")[1].slice(0, 5),
    available: slot.is_available,
  }));

  const result = {
    id: profile.id,
    name: profile.full_name,
    city: profile.city,
    description:
      profile.performer_profiles?.bio || "Информация временно недоступна",
    tags: profile.performer_profiles?.performer_tags?.map((t) => t.tag) || [],
    rating: 4.8,
    reviewCount: 0,
    avatar: profile.photo_url || null,
    services: servicesByCategory,
    timeSlots: formattedSlots,
  };

  console.log("[API] Итоговый объект мастера:", result);
  return result;
}
