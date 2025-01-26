import { BarLoader } from "react-spinners";
import useMultipleStudentExchanges from "../../../hooks/admin/useMultipleStudentExchanges";
import { MultipleStudentExchangeCard } from "./cards/MultipleStudentExchangeCard";

export const MultipleStudentExchanges = () => {
    const { exchanges, loading } = useMultipleStudentExchanges();

    return (
        <>
            <div className="flex flex-col gap-y-2">
                {loading && <BarLoader className="w-full"/>}

                {!loading && (!exchanges || exchanges.length === 0) && (
                    <h2>Nenhum pedido encontrado de momento</h2>
                )}

                {exchanges?.map((exchange) => (
                    <MultipleStudentExchangeCard 
                        exchange={exchange}
                    />
                ))}
            </div>
        </>
    )
}