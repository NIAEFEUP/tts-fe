import { BarLoader } from "react-spinners";
import useSingleStudentExchanges from "../../../hooks/admin/useSingleStudentExchanges";
import { SingleStudentExchangeCard } from "./cards/SingleStudentExchangeCard";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import { useContext, useEffect } from "react";
import AdminPaginationContext from "../../../contexts/admin/AdminPaginationContext";

export const SingleStudentExchanges = () => {
    const filterContext = useContext(RequestFiltersContext);
    const { currPage, setTotalPages } = useContext(AdminPaginationContext);
    const { exchanges, loading, totalPages } = useSingleStudentExchanges(filterContext, currPage);

    useEffect(() => {
        setTotalPages(totalPages)
    }, [exchanges]);

    return (
        <>
            {loading && <BarLoader className="w-full"/>}

            {!loading && (!exchanges || exchanges.length === 0) && (
                    <h2>Nenhum pedido encontrado de momento</h2>
                )}
                
            {!loading && exchanges?.map((exchange) => (
                <SingleStudentExchangeCard 
                    key={`single-student-${exchange.id}`}
                    exchange={exchange} 
                />
            ))}
        </>
    )
}