import type { FC, AnchorHTMLAttributes } from 'react';

import type { Language } from '@brickninja-org/database';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import type { LocalizedEntity } from '@/lib/localized-name';
import { getLinkProperties } from '@/lib/link-properties';
import { EntityLinkInternal } from '@/components/entity/entity-link-internal';

interface CustomEntityLinkProps extends RefProp<HTMLAnchorElement> {
  href: string;
  entity: LocalizedEntity & ({ id: unknown });
  language?: Language;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type EntityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CustomEntityLinkProps> & CustomEntityLinkProps;

export const EntityLink: FC<EntityLinkProps> = ({ ref, entity, ...linkProps }) => {
  const cleanEntity = getLinkProperties(entity);

  return <EntityLinkInternal ref={ref} entity={cleanEntity} {...linkProps}/>;
};
