import { useState, useContext } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { DirectExchangeStatus, ClassExchange } from "../../@types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MoonLoader } from "react-spinners";
import { DirectExchangeStatusCard } from "./DirectExchangeStatusCard"
import { SessionContext } from "../../contexts/SessionContext";
import { useExchangeHistory } from "../../api/hooks/useExchangeHistory";

export const DirectExchangeHistoryButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const {
        data: exchanges,
        isLoading: isLoadingHistory,
        isValidating: isValidatingHistory
    } = useExchangeHistory(loggedIn);
    
    let pending;
    let accepted;
    if(!isLoadingHistory) {
        pending = exchanges.filter((exchange) => exchange.status === "pending");
        accepted = exchanges.filter((exchange) => exchange.status === "accepted");
   }

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="submit"
                    className="w-full"
                >
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Ver histórico
                </Button>
            </DialogTrigger>
            <DialogContent className="h-5/6 content-start">
                <DialogHeader className="">
                    <DialogTitle className="text-center">Histórico de trocas diretas</DialogTitle>
                    <DialogDescription className="text-center"></DialogDescription>
                </DialogHeader>
                {!isLoadingHistory ? 

                    <Tabs defaultValue="pending" className="w-full overflow-scroll">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pending">Pendentes</TabsTrigger>
                            <TabsTrigger value="accepted">Aceites</TabsTrigger>
                        </TabsList>
                        <TabsContent className="p-2" value="pending"> {
                                pending.length > 0 ?

                                    <div className="flex flex-col space-y-4"> {
                                    pending.map((exchange) => (
                                        <DirectExchangeStatusCard key={exchange.id} exchange={exchange} />
                                    ))
                                    } </div>
                                    :
                                    <div className="text-center align-middle">Não tens nenhum pedido</div>

                        }
                        </TabsContent>
                        <TabsContent className="align-middle p-2" value="accepted"> {
                                accepted.length > 0 ?

                                    <div className="flex flex-col space-y-4"> {
                                    accepted.map((exchange) => (
                                        <DirectExchangeStatusCard key={exchange.id} exchange={exchange} />
                                    ))
                                    } </div>
                                    :
                                    <div className="text-center align-middle">Não tens nenhum pedido</div>

                        }
                        </TabsContent>
                    </Tabs> : <div className="mt-4">
                        <MoonLoader className="mx-auto my-auto" loading={isLoadingHistory} />
                        <p className="text-center">A carregar os horários</p>
                    </div>
                }
            </DialogContent>
        </Dialog>
    </>
}
