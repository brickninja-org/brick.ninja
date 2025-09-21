import type { FC, ReactNode } from 'react';
import type { Scope } from '@bn2me/client';

import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';

export interface Bn2AccountLoginNoticeProps {
  children?: ReactNode,
  requiredScopes: Scope[],
  optionalScopes?: Scope[],
}

export const Bn2AccountLoginNotice: FC<Bn2AccountLoginNoticeProps> = ({ children, requiredScopes, optionalScopes = [] }) => {
  const loginUrl = `/login?returnTo=${encodeURIComponent(location.pathname + location.search)}&scopes=${encodeURIComponent([...requiredScopes, ...optionalScopes].join(','))}`;

  return (
    <Notice index={false}>
      <FlexRow wrap>
        {children ?? 'You need to login to view this page.'}
        <LinkButton href={loginUrl} icon="user" appearance="tertiary">Login</LinkButton>
      </FlexRow>
    </Notice>
  );
};
