import { BrowserRouter, Route, Router } from "react-router-dom";
import { AdminMainContent } from "../components/admin/AdminMainContent";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminSettings } from "../components/admin/AdminSettings";

type Props = {
    page: string;
}

const AdminPage = ({ page }: Props) => {
    return (
        <div className="flex flex-row h-screen gap-x-2">
            <div className="w-2/12">
                <AdminSidebar />
            </div>
            <div className="w-10/12">
                {page === "pedidos" && <AdminMainContent />}
                {page === "settings" && <AdminSettings />}
            </div>
        </div>
    )
}

export default AdminPage;