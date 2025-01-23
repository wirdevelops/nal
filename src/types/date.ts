export interface DateRange {
    from?: Date | null;
    to?: Date | null;
  }
  
  export type DateValue = Date | null;
  
  export interface CalendarProps {
    mode?: 'single' | 'range' | 'multiple';
    selected?: Date | Date[] | DateRange;
    onSelect?: (date: Date | Date[] | DateRange | undefined) => void;
    disabled?: (date: Date) => boolean;
    defaultMonth?: Date;
    numberOfMonths?: number;
    showOutsideDays?: boolean;
    fixedWeeks?: boolean;
    ISOWeek?: boolean;
  }
  
  export interface DatePickerProps {
    date?: Date;
    onSelect?: (date: Date | undefined) => void;
    disabled?: boolean;
  }
  
  export interface DateRangePickerProps {
    from?: Date | null;
    to?: Date | null;
    onChange?: (range: { from: Date | null; to: Date | null }) => void;
    disabled?: boolean;
  }