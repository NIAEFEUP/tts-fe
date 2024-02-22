import { useForm, useFormContext} from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { login } from "../../api/backend";

export const LoginForm = () => {
    const form = useForm();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;

        const username = form.elements['username'].value;
        const password = form.elements['username'].value;
        
        await login("feup", username, password);
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
                        <Input placeholder="Username (ex: 2021xxxxx)" {...field} />
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
                        <Input type="password" placeholder="Password" {...field} />
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