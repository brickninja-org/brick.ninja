'use client';

import type { FC } from 'react';

import { useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';

import { Icon } from '@brickninja-org/ui/icons';

import { useLanguage } from '@/components/i18n/context';
import { FormatConfigDialog } from '@/components/format/FormatConfigDialog';
import type { TranslationSubset } from '@/lib/translate';

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
  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  const language = useLanguage();
  const localeName = languages[language];
  const localizedUrl = new URL(window.location.href);
  localizedUrl.hostname = language + localizedUrl.hostname.substring(2);

  return (
    <>
      <Dropdown>
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
        <DropdownMenu>
          <DropdownSection showDivider>
            {Object.entries(languages).map(([code, label]) => (
              <DropdownItem
                key={code}
                href={localizedUrl.href}
              >
                {label}
              </DropdownItem>
            ))}
          </DropdownSection>

          <DropdownSection>
            <DropdownItem
              key="formatting-settings"
              onPress={() => setFormatDialogOpen(true)}
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
