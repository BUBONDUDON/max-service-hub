import { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/createClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isProvider, setIsProvider] = useState(false);
  const [performerProfile, setPerformerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const wa = window.WebApp;
      if (!wa || !wa.initDataUnsafe?.user) {
        throw new Error("MAX WebApp не инициализирован");
      }

      const maxUser = wa.initDataUnsafe.user;
      const userId = maxUser.id;

      let photoUrl = null;
      if (maxUser.photo_url) {
        photoUrl = maxUser.photo_url;
      }

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select(
          `
          *,
          performer_profiles (
            id,
            bio
          )
        `
        )
        .eq("id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (!profile) {
        const fullName = `${maxUser.first_name} ${
          maxUser.last_name || ""
        }`.trim();

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: fullName,
            city: null,
            photo_url: photoUrl,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setUser(newProfile);
        setIsProvider(false);
        setPerformerProfile(null);
      } else {
        if (profile.photo_url !== photoUrl) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ photo_url: photoUrl })
            .eq("id", userId);

          if (updateError) {
            console.error("[AuthContext] Ошибка обновления фото:", updateError);
          }
        }

        setUser({ ...profile, photo_url: photoUrl });
        setIsProvider(!!profile.performer_profiles);
        setPerformerProfile(profile.performer_profiles || null);
      }
    } catch (err) {
      console.error("[AuthContext] Ошибка инициализации:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(data);
      return data;
    } catch (err) {
      console.error("[AuthContext] Ошибка обновления профиля:", err);
      throw err;
    }
  };

  const becomeProvider = async (bio) => {
    try {
      const { data, error } = await supabase
        .from("performer_profiles")
        .insert({
          id: user.id,
          bio: bio,
        })
        .select()
        .single();

      if (error) throw error;

      setIsProvider(true);
      setPerformerProfile(data);
      return data;
    } catch (err) {
      console.error("[AuthContext] Ошибка создания профиля исполнителя:", err);
      throw err;
    }
  };

  const updatePerformerProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from("performer_profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setPerformerProfile(data);
      return data;
    } catch (err) {
      console.error(
        "[AuthContext] Ошибка обновления профиля исполнителя:",
        err
      );
      throw err;
    }
  };

  const value = {
    user,
    isProvider,
    performerProfile,
    loading,
    error,
    updateProfile,
    becomeProvider,
    updatePerformerProfile,
    refetch: initializeUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
