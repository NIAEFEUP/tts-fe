import { Key } from "swr";
import { AdminRequestType, CreateRequestData, MarketplaceRequest } from "../../@types";
import api from "../backend";
import { startOfDay } from "date-fns";

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

  if(!isDirectExchange(requests.values()) && requests.values()[0]?.marketplace_id) formData.append("marketplace_id", requests.values()[0]?.marketplace_id);

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
    return json;
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
  token = atob(token);
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

const acceptDirectExchangeRequest = async (id: number) => {
  return fetch(`${api.BACKEND_URL}/exchange/direct/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    },
  });
}

const cancelMarketplaceRequest = async (id: number) => {
  return fetch(`${api.BACKEND_URL}/exchange/marketplace/${id}/cancel/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    },
  });
}

const addCourseExchangePeriod = async (startDate: Date, endDate: Date, selectedCourse: number) => {
  const formData = new FormData();
  formData.append("startDate", startDate.toISOString());
  formData.append("endDate", endDate.toISOString()); 
  formData.append("courseId" , selectedCourse.toString());
  return fetch(`${api.BACKEND_URL}/exchange/admin/course/${selectedCourse}/period/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    },
    body: formData
  });
}

const addCourseUnitExchangePeriod = async (startDate: Date, endDate: Date, selectedCourseUnit: number) => {
  const formData = new FormData();
  formData.append("startDate", startDate.toISOString());
  formData.append("endDate", endDate.toISOString());
  formData.append("courseId" , selectedCourseUnit.toString());
  return fetch(`${api.BACKEND_URL}/exchange/admin/course_unit/${selectedCourseUnit}/period/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    },
    body: formData
  });
}


const exchangeRequestService = {
  submitExchangeRequest,
  retrieveMarketplaceRequest,
  retrieveRequestCardMetadata,
  adminRejectExchangeRequest,
  adminAcceptExchangeRequest,
  adminMarkRequestAsAwaitingInformation,
  verifyExchangeRequest,
  acceptDirectExchangeRequest,
  cancelMarketplaceRequest,
  isDirectExchange,
  addCourseExchangePeriod,
  addCourseUnitExchangePeriod,
}

export default exchangeRequestService;