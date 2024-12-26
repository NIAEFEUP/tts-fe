import { AdminMainContent } from "../components/admin/AdminMainContent";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminSettings } from "../components/admin/AdminSettings";
import SessionContext from '../contexts/SessionContext'
import { useContext } from "react";
import { AdminExchangeSettings } from "../components/admin/AdminExchangeSettings";

type Props = {
    page: string;
}

const AdminPage = ({ page }: Props) => {
    const {signedIn, user} = useContext(SessionContext);

    if (!signedIn || user?.role !== 'admin') {
        return <div>Access Denied. You do not have admin credentials.</div>;
    }
    
    return (
        <div className="flex flex-row h-screen gap-x-2">
            <div className="w-2/12">
                <AdminSidebar />
            </div>
            <div className="w-10/12 m-8">
                {page === "pedidos" && <AdminMainContent />}
                {page === "settings" && <AdminExchangeSettings />}
            </div>
        </div>
    )
}

export default AdminPage;
