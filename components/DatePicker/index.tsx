'use client';

import 'react-day-picker/dist/style.css';
import { DateRange, DayPicker } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';
import { ThemeIcon } from '@/components/Icon';
import { useState } from 'react';
import moment from 'moment';
import {
	CustomCloseButton,
	CustomDatePicker,
	CustomDatePickerButton,
	ThemeDatePickerContainer,
} from './styles';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type ThemeDatePickerProps =
	| {
		mode: 'single';
		value: Date | undefined;
		onChange: (value: Date | undefined) => void;
	}
	| {
		mode: 'range';
		value: DateRange | undefined;
		onChange: (value: DateRange | undefined) => void;
	};

export const ThemeDatePicker = (props: ThemeDatePickerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { is768 } = useMediaQuery();

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleClear = () => {
		props.onChange(undefined as any);
	};

	const formatDisplay = () => {
		if (props.mode === 'single') {
			if (props.value) {
				return moment(props.value).format('DD MMM YYYY');
			}
			return 'Selecionar';
		} else {
			if (props.value?.from) {
				const from = moment(props.value.from).format('DD MMM');
				const to = props.value.to ? moment(props.value.to).format('DD MMM YYYY') : '';
				return `${from} - ${to}`;
			}
			return 'Selecionar';
		}
	};

	if (is768) return null;

	return (
		<ThemeDatePickerContainer>
			<CustomDatePickerButton onClick={toggleOpen}>
				<ThemeIcon
					type="theme/analytics"
					icon="calendar-icon"
					width={16}
					height={16}
				/>
				<span>{formatDisplay()}</span>
			</CustomDatePickerButton>

			{props.value !== undefined && (
				<CustomCloseButton onClick={handleClear}>X</CustomCloseButton>
			)}

			{isOpen && (
				<CustomDatePicker>
					<CustomCloseButton onClick={toggleOpen}>X</CustomCloseButton>

					{props.mode === 'single' ? (
						<DayPicker
							mode="single"
							selected={props.value}
							onSelect={props.onChange}
							locale={ptBR}
						/>
					) : (
						<DayPicker
							mode="range"
							selected={props.value}
							onSelect={props.onChange}
							locale={ptBR}
						/>
					)}
				</CustomDatePicker>
			)}

		</ThemeDatePickerContainer>
	);
};
