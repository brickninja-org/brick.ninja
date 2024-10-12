'use client';

import { useCallback, useEffect, useId, useRef, type FC, type KeyboardEventHandler, type ReactNode } from 'react';

import type { RefProp } from '../../lib/react';
import { Icon } from '../../icons';

export interface CheckboxProps extends RefProp<HTMLLabelElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  formValue?: string;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  children?: ReactNode;
  disabled?: boolean;
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
    <label htmlFor={id} className="inline-flex flex-row gap-2.5 py-2 px-4 rounded-sm leading-normal cursor-pointer select-none" tabIndex={0} onKeyDown={labelOnKeyDown} ref={ref} aria-disabled={disabled}>
      <input id={id} ref={inputRef} type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onChange?.(e.target.checked)} className="" tabIndex={-1} name={name} value={formValue} disabled={disabled}/>
      <div className="relative flex w-5 h-5 m-0 rounded-sm border-2 text-transparent transition-colors [stroke-dasharray:16_16] [stroke-dashoffset:16] appearance-none"><Icon icon="checkmark"/></div>
      <div className="flex-1">{children}</div>
    </label>
  );
};
