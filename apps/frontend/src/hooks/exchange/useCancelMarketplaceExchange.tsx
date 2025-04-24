import useSWRMutation from "swr/mutation";
import exchangeRequestService from "../../api/services/exchangeRequestService";

export default (id: number) => {
    const submit = async () => {
       return await exchangeRequestService.cancelMarketplaceRequest(id);
    }

    const { error, trigger, isMutating } = useSWRMutation(
        `${id}`,
        submit
    );

    return {
        error,
        trigger,
        isMutating
    };
};



