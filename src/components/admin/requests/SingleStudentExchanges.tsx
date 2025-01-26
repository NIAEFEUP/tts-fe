import { BarLoader } from "react-spinners";
import useSingleStudentExchanges from "../../../hooks/admin/useSingleStudentExchanges";
import { SingleStudentExchangeCard } from "./cards/SingleStudentExchangeCard";

export const SingleStudentExchanges = () => {
    const { exchanges, loading } = useSingleStudentExchanges();

    return (
        <>
            {loading && <BarLoader className="w-full"/>}

            {!loading && exchanges?.map((exchange) => (
                <SingleStudentExchangeCard exchange={exchange} />
            ))}
        </>
    )
}