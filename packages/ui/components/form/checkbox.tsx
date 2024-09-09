'use client';

import { forwardRef, useCallback, useEffect, useId, useRef, type KeyboardEventHandler, type ReactNode, type Ref } from 'react';

export interface CheckboxProps {
  ref: Ref<HTMLLabelElement>;
  checked?: boolean;
  defaultChecked?: boolean;
  formValue?: string;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(({ checked, defaultChecked, formValue, indeterminate = false, onChange, name, disabled, children }, ref) => {
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
    <label htmlFor={id} className="inline-flex flex-row gap-2 py-2 px-4 rounded-sm leading-normal cursor-pointer select-none" tabIndex={0} onKeyDown={labelOnKeyDown} ref={ref} aria-disabled={disabled}>
      <input id={id} ref={inputRef} type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onChange?.(e.target.checked)} className="" tabIndex={-1} name={name} value={formValue} disabled={disabled}/>
      <div className="flex-1">{children}</div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
