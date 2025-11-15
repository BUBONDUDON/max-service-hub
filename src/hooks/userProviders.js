import { useEffect, useState } from "react";
import { fetchProviders } from "../Api/providers";

export function useProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProviders();
        setProviders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);

  return { providers, loading, error };
}
