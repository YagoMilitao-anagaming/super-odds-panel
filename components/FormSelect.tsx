'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import React from 'react';

export type FormSelectOption<T extends string> = {
  label: string;
  value: T;
};

type FormSelectProps<T extends string> = {
  value: T;
  onChange: (val: T) => void;
  options: FormSelectOption<T>[];
  placeholder?: string;
  label: string;
};

const FormSelect = <T extends string>({
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção',
  label,
}: FormSelectProps<T>) => {
  return (
    <div className="sm:col-span-3">
      <label className="block text-xs mb-1 text-[#B0B6C9]">{label}</label>

      <Select.Root value={value} onValueChange={(val) => onChange(val as T)}>
        <Select.Trigger className="relative flex items-center justify-between w-full rounded-md bg-[#15161D] px-3 py-1.5 border border-[#3A4052] text-xs text-[#B0B6C9]">
          <Select.Value placeholder={placeholder} />
          <ChevronDown className="w-4 h-4 text-[#858FAB]" />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            side="bottom"
            sideOffset={4}
            align="start"
            className="w-[380px] min-w-[180px] rounded-md border border-[#3A4052] bg-[#15161D] shadow-md text-xs text-[#B0B6C9] z-50"
          >
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={`cursor-pointer px-3 py-1.5 flex items-center justify-between
                  hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white
                  ${value === option.value ? 'bg-[#282B38]' : ''}`}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                {value === option.value && <Check className="w-3 h-3 text-white" />}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default FormSelect;
