'use client';

import { useActionState } from 'react';
import { addToast, Alert, Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { submit } from './actions';

export function QueueJobForm({ jobs }: { jobs: { key: string; label: string }[] }) {
  const [state, formAction, isPending] = useActionState(submit, {});

  return (
    <Form action={formAction}>
      {state.error && (
        <Alert color="danger" title={state.error}/>
      )}
      {state.success && addToast({ title: state.success, color: 'success' })}
      <Select
        className="max-w-xs"
        items={jobs}
        label="Type"
        name="type"
        placeholder="Select a job type"
      >
        {(job) => <SelectItem>{job.label}</SelectItem>}
      </Select>

      <Input
        className="max-w-xs"
        label="Data"
        name="data"
        defaultValue="{}"/>

      <FlexRow>
        <Button isLoading={isPending} type="submit">Queue</Button>
      </FlexRow>
    </Form>
  );
}
