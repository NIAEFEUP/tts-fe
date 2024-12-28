import { Key } from "swr";
import { CreateRequestData, MarketplaceRequest } from "../../@types";
import api from "../backend";

const isDirectExchange = (requests: IterableIterator<CreateRequestData>) => {
  for (const request of requests) {
    if (!request.other_student) return false;
  }

  return true;
}

const submitExchangeRequest = async (requests: Map<number, CreateRequestData>) => {
  const formData = new FormData();

  for (const request of requests.values()) {
    formData.append("exchangeChoices[]", JSON.stringify(request));
  }

  try {
    const res = await fetch(
      `${api.BACKEND_URL}/exchange/${isDirectExchange(requests.values()) ? "direct/" : "marketplace/"}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": api.getCSRFToken(),
        },
        body: formData
      }
    );

    return res;
  } 
  catch (error) 
  {
    console.error(error);
    throw new Error("Network error");
  }
}

const retrieveMarketplaceRequest = async (url: string): Promise<MarketplaceRequest[]> => {
  return fetch(url).then(async (res) => {
    const json = await res.json();
    return json.data;
  }).catch((e) => {
    console.error(e);
    return [];
  })
}

const retrieveRequestCardMetadata = async (courseUnitId: Key) => {
  return fetch(`${api.BACKEND_URL}/course_unit/${courseUnitId}/exchange/metadata`).then(async (res) => {
    if (!res.ok) return [];
    return await res.json();
  }).catch((e) => {
    console.error(e);
    return [];
  });
}

const exchangeRequestService = {
  submitExchangeRequest,
  retrieveMarketplaceRequest,
  retrieveRequestCardMetadata
}

export default exchangeRequestService;
