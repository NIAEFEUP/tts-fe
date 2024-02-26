import { useForm, useFormContext } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { login } from "../../api/backend";
import { ToastAction } from "../ui/toast"
import { useToast } from "../ui/use-toast"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export const LoginForm = ({
    setOpen
}) => {
    const form = useForm();
    const [errorMessages, setErrorMessages] = useState<{ name?: string, message?: string }>({});
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;

        const username = form.elements['username'].value;
        const password = form.elements['password'].value;

        let newErrorMessages = {};

        if (!username) {
            newErrorMessages = { ...newErrorMessages, uname: "Campo obrigatório" };
        }

        if(!password) {
            newErrorMessages = { ...newErrorMessages, pass: "Campo obrigatório" };
        }

        setErrorMessages(newErrorMessages);

        if(username && password) {
            login("feup", username, password)
            .then((res) => {
                if(!res.authenticated) {
                    newErrorMessages = { ...newErrorMessages, invalid_credentials: "Seu username ou senha estão incorretos" };
                    setErrorMessages(newErrorMessages);
                } else {
                    setOpen(false);
                    toast({
                        variant: "success",
                        title: "Login realizado com sucesso!",
                        description: "Você encontra-se logado.",
                        action: <ToastAction altText="Close">Fechar</ToastAction>,
                    });
                }
            })
            .catch((e) => {
                console.error(e);
                newErrorMessages = { ...newErrorMessages, login_error: "Ocorreu um erro durante o login." };
                setErrorMessages(newErrorMessages);
            });
        }
    }

    const renderErrorMessage = (name) => {
        return errorMessages[name] && (
            <div className="error text-red-500 flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                {errorMessages[name]}
            </div>
        );
    };

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
                            {renderErrorMessage("uname")}
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
                            {renderErrorMessage("pass")}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {renderErrorMessage("invalid_credentials")}
                <Button className="p-5 w-full mt-2" type="submit">Entrar</Button>     
                {renderErrorMessage("login_error")}
            </form>
        </Form>      
    );
};