import { useEffect, useState } from "react";
import useDirectExchangeValidation from "../../../../hooks/useDirectExchangeValidation";
import { Button } from "../../../ui/button"

type Props = {
    id: number
}

export const ValidateRequestButton = ({
    id
}: Props) => {
    const { trigger, isMutating } = useDirectExchangeValidation(id);
    const [validateResult, setValidateResult] = useState<boolean | null>(null);

    useEffect(() => {
        if(validateResult === null) return;

        const timeout = setTimeout(() => {
            setValidateResult(null);
        }, 4000)

        return () => clearTimeout(timeout);
    }, [validateResult, setValidateResult])

    return (<div className="flex flex-col gap-y-2">
        <Button
            variant="secondary"
            onClick={async () => {
                setValidateResult(await trigger(id));
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
    )
}