import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";
import { RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";
import { buildUrlWithFilterParams } from "../../utils/admin/filters";

/**
 * Gets the exchanges that a student made not involving any other student.
*/
export default (filtersContext: RequestFiltersContextContent) => {
  const url = buildUrlWithFilterParams(`${api.BACKEND_URL}/exchange/direct/`, filtersContext);

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

  const { data, error, mutate } = useSWR(url, getExchanges);
  const exchanges = useMemo(() => data ? data : null, [data]);

  return {
    exchanges,
    error,
    loading: !data,
    mutate,
  };
};
