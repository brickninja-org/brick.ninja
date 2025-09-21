import type { FC, ReactElement, ReactNode } from 'react';
import type { Icon } from '@brickninja-org/database';
import type { EntityIconType } from '@/components/entity/EntityIcon';

import './detail-layout.css';

import { cloneElement, isValidElement } from 'react';
import { Button, tv } from '@heroui/react';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { TableOfContent, TableOfContentContext } from '@brickninja-org/ui/components/table-of-content/TableOfContents';
import { Icon as IconComponent } from '@brickninja-org/ui/icons';

import { EntityIcon } from '@/components/entity/EntityIcon';

interface DetailLayoutProps {
  title: ReactNode,
  icon?: Icon | ReactElement<{ className: string }> | null,
  iconType?: EntityIconType,
  breadcrumb?: ReactNode,
  children: ReactNode,
  infobox?: ReactNode,
  className?: string,
  actions?: ReactNode[],
}

const headline = tv({
  base: 'headline [grid-area:headline] grid p-4 bg-surface-2 border-b',
  variants: {
    withoutInfobox: {
      true: '[grid-column-end:infobox]',
    },
  },
});

const DetailLayout: FC<DetailLayoutProps> = ({ title, icon, iconType, children, actions, breadcrumb, infobox }) => {
  return (
    <TableOfContentContext>
      <main className="main [grid-area:main] grid before:[grid-area:padding] before:bg-surface-2 before:border-b before:[content:''] max-[920px]:before:hidden">
        <div className={headline({ withoutInfobox: !!infobox })}>
          {icon && typeof icon === 'object' && (isValidElement(icon) ? cloneElement(icon, { className: '[grid-area:icon] mr-4 bg-background' }) : <EntityIcon className="mr-4" icon={icon} size={48} type={iconType}/>)}
          <h1 className="[grid-area:title] font-bitter font-bold text-[22px] leading-none">{title}</h1>
          {breadcrumb && <div className="[grid-area:breadcrumb] mt-2 text-sm text-muted leading-none">{breadcrumb}</div>}
          {actions && (
            <div className="[grid-area:actions] flex flex-col justify-center">
              <Dropdown button={<Button isIconOnly className="rounded-sm" variant="ghost" aria-label="Actions"><IconComponent icon="more"/></Button>}>
                <MenuList>{actions}</MenuList>
              </Dropdown>
            </div>
          )}
        </div>
        <aside className="[grid-area:toc] max-[920px]:hidden">
          <TableOfContent/>
        </aside>
        {infobox && (
          <aside className="[grid-area:infobox] p-4 border border-t-0 max-[920px]:border-x-0">
            {infobox}
          </aside>
        )}
        <div className="[grid-area:content] p-4">
          {children}
        </div>
      </main>
    </TableOfContentContext>
  );
};

export default DetailLayout;