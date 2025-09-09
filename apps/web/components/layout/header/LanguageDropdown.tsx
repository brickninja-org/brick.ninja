'use client';

import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { TranslationSubset } from '@/lib/translate';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';

import { Icon } from '@brickninja-org/ui/icons';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/FormatConfigDialog';

export interface LanguageDropdownProps {
  translations: TranslationSubset<
    | 'locale.formatting.settings'
    | 'language.select.label'
    | 'language.select.placeholder'
    | 'region.select.label'
    | 'region.select.placeholder'
  >;
}

const languages = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  nl: 'Nederlands',
};

export const LanguageDropdown: FC<LanguageDropdownProps> = ({ translations }) => {
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
      <Dropdown placement="bottom">
        <DropdownTrigger>
          <Button
            aria-label={localeName}
            className="min-w-10 w-10 md:min-w-20 md:w-fit"
            radius="sm"
            startContent={<Icon icon="globe"/>}
            variant="light"
          >
            <span className="hidden md:block">{localeName}</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label={translations['language.select.label']}
          selectionMode="single"
          variant="flat"
          onAction={(change) => changeLanguage(change as Language)}
        >
          <DropdownSection showDivider title="Language" items={Object.entries(languages).map(([code, label]) => ({ key: code, label }))}>
            {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
          </DropdownSection>
          <DropdownSection title="Locale">
            <DropdownItem
              key="settings"
              onPress={() => {
                setFormatDialogOpen(true);
              }}
            >
              {translations['locale.formatting.settings']}
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <FormatConfigDialog translations={translations} open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>
    </>
  );
};
