'use client';

import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Separator } from '@heroui/react';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/FormatConfigDialog';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { Radiobutton } from '@brickninja-org/ui/components/form/Radiobutton';
import { Iconify } from '@/components/iconify';

const languages: Record<Language, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
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
          <Button
            aria-label={localeName}
            className="min-w-10 w-10 lg:min-w-20 lg:w-fit rounded-sm font-normal"
            variant="ghost"
          >
            <Iconify icon="globe"/>
            <span className="hidden lg:block">{localeName}</span>
          </Button>
        )}
      >
        <MenuList>
          <Radiobutton checked={language === 'de'} onChange={() => changeLanguage('de')}>{languages.de}</Radiobutton>
          <Radiobutton checked={language === 'en'} onChange={() => changeLanguage('en')}>{languages.en}</Radiobutton>
          <Radiobutton checked={language === 'es'} onChange={() => changeLanguage('es')}>{languages.es}</Radiobutton>
          <Radiobutton checked={language === 'fr'} onChange={() => changeLanguage('fr')}>{languages.fr}</Radiobutton>
          <Radiobutton checked={language === 'nl'} onChange={() => changeLanguage('nl')}>{languages.nl}</Radiobutton>
          <Separator className="my-2"/>
          <Button className="rounded-sm font-normal" variant="ghost" onPress={() => setFormatDialogOpen(true)}>Formatting Settings</Button>
        </MenuList>
      </Dropdown>

      <FormatConfigDialog open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>
    </>
  );
};
