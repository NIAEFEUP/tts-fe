import useAdminExchangeStatistics from '../../hooks/admin/useAdminExchangeStatistics'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { PackageIcon, CheckIcon, XIcon, FileClockIcon } from 'lucide-react'

const StatCard = ({
  label,
  value,
  bgColor,
  icon,
}: {
  label: string
  value: number | string
  bgColor: string
  icon: React.ReactNode
}) => (
  <Card className="min-w-[200px] flex-1 shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor}`}>{icon}</div>
    </CardHeader>

    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)

export const AdminStatisticsView = () => {
  const { adminStatistics, error } = useAdminExchangeStatistics()

  const totalPedidos = adminStatistics?.total_exchanges ?? 'N/A'
  const aceites = adminStatistics?.accepted_exchanges ?? 'N/A'
  const recusados = adminStatistics?.rejected_exchanges ?? 'N/A'
  const pendentes = adminStatistics?.pending_exchanges ?? 'N/A'

  if (error) {
    return (
      <div className="p-4">
        <h1 className="mb-6 text-3xl font-bold">Estatísticas Administrativas</h1>
        <div className="rounded-md border border-red-300 bg-red-100 px-4 py-3 text-red-600">
          Erro ao carregar estatísticas. Tente novamente mais tarde
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-8 p-4">
      <h1 className="text-3xl font-bold">Estatísticas Administrativas</h1>

      <div className="text-muted-foreground text-base">
        <p>Visão geral dos pedidos de troca</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de Pedidos"
          value={totalPedidos}
          bgColor="bg-blue-100"
          icon={<PackageIcon className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          label="Aceites"
          value={aceites}
          bgColor="bg-green-100"
          icon={<CheckIcon className="h-5 w-5 text-green-600" />}
        />
        <StatCard
          label="Recusados"
          value={recusados}
          bgColor="bg-red-100"
          icon={<XIcon className="h-5 w-5 text-red-600" />}
        />
        <StatCard
          label="Pendentes"
          value={pendentes}
          bgColor="bg-yellow-100"
          icon={<FileClockIcon className="h-5 w-5 text-yellow-600" />}
        />
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Gráficos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Aqui seria o espaço para gráficos</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminStatisticsPage() {
  return <AdminStatisticsView />
}
