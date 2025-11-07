import { BarLoader } from "react-spinners";
import useMultipleStudentExchanges from "../../../hooks/admin/useMultipleStudentExchanges";
import { MultipleStudentExchangeCard } from "./cards/MultipleStudentExchangeCard";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import { useContext, useEffect } from "react";
import AdminPaginationContext from "../../../contexts/admin/AdminPaginationContext";
import { PageSizeSelector } from "./cards/PageSizeSelector";

export const MultipleStudentExchanges = () => {
    const filterContext = useContext(RequestFiltersContext);

    const { currPage, setTotalPages, itemsPerPage, setItemsPerPage } = useContext(AdminPaginationContext);
    const { exchanges, totalPages, loading } = useMultipleStudentExchanges(filterContext, currPage, itemsPerPage);

    useEffect(() => {
        setTotalPages(totalPages)
    }, [exchanges]);
    
    return (
        <>
            <PageSizeSelector
                value={itemsPerPage}
                onChange={setItemsPerPage}
            />
            <div className="flex flex-col gap-y-2">
                {loading && <BarLoader className="w-full"/>}

                {!loading && (!exchanges || exchanges.length === 0) && (
                    <h2>Nenhum pedido encontrado de momento</h2>
                )}
                {exchanges?.map((exchange) => (
                    <MultipleStudentExchangeCard 
                        exchange={exchange}
                        key={`multiple-student-${exchange.id}`}
                    />
                ))}
            </div>
        </>
    )
}