import { FileDown, LayoutDashboard, SendHorizonal, Settings } from "lucide-react"
import { Separator } from "../ui/separator"
import api from "../../api/backend"

// TODO(thePeras): use Shadcn sidebar
export const AdminSidebar = () => {  
   return (
    <div className="flex flex-col gap-y-4 bg-white shadow-md h-full h-dvh m-4 p-4 rounded-lg m-1">
        <div className="flex flex-row gap-x-2">
            <LayoutDashboard />
            <h1 className="font-bold">Admin</h1>
        </div>
        <Separator className="bg-black" />
        <ul className="flex flex-col gap-y-8 mt-4">
            <li className="flex flex-row gap-x-2">
                <SendHorizonal />
                <a href="/admin" className="hover:underline">Pedidos</a>
            </li>
            <li className="flex flex-row gap-x-2">
                <Settings />
                <a href="/admin/settings" className="hover:underline">Definições</a>
            </li>
            <li className="flex flex-row gap-x-2">
                <FileDown />
                <a href="" className="hover:underline" onClick={async (e) => {
                    e.preventDefault();
                    const res = await fetch(`${api.BACKEND_URL}/exchange/export/csv`, {credentials: "include"});
                    if(res.ok) {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(await res.blob());
                        link.download = "exchange_data.csv";
                        link.click();
                    }
                }} >Exportar CSV</a>
            </li>
        </ul>
    </div>
   )
}
