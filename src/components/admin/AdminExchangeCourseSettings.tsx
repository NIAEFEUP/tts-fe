"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Table, TableHead, TableRow, TableBody, TableCell } from '../ui/table'
import exchangeRequestService from "../../api/services/exchangeRequestService";
import { useEffect, useState } from 'react'
import useAdminExchangeCoursePeriods from '../../hooks/admin/useAdminExchangeCoursePeriods'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { DateTimePicker } from '../ui/datetime-picker';
import { format } from 'date-fns';

export const AdminExchangeCourseSettings = () => {
  const { exchangeCoursePeriods, mutate } = useAdminExchangeCoursePeriods();
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [addingPeriod, setAddingPeriod] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);
  const [editingStartDate, setEditingStartDate] = useState<Date | undefined>(undefined);
  const [editingEndDate, setEditingEndDate] = useState<Date | undefined>(undefined);

  const courses = exchangeCoursePeriods?.courses || [];

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].courseId);
    }
  }, [courses]);

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedCourse) return;

    try {
      await exchangeRequestService.addCourseExchangePeriod(startDate, endDate, selectedCourse);
      setAddingPeriod(false);
      setStartDate(undefined);
      setEndDate(undefined);
      mutate();
    } catch (error) {
      console.error("Failed to add exchange period:", error);
    }
  };

  const handleEditPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStartDate || !editingEndDate || !selectedCourse || editingPeriodId === null) return;

    try {
      await exchangeRequestService.editCourseExchangePeriod(editingStartDate, editingEndDate, selectedCourse, editingPeriodId);
      setEditingPeriodId(null);
      setEditingStartDate(undefined);
      setEditingEndDate(undefined);
      mutate();
    } catch (error) {
      console.error("Failed to update exchange period:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  };

  const getCurrentCoursePeriods = () => {
    if (!exchangeCoursePeriods?.courses || !selectedCourse) return [];
    const course = exchangeCoursePeriods.courses.find(c => c.courseId === selectedCourse);
    console.log("Selected course:", course);
    return course ? course.exchangePeriods : [];
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <p>Aqui podem ser definidas configurações para o período de trocas dos grupos de cursos responsáveis.</p>
      </div>
      <div className="flex flex-row justify-between">
        <div className="w-1/2">
          <div className="flex flex-row gap-x-4 items-center">
            <h2 className="text-lg font-bold">Períodos de troca ativos</h2>
            <Button onClick={() => setAddingPeriod(prev => !prev)}>
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
          
          {addingPeriod && (
            <form onSubmit={handleAddPeriod} className="flex flex-row gap-x-2 mt-4">
              <div className="flex flex-row space-x-2">
                <DateTimePicker
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
                /> 
              </div>
              <div>
                <Button type="submit">
                  <CheckIcon className="h-5 w-5" />
                </Button>
              </div>
            </form>
          )}
          
          <Table className="w-1/2 table-fixed mt-4">
            <TableHead>
              <TableRow>
                <TableHead className="text-center px-12">#</TableHead>
                <TableHead className="text-right font-mono px-12">Data de início</TableHead>
                <TableHead className="text-right font-mono px-12">Data de término</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCourse ? (
                getCurrentCoursePeriods().length > 0 ? (
                  getCurrentCoursePeriods().map((period, index) => (
                    <TableRow key={period.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-right font-mono px-5">
                        {editingPeriodId === period.id ? (
                          <DateTimePicker
                            value={editingStartDate}
                            onChange={setEditingStartDate}
                            showOutsideDays={false}
                            weekStartsOn={1}
                            showWeekNumber={false}
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
                            showOutsideDays={false}
                            weekStartsOn={1}
                            showWeekNumber={false}
                          />
                        ) : (
                          formatDate(period.endDate)
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editingPeriodId === period.id ? (
                          <>
                            <Button onClick={handleEditPeriod} className="mr-2" type="button">
                              <CheckIcon className="h-5 w-5" />
                            </Button>
                            <Button onClick={() => setEditingPeriodId(null)} variant="destructive" type="button">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => {
                            setEditingPeriodId(period.id);
                            setEditingStartDate(new Date(period.startDate));
                            setEditingEndDate(new Date(period.endDate));
                          }}>
                            Editar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhum período encontrado para este curso
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Selecione um curso
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex flex-row gap-x-4 mx-auto">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-lg">Cursos responsáveis</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2 m-2">
              {courses.map((course, idx) => (
                <Button
                  key={course.courseId}
                  variant="ghost"
                  className={`${selectedGroup === idx ? "bg-gray-100" : ""}`}
                  onClick={() => {
                    setSelectedGroup(idx);
                    setSelectedCourse(course.courseId);
                  }}
                >
                  {course.courseAcronym}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};