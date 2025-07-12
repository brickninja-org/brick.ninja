import type { FC, ReactElement } from 'react';
import type { Language } from '@brickninja-org/database';

import { cloneElement } from 'react';

interface LanguageLinksProps {
  link: ReactElement<{ language: string }>;
  language: Language;
}

export const LanguageLinks: FC<LanguageLinksProps> = ({ link, language }) => {
  return (
    <div className="grid grid-cols-[auto_1fr] items-baseline gap-[0px_8px] leading-normal">
      {language !== 'de' && (<><div className="text-muted">DE</div>{cloneElement(link, { language: 'de' })}</>)}
      {language !== 'en' && (<><div className="text-muted">EN</div>{cloneElement(link, { language: 'en' })}</>)}
      {language !== 'es' && (<><div className="text-muted">ES</div>{cloneElement(link, { language: 'es' })}</>)}
      {language !== 'fr' && (<><div className="text-muted">FR</div>{cloneElement(link, { language: 'fr' })}</>)}
      {language !== 'nl' && (<><div className="text-muted">NL</div>{cloneElement(link, { language: 'nl' })}</>)}
    </div>
  );
};
