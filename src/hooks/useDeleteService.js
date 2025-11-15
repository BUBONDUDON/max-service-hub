import { useState, useCallback } from "react";
import { deleteService } from "../Api/services";

export function useDeleteService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeService = useCallback(async (serviceId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteService(serviceId);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeService, loading, error };
}
