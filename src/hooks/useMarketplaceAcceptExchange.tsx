import { useMemo } from "react";
import useSWRMutation from "swr/mutation";
import { DirectExchangeRequest, ExchangeOption, MarketplaceRequest } from "../@types";
import exchangeRequestService from "../api/services/exchangeRequestService";

/**
 * This is used to submit a exchange proposal in the marketplace.
 * We need this hook to improve the readibility of the code to show a loading state and so on.
 */
export default (request: MarketplaceRequest | DirectExchangeRequest, selectedOptions: Map<string, boolean>) => {
    const submit = async () => {
        const exchangeRequests = new Map();
        for (const option of request.options) {
            if (selectedOptions.get(option.course_info.acronym)) {
                exchangeRequests.set(
                    option.course_info.id,
                    {
                        courseUnitId: option.course_info.id,
                        courseUnitName: option.course_info.name,
                        classNameRequesterGoesTo: (option as ExchangeOption).class_issuer_goes_from.name,
                        classNameRequesterGoesFrom: (option as ExchangeOption).class_issuer_goes_to.name,
                        other_student: {
                            name: request.issuer_name,
                            mecNumber: request.issuer_nmec
                        }
                    }
                );
            }
        }

        return exchangeRequestService.submitExchangeRequest(exchangeRequests, "");
    }

    const { data, error, trigger, isMutating } = useSWRMutation(
        `${request.id}`,
        submit
    );
    const directExchangeValid = useMemo(() => data ? data : null, [data]);

    return {
        directExchangeValid,
        error,
        trigger,
        isMutating
    };
};

