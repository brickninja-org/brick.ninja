import type { FC } from 'react';

import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { List } from '@brickninja-org/ui/components/layout/List';
import { fetchAccounts } from '@/components/bn2-api/fetch-account.actions';
import { reauthorize } from '@/components/bn2-api/reauthorize';
import { Bn2AccountName } from '@/components/bn2-api/Bn2AccountName';

export const Accounts: FC = async () => {
  const accounts = await fetchAccounts([]);

  return (
    <>
      {accounts.error !== undefined
        ? (
            <form action={reauthorize.bind(null, [], undefined)}>
              <p>Authorize brick.ninja to view your collection.</p>
              <FlexRow>
                <SubmitButton icon="unlock">Authorize</SubmitButton>
              </FlexRow>
            </form>
          )
        : (
            <form action={reauthorize.bind(null, [], 'consent')}>
              <p>brick.ninja is authorized to view your collection of these accounts.</p>
              <List>
                {accounts.accounts.map((account) => (
                  <li key={account.id}><Bn2AccountName account={account} long/></li>
                ))}
              </List>
            </form>
          )
      }
    </>
  );
};
