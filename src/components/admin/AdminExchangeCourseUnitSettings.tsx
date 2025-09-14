"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react';
import useAdminExchangeCourseUnitPeriods from '../../hooks/admin/useAdminExchangeCourseUnitPeriods'
import exchangeRequestService from "../../api/services/exchangeRequestService";
import { AdminExchangePeriodDeleteConfirmation } from "./AdminExchangePeriodDeleteConfirmation";
import { ExchangePeriodForm } from "./AdminExchangePeriodForm";
import { ExchangePeriodTable, ExchangePeriod } from "./AdminExchangePeriodTable";

export const AdminExchangeCourseUnitSettings = () => {
  const { courseUnitPeriods, mutate } = useAdminExchangeCourseUnitPeriods();
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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const courseUnits = courseUnitPeriods?.courseUnits || [];

  useEffect(() => {
    if (courseUnits.length > 0 && !selectedCourseUnit) {
      setSelectedCourseUnit(courseUnits[0].id);
    }
  }, [courseUnits]);

  useEffect(() => {
    if (!addingPeriod && editingPeriodId === null) {
      setErrorMessage(null);
    }
  }, [addingPeriod, editingPeriodId]);

  const handleAddPeriod = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedCourseUnit) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await exchangeRequestService.addCourseUnitExchangePeriod(
        startDate, endDate, selectedCourseUnit
      );
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

  const handleEditPeriod = async (e) => {
    e.preventDefault();
    if (!editingStartDate || !editingEndDate || !selectedCourseUnit || editingPeriodId === null) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await exchangeRequestService.editCourseUnitExchangePeriod(
        editingStartDate, editingEndDate, selectedCourseUnit, editingPeriodId
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

  const getCurrentPeriods = (): ExchangePeriod[] => {
    if (!courseUnits || !selectedCourseUnit) return [];
    const unit = courseUnits.find(u => u.id === selectedCourseUnit);
    return unit?.exchangePeriods || [];
  };

  const onEditChange = (periodId: number, newStartDate: Date, newEndDate: Date) => {
    if (editingPeriodId === null) {
      setEditingPeriodId(periodId);
    }
    setEditingStartDate(newStartDate);
    setEditingEndDate(newEndDate);
  };

  const onCancelEdit = () => {
    setEditingPeriodId(null);
    setEditingStartDate(undefined);
    setEditingEndDate(undefined);
    setErrorMessage(null);
  };

  const onDelete = (periodId: number) => {
    setPeriodToDelete(periodId);
    setDeleteDialogOpen(true);
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
              <div className="text-sm text-red-600 px-2 py-1 rounded-md bg-red-100 border border-red-300 mb-4">
                {errorMessage}
              </div>
            )}
            {addingPeriod && (
              <ExchangePeriodForm
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                isLoading={isLoading}
                onSubmit={handleAddPeriod}
              />
            )}
            <ExchangePeriodTable
              periods={getCurrentPeriods()}
              editingPeriodId={editingPeriodId}
              editingStartDate={editingStartDate}
              editingEndDate={editingEndDate}
              isLoading={isLoading}
              onEditChange={onEditChange}
              onEditSubmit={handleEditPeriod}
              onCancelEdit={onCancelEdit}
              onDelete={onDelete}
            />
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