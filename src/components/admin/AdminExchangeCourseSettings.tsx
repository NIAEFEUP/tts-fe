"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '../ui/table';
import { useEffect, useState } from 'react';
import exchangeRequestService from "../../api/services/exchangeRequestService";
import useAdminExchangeCoursePeriods from '../../hooks/admin/useAdminExchangeCoursePeriods';
import { CheckIcon, PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { DateTimePicker } from '../ui/datetime-picker';
import { format } from 'date-fns';
import { AdminExchangePeriodDeleteConfirmation } from "./AdminExchangePeriodDeleteConfirmation";

export const AdminExchangeCourseSettings = () => {
  const { exchangeCoursePeriods, mutate } = useAdminExchangeCoursePeriods();
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [addingPeriod, setAddingPeriod] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);
  const [editingStartDate, setEditingStartDate] = useState<Date | undefined>(undefined);
  const [editingEndDate, setEditingEndDate] = useState<Date | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [periodToDelete, setPeriodToDelete] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const courses = exchangeCoursePeriods?.courses || [];

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].courseId);
    }
  }, [courses]);

  useEffect(() => {
    if (!addingPeriod && editingPeriodId === null) {
      setErrorMessage(null);
    }
  }, [addingPeriod, editingPeriodId]);

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedCourse) return;

    try {
      setIsLoading(true);
      setErrorMessage(null); 
    
      const response = await exchangeRequestService.addCourseExchangePeriod(startDate, endDate, selectedCourse);
    
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || "Erro ao adicionar período.");
        return;
      }
    
      setAddingPeriod(false);
      setStartDate(undefined);
      setEndDate(undefined);
      mutate();
    } catch (error) {
      console.error("Failed to add exchange period:", error);
      setErrorMessage("Erro de rede ao adicionar o período.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStartDate || !editingEndDate || !selectedCourse || editingPeriodId === null) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await exchangeRequestService.editCourseExchangePeriod(
        editingStartDate,
        editingEndDate,
        selectedCourse,
        editingPeriodId
      );
      
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || "Erro ao atualizar período.");
        return;
      }
      
      setEditingPeriodId(null);
      setEditingStartDate(undefined);
      setEditingEndDate(undefined);
      mutate();
    } catch (error) {
      console.error("Failed to update exchange period:", error);
      setErrorMessage("Erro de rede ao atualizar o período.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePeriod = async (periodId: number) => {
    if (!selectedCourse) return;
    try {
      setIsLoading(true);
      await exchangeRequestService.deleteCourseExchangePeriod(selectedCourse, periodId);
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

  const formatDate = (dateString: string) => format(new Date(dateString), 'yyyy-MM-dd HH:mm');

  const getCurrentCoursePeriods = () => {
    if (!exchangeCoursePeriods?.courses || !selectedCourse) return [];
    const course = exchangeCoursePeriods.courses.find(c => c.courseId === selectedCourse);
    return course?.exchangePeriods || [];
  };

  return (
    <div className="flex flex-col gap-y-8 p-4">
      <div className="text-base text-muted-foreground">
        <p>Configure os períodos de troca dos cursos responsáveis.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="col-span-2 rounded-2xl shadow-md">
          <CardHeader>
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl">Períodos de troca ativos</CardTitle>
              <Button onClick={() => {
                setAddingPeriod(prev => {
                  if (prev) setErrorMessage(null);
                  return !prev;
                });
                setEditingPeriodId(null);
              }} size="icon">
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <div className="text-sm text-red-600 px-2 py-1 rounded-md bg-red-100 border border-red-300">
                {errorMessage}
              </div>
            )}
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
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">#</TableHead>
                  <TableHead className="text-center font-mono">Início</TableHead>
                  <TableHead className="text-center font-mono">Fim</TableHead>
                  <TableHead className="text-center font-mono">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCourse ? (
                  getCurrentCoursePeriods().length > 0 ? (
                    getCurrentCoursePeriods().map((period, index) => (
                      <TableRow key={period.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="text-center font-mono">
                          {editingPeriodId === period.id ? (
                            <DateTimePicker
                              value={editingStartDate}
                              onChange={setEditingStartDate}
                            />
                          ) : (
                            formatDate(period.startDate)
                          )}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {editingPeriodId === period.id ? (
                            <DateTimePicker
                              value={editingEndDate}
                              onChange={setEditingEndDate}
                            />
                          ) : (
                            formatDate(period.endDate)
                          )}
                        </TableCell>
                        <TableCell className="flex justify-center gap-2">
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
                                  setErrorMessage(null);
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
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                      Selecione um curso
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Cursos responsáveis</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {courses.map((course, idx) => (
              <Button
                key={course.courseId}
                variant={selectedGroup === idx ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedGroup(idx);
                  setSelectedCourse(course.courseId);
                }}
              >
                {course.courseName}
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