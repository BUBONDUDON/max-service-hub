import { useState, useCallback } from "react";
import { createService } from "../Api/services";

export function useCreateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addService = useCallback(async (serviceData) => {
    try {
      setLoading(true);
      setError(null);
      const newService = await createService(serviceData);
      return newService;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addService, loading, error };
}
