import { useMemo } from "react";
import api from "../api/backend";
import useSWRMutation from "swr/mutation";

type ValidationResponse = {
    valid: boolean;
    last_validated?: string;
};

export default (id: number) => {
    const validateRequest = async (
        url: string,
        { arg: id }: { arg: number }
    ): Promise<ValidationResponse> => {
        try {
            const res = await fetch(`${api.BACKEND_URL}/exchange/direct/validate/${id}`);
            if (!res.ok) return { valid: false };

            return await res.json();
        } catch (error) {
            console.error(error);
            return { valid: false };
        }
    };

    const { data, error, trigger, isMutating } = useSWRMutation(
        `${api.BACKEND_URL}/exchange/direct/validate/${id}`,
        validateRequest
    );

    const directExchangeValid = useMemo(() => data?.valid ?? null, [data]);
    const lastValidated = useMemo(() => data?.last_validated ?? null, [data]);

    return {
        directExchangeValid,
        last_validated,
        error,
        trigger,
        isMutating
    };
};


