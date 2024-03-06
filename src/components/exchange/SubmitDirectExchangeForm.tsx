import { useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form"
import { submitDirectExchange } from "../../api/backend";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import PulseLoader from "react-spinners/PulseLoader";
import { ClassExchange } from "../../@types";
import { ExchangeSelectionPreview } from "./ExchangeSelectionPreview";

type Props = {
    dialogAction: Dispatch<SetStateAction<boolean>>,
    currentDirectExchange: Map<string, ClassExchange>
}

export const SubmitDirectExchangeForm = ({ dialogAction, currentDirectExchange }: Props) => {
    const [exchangeBeingProcessed, setExchangeBeingProcessed] = useState<boolean>(false);
    const form = useForm();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setExchangeBeingProcessed(true);

        submitDirectExchange(Array.from(currentDirectExchange.values())).then((res) => {
            setExchangeBeingProcessed(false);
            if (res.ok) {
                dialogAction(false);
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
    </Form>
}
