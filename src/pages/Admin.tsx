import { AdminMainContent } from "../components/admin/AdminMainContent";
import { AdminSidebar } from "../components/admin/AdminSidebar";

const AdminPage = () => {
    return (
        <div className="flex flex-row h-screen gap-x-2">
            <div className="w-2/12">
                <AdminSidebar />
            </div>
            <div className="w-10/12">
                <AdminMainContent />
            </div>
        </div>
    )
}

export default AdminPage;