import { Key } from "swr";
import { AdminRequestType, CreateRequestData, MarketplaceRequest } from "../../@types";
import api from "../backend";

const isDirectExchange = (requests: IterableIterator<CreateRequestData>) => {
  for (const request of requests) {
    if (!request.other_student) return false;
  }

  return true;
}

const submitExchangeRequest = async (requests: Map<number, CreateRequestData>, urgentMessage: string = "") => {
  const formData = new FormData();

  for (const request of requests.values()) {
    formData.append("exchangeChoices[]", JSON.stringify(request));
  }

  if (urgentMessage !== "") formData.append("urgentMessage", urgentMessage);

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

const adminRejectExchangeRequest = async (requestType: AdminRequestType, id: number) => {
  return fetch(`${api.BACKEND_URL}/exchange/admin/request/${requestType}/${id}/reject/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    }
  });
}

const adminAcceptExchangeRequest = async (requestType: AdminRequestType, id: number) => {
  return fetch(`${api.BACKEND_URL}/exchange/admin/request/${requestType}/${id}/accept/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    }
  })
}

const adminMarkRequestAsAwaitingInformation = async (requestType: AdminRequestType, id: number) => {
  return fetch(`${api.BACKEND_URL}/exchange/admin/request/${requestType}/${id}/awaiting-information/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    }
  })
}

const verifyExchangeRequest = async (token: string): Promise<boolean>=> {
  return fetch(`${api.BACKEND_URL}/exchange/verify/${token}`, {
    method: "POST",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    }
  }).then(async (res) => {
    if(res.ok) {
      const json = await res.json();
      return json.verified;
    } else {
      return false;
    }
  }).catch((e) => {
    console.error(e);
    return false;
  });
}

const exchangeRequestService = {
  submitExchangeRequest,
  retrieveMarketplaceRequest,
  retrieveRequestCardMetadata,
  adminRejectExchangeRequest,
  adminAcceptExchangeRequest,
  adminMarkRequestAsAwaitingInformation,
  verifyExchangeRequest
}

export default exchangeRequestService;
