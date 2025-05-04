import type { Scope } from '@bn2me/client';
import type { FC, ReactNode } from 'react';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { reauthorize } from './reauthorize';

export interface Bn2AccountAuthorizationNoticeProps {
  children?: ReactNode;
  scopes: Scope[];
  requiredScopes: Scope[];
  optionalScopes?: Scope[];
}

export const Bn2AccountAuthorizationNotice: FC<Bn2AccountAuthorizationNoticeProps> = ({ children, scopes, requiredScopes, optionalScopes = [] }) => {
  const missingRequiredScopes = requiredScopes.some((scope) => !scopes.includes(scope));
  if (!missingRequiredScopes) {
    return null;
  }

  return (
    <form action={reauthorize.bind(null, [...requiredScopes, ...optionalScopes], undefined)}>
      <Notice index={false}>
        <FlexRow wrap>
          {children ?? 'brick.ninja requires additional authorizations to display this page.'}
          <SubmitButton type="submit" icon="user" appearance="tertiary">Authorize</SubmitButton>
        </FlexRow>
      </Notice>
    </form>
  );
};
