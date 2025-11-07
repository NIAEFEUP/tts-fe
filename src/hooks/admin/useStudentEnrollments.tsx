import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";
import { RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";
import { buildUrlWithFilterParams } from "../../utils/admin/filters";

/**
 * Gets the exchanges that a student made not involving any other student.
*/
export default (filtersContext: RequestFiltersContextContent, pageIndex: number, pageSize: number) => {
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
    buildUrlWithFilterParams(`${api.BACKEND_URL}/course_unit/enrollment/?page=${pageIndex}&page_size=${pageSize}`, filtersContext),
    getEnrollments
  );

  const enrollments = useMemo(() => data ? [].concat(...data["enrollments"]) : null, [data]);
  const totalPages = useMemo(() => data ? data["total_pages"] : null, [data]);

  return {
    enrollments,
    totalPages,
    error,
    loading: !data,
    mutate,
  };
};

