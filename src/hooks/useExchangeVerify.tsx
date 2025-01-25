import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";
import exchangeRequestService from "../api/services/exchangeRequestService";

/**
 * This hook will send a request to the backend to verify the token
 */
export default (token: string) => {
  const { data, error, mutate, isLoading } = useSWR(token, exchangeRequestService.verifyExchangeRequest);
  const verified = useMemo(() => data ? data : null, [data]);

  return {
    verified,
    error,
    loading: isLoading,
    mutate,
  };
};
