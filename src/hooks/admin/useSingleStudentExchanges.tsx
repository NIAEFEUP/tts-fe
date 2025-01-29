import { useMemo } from "react";
import api from "../../api/backend";
import useSWRInfinite from "swr/infinite";
import { RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";
import { buildUrlWithFilterParams } from "../../utils/admin/filters";

/**
 * Gets the exchanges that a student made not involving any other student.
*/
export default (filtersContext: RequestFiltersContextContent) => {
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
    return buildUrlWithFilterParams(`${api.BACKEND_URL}/exchange/urgent/?page=${index + 1}`, filtersContext);
  }, getExchanges);

  const exchanges = useMemo(() => data ? [].concat(...data) : null, [data]);

  return {
    exchanges,
    size,
    setSize,
    error,
    loading: !data,
    mutate,
  };
};
