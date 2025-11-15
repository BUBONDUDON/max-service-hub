import { useEffect, useState, useCallback } from "react";
import {
  fetchPerformerServicesFlat,
  updateService,
  createService,
} from "../Api/services";
import { supabase } from "../lib/createClient";

export function usePerformerServicesFlat(performerId) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!performerId) return;
    let cancelled = false;

    supabase
      .from("service_categories")
      .select("id, name")
      .eq("performer_id", performerId)
      .then(({ data, error: catError }) => {
        if (!cancelled && !catError) {
          setCategories(data || []);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [performerId]);

  useEffect(() => {
    if (!performerId) return;
    let cancelled = false;

    setLoading(true);
    fetchPerformerServicesFlat(performerId)
      .then((data) => {
        if (!cancelled) setServices(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [performerId]);

  const editService = useCallback(async (serviceId, updates) => {
    try {
      await updateService(serviceId, updates);

      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                name: updates.name,
                description: updates.description,
                price: Number(updates.price),
                duration: Number(updates.duration),
              }
            : s
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const addService = useCallback(async (serviceData) => {
    try {
      const newService = await createService(serviceData);

      setServices((prev) => [...prev, newService]);

      return newService;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const addCategory = useCallback(
    async (categoryData) => {
      try {
        const { data, error: insertError } = await supabase
          .from("service_categories")
          .insert({
            performer_id: performerId,
            name: categoryData.name,
            description: categoryData.description || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setCategories((prev) => [...prev, data]);

        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [performerId]
  );

  return {
    services,
    categories,
    loading,
    error,
    editService,
    addService,
    addCategory,
  };
}
