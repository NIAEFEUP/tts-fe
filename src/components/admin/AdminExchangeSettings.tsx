"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Table, TableHead, TableRow, TableBody, TableCell } from '../ui/table'

import { useState } from 'react'
import useAdminExchangeCourses from '../../hooks/admin/useAdminExchangeCourses'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { Input } from '../ui/input'
// import { DateTimePicker } from '../ui/datetime-picker';

export const AdminExchangeSettings = () => {
  const { courses } = useAdminExchangeCourses();

  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [addingPeriod, setAddingPeriod] = useState<boolean>(false)
  // const [startDate, setStartDate] = useState<Date>();
  // const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <h1 className="text-3xl font-bold">Definições</h1>
        <p>Aqui podem ser definidas configurações para o período de trocas dos grupos de cadeiras responsáveis.</p>
      </div>
      <div className="flex flex-row justify-between">
        <div className="w-1/2">
          <div className="flex flex-row gap-x-4 items-center">
            <h2 className="text-lg font-bold">Períodos de troca ativos</h2>
            <Button onClick={() => setAddingPeriod(prev => !prev)}>
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
          {addingPeriod &&
            <form className="flex flex-row gap-x-2 mt-4">
              <div className="flex flex-row space-x-2">
                <Input type="text" placeholder="Nome do período" />
                {/* <DateTimePicker
                  value={startDate}
                  onChange={setStartDate}
                  showOutsideDays={false}
                  weekStartsOn={1}
                  showWeekNumber={false}
                  placeholder="Início"
                />
                <DateTimePicker
                  value={endDate}
                  onChange={setEndDate}
                  showOutsideDays={false}
                  weekStartsOn={1}
                  showWeekNumber={false}
                  placeholder="Fim"
                /> */}
              </div>
              <div>
                <Button onClick={() => setAddingPeriod(false)}>
                  <CheckIcon className="h-5 w-5" />
                </Button>
              </div>
            </form>
          }
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
                  {course.acronym}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
