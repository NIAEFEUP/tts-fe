import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";

export default () => {
  const isEligible = async () => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/student/exchange/eligible`, {
        credentials: "include",
      });

      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate, isLoading } = useSWR("", isEligible);
  const courseUnits = useMemo(() => data ? data : null, [data]);

  return {
    courseUnits,
    error,
    loading: isLoading,
    mutate,
  };
};

