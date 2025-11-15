import { supabase } from "../lib/createClient";

export async function fetchPerformerServicesFlat(performerId) {
  try {
    const { data: categories, error: catError } = await supabase
      .from("service_categories")
      .select("id, name")
      .eq("performer_id", performerId);

    if (catError) throw catError;
    if (!categories?.length) return [];

    const categoryIds = categories.map((c) => c.id);

    const { data: services, error: servError } = await supabase
      .from("services")
      .select("id, name, description, price, duration_minutes, category_id")
      .in("category_id", categoryIds)
      .order("id", { ascending: true });

    if (servError) throw servError;

    const categoriesById = Object.fromEntries(
      categories.map((c) => [c.id, c.name])
    );

    return services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: Number(s.price),
      duration: s.duration_minutes,
      category: categoriesById[s.category_id] || "Без категории",
    }));
  } catch (error) {
    console.error("[API] Ошибка загрузки услуг мастера:", error);
    return [];
  }
}

export async function updateService(serviceId, updates) {
  try {
    const { data, error } = await supabase
      .from("services")
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        duration_minutes: updates.duration,
        category_id: updates.category_id,
      })
      .eq("id", serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[API] Ошибка обновления услуги:", err);
    throw new Error("Не удалось обновить услугу");
  }
}

export async function createService(serviceData) {
  try {
    const { data, error } = await supabase
      .from("services")
      .insert([
        {
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          duration_minutes: serviceData.duration,
          category_id: serviceData.category_id,
        },
      ])
      .select(
        `
        id,
        name,
        description,
        price,
        duration_minutes,
        category_id,
        service_categories ( name )
      `
      )
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      duration: data.duration_minutes,
      category: data.service_categories?.name || "Без категории",
    };
  } catch (err) {
    console.error("[API] Ошибка создания услуги:", err);
    throw new Error("Не удалось создать услугу");
  }
}

export async function deleteService(serviceId) {
  try {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("[API] Ошибка удаления услуги:", err);
    throw new Error("Не удалось удалить услугу");
  }
}
