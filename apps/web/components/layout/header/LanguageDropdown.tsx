'use client';

import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { Radiobutton } from '@brickninja-org/ui/components/form/Radiobutton';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { Icon } from '@brickninja-org/ui/icons';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/FormatConfigDialog';

const languages = {
  en: 'English',
  nl: 'Nederlands',
};

export const LanguageDropdown: FC = () => {
  const { push } = useRouter();

  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  const language = useLanguage();
  const localeName = languages[language];

  const changeLanguage = useCallback((language: Language) => {
    const url = new URL(window.location.href);
    url.hostname = language + url.hostname.substring(2);
    push(url.href);
  }, [push]);

  return (
    <>
      <Dropdown
        hideTop={false}
        preferredPlacement="bottom"
        button={(
          <Button radius="sm" variant="light" aria-label={localeName} className="gap-1 px-3" startContent={<Icon icon="globe" className="min-w-10 w-10 md:min-w-20"/>}>
            <span className="hidden md:block">{localeName}</span>
          </Button>
        )}
      >
        <MenuList>
          <Radiobutton checked={language === 'en'} onChange={() => changeLanguage('en')}>{languages.en}</Radiobutton>
          <Radiobutton checked={language === 'nl'} onChange={() => changeLanguage('nl')}>{languages.nl}</Radiobutton>
          <Separator/>
          <Button radius="sm" variant="light" onPress={() => setFormatDialogOpen(true)}>Formatting Settings</Button>
        </MenuList>
      </Dropdown>

      <FormatConfigDialog open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>
    </>
  );
};
