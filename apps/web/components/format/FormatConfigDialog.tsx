import type { FC } from 'react';

import { useMemo } from 'react';
import { Select, SelectItem, type SharedSelection } from '@heroui/react';

import { Dialog } from '@brickninja-org/ui/components/dialog/Dialog';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';

import { useFormatContext } from '@/components/format/Format.context';
import { FormatDate } from '@/components/format/FormatDate';
import { FormatNumber } from '@/components/format/FormatNumber';
import { useLanguage } from '@/components/i18n/context';
import { CookieNotification } from '@/components/user/CookieNotification';
import { useCurrency } from './Currency.context';

export interface FormatConfigDialogProps {
  translations: {
    'locale.formatting.settings': string,
    'language.select.label': string,
    'language.select.placeholder': string,
    'region.select.label': string,
    'region.select.placeholder': string,
  },
  open: boolean,
  onClose: () => void,
}

const defaultLocales = { languages: ['de', 'en', 'es', 'fr', 'nl'], regions: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'NL'] };
const localeRegex = /^([a-z]{2,4})([_-][a-z]{4})?[_-]([a-z]{2,3})?\b/i;

const { languages: availableLanguages, regions: availableRegions } = typeof window === 'undefined'
  ? defaultLocales
  : navigator.languages.reduceRight((available, lang) => {
      const match = lang.match(localeRegex);

      if(!match) {
        return available;
      }

      if(match[3]) {
        return {
          languages: [match[1], ...available.languages.filter((l) => l !== match[1])],
          regions: [match[3], ...available.regions.filter((r) => r !== match[3])]
        };
      }

      return { ...available, languages: [match[1], ...available.languages.filter((l) => l !== match[1])] };
    }, defaultLocales);

export const FormatConfigDialog: FC<FormatConfigDialogProps> = ({ translations, open, onClose }) => {
  const { locale, language, region, setLocale, defaultRegion } = useFormatContext();
  const currentLanguage = useLanguage();
  const { currency } = useCurrency();

  const languages = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'language', fallback: 'none' });
    return availableLanguages.map((code) => ({ key: code, label: formatter.of(code) ?? code }));
  }, [currentLanguage]);

  const regions = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'region', fallback: 'none' });
    return availableRegions.map((code) => ({ key: code, label: formatter.of(code) ?? code }));
  }, [currentLanguage]);

  const handleLanguageChange = (keys: SharedSelection) => {
    setLocale(keys.currentKey ?? 'auto', region);
  };

  const handleRegionChange = (keys: SharedSelection) => {
    setLocale(language, keys.currentKey ?? 'browser');
  };

  return (
    <Dialog title={translations['locale.formatting.settings']} onClose={onClose} open={open}>
      <div className="flex flex-col gap-4">
        <CookieNotification/>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            items={[{ key: 'auto', label: `Current language (${currentLanguage})` }, ...languages]}
            label={translations['language.select.label']}
            placeholder={translations['language.select.placeholder']}
            radius="sm"
            selectedKeys={[language]}
            selectionMode="single"
            variant="bordered"
            className="w-full md:max-w-xs"
            onSelectionChange={handleLanguageChange}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>

          <div className="hidden sm:block mt-6 leading-9">-</div>

          <Select
            items={[{ key: 'browser', label: `Browser region (${defaultRegion})` }, ...regions]}
            label={translations['region.select.label']}
            placeholder={translations['region.select.placeholder']}
            radius="sm"
            selectedKeys={[region]}
            selectionMode="single"
            variant="bordered"
            className="w-full md:max-w-xs"
            onSelectionChange={handleRegionChange}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </div>

        <div
          className="p-4 rounded-xs border"
          style={{ backgroundColor: 'var(--color-background-light)', borderColor: 'var(--color-border-dark)' }}
        >
          <MenuList>
            <div className="flex justify-between py-0.5 px-2">Locale <span>{locale}</span></div>
            <div className="flex justify-between py-0.5 px-2">Date <FormatDate date={new Date()}/></div>
            <div className="flex justify-between py-0.5 px-2">Relative Date <FormatDate relative date={new Date()}/></div>
            <div className="flex justify-between py-0.5 px-2">Number <span><FormatNumber value={1234567.89}/></span></div>
            <div className="flex justify-between py-0.5 px-2">Currency <span><FormatNumber value={1234567.89} options={{ style: 'currency', currency }}/></span></div>
          </MenuList>
        </div>
      </div>
    </Dialog>
  );
};
