import { useContext } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import AdminPaginationContext from "../../contexts/admin/AdminPaginationContext";

export const AdminPagination = () => {
    const { currPage, setCurrPage } = useContext(AdminPaginationContext);

    return <Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href="#" />
            </PaginationItem>
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
            <PaginationItem>
                <PaginationLink 
                    href="#" 
                    onClick={() => setCurrPage(prev => prev + 1)}
                    className="hover:bg-black hover:text-white"
                >
                    {currPage + 1}
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
                <PaginationNext href="#" />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
}