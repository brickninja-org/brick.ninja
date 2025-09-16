import type { FC, AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';
import type { Language } from '@brickninja-org/database';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import type { IconSize } from '@/lib/get-icon-url';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { EntityIconType } from './EntityIcon';
import type { WithIcon } from '@/lib/with';

import { getLinkProperties } from '@/lib/link-properties';
import { EntityLinkInternal } from '@/components/entity/EntityLinkInternal';

interface CustomEntityLinkProps extends RefProp<HTMLAnchorElement> {
  href: string,
  entity: WithIcon<LocalizedEntity> & ({ id: unknown }),
  icon?: IconSize | 'none' | ReactElement,
  iconType?: EntityIconType,
  language?: Language,
  onClick?: React.MouseEventHandler<HTMLAnchorElement>,
  children?: ReactNode,
}

export type EntityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CustomEntityLinkProps> & CustomEntityLinkProps;

export const EntityLink: FC<EntityLinkProps> = ({ ref, entity, ...props }) => {
  const cleanEntity = getLinkProperties(entity);

  return <EntityLinkInternal ref={ref} entity={cleanEntity} {...props}/>;
};
