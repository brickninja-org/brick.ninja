import type { FC, ReactNode } from 'react';
import type { Revision } from '@brickninja-org/database';

import { cn, Link } from '@heroui/react';

import { getLanguage, translate } from '@/lib/translate';
import { FormatDate } from '@/components/format/FormatDate';
import { Translate } from '@/components/i18n/Translate';
import { Table as StaticTable, TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from '@/components/table/StaticTable';
import { RevisionTableHiddenRows } from './RevisionTable.client';

export interface RevisionTableProps {
  revisions: Pick<Revision, 'id' | 'type' | 'buildId' | 'hash' | 'description' | 'createdAt'>[],
  currentRevisionId?: string,
  link: ({ revisionId, children }: { revisionId: string, children: ReactNode }) => ReactNode,
}

export const RevisionTable: FC<RevisionTableProps> = async ({ revisions, currentRevisionId, link }) => {
  const language = await getLanguage();
  const hiddenIndexes = new Set<number>();

  // iterate through all revisions and find indexes to hide
  for (const [i, revision] of revisions.entries()) {
    const earlierRevision = revisions[i + 1];

    if (
      // there has to be an earlier revision
      earlierRevision &&
      // ...that is a removal (so the current is a rediscovery)...
      revision.type === 'Updated' && earlierRevision.type === 'Removed' &&
      // ...the hash has to match (and not be empty)...
      revision.hash === earlierRevision.hash && revision.hash !== '' &&
      // ..and the user is not viewing any of these revisions...
      revision.id !== currentRevisionId && earlierRevision.id !== currentRevisionId
    ) {
      // ...then hide them both
      hiddenIndexes.add(i);
      hiddenIndexes.add(i + 1);
    }
  }

  return (
    <TableRoot className="overflow-x-auto overflow-y-hidden">
      <StaticTable aria-label="History table" className="w-full" layout="auto">
        <TableHeader>
          <TableRow>
            <TableColumnHeader><Translate id="revisions.build"/></TableColumnHeader>
            <TableColumnHeader><Translate id="revisions.description"/></TableColumnHeader>
            <TableColumnHeader><Translate id="revisions.date"/></TableColumnHeader>
            <TableColumnHeader><Translate id="actions"/></TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RevisionTableHiddenRows hiddenIndexes={Array.from(hiddenIndexes)} label={translate('revisions.showHidden', language)}>
            {revisions.map((revision) => (
              <TableRow key={revision.id} className="[&>td]:px-2 [&>td]:py-1.5 first:[&>td]:pt-4">
                <TableCell>{revision.buildId !== 0 ? (<Link href={`/build/${revision.buildId}`}>{revision.buildId}</Link>) : '-'}</TableCell>
                <TableCell className={cn(currentRevisionId === revision.id && 'font-medium', 'whitespace-nowrap')}>
                  {link({ revisionId: revision.id, children: revision.description })}
                </TableCell>
                <TableCell className="whitespace-nowrap"><FormatDate date={revision.createdAt} relative/></TableCell>
                <TableCell>
                  {currentRevisionId !== revision.id && link({ revisionId: revision.id, children: <Translate id="revisions.view"/> })}
                </TableCell>
              </TableRow>
            ))}
          </RevisionTableHiddenRows>
        </TableBody>
      </StaticTable>
    </TableRoot>
  );
};
