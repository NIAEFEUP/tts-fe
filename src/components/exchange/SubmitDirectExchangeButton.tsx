import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { SubmitDirectExchangeForm } from "./SubmitDirectExchangeForm";

export const SubmitDirectExchangeButton = () => {
    const [open, setOpen] = useState<boolean>(false);

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => { setOpen(true) }} variant="submit" className="w-full"><CheckCircleIcon className="h-5 w-5 mr-2"></CheckCircleIcon>Submeter Troca</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Confirmação de sumbissão de troca direta</DialogTitle>
                    <DialogDescription className="text-center">
                        Após a submissão, tanto tu como o estudante com o qual especificaste na troca terão de clicar num link de confirmação para que a
                        troca se efetue de facto.
                    </DialogDescription>
                    <SubmitDirectExchangeForm dialogAction={setOpen} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </>
}
