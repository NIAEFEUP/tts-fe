import { useMemo } from "react";
import api from "../api/backend";
import useSWRMutation from "swr/mutation";

export default (id: number) => {
    const isValid = async (url: string, { arg: id }: { arg: number }) => {
        try {
            const res = await fetch(`${api.BACKEND_URL}/exchange/direct/validate/${id}`);
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const { data, error, trigger, isMutating } = useSWRMutation(
        `${api.BACKEND_URL}/exchange/direct/validate/${id}`, 
        isValid
    );
    const directExchangeValid = useMemo(() => data ? data : null, [data]);

    return {
        directExchangeValid,
        error,
        trigger,
        isMutating
    };
};


