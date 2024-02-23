import { LoginForm } from "./LoginForm";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";

export const LoginDialog = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => { setOpen(true) }} type="button" className="btn btn-primary btn-lg">
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Log-In</DialogTitle>
                    <DialogDescription className="text-center">
                        Entra com as tuas credencias do sigarra.
                    </DialogDescription>
                </DialogHeader>
                <LoginForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
};
