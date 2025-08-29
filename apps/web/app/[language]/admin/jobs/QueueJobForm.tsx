'use client';

import { cn, Input, Select, SelectItem, type InputProps, type SelectProps } from '@heroui/react';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { Form } from '@/components/form/Form';
import { SubmitButton } from '@/components/form/SubmitButton';
import { submit } from './actions';

export interface QueueJobFormProps {
  jobs: { key: string; label: string }[];
  className?: string;
}

export function QueueJobForm({ className, jobs }: QueueJobFormProps) {
  const inputProps: Pick<InputProps, 'labelPlacement' | 'classNames'> = {
    labelPlacement: 'outside',
    classNames: {
      label: 'text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700',
    }
  };

  const selectProps: Pick<SelectProps, 'labelPlacement' | 'classNames'> = {
    labelPlacement: 'outside',
    classNames: {
      label: 'text-small font-medium text-default-700 group-data-[filled=true]:text-default-700',
    }
  };
  return (
    <Form id="queue" className={cn(className)} action={submit}>
      <Select
        isRequired
        className="max-w-xs"
        items={jobs}
        label="Type"
        name="type"
        placeholder="Select a job type"
        {...selectProps}
      >
        {(job) => <SelectItem>{job.label}</SelectItem>}
      </Select>

      <Input
        className="max-w-xs"
        label="Data"
        name="data"
        defaultValue="{}"
        {...inputProps}/>

      <FlexRow>
        <SubmitButton variant="ghost">Queue</SubmitButton>
      </FlexRow>
    </Form>
  );
}
