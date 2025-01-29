import { useMemo } from "react";
import api from "../../api/backend";
import { RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";
import { buildUrlWithFilterParams } from "../../utils/admin/filters";
import useSWRInfinite from "swr/infinite";

/**
 * Gets the exchanges that involve multiple students.
*/
export default (filterContext: RequestFiltersContextContent) => {
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

  const { data, error, mutate, size, setSize } = useSWRInfinite((index) => {
    return buildUrlWithFilterParams(`${api.BACKEND_URL}/exchange/direct/?page=${index + 1}`, filterContext);
  }, getExchanges);
  const exchanges = useMemo(() => data ? [].concat(...data) : null, [data]);

  return {
    exchanges,
    error,
    size,
    setSize,
    loading: !data,
    mutate,
  };
};


