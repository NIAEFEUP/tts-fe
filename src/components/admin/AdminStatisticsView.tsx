import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { MultipleStudentExchanges } from "./requests/MultipleStudentExchanges";
import { RequestFilters } from "./requests/RequestFilters";
import { SingleStudentExchanges } from "./requests/SingleStudentExchanges";
import { StudentEnrollments } from "./requests/StudentEnrollments";
import { AdminRequestState } from "../../contexts/admin/RequestFiltersContext";
import RequestFiltersContext from "../../contexts/admin/RequestFiltersContext";
import { AdminPagination } from "./AdminPagination";
import AdminPaginationContext from "../../contexts/admin/AdminPaginationContext";
import { AdminMarketplaceExchanges } from "./requests/AdminMarketplaceExchanges";

export const AdminStatisticsView = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Estatísticas Administrativas</h1>
            {/* Aqui você pode adicionar gráficos, tabelas ou qualquer outro componente relacionado às estatísticas */}
            <p>Conteúdo de estatísticas será exibido aqui.</p>
        </div>
    )
}
