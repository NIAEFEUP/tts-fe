import { BareFetcher } from "swr";
import { SWRInfiniteConfiguration } from "swr/dist/infinite";
import { CreateRequestData, MarketplaceRequest } from "../../@types";
import api from "../backend";

const isDirectExchange = (requests: IterableIterator<CreateRequestData>) => {
  for (const request of requests) {
    if (!request.other_student) return false;
  }

  return true;
}

const submitExchangeRequest = async (requests: Map<string, CreateRequestData>) => {
  const formData = new FormData();

  for (const request of requests.values()) {
    formData.append("requestChoices[]", JSON.stringify(request));
  }

  await fetch(
    `${api.BACKEND_URL}/exchange/${isDirectExchange(requests.values()) ? "direct/" : "marketplace/"}`,
    {
      method: "POST",
      credentials: "include",
      body: formData
    },
  );
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

const exchangeRequestService = {
  submitExchangeRequest,
  retrieveMarketplaceRequest
}

export default exchangeRequestService;
