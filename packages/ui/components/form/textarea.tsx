import { type ChangeEvent, type FC, useCallback } from 'react';

export interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

export const Textarea: FC<TextareaProps> = ({ onChange, ...props }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return <textarea className="w-full min-h-24 py-2 px-4 rounded-sm border bg-white resize-y focus:outline-hidden" onChange={onChange && handleChange} {...props}/>;
};
