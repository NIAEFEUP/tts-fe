import { CreateRequestData } from "../@types";

const exchangeIsValid = (exchange: Array<CreateRequestData>) => {
  for (const request of exchange) {
    if (!request.classNameRequesterGoesFrom || !request.classNameRequesterGoesTo) return false;
  }

  return true;
}

const isDirectExchange = (exchanges: Array<CreateRequestData>) => {
  return exchanges.every((exchange) => exchange.other_student);
}

export enum DirectExchangePendingMotive {
  USER_DID_NOT_ACCEPT = 1,
  OTHERS_DID_NOT_ACCEPT = 2
}

const exchangeUtils = {
  exchangeIsValid,
  isDirectExchange,
}

export default exchangeUtils;


