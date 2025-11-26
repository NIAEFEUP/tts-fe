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
    // Only redirect if session is loaded and user is definitely not admin
    if (!isSessionLoading && signedIn && !isAuthorized) {
      navigate("/planner");
    }
  }, [isSessionLoading, isAuthorized, signedIn, navigate]);

  // Prevent rendering admin content for unauthorized users
  if (!isAuthorized && signedIn && !isSessionLoading) {
    return null;
  }

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
