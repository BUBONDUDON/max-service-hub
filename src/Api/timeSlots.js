import { supabase } from "../lib/createClient";

export async function fetchSlots(performerId) {
  try {
    const { data, error } = await supabase
      .from("time_slots")
      .select("*")
      .eq("performer_id", performerId)
      .order("start_time", { ascending: true });

    if (error) throw error;

    return data.map((slot) => ({
      id: slot.id,
      start: slot.start_time,
      end: slot.end_time,
      available: slot.is_available,
    }));
  } catch (err) {
    console.error("[API] Ошибка загрузки слотов:", err);
    throw new Error("Не удалось загрузить слоты");
  }
}

export async function createSlot({ performer_id, start_time, end_time }) {
  try {
    console.log("🟢 [API-1] Получили данные для создания:", {
      start_time,
      end_time,
    });

    const { data, error } = await supabase
      .from("time_slots")
      .insert([
        {
          performer_id,
          start_time,
          end_time,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    console.log("🟢 [API-2] Ответ от Supabase:", {
      start_time: data.start_time,
      end_time: data.end_time,
    });

    const result = {
      id: data.id,
      start: data.start_time,
      end: data.end_time,
      available: data.is_available,
    };

    console.log("🟢 [API-3] Возвращаем после обработки:", result);

    return result;
  } catch (err) {
    console.error("❌ [API] Ошибка создания слота:", err);
    throw new Error("Не удалось создать слот");
  }
}

export async function updateSlot(id, updateData) {
  try {
    const { data, error } = await supabase
      .from("time_slots")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return {
      id: data.id,
      start: data.start_time,
      end: data.end_time,
      available: data.is_available,
    };
  } catch (err) {
    console.error("[API] Ошибка обновления слота:", err);
    throw new Error("Не удалось обновить слот");
  }
}

export async function deleteSlot(id) {
  try {
    const { error } = await supabase.from("time_slots").delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (err) {
    console.error("[API] Ошибка удаления слота:", err);
    throw new Error("Не удалось удалить слот");
  }
}
