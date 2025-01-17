import type { FC, ReactElement } from 'react';
import type { Language } from '@brickninja-org/database';

import { cloneElement } from 'react';

interface LanguageLinksProps {
  link: ReactElement<{ language: string }>;
  language: Language;
}

export const LanguageLinks: FC<LanguageLinksProps> = ({ link, language }) => {
  return (
    <div className="grid grid-cols-[auto__1fr] items-baseline gap-[0px_8px] leading-6">
      {language !== 'en' && (<><div className="text-gray-600">EN</div>{cloneElement(link, { language: 'en' })}</>)}
      {language !== 'nl' && (<><div className="text-gray-600">NL</div>{cloneElement(link, { language: 'nl' })}</>)}
    </div>
  );
};
