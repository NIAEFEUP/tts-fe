import useAdminExchanges from "../../hooks/useAdminExchanges";
import { AcceptedExchangeCard } from "./AcceptedExchangeCard";

export const AdminMainContent = () => {
    const { exchanges } = useAdminExchanges(); 

    console.log("Exchanges: ", exchanges);

    return (
        <div className="flex flex-col gap-y-4 p-4">
            <h1 className="text-4xl font-bold">Pedidos</h1>
            <div className="flex flex-col gap-y-2">
                {exchanges?.map((exchange) => (
                    <article key={`${exchange.participant_nmec}`}>
                        <AcceptedExchangeCard 
                            participant_name={exchange.participant_name}
                            participant_nmec={exchange.participant_nmec}
                            exchanges={exchange.exchanges}
                            schedule={exchange.schedule}
                        />
                    </article>
                ))}
            </div>
        </div>
    )
}