import { useForm, useFormContext } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { login } from "../../api/backend";

export const LoginForm = ({
    setOpen
}) => {
    const form = useForm();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;

        const username = form.elements['username'].value;
        const password = form.elements['password'].value;

        await login("feup", username, password);

        setOpen(false);
    }

    return (
        <Form {...form}>
            <form method="POST" onSubmit={handleSubmit}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input name={field.name} value={field.value} placeholder="Username (ex: 2021xxxxx)" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input name={field.name} value={field.value} type="password" placeholder="Password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="p-5 w-full mt-2" type="submit">Submit</Button>
            </form>
        </Form>

    );
};
