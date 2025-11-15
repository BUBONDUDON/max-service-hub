import { supabase } from "../lib/createClient";

export async function fetchProviders() {
  try {
    const { data: profiles, error: profilesError } = await supabase
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
      .order("full_name", { ascending: true });

    console.log("[DEBUG] Profiles data:", profiles);
    console.log("[DEBUG] Profiles error:", profilesError);

    if (profilesError) {
      console.error("[API] Supabase error:", profilesError);
      throw new Error(`Ошибка загрузки мастеров: ${profilesError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.full_name,
      city: profile.city,
      description:
        profile.performer_profiles.bio || "Информация временно недоступна",
      tags: profile.performer_profiles.performer_tags.map((t) => t.tag) || [],
      rating: 4.8,
      reviewCount: 0,
      priceFrom: 1000,
      categories: [],
      avatar: profile.photo_url || null,
    }));
  } catch (error) {
    console.error("[API] Ошибка загрузки мастеров:", error);
    throw new Error("Не удалось загрузить список мастеров");
  }
}
