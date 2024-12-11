// app/components/DatePicker.tsx
'use client';

import { DateTimePicker } from '@/components/ui/datetime-picker';
import { es } from 'date-fns/locale';
import { useState, createContext, useContext } from 'react';

// Create context for the date
const DateContext = createContext<{
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}>({
  selectedDate: '',
  setSelectedDate: () => {},
});

export const useDate = () => useContext(DateContext);

const ClientSideExcelFilters = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(''); // Store the date in ISO format

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const isoDate = date.toISOString();
      setSelectedDate(isoDate);
    }
  };

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      <div className="my-4 grid grid-cols-2 rounded-lg bg-gray-50 p-4">
        <div className="col-span-1 mb-5">
          <label
            htmlFor="startDate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Fecha de inicio
          </label>
          <DateTimePicker
            value={selectedDate ? new Date(selectedDate) : undefined} // Convert ISO to Date for the picker
            onChange={(date) => handleDateChange(date)}
            required
            timeZone="America/Montevideo"
            locale={es}
            name="startDate"
            hideTime={true}
          />
          <input
            type="hidden"
            name="startDate"
            value={selectedDate} 
          />
        </div>
      </div>
      {children}
    </DateContext.Provider>
  );
};

export default ClientSideExcelFilters;
