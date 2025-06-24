import { format } from "date-fns";

export const formatDateTimeToInput = (dateInput: Date | string | undefined): string => {
        if (!dateInput) return '';

        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        if (isNaN(date.getTime())) {
            return '';
        }
        return format(date, "yyyy-MM-dd'T'HH:mm");
    };