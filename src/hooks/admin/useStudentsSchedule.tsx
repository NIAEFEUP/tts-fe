import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (nmec: string) => {
  const getSchedule = async () => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/student/${nmec}/schedule`, {
        credentials: "include"
      });

      if (res.ok) {
        return await res.json();
      }

      return [];
    } catch (e) {
      console.error(e);
      return [];
    }

  }

  const { data, error, mutate, isValidating } = useSWR("schedule", getSchedule, {});
  const schedule = useMemo(() => data ? data.schedule : null, [data]);
  const sigarraSynced = data ? data.noChanges : null;

  return {
    schedule,
    sigarraSynced,
    error,
    loading: !data,
    isValidating,
    mutate,
  };
};

