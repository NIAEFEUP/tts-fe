import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form"
import { submitDirectExchange } from "../../api/backend";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type Props = {
    dialogAction: Dispatch<SetStateAction<boolean>>
}

export const SubmitDirectExchangeForm = ({ dialogAction }: Props) => {
    const form = useForm();

    const handleSubmit = async (e) => {
        e.preventDefault();

        submitDirectExchange([
            {
                course_unit: "teste1",
                old_class: "3LEIC01",
                new_class: "3LEIC09",
                other_student: "202108880"
            },
            {
                course_unit: "teste1",
                old_class: "3LEIC06",
                new_class: "3LEIC10",
                other_student: "2021088819"
            },
        ]).then((res) => {
            dialogAction(false);
        }).catch((err) => {
            console.log(err);
        });
    }

    return <Form {...form}>
        <form method="POST" onSubmit={handleSubmit}>
            <Button className="p-5 w-full mt-2" type="submit">Submeter</Button>
        </form>
    </Form>
}
