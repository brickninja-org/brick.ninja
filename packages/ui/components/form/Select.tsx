import type { FC } from 'react';

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  name?: string;
  defaultValue?: string;
}

export const Select: FC<SelectProps> = ({ value, onChange, options, name, defaultValue }) => {
  return (
    <select className="flex-1 py-1.5 pr-10 pl-4 rounded-xs border-2 bg-white leading-5 appearance-none ease-in-out focus:border-blue-600 focus:outline-hidden" value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} name={name} defaultValue={defaultValue}>
      {options.map(({ label, value }) => <option className="p-2" key={value} value={value}>{label}</option>)}
    </select>
  );
};
