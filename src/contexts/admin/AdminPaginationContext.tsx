import { Context, Dispatch, createContext, SetStateAction } from "react";

export interface AdminPaginationContextContent {
    currPage: number,
    setCurrPage: Dispatch<SetStateAction<number>>,
    totalPages: number,
    setTotalPages: Dispatch<SetStateAction<number>>
}

const AdminPaginationContext: Context<AdminPaginationContextContent> = createContext({
    currPage: 1,
    setCurrPage: () => { },
    totalPages: 0,
    setTotalPages: () => { }
});

export default AdminPaginationContext;