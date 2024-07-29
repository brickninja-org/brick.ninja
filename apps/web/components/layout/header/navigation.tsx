import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

interface NavigationProps {
  language: Language;
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  return (
    <div>
      <ul className="flex py-1.5 bg-white">
        <li className="">Link</li>
      </ul>
    </div>
  );
};

export default Navigation;
