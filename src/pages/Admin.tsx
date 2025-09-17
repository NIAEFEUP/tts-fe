import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminMainContent } from "../components/admin/AdminMainContent";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminExchangeSettings } from "../components/admin/AdminExchangeSettings";
import { SidebarProvider } from "../components/ui/sidebar";
import SessionContext from "../contexts/SessionContext";

type Props = {
  page: string;
};

const AdminPage = ({ page }: Props) => {
  const navigate = useNavigate();
  const { signedIn, user, isSessionLoading } = useContext(SessionContext);

  const isAuthorized = signedIn && user?.is_admin;

  useEffect(() => {
    if (!isSessionLoading && !isAuthorized) {
      navigate("/planner");
    }
  }, [isSessionLoading, isAuthorized, navigate]);


  if (isSessionLoading || !isAuthorized) return null;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="m-8 w-full">
        {page === "pedidos" && <AdminMainContent />}
        {page === "settings" && <AdminExchangeSettings />}
      </main>
    </SidebarProvider>
  );
};


export default AdminPage;
