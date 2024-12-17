import useSWRInfinite from "swr/infinite";
import { MarketplaceRequest } from "../@types";
import api from "../api/backend";
import exchangeRequestService from "../api/services/exchangeRequestService";

export default () => {
  const getKey = (pageIndex: number) => {
    if (pageIndex === 0) return `${api.BACKEND_URL}/student/exchange/received/?limit=10`;

    return `${api.BACKEND_URL}/student/exchange/received/?page=${pageIndex + 1}&limit=10`;
  }

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<Promise<MarketplaceRequest[]>>(
    getKey,
    exchangeRequestService.retrieveMarketplaceRequest
  );

  return {
    data,
    isLoading,
    size,
    isValidating,
    setSize
  }
};

