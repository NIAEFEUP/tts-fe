import { Context, Dispatch, createContext, SetStateAction } from "react";

export interface AdminPaginationContextContent {
    currPage: number,
    setCurrPage: Dispatch<SetStateAction<number>>
}

const AdminPaginationContext: Context<AdminPaginationContextContent> = createContext({
    currPage: 1,
    setCurrPage: () => { }
});

export default AdminPaginationContext;