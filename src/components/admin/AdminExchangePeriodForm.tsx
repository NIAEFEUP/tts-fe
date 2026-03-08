"use client";

import { DateTimePicker } from '../ui/datetime-picker';
import { Button } from '../ui/new/newButton';
import { CheckIcon } from 'lucide-react';
import React from 'react';

interface ExchangePeriodFormProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  isLoading: boolean;
  onSubmit: (e) => void;
}

export const ExchangePeriodForm: React.FC<ExchangePeriodFormProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col xl:flex-row gap-4 mb-6">
      <DateTimePicker value={startDate} onChange={setStartDate} placeholder="Início" />
      <DateTimePicker value={endDate} onChange={setEndDate} placeholder="Fim" />
      <Button type="submit" disabled={isLoading} square size="md">
        <CheckIcon size="18" />
      </Button>
    </form>
  );
};