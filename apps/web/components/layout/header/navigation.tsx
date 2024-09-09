import type { FC } from 'react';

import type { Language } from '@brickninja-org/database';
import { LinkButton } from '@brickninja-org/ui/components/form/button';

interface NavigationProps {
  language: Language;
}

const Navigation: FC<NavigationProps> = () => {
  return (
    <div className="relative overflow-hidden bg-white border-b">
      <ul className="flex m-0 py-1.5 first:border-l-0">
        <li className="border-l"><LinkButton href="/sets">Sets</LinkButton></li>
        <li className="border-l"><LinkButton href="/minifigures">Minifigures</LinkButton></li>
      </ul>
    </div>
  );
};

export default Navigation;
