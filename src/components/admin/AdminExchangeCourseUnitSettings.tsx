"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Table, TableHead, TableRow, TableBody, TableCell } from '../ui/table'
import { useEffect, useState } from 'react'
import useAdminExchangeCourseUnitPeriods from '../../hooks/admin/useAdminExchangeCourseUnitPeriods'
import { CheckIcon, PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react'
import { DateTimePicker } from '../ui/datetime-picker';
import exchangeRequestService from "../../api/services/exchangeRequestService";
import { format } from 'date-fns';
import { AdminExchangePeriodDeleteConfirmation } from "./AdminExchangePeriodDeleteConfirmation";

interface ExchangePeriod {
  id: number;
  startDate: string;
  endDate: string;
}

export const AdminExchangeCourseUnitSettings = () => {
  const { courseUnitPeriods, mutate, error } = useAdminExchangeCourseUnitPeriods();
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [selectedCourseUnit, setSelectedCourseUnit] = useState<number | null>(null);
  const [addingPeriod, setAddingPeriod] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);
  const [editingStartDate, setEditingStartDate] = useState<Date | undefined>(undefined);
  const [editingEndDate, setEditingEndDate] = useState<Date | undefined>(undefined);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [periodToDelete, setPeriodToDelete] = useState<number | null>(null);

  const courseUnits = courseUnitPeriods?.courseUnits || [];

  useEffect(() => {
    if (courseUnits.length > 0 && !selectedCourseUnit) {
      setSelectedCourseUnit(courseUnits[0].id);
    }
  }, [courseUnits]);

  const getCurrentPeriods = (): ExchangePeriod[] => {
    if (!courseUnits || !selectedCourseUnit) return [];
    const unit = courseUnits.find(u => u.id === selectedCourseUnit);
    return unit?.exchangePeriods?.map(period => ({
      id: period.id, 
      startDate: period.startDate,
      endDate: period.endDate
    })) || [];
  };

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedCourseUnit) return;

    try {
      setIsLoading(true);
      await exchangeRequestService.addCourseUnitExchangePeriod(
        startDate, 
        endDate, 
        selectedCourseUnit
      );
      setAddingPeriod(false);
      setStartDate(undefined);
      setEndDate(undefined);
      if (error) {
        console.error("Error fetching course unit periods:", error);
      }
      mutate();
    } catch (error) {
      console.error("Failed to add exchange period:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStartDate || !editingEndDate || !selectedCourseUnit || editingPeriodId === null) return;
    
    try {
      setIsLoading(true);
      await exchangeRequestService.editCourseUnitExchangePeriod(
        editingStartDate,
        editingEndDate,
        selectedCourseUnit,
        editingPeriodId
      );
      setEditingPeriodId(null);
      setEditingStartDate(undefined);
      setEditingEndDate(undefined);
      mutate();
    } catch (error) {
      console.error("Failed to update exchange period:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePeriod = async (periodId: number) => {
    if (!selectedCourseUnit) return;
    try {
      setIsLoading(true);
      await exchangeRequestService.deleteCourseUnitExchangePeriod(selectedCourseUnit, periodId);
      mutate();
    } catch (error) {
      console.error("Failed to delete exchange period:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (periodToDelete !== null) {
      await handleDeletePeriod(periodToDelete);
      setPeriodToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  };

  return (
    <div className="flex flex-col gap-y-8 p-4">
      <div className="text-base text-muted-foreground">
        <p>Aqui podem ser definidas configurações para o período de trocas dos grupos de cadeiras responsáveis.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="col-span-2 rounded-2xl shadow-md">
          <CardHeader>
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl">Períodos de troca ativos</CardTitle>
              <Button onClick={() => setAddingPeriod(prev => !prev)} size="icon">
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {addingPeriod && (
              <form onSubmit={handleAddPeriod} className="flex flex-col xl:flex-row gap-4 mb-6">
                <DateTimePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Início"
                />
                <DateTimePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Fim"
                />
                <Button type="submit" disabled={isLoading} className="md:mt-0">
                  <CheckIcon className="h-5 w-5" />
                </Button>
              </form>
            )}

            <Table className="w-full table-auto">
              <TableHead>
                <TableRow>
                  <TableHead className="text-center w-12">#</TableHead>
                  <TableHead className="text-right font-mono">Início</TableHead>
                  <TableHead className="text-right font-mono">Fim</TableHead>
                  <TableHead className="text-center font-mono">Ações</TableHead>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentPeriods().length > 0 ? (
                  getCurrentPeriods().map((period, index) => (
                    <TableRow key={period.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-right font-mono">
                        {editingPeriodId === period.id ? (
                          <DateTimePicker
                            value={editingStartDate}
                            onChange={setEditingStartDate}
                          />
                        ) : (
                          formatDate(period.startDate)
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {editingPeriodId === period.id ? (
                          <DateTimePicker
                            value={editingEndDate}
                            onChange={setEditingEndDate}
                          />
                        ) : (
                          formatDate(period.endDate)
                        )}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2 py-2">
                        {editingPeriodId === period.id ? (
                          <>
                            <Button onClick={handleEditPeriod} size="sm" disabled={isLoading}>
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingPeriodId(null);
                                setEditingStartDate(undefined);
                                setEditingEndDate(undefined);
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => {
                                setEditingPeriodId(period.id);
                                setEditingStartDate(new Date(period.startDate));
                                setEditingEndDate(new Date(period.endDate));
                              }}
                              size="sm"
                            >
                              <Edit2Icon className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setPeriodToDelete(period.id);
                                setDeleteDialogOpen(true);
                              }}
                              variant="destructive"
                              size="sm"
                              disabled={isLoading}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                      Nenhum período encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Cadeiras responsáveis</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {courseUnits.map((courseUnit, idx) => (
              <Button
                key={courseUnit.id}
                variant={selectedGroup === idx ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  setSelectedGroup(idx);
                  setSelectedCourseUnit(courseUnit.id);
                }}
              >
                {courseUnit.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <AdminExchangePeriodDeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
