import { AdminMainContent } from "../components/admin/AdminMainContent";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import SessionContext from '../contexts/SessionContext'
import { useContext } from "react";
import { AdminExchangeSettings } from "../components/admin/AdminExchangeSettings";
import { SidebarProvider } from "../components/ui/sidebar";

type Props = {
    page: string;
}

const AdminPage = ({ page }: Props) => {
    const { signedIn, user } = useContext(SessionContext);

    /*if (!signedIn || user?.role !== 'admin') {
        return <div>Access Denied. You do not have admin credentials.</div>;
    }*/

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="m-8 w-full">
                {page === "pedidos" && <AdminMainContent />}
                {page === "settings" && <AdminExchangeSettings />}
            </main>
        </SidebarProvider>
    )
}

export default AdminPage;
