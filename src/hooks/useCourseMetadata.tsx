import useSWRInfinite from "swr/infinite";
import { MarketplaceRequest } from "../@types";
import api from "../api/backend";
import exchangeRequestService from "../api/services/exchangeRequestService";

export default (filter: string) => {
  const getKey = (pageIndex: number) => {
    if (pageIndex === 0) return `${api.BACKEND_URL}/exchange/marketplace/?limit=10`;

    return `${api.BACKEND_URL}/exchange/marketplace/?page=${pageIndex + 1}&limit=10&filter=${filter}`;
  }

  const { data, size, setSize, isLoading } = useSWRInfinite<Promise<MarketplaceRequest[]>>(
    getKey,
    exchangeRequestService.retrieveMarketplaceRequest
  );

  return {
    data,
    isLoading,
    size,
    setSize
  }
};

