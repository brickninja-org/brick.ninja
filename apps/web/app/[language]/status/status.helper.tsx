import { FormatNumber } from '@/components/format/FormatNumber';

const API_ERROR_THRESHOLD = 0.1;
const API_SLOW_THRESHOLD = 0.1;
const JOBS_WARNING_THRESHOLD = 25;

export type StatusRowData = {
  description: string | JSX.Element,
  statusColor: string,
};

export function getStatusRow(
  type: 'jobs',
  value: number
): StatusRowData;
export function getStatusRow(
  type: 'api',
  total: number,
  errors: number,
  slow: number
): StatusRowData;
export function getStatusRow(
  type: 'database',
  size: string
): StatusRowData;

export function getStatusRow(
  type: 'jobs' | 'api' | 'database',
  a: number | string,
  b?: number,
  c?: number
): StatusRowData {
  if (type === 'jobs' && typeof a === 'number') {
    return {
      description: `${a} queued jobs`,
      statusColor: a > JOBS_WARNING_THRESHOLD ? 'text-warning' : 'text-success',
    };
  }

  if (type === 'api' && typeof a === 'number' && typeof b === 'number' && typeof c === 'number') {
    const total = a;
    const errors = b;
    const slow = c;

    const errorsPct = total > 0 ? errors / total : 0;
    const slowPct = total > 0 ? slow / total : 0;

    if (errorsPct > API_ERROR_THRESHOLD) {
      return { statusColor: 'text-danger', description: <><FormatNumber value={errors}/> errors in the last 30 minutes</> };
    }

    if (slowPct > API_SLOW_THRESHOLD) {
      return { statusColor: 'text-warning', description: <><FormatNumber value={slow}/> slow requests in the last 30 minutes</> };
    }

    return { statusColor: 'text-success', description: <><FormatNumber value={total}/> requests in the last 30 minutes</> };
  }

  if (type === 'database' && typeof a === 'string') {
    return { statusColor: 'text-success', description: a };
  }

  throw new Error('Invalid arguments for getStatusRow');
}
