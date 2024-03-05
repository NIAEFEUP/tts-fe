import { useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form"
import { submitDirectExchange } from "../../api/backend";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import PulseLoader from "react-spinners/PulseLoader";

type Props = {
    dialogAction: Dispatch<SetStateAction<boolean>>
}

export const SubmitDirectExchangeForm = ({ dialogAction }: Props) => {
    const [exchangeBeingProcessed, setExchangeBeingProcessed] = useState<boolean>(false);
    const form = useForm();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setExchangeBeingProcessed(true);

        submitDirectExchange([
            {
                course_unit: "CG",
                old_class: "3LEIC09",
                new_class: "3LEIC11",
                other_student: "202108752"
            },
        ]).then((res) => {
            setExchangeBeingProcessed(false);
            if (res.ok) {
                dialogAction(false);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return <Form {...form}>
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
