import { useContext } from "react";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import useAdminAllMarketplaceExchanges from "../../../hooks/admin/useAdminAllMarketplaceExchanges"
import AdminPaginationContext from "../../../contexts/admin/AdminPaginationContext";
import { BarLoader } from "react-spinners";
import { AdminMarketplaceExhangesCard } from "../AdminMarketplaceExchangesCard";

export const AdminMarketplaceExhanges = () => {
    const filterContext = useContext(RequestFiltersContext);
    const { currPage } = useContext(AdminPaginationContext);
    const { exchanges, loading } = useAdminAllMarketplaceExchanges(filterContext, currPage);

    return (<>
        {loading && <BarLoader className="w-full" />}

        {exchanges?.map((exchange) => (
            <AdminMarketplaceExhangesCard 
                key={`admin-marketplace-${exchange.id}`}
                exchange={exchange}
            /> 
        ))}
    </>
    )
}