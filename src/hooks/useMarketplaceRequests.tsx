import { Buffer } from "buffer";
import useSWRInfinite from "swr/infinite";
import { MarketplaceRequest } from "../@types";
import api from "../api/backend";
import exchangeRequestService from "../api/services/exchangeRequestService";

/**
 * Hook to get the marketplace requests
 * @param courseUnitNameFilter - Set of course unit names to filter the requests by
 * @param typeFilter - Type of request                    
 * @param classesFilter - Set of dest classes to filter (hash of class-id,class_name_1,...,class_name_n)
 * 
*/
export default (courseUnitNameFilter: Set<number>, typeFilter: string, classesFilter: Map<string, Set<string>>) => {

  const classesFilterArray = Array.from(classesFilter, ([key, value]) => [key, Array.from(value)]);
  const classesFilterBase64 = btoa(JSON.stringify(classesFilterArray));
  const filters = `typeFilter=${typeFilter}&courseUnitNameFilter=${Array.from(courseUnitNameFilter).join(",")}&classesFilter=${classesFilterBase64}`;

  const getKey = (pageIndex: number) => {
    if (pageIndex === 0) return `${api.BACKEND_URL}/exchange/marketplace/?limit=10&${filters}`;

    return `${api.BACKEND_URL}/exchange/marketplace/?page=${pageIndex + 1}&limit=10&${filters}`;
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

