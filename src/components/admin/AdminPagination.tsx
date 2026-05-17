import { useContext } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";
import AdminPaginationContext from "../../contexts/admin/AdminPaginationContext";


export const AdminPagination = () => {
    const { currPage, setCurrPage, totalPages } = useContext(AdminPaginationContext);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrPage(page);
        }
    };

    return (
        <Pagination>
            <PaginationContent>

                {/* FIRST */}
                {currPage > 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => goToPage(1)}>
                            {"<<"}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* -2 */}
                {currPage - 2 >= 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => goToPage(currPage - 2)}>
                            {currPage - 2}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* -1 */}
                {currPage - 1 >= 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => goToPage(currPage - 1)}>
                            {currPage - 1}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* CURRENT */}
                <PaginationItem>
                    <PaginationLink className="bg-black text-white">
                        {currPage}
                    </PaginationLink>
                </PaginationItem>

                {/* +1 */}
                {currPage + 1 <= totalPages && (
                    <PaginationItem>
                        <PaginationLink onClick={() => goToPage(currPage + 1)}>
                            {currPage + 1}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* +2 */}
                {currPage + 2 <= totalPages && (
                    <PaginationItem>
                        <PaginationLink onClick={() => goToPage(currPage + 2)}>
                            {currPage + 2}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* LAST */}
                {currPage < totalPages && (
                    <PaginationItem>
                        <PaginationLink onClick={() => goToPage(totalPages)}>
                            {">>"}
                        </PaginationLink>
                    </PaginationItem>
                )}

            </PaginationContent>
        </Pagination>
    );
};