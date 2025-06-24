'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { BethouseType } from "@/constants/betHouseTypes";

interface BetHouseypeSelectorProps {
  selected: BethouseType | '';
  onChange: (value: BethouseType) => void;
}

function BetHouseypeSelector({ selected, onChange }: BetHouseypeSelectorProps) {
  const getLabel = (value: BethouseType | '') => {
    if (value === 'cassino') return 'Cassino';
    if (value === '7kbet') return '7k Bet';
    return '';
  };

  return (
    <div className="sm:col-span-3">

      <Select.Root value={selected} onValueChange={(value) => onChange(value as BethouseType)}>
        <Select.Trigger className="flex items-center justify-between w-[100px] rounded-md bg-[#15161D] px-3 py-1.5 border border-[#3A4052] text-xs text-[#B0B6C9]">
          {selected ? (
            <Select.Value>{getLabel(selected)}</Select.Value>
          ) : (
            <span className="text-[#667191]">Selecione</span>
          )}
          <ChevronDown className="w-4 h-4 text-[#858FAB]" />
        </Select.Trigger>

        <Select.Content className="bg-[#15161D] border border-[#3A4052] rounded-md shadow-md text-xs text-[#B0B6C9]">
          {(['7kbet', 'cassino'] as BethouseType[]).map((option) => (
            <Select.Item
              key={option}
              value={option}
              className={`cursor-pointer px-3 py-1.5 hover:bg-gradient-to-r from-red-500 to-orange-500 hover:text-white flex items-center justify-between ${selected === option ? 'bg-[#282B38]' : ''}`}
            >
              <Select.ItemText>{getLabel(option)}</Select.ItemText>
              {selected === option && <Check className="w-3 h-3 text-white" />}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
export default BetHouseypeSelector
