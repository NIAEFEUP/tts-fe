import { useContext } from "react";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import useAdminAllMarketplaceExchanges from "../../../hooks/admin/useAdminAllMarketplaceExchanges"
import AdminPaginationContext from "../../../contexts/admin/AdminPaginationContext";
import { BarLoader } from "react-spinners";
import { AdminMarketplaceExchangesCard } from "../AdminMarketplaceExchangesCard";

export const AdminMarketplaceExchanges = () => {
    const filterContext = useContext(RequestFiltersContext);
    const { currPage } = useContext(AdminPaginationContext);
    const { exchanges, loading } = useAdminAllMarketplaceExchanges(filterContext, currPage);

    return (<>
        {loading && <BarLoader className="w-full" />}

        {!loading && (!exchanges || exchanges.length === 0) && (
                    <h2>Nenhum pedido encontrado de momento</h2>
            )}
        {exchanges?.map((exchange) => (
            <AdminMarketplaceExchangesCard 
                key={`admin-marketplace-${exchange.id}`}
                exchange={exchange}
            /> 
        ))}
    </>
    )
}