import type { FC, KeyboardEventHandler, ReactNode } from 'react';

import { useCallback, useId, useRef } from 'react';
import { tv } from 'tailwind-variants';

export interface RadiobuttonProps {
  checked: boolean,
  onChange: (checked: boolean) => void,
  children: ReactNode,
}

const radio = tv({
  slots: {
    base: 'inline-flex flex-row items-center gap-2 rounded-xs py-2 px-4 leading-5 cursor-pointer hover:bg-panel-hover hover:text-panel-hover focus-visible:outline-hidden',
    input: 'hidden',
    circle: 'relative flex w-5 h-5 rounded-full border-2 bg-accent-soft text-transparent appearance-none after:content-[""] after:absolute after:top-1 after:left-1 after:block after:w-2 after:h-2 after:rounded-full after:bg-accent-soft-foreground [stroke-dasharray:_16_16] [strokepffset:_16]',
    content: 'flex-1 flex items-center gap-1',
  },
  variants: {
    checked: {
      true: {
        circle: 'border-blue-800 bg-blue-800',
      }
    }
  }
});

export const Radiobutton: FC<RadiobuttonProps> = ({ checked, onChange, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const styles = radio();

  const labelOnKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback((e) => {
    if(e.key === 'Enter' || e.key === ' ') {
      inputRef.current?.click();
      e.preventDefault();
    }
  }, []);

  return (
    <label htmlFor={id} className={styles.base()} tabIndex={0} onKeyDown={labelOnKeyDown}>
      <input id={id} ref={inputRef} type="radio" checked={checked} onChange={(e) => onChange(e.target.checked)} className={styles.input()} tabIndex={-1}/>
      <div className={styles.circle({ checked })}/>
      <div className={styles.content()}>
        {children}
      </div>
    </label>
  );
};
