import { useMemo } from "react";
import api from "../../api/backend";
import { RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";
import { buildUrlWithFilterParams } from "../../utils/admin/filters";
import useSWR from "swr";

/**
 * Gets the exchanges that involve multiple students.
*/
export default (filterContext: RequestFiltersContextContent, pageIndex: number) => {
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
    buildUrlWithFilterParams(`${api.BACKEND_URL}/exchange/direct/?page=${pageIndex}`, filterContext), getExchanges
  );
  const exchanges = useMemo(() => data ? [].concat(...data) : null, [data]);

  return {
    exchanges,
    error,
    loading: !data,
    mutate,
  };
};


