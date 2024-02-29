import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { LogoutForm } from "./LogoutForm";

export const LogoutDialog = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => { setOpen(true) }} type="button" className="bg-red-700 hover:bg-red-500 btn-lg">
                    Sair
                    <ArrowLeftEndOnRectangleIcon className="h-5 w-5 ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Pretendes sair da tua conta?</DialogTitle>
                </DialogHeader>
                <LogoutForm />
            </DialogContent>
        </Dialog>
    );
};
