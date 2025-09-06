import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { SessionUser } from '@/lib/get-user';

import { Suspense } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Skeleton } from '@heroui/react';
import { UserRole } from '@brickninja-org/database';
import { Icon } from '@brickninja-org/ui/icons';

import { getUser } from '@/lib/get-user';
import { getTranslate } from '@/lib/translate';
import { Translate } from '@/components/i18n/Translate';
import { reauthorize } from '@/components/bn2-api/reauthorize';
import { SubmitButton } from '@/components/form/SubmitButton';

export interface UserButtonProps {
  language: Language;
}

export const UserButton: FC<UserButtonProps> = ({ language }) => {
  return (
    <Suspense>
      <UserButtonLoader language={language}/>
    </Suspense>
  );
};

// internal component to load the user
const UserButtonLoader: FC<UserButtonProps> = async ({ language }) => {
  const user = await getUser();

  return <UserButtonInternal language={language} user={user}/>;
};

interface UserButtonInternalProps {
  user?: SessionUser | 'loading';
  language: Language;
}

// internal component to show loader | user | login
const UserButtonInternal: FC<UserButtonInternalProps> = ({ user, language }) => {
  const t = getTranslate(language);

  if (!user) {
    return (
      <Button
        aria-label={t('login')}
        className="min-w-10 w-10 md:min-w-20 md:w-fit"
        href="/login"
        radius="sm"
        startContent={<Icon icon="user"/>}
        variant="light"
      >
        <span className="hidden md:block">
          <Translate id="login" language={language}/>
        </span>
      </Button>
    );
  }

  const button = (
    <Button
      aria-label={user === 'loading' ? undefined : user.name}
      className="min-w-10 w-10 md:min-w-20 md:w-fit"
      href="/profile"
      radius="sm"
      startContent={<Icon icon="user"/>}
      variant="light"
    >
      <span className="hidden md:block">{user === 'loading' ? <Skeleton className="w-20"/> : user.name}</span>
    </Button>
  );

  return (
    <Dropdown offset={8} placement="bottom-end" radius="sm" shadow="md">
      <DropdownTrigger>{button}</DropdownTrigger>
      <DropdownMenu>
        <DropdownSection showDivider title="actions">
          <DropdownItem
            key="profile"
            href="/profile"
            startContent={<Icon icon="user"/>}
          >
            <Translate id="user.profile" language={language}/>
          </DropdownItem>
          {user !== 'loading' && user.roles.includes(UserRole.Admin) ? (
            <DropdownItem
              key="admin"
              href="/admin/users"
              startContent={<Icon icon="developer"/>}
            >
              <Translate id="user.role.admin" language={language}/>
            </DropdownItem>
          ) : null}
          <DropdownItem key="logout">
            <form action="/logout" method="POST" className="flex w-full">
              <SubmitButton
                radius="sm"
                size="sm"
                startContent={<Icon icon="logout"/>}
                variant="light"
              >
                <Translate id="logout" language={language}/>
              </SubmitButton>
            </form>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="accounts">
          <DropdownItem key="manage-accounts">
            <form action={reauthorize.bind(null, [], 'consent')} className="flex w-full">
              <SubmitButton
                radius="sm"
                size="sm"
                startContent={<Icon icon="unlock"/>}
                variant="light"
              >
                <Translate id="user.manage-accounts" language={language}/>
              </SubmitButton>
            </form>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
