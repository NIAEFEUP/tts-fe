import { useMemo } from "react";
import useSWR from "swr";
import { CreateRequestData } from "../../@types";
import exchangeRequestService from "../../api/services/exchangeRequestService";

export default (requestKeys: string, requests: Map<number, CreateRequestData>) => {
  const getRelatedExchange = async () => {
    try {
      const res = await exchangeRequestService.getRelatedExchanges(requests);

      if (res.ok) {
        return await res.json();
      }

      return [];
    } catch (e) {
      console.error(e);
      return [];
    }

  }

  const { data, error, mutate, isValidating } = useSWR(`${requestKeys}`, getRelatedExchange, {});
  const relatedExchanges = useMemo(() => data ? data.exchanges : null, [data]);

  return {
    relatedExchanges,
    error,
    loading: !data,
    isValidating,
    mutate,
  };
};

