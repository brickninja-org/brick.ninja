import type { FC } from 'react';

import { Tip } from '@brickninja-org/ui/components/tip/Tip';

import { Code } from '@/components/layout/code';

export interface JsonProps {
  data: object,
  borderless?: boolean,
}

const comma = <span className="text-muted">, </span>;

function renderJson([key, value]: [string, unknown], index: number, array: unknown[]) {
  return (
    <div key={key} style={{ marginLeft: 16 }}>&quot;{key}&quot;: {renderValue(value, index, array)}</div>
  );
}

function renderValue(value: unknown, index: number, array: unknown[]) {
  const maybeComma = index < array.length - 1 && comma;

  switch(typeof value) {
    case 'string':
      return (
        <span key={index} className="text-success">
          &quot;{value.startsWith('https://www.lego.com/cdn/')
            // eslint-disable-next-line @next/next/no-img-element
            ? <Tip tip={<img className="max-w-[190px] max-h-[190px]" src={value} alt="Preview"/>}><a href={value} className="text-success">{value}</a></Tip>
            : value.replaceAll('"', '\\"')
          }&quot;{maybeComma}
        </span>
      );
    case 'number':
    case 'boolean':
      return <span key={index} className="text-danger">{value.toString()}{maybeComma}</span>;
    case 'object':
      if (value === null) {
        return <span key={index} className="text-danger">null{maybeComma}</span>;
      }
      return Array.isArray(value)
        ? <span key={index}>[{value.length > 0 && (<div className="m-4">{value.map(renderValue)}</div>)}]{maybeComma}</span>
        : <span key={index}>{'{'}{Object.entries(value).map(renderJson)}{'}'}{maybeComma}</span>;
  }

  return typeof value;
}

export const Json: FC<JsonProps> = ({ data, borderless = false }) => {
  return (
    <Code borderless={borderless}>
      {'{'}
      {Object.entries(data).map(renderJson)}
      {'}'}
    </Code>
  );
};
