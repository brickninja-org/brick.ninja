import { useCallback, type ChangeEvent, type FC, type HTMLInputAutoCompleteAttribute } from 'react';

export interface TextInputProps {
  type?: 'text' | 'password' | 'search' | 'date';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
}

export const TextInput: FC<TextInputProps> = ({ type = 'text', onChange, ...props }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return (
    <input className="flex-1 py-1.5 px-4 rounded-sm border-2 bg-white" type={type} onChange={onChange && handleChange} {...props}/>
  );
};
