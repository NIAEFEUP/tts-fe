import { useContext } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";
import AdminPaginationContext from "../../contexts/admin/AdminPaginationContext";

export const AdminPagination = () => {
    const { currPage, setCurrPage, totalPages } = useContext(AdminPaginationContext);

    return <Pagination>
        <PaginationContent>
            {currPage > 1 && (
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={() => setCurrPage(prev => prev - 1)}
                        className="hover:bg-black hover:text-white"
                    >
                        {currPage - 1}
                    </PaginationLink>
                </PaginationItem>
            )}
            <PaginationItem>
                <PaginationLink
                    className="bg-black text-white hover:bg-white hover:text-black"
                    href="#"
                >
                    {currPage}
                </PaginationLink>
            </PaginationItem>
            {currPage < totalPages && (
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={() => setCurrPage(prev => prev + 1)}
                        className="hover:bg-black hover:text-white"
                    >
                        {currPage + 1}
                    </PaginationLink>
                </PaginationItem>)}
        </PaginationContent>
    </Pagination>
}