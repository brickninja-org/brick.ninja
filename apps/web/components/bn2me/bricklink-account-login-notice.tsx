import type { FC, ReactNode } from 'react';

import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { Notice } from '@brickninja-org/ui/components/notice';

export interface BricklinkAccountLoginNoticeProps {
  children?: ReactNode;
  requiredScopes: [];
  optionalScopes?: [];
}

export const BricklinkAccountLoginNotice: FC<BricklinkAccountLoginNoticeProps> = ({ children, requiredScopes, optionalScopes = [] }) => {
  const loginUrl = `/login?returnTo=${encodeURIComponent('' /* TODO fix error location.pathname + location.search/*/)}&scopes=${encodeURIComponent([...requiredScopes, ...optionalScopes].join(','))}`;

  return (
    <Notice index={false}>
      <FlexRow wrap>
        {children ?? 'You need to login to view this page.'}
        <LinkButton href={loginUrl} icon="person" appearance="tertiary">Login</LinkButton>
      </FlexRow>
    </Notice>
  );
};
