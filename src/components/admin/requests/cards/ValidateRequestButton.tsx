import { useEffect, useState } from "react";
import useDirectExchangeValidation from "../../../../hooks/useDirectExchangeValidation";
import { Button } from "../../../ui/button"

type Props = {
    id: number;
    onValidation: (result: { valid: boolean; last_validated?: string | null }) => void;
}

export const ValidateRequestButton = ({ id, onValidation }: Props) => {
    const { trigger, isMutating } = useDirectExchangeValidation(id);

    return (
        <Button
            variant="secondary"
            onClick={async () => {
                const result = await trigger();
                onValidation(result); // <-- envia para o pai
            }}
        >
            {isMutating ? "..." : "Validar"}
        </Button>
    );
};