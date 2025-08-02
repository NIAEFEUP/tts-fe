import { useMemo } from "react";
import useSWR from "swr";
import exchangeRequestService from "../api/services/exchangeRequestService";

/**
 * This hook will send a request to the backend to verify the token
 */
export default (token: string) => {
  const { data, error, mutate, isLoading } = useSWR(token, exchangeRequestService.verifyExchangeRequest);
  const response = useMemo(() => data || { verified: false }, [data]);

  return {
    verified : response["verified"],
    expired : response["expired"],
    exchange_id : response["exchange_id"],
    error,
    loading: isLoading,
    mutate,
  };
};
