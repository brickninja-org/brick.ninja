import type { FC } from 'react';
import type { Bn2Account } from './types';

import { Tip } from '@brickninja-org/ui/components/tip/Tip';

interface Bn2AccountNameProps {
  account: Bn2Account;
  long?: boolean;
}

export const Bn2AccountName: FC<Bn2AccountNameProps> = ({ account, long }) => {
  // if the account does not have a displayName, always just return the name
  if (!account.displayName) {
    return <span className="whitespace-nowrap">{account.name}</span>;
  }

  if (long) {
    return <span className="whitespace-nowrap">{account.displayName} ({account.name})</span>;
  }

  return (
    <Tip tip={account.name}>
      <span className="whitespace-nowrap">{account.displayName}</span>
    </Tip>
  );
};
