import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";

export default (courseId: number) => {
  const getClasses = async () => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/class/${courseId}/`, {
        credentials: "include"
      });

      if (res.ok) {
        const json = await res.json();

        return json;
      }

      return [];
    } catch (e) {
      console.error(e);
      return [];
    }

  }

  const { data, error, mutate, isValidating } = useSWR(`classes-of-${courseId}`, getClasses, {});

  const classes = useMemo(() => data ? data : null, [data]);

  return {
    classes,
    error,
    loading: !data,
    isValidating,
    mutate,
  };
};

