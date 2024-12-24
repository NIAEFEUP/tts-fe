import { LayoutDashboard, SendHorizonal, Settings } from "lucide-react"
import { Separator } from "../ui/separator"

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
        </ul>
    </div>
   )
}