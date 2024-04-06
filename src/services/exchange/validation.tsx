import { ClassExchange } from "../../@types";

export const validateExchangeChoices = (exchangeChoices: Map<string, ClassExchange>, marketplaceSubmission: boolean) => {
    if (marketplaceSubmission) return exchangeChoices.size > 0;

    for (const exchange of Array.from(exchangeChoices.values())) {
        if (exchange.other_student === "" || exchange.old_class === "") {
            return false;
        }
    }

    return exchangeChoices.size > 0;
}
