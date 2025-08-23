import { useEffect, useState } from "react";
import useDirectExchangeValidation from "../../../../hooks/useDirectExchangeValidation";
import { Button } from "../../../ui/button";

type Props = {
  id: number;
  onValidation?: (result: ValidationResponse) => void;
};

type ValidationResponse = {
  valid: boolean;
  last_validated?: string | null;
};

export const ValidateRequestButton = ({
    id,
    onValidation 
}: Props) => {
    const { trigger, isMutating } = useDirectExchangeValidation(id);
    const [validateResult, setValidateResult] = useState<ValidationResponse | null>(null);

    useEffect(() => {
        if(validateResult === null) return;

        const timeout = setTimeout(() => {
            setValidateResult(null);
        }, 4000);

        return () => clearTimeout(timeout);
    }, [validateResult]);

    return (<div className="flex flex-col gap-y-2">
        <Button
            variant="secondary"
            onClick={async () => {
            const result = await trigger(id);
            console.log("Validation result:", result);
            setValidateResult(result);
            if (onValidation) {
                onValidation(result);
            }
            }}
        >
            {isMutating
                ? <p>...</p>
                : <p>Validar</p>
            }
        </Button>
        <p>
            {validateResult === null
                ? <></>
                : (
                    <>
                        {validateResult
                            ? <p>Válido</p>
                            : <p>Inválido!</p>
                        }
                    </>
                )
            }
        </p>
    </div>
    );
};
