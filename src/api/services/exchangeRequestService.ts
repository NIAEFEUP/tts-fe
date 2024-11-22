import { BareFetcher, Key } from "swr";
import { SWRInfiniteConfiguration } from "swr/dist/infinite";
import { CreateRequestData, MarketplaceRequest } from "../../@types";
import Cookies from 'js-cookie';
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

  return fetch(
    `${api.BACKEND_URL}/exchange/${isDirectExchange(requests.values()) ? "direct/" : "marketplace/"}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": api.getCSRFToken(),
      },
      body: formData
    },
  ).then(async (res) => {
    const json = await res.json();
    return json;
  }).catch((e) => {
    console.error(e);
  });
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
    if (res.ok) {
      return await res.json();
    }

    return [];
  }).catch((e) => {
    console.error(e);
    return [];
  });
}

const acceptDirectExchangeRequest = async (id: number) => {
  return fetch(`${api.BACKEND_URL}/exchange/direct/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    },
  }).then(async (res) => {
    const json = await res.json();
    return json;
  }).catch((e) => {
    console.error(e);
  });
}

const exchangeRequestService = {
  submitExchangeRequest,
  retrieveMarketplaceRequest,
  retrieveRequestCardMetadata,
  acceptDirectExchangeRequest
}

export default exchangeRequestService;
