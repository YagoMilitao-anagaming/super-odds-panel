import React from 'react';

type SmarticoType = '7kbet' | 'cassino';

interface Props {
  selected: SmarticoType;
  onChange: (value: SmarticoType) => void;
}

export const smarticoCodes: Record<'7kbet' | 'cassino', string> = {
  '7kbet': '6271111',
  'cassino': '6651071',
};

const SmarticoTypeSelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="sm:col-span-3">

      {/* <label className="block text-sm/6 font-medium text-gray-900 mb-1">
        Código smartico
      </label> */}

      <div className="flex items-center space-x-4 mb-3 text-xs">
        {(['7kbet', 'cassino'] as SmarticoType[]).map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer mt-1.5 mb-1.5">
            <input
              type="radio"
              name="smarticoType"
              value={option}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="peer hidden"
            />
            <div
              className={`
        w-4 h-4 rounded-full border
        ${selected === option ? 'bg-[#858FAB] border-[#858FAB]' : 'bg-[#15161D] border-[#858FAB]'}
        peer-checked:bg-[#FC830B] peer-checked:border-[#FC830B]
      `}
            ></div>
            <span>{option === '7kbet' ? '7k bet' : 'Cassino'}</span>
          </label>
        ))}

      </div>

      <div>
        <input
          id="smartico-code"
          name="smartico-code"
          value={smarticoCodes[selected]}
          disabled
          className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 border border-[#3A4052] text-base text-[#858FAB] placeholder:text-[#3A4052]  sm:text-xs"
        />
      </div>
    </div>
  );
};

export default SmarticoTypeSelector;
