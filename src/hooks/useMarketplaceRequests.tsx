import useSWRInfinite from "swr/infinite";
import { MarketplaceRequest } from "../@types";
import api from "../api/backend";
import exchangeRequestService from "../api/services/exchangeRequestService";

export default () => {

  const getKey = (pageIndex: number) => {
    if (pageIndex === 0) return `${api.BACKEND_URL}/exchange/marketplace/?limit=10`;

    return `${api.BACKEND_URL}/exchange/marketplace/?page=${pageIndex}&limit=10`;
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

