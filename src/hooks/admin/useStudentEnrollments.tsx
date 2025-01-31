import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";
import { RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";
import { buildUrlWithFilterParams } from "../../utils/admin/filters";

/**
 * Gets the exchanges that a student made not involving any other student.
*/
export default (filtersContext: RequestFiltersContextContent, pageIndex: number) => {
  const getEnrollments = async (url: string) => {
    try {
        const res = await fetch(url, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR(
    buildUrlWithFilterParams(`${api.BACKEND_URL}/course_unit/enrollment/?page=${pageIndex}`, filtersContext),
    getEnrollments
  );

  const enrollments = useMemo(() => data ? [].concat(...data) : null, [data]);

  return {
    enrollments,
    error,
    loading: !data,
    mutate,
  };
};

