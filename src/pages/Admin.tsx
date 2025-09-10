import { AdminMainContent } from "../components/admin/AdminMainContent";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminExchangeSettings } from "../components/admin/AdminExchangeSettings";
import { AdminExchangeClasses } from "../components/admin/AdminExchangeClasses";
import { SidebarProvider } from "../components/ui/sidebar";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SessionContext from "../contexts/SessionContext";

type Props = {
    page: string;
}

const AdminPage = ({ page }: Props) => {
    const navigate = useNavigate();
    const { signedIn, user, isSessionLoading } = useContext(SessionContext);

    if(!isSessionLoading && signedIn && user && !user.is_admin) {
        navigate("/planner")
        return <></>
    }

    return (<>
        {(!isSessionLoading && user && user.is_admin) &&
            <SidebarProvider>
                <AdminSidebar />
                <main className="m-8 w-full">
                    {page === "pedidos" && <AdminMainContent />}
                    {page === "settings" && <AdminExchangeSettings />}
                    {page === "vacancies" && <AdminExchangeClasses />}
                </main>
            </SidebarProvider>
        }
    </>
    )
}

export default AdminPage;
