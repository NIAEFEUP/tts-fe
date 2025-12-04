import useAdminExchangeStatistics from '../../hooks/admin/useAdminExchangeStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const StatCard = ({ label, value }: { label: string; value: number | string}) => (
    <Card className="flex-1 min-w-[200px] shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                
                {value}
             
            </div>
        </CardContent>
    </Card>
);

export const AdminStatisticsView = () => {
    const { adminStatistics, error } = useAdminExchangeStatistics();

    const totalPedidos = adminStatistics?.total_exchanges ?? 'N/A';
    const aceites = adminStatistics?.accepted_exchanges ?? 'N/A';
    const recusados = adminStatistics?.rejected_exchanges ?? 'N/A';
    const pendentes = adminStatistics?.pending_exchanges ?? 'N/A';
    const estudantesUnicos = 'N/A'; 
    
    if (error) {
        return (
            <div className="p-4">
                <h1 className="text-3xl font-bold mb-6">Estatísticas Administrativas</h1>
                <div className="text-red-600 px-4 py-3 rounded-md bg-red-100 border border-red-300">
                    Erro ao carregar estatísticas. Tente novamente mais tarde
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-8 p-4">
            <h1 className="text-3xl font-bold">Estatísticas Administrativas</h1>
            
            <div className="text-base text-muted-foreground">
                <p>Visão geral dos pedidos de troca</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label={`Total de Pedidos (de ${estudantesUnicos} estudantes)`} 
                    value={totalPedidos} 
                    
                />
                <StatCard 
                    label="Aceites" 
                    value={aceites} 
                    
                />
                <StatCard 
                    label="Recusados" 
                    value={recusados} 
    
                />
                <StatCard 
                    label="Pendentes" 
                    value={pendentes} 
                    
                />
            </div>
            
            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Gráficos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        Aqui seria o espaço para gráficos
                    </p>
                </CardContent>
            </Card>

        </div>
    );
}

export default function AdminStatisticsPage() {
    return (
        <AdminStatisticsView />
    )
}