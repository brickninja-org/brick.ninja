import type { FC, ReactNode } from 'react';
import type { Revision } from '@brickninja-org/database';

import { cn, Link } from '@heroui/react';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { getLanguage, translate } from '@/lib/translate';
import { FormatDate } from '@/components/format/FormatDate';
import { Translate } from '@/components/i18n/Translate';
import { RevisionTableHiddenRows } from './RevisionTable.client';

export interface RevisionTableProps {
  revisions: Pick<Revision, 'id' | 'type' | 'buildId' | 'hash' | 'description' | 'createdAt'>[];
  currentRevisionId?: string;
  link: ({ revisionId, children }: { revisionId: string, children: ReactNode }) => ReactNode;
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
    <>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell><Translate id="revisions.build"/></Table.HeaderCell>
            <Table.HeaderCell><Translate id="revisions.description"/></Table.HeaderCell>
            <Table.HeaderCell small><Translate id="revisions.date"/></Table.HeaderCell>
            <Table.HeaderCell small><Translate id="actions"/></Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <RevisionTableHiddenRows hiddenIndexes={Array.from(hiddenIndexes)} label={translate('revisions.showHidden', language)}>
            {revisions.map((revision) => (
              <tr key={revision.id}>
                <td>{revision.buildId !== 0 ? (<Link href={`/build/${revision.buildId}`}>{revision.buildId}</Link>) : '-'}</td>
                <td className={cn(currentRevisionId === revision.id && 'font-medium')}>
                  {link({ revisionId: revision.id, children: revision.description })}
                </td>
                <td><FormatDate date={revision.createdAt} relative/></td>
                <td>
                  {currentRevisionId !== revision.id && link({ revisionId: revision.id, children: <Translate id="revisions.view"/> })}
                </td>
              </tr>
            ))}
          </RevisionTableHiddenRows>
        </tbody>
      </Table>
    </>
  );
};
