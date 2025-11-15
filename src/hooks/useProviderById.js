import { useState, useEffect } from "react";
import { fetchProviderById } from "../Api/providerBuId";

export function useProviderById(providerId) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProvider = async () => {
    if (!providerId) {
      setError("ID мастера не указан");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchProviderById(providerId);
      setProvider(data);
    } catch (err) {
      console.error("[Hook] Ошибка загрузки профиля:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvider();
  }, [providerId]);

  const refetch = () => {
    loadProvider();
  };

  return { provider, loading, error, refetch };
}
