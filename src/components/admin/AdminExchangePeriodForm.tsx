"use client";

import { DateTimePicker } from '../ui/datetime-picker';
import { Button } from '../ui/button';
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
      <Button type="submit" disabled={isLoading} className="md:mt-0">
        <CheckIcon className="h-5 w-5" />
      </Button>
    </form>
  );
};