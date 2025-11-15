import { supabase } from "../lib/createClient";

/**
 * Получает числовой ID пользователя по UUID
 * @param {string} authId UUID пользователя из Supabase Auth
 * @returns {Promise<number>} числовой ID пользователя
 */
export async function getUserIdByAuthId(authId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", authId)
    .single();

  if (error) {
    console.error("[User API] Ошибка получения ID:", error);
    throw error;
  }

  return data.id;
}

/**
 * Получает текущего авторизованного пользователя
 * @returns {Promise<{authId: string, userId: number}>}
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Пользователь не авторизован");
  }

  const userId = await getUserIdByAuthId(user.id);

  return {
    authId: user.id,
    userId: userId,
  };
}
