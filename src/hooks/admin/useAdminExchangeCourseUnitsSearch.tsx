import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (query: string = "") => {
  const getCourseUnits = async (q: string) => {
    try {
      const url = new URL(`${api.BACKEND_URL}/exchange/admin/course_units/search/`);
      if (q) url.searchParams.set('q', q);
      const res = await fetch(url.toString(), {
        credentials: "include",
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR(`admin-exchange-course-units-search-${query}`, () => getCourseUnits(query));
  const courseUnits = useMemo(() => (data ? data.course_units ?? data : null), [data]);

  return {
    courseUnits,
    error,
    loading: !data,
    mutate,
  };
};