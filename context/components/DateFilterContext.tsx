'use client';

import { createContext, ReactNode, useCallback, useState } from 'react';
import moment from 'moment';

interface HasCreatedAt {
	created_at: string;
	[key: string]: any;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DateFilterContextProps {
	filteredData: (_: any[]) => any[];
	startDate: ValuePiece;
	endDate: ValuePiece;
	handleSetStartDate: (_: Date | null) => void;
	handleSetEndDate: (_: Date | null) => void;
}

export const DateFilterContext = createContext({} as DateFilterContextProps);

export function DateFilterContextProvider({
	children,
}: {
	children: ReactNode;
}) {
	// Initialize date states with null as the initial value
	const [startDate, setStartDate] = useState<ValuePiece>(null);
	const [endDate, setEndDate] = useState<ValuePiece>(null);

	// Handlers
	const handleSetStartDate = useCallback(
		(date: Date | null) => {
			if (date && endDate && moment(date).isAfter(moment(endDate))) {
				// Se a nova startDate for após a endDate, ajustamos a endDate
				setEndDate(date);
			}
			setStartDate(date);
		},
		[endDate],
	);

	const handleSetEndDate = useCallback(
		(date: Date | null) => {
			if (date && startDate && moment(date).isBefore(moment(startDate))) {
				// Se a nova endDate for antes da startDate, ajustamos a startDate
				setStartDate(date);
			}
			setEndDate(date);
		},
		[startDate],
	);


	const filteredData = useCallback(
		(data: any[]) => {
			if (!data || !startDate || !endDate) return data;

			const start = moment(startDate);
			const end = moment(endDate);

			return data.filter((item: HasCreatedAt) => {
				const createdAt = moment(item.created_at);
				return createdAt.isBetween(start, end, undefined, '[]');
			});
		},
		[startDate, endDate],
	);

	return (
		<DateFilterContext.Provider
			value={{
				filteredData,
				handleSetEndDate,
				handleSetStartDate,
				endDate,
				startDate,
			}}
		>
			{children}
		</DateFilterContext.Provider>
	);
}
