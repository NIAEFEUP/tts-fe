import { BarLoader } from "react-spinners";
import useSingleStudentExchanges from "../../../hooks/admin/useSingleStudentExchanges";
import { SingleStudentExchangeCard } from "./cards/SingleStudentExchangeCard";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import { useContext } from "react";

export const SingleStudentExchanges = () => {
    const filterContext = useContext(RequestFiltersContext);
    const { exchanges, loading } = useSingleStudentExchanges(filterContext);

    return (
        <>
            {loading && <BarLoader className="w-full"/>}

            {!loading && exchanges?.map((exchange) => (
                <SingleStudentExchangeCard 
                    key={`single-student-${exchange.id}`}
                    exchange={exchange} 
                />
            ))}
        </>
    )
}