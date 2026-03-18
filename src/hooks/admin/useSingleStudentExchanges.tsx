import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";
import { RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";
import { buildUrlWithFilterParams } from "../../utils/admin/filters";

/**
 * Gets the exchanges that a student made not involving any other student.
*/
export default (filterContext: RequestFiltersContextContent, pageIndex: number, pageSize: number) => {
  const getExchanges = async (url: string) => {
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
    buildUrlWithFilterParams(`${api.BACKEND_URL}/exchange/urgent/?page=${pageIndex}&page_size=${pageSize}`, filterContext),
    getExchanges
  );

  const exchanges = useMemo(() => data ? [].concat(...data["exchanges"]) : null, [data]);
  const totalPages = useMemo(() => data ? data["total_pages"] : null, [data]);

  return {
    exchanges,
    totalPages,
    error,
    loading: !data,
    mutate,
  };
};
