import type { FC, ReactNode } from 'react';

import { Fragment } from 'react';

import { isTruthy } from '@brickninja-org/helper/is';

interface DataListProps {
  data: ({
    label: ReactNode;
    value: ReactNode;
    key: string;
  } | false | undefined)[];
}

export const DataList: FC<DataListProps> = ({ data }) => {
  return (
    <dl className="grid grid-cols-[auto_1fr] items-baseline">
      {data.filter(isTruthy).map(({ label, value, key }) => (
        <Fragment key={key}>
          <dt className="self-stretch py-1 pr-4 border-r-2 border-(--color-border) font-medium">{label}</dt>
          <dd className="ml-4 py-1">{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
};
