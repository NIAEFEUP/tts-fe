import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Table, TableHead, TableRow, TableBody, TableCell } from '../ui/table'

import { useState } from 'react'
import useAdminExchangeCourses from '../../hooks/admin/useAdminExchangeCourses'

export const AdminExchangeSettings = () => {
    const { courses, loading } = useAdminExchangeCourses();
    const [selectedGroup, setSelectedGroup] = useState<number>(0);

    return (
      <div className="flex flex-col gap-y-8">
        <div>
          <h1 className="text-3xl font-bold">Definições</h1>
          <p>Aqui podem ser definidas configurações para o período de trocas dos grupos de cadeiras responsáveis.</p>
        </div>
        <div className="flex flex-row justify-between">
        <div className="w-1/2">
            <h2 className="text-lg font-bold">Períodos de troca ativos</h2>
            <Table className="w-1/2">
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Data de início</TableHead>
                <TableHead>Data de término</TableHead>
              </TableRow>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>2023-01-01</TableCell>
                  <TableCell>2023-12-31</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>2024-01-01</TableCell>
                  <TableCell>2024-12-31</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row gap-x-4 mx-auto">
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-lg">Cadeiras responsáveis</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-2 m-2">
                {courses?.map((course, idx) => (
                  <Button 
                    key={course.id} 
                    variant="ghost" 
                    className={`${selectedGroup === idx ? "bg-gray-100" : ""}`}
                    onClick={() => setSelectedGroup(idx)}
                  >
                    { course.acronym }
              </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
}
