import { CreateRequestData } from "../../@types";
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
    `${api.BACKEND_URL}/${isDirectExchange(requests.values()) ? "direct_exchange/" : "marketplace_exchange/"}`,
    {
      method: "POST",
      credentials: "include",
      body: formData
    },
  );
}

const exchangeRequestService = {
  submitExchangeRequest
}

export default exchangeRequestService;
