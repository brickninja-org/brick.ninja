import type { Language } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';

import { forwardRef, type AnchorHTMLAttributes } from 'react';

import { getLinkProperties } from '@/lib/link-properties';
import { EntityLinkInternal } from '@/components/entity/entity-link-internal';

interface CustomEntityLinkProps {
  href: string;
  entity: LocalizedEntity & ({ id: unknown });
  language?: Language;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type EntityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CustomEntityLinkProps> & CustomEntityLinkProps;

export const EntityLink = forwardRef<HTMLAnchorElement, EntityLinkProps>(function EntityLink({ entity, ...linkProps }: EntityLinkProps, ref) {
  const cleanEntity = getLinkProperties(entity);

  return <EntityLinkInternal ref={ref} entity={cleanEntity} {...linkProps}/>;
});
