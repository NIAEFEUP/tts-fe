import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { SessionContext } from "../../contexts/SessionContext";
import { useContext } from "react";

export const LogoutForm = ({ }) => {
    const { loggedIn, setLoggedIn } = useContext(SessionContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        localStorage.removeItem("username");
        setLoggedIn(false);
    }

    const form = useForm();

    return (
        <Form {...form}>
            <form method="GET" onSubmit={handleSubmit}>
                <Button className="p-5 bg-red-700 hover:bg-red-500 w-full mt-2" type="submit">Sair</Button>
            </form>
        </Form>

    );
};
