'use client';

import type { FC, KeyboardEventHandler, ReactNode } from 'react';
import type { RefProp } from '../../lib/react';

import { useCallback, useEffect, useId, useRef } from 'react';

import { Icon } from '../../icons';

export interface CheckboxProps extends RefProp<HTMLLabelElement> {
  checked?: boolean,
  defaultChecked?: boolean,
  formValue?: string,
  indeterminate?: boolean,
  onChange?: (checked: boolean) => void,
  name?: string,
  children?: ReactNode,
  disabled?: boolean,
}

export const Checkbox: FC<CheckboxProps> = ({ ref, checked, defaultChecked, formValue, indeterminate = false, onChange, name, disabled, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const labelOnKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      inputRef.current?.click();
      e.preventDefault();
    }
  }, []);

  return (
    <label htmlFor={id} className="inline-flex flex-row items-center gap-2.5 py-2 px-4 rounded-xs leading-normal cursor-pointer select-none hover:bg-gray-100" tabIndex={0} onKeyDown={labelOnKeyDown} ref={ref} aria-disabled={disabled}>
      <input className="peer hidden" id={id} ref={inputRef} type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onChange?.(e.target.checked)} tabIndex={-1} name={name} value={formValue} disabled={disabled}/>
      <div className="peer-checked:border-blue-800 peer-indeterminate:border-blue-800 peer-checked:bg-blue-800 peer-indeterminate:bg-blue-800 peer-checked:text-white peer-checked:[stroke-dashoffset:0] peer-checked:transition-[stroke-dashoffset] peer-checked:duration-300 relative flex items-center justify-center w-5 h-5 m-0 rounded-xs border-2 bg-white text-transparent transition-colors [stroke-dasharray:20_20] [stroke-dashoffset:20] appearance-none [--icon-size:1em]"><Icon icon="checkmark"/></div>
      <div className="flex-1">{children}</div>
    </label>
  );
};
