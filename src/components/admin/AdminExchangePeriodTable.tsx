"use client";

import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '../ui/table';
import { DateTimePicker } from '../ui/datetime-picker';
import { Button } from '../ui/button';
import { Edit2Icon, Trash2Icon, CheckIcon } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';

export interface ExchangePeriod {
  id: number;
  startDate: string;
  endDate: string;
}

interface ExchangePeriodTableProps {
  periods: ExchangePeriod[];
  editingPeriodId: number | null;
  editingStartDate: Date | undefined;
  editingEndDate: Date | undefined;
  isLoading: boolean;
  onEditChange: (periodId: number, newStartDate: Date, newEndDate: Date) => void;
  onEditSubmit: (e) => void;
  onCancelEdit: () => void;
  onDelete: (periodId: number) => void;
  formatDate?: (dateString: string) => string;
}

export const ExchangePeriodTable: React.FC<ExchangePeriodTableProps> = ({
  periods,
  editingPeriodId,
  editingStartDate,
  editingEndDate,
  isLoading,
  onEditChange,
  onEditSubmit,
  onCancelEdit,
  onDelete,
  formatDate = (dateString: string) => format(new Date(dateString), 'yyyy-MM-dd HH:mm'),
}) => {
  return (
    <Table className="w-full table-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-12">#</TableHead>
          <TableHead className="text-center font-mono">Início</TableHead>
          <TableHead className="text-center font-mono">Fim</TableHead>
          <TableHead className="text-center font-mono">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.length > 0 ? (
          periods.map((period, index) => (
            <TableRow key={period.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="text-center font-mono">
                {editingPeriodId === period.id ? (
                  <DateTimePicker
                    value={editingStartDate}
                    onChange={(date) => onEditChange(period.id, date!, editingEndDate!)}
                  />
                ) : (
                  formatDate(period.startDate)
                )}
              </TableCell>
              <TableCell className="text-center font-mono">
                {editingPeriodId === period.id ? (
                  <DateTimePicker
                    value={editingEndDate}
                    onChange={(date) => onEditChange(period.id, editingStartDate!, date!)}
                  />
                ) : (
                  formatDate(period.endDate)
                )}
              </TableCell>
              <TableCell className="flex justify-center gap-2">
                {editingPeriodId === period.id ? (
                  <>
                    <Button onClick={onEditSubmit} size="sm" disabled={isLoading}>
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={onCancelEdit} variant="destructive" size="sm">
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() =>
                        onEditChange(period.id, new Date(period.startDate), new Date(period.endDate))
                      }
                      size="sm"
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => onDelete(period.id)} variant="destructive" size="sm" disabled={isLoading}>
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
  );
};