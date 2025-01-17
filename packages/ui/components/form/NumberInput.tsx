import type { FC, ChangeEvent } from 'react';

import { useCallback } from 'react';

export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  min?: number;
  max?: number;
}

export const NumberInput: FC<NumberInputProps> = ({ value, defaultValue, placeholder, name, readOnly, min, max, onChange }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(e.target.value));
  }, [onChange]);

  return (
    <input className="flex-1 py-1.5 px-4 rounded-xs border-2 bg-white" type="number" value={value ?? ''} defaultValue={defaultValue} placeholder={placeholder} name={name} readOnly={readOnly} min={min} max={max} onChange={onChange && handleChange}/>
  );
};
