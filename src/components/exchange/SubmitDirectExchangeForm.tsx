import { useState, Dispatch, SetStateAction, useContext } from "react";
import { useForm } from "react-hook-form"
import { submitDirectExchange } from "../../api/backend";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import PulseLoader from "react-spinners/PulseLoader";
import { ClassExchange } from "../../@types";
import { ExchangeSelectionPreview } from "./ExchangeSelectionPreview";
import { ExchangeErrors } from "../../services/exchange/errors";
import { CheckCircleIcon, CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "../ui/use-toast";
import { DirectExchangeContext } from "../../contexts/DirectExchangeContext";

type Props = {
    dialogAction: Dispatch<SetStateAction<boolean>>,
    currentDirectExchange: Map<string, ClassExchange>
}

const directExchangeAction = (dialogAction) => {
    setTimeout(() => {
        dialogAction(false);

        toast({
            title: 'Troca submetida',
            description: 'A troca foi submetida com sucesso!',
            duration: 2000,
        })
    }, 1000);
}

const marketplacePostSubmissionAction = (dialogAction) => {

}

const exchangeSubmittedMiddleware = (marketplaceToggled: boolean, dialogAction) => {
    marketplaceToggled ? marketplacePostSubmissionAction(dialogAction) : directExchangeAction(dialogAction);
}

export const SubmitDirectExchangeForm = ({ dialogAction, currentDirectExchange }: Props) => {
    const [exchangeBeingProcessed, setExchangeBeingProcessed] = useState<boolean>(false);
    const [exchangeError, setExchangeError] = useState<string>();
    const [submitSuccessShow, setSubmitSuccessShow] = useState<boolean>(false);
    const form = useForm();
    const { marketplaceToggled } = useContext(DirectExchangeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setExchangeBeingProcessed(true);

        submitDirectExchange(Array.from(currentDirectExchange.values()), marketplaceToggled).then(async (res) => {
            setExchangeBeingProcessed(false);
            if (res.success) {
                setSubmitSuccessShow(true);

                exchangeSubmittedMiddleware(marketplaceToggled, dialogAction);
            }
            else {
                const content = await res.json();
                setExchangeError(ExchangeErrors[content.error]);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return <Form {...form}>
        {
            Array.from(currentDirectExchange.values()).map((exchange) => (
                <ExchangeSelectionPreview exchange={exchange} key={exchange.course_unit} />
            ))
        }
        <form method="POST" onSubmit={handleSubmit}>
            <Button className="p-5 w-full mt-2" type="submit">Submeter</Button>
        </form>

        {exchangeBeingProcessed ? <p className="text-center">A processar o pedido</p> : ""}
        <PulseLoader
            className="mx-auto"
            loading={exchangeBeingProcessed}
        />

        {submitSuccessShow && <>
            <CheckCircleIcon className="w-10 h-10 mx-auto success-text" />
            <p className="text-center success-text">Submetido com sucesso!</p>
        </>}

        {exchangeError && <>
            <ExclamationCircleIcon className="w-10 h-10 mx-auto error-text" />
            <p className="error-text text-center">{exchangeError}</p>
        </>}
    </Form>
}
