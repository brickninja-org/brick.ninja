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
      {language !== 'en' && (<><div className="text-muted">EN</div>{cloneElement(link, { language: 'en' })}</>)}
      {language !== 'nl' && (<><div className="text-muted">NL</div>{cloneElement(link, { language: 'nl' })}</>)}
    </div>
  );
};
