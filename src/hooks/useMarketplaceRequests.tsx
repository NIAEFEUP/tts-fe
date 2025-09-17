import useSWRInfinite from "swr/infinite";
import { MarketplaceRequest } from "../@types";
import api from "../api/backend";
import exchangeRequestService from "../api/services/exchangeRequestService";
import { useEffect, useState } from "react";

const getUrl = (requestType: string) => {
  switch (requestType) {
    case "all":
      return `exchange/marketplace`;
    case "mine":
      return `student/exchange/sent`;
    case "received":
      return `student/exchange/received`;
  }
}

/**
 * Hook to get the marketplace requests
 * @param courseUnitNameFilter - Set of course unit names to filter the requests by
 * @param typeFilter - Type of request                    
 * @param classesFilter - Set of dest classes to filter (hash of class-id,class_name_1,...,class_name_n)
 * 
*/
export default (courseUnitNameFilter: Set<number>, requestType: string, classesFilter: Map<string, Set<string>>) => {
  const [hasNext, setHasNext] = useState<boolean>(true);

  const classesFilterArray = Array.from(classesFilter, ([key, value]) => [key, Array.from(value)]);
  const classesFilterBase64 = btoa(JSON.stringify(classesFilterArray));
  const filters = `courseUnitNameFilter=${Array.from(courseUnitNameFilter).join(",")}&classesFilter=${classesFilterBase64}`;

  const getKey = (pageIndex: number) => {
    if (pageIndex === 0) return `${api.BACKEND_URL}/${getUrl(requestType)}/?limit=10&${filters}`;

    return `${api.BACKEND_URL}/${getUrl(requestType)}/?page=${pageIndex + 1}&limit=10&${filters}`;
  }

  const { data, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite<Promise<MarketplaceRequest[]>>(
    getKey,
    exchangeRequestService.retrieveMarketplaceRequest
  );
  const updateUrgentRequest = async (id: number, message: string) => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/exchange/urgent/`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', [api.csrfTokenName()]: api.getCSRFToken() },
        body: JSON.stringify({ urgent_request_id: id, message: message })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to update urgent request', res.status, text);
        return null;
      }

      const updated = await res.json();

      if (mutate) {
        mutate((pages: any) => {
          if (!pages) return pages;
          return pages.map((page: any) => {
            if (!page || !page.data) return page;
            return {
              ...page,
              data: page.data.map((req: any) => req.id === id ? { ...req, ...updated } : req)
            }
          })
        }, { revalidate: false });
      }

      return updated;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  
  const requests = data ? [].concat(...data.map((el) => el["data"])) : [];

  useEffect(() => {
    if(data) {
      const page = data[data.length - 1]["page"];
      if(page) setHasNext(page["has_next"]);
    }
  }, [data])

  return {
    requests,
    hasNext,
    isLoading,
    size,
    isValidating,
    setSize,
    updateUrgentRequest

  }
};

