import type { FC, ReactNode } from 'react';
import { Icon } from '../../icons';

export interface ExternalLinkProps {
  href: string,
  target?: string,
  children: ReactNode,
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, target, children }) => {
  // the `&#8203;` in combination with `white-space: nowrap` on `.icon` prevents wrapping
  // between the link content and the icon, but still allows wrapping within the content.
  return (
    <a href={href} target={target} rel="noopener noreferrer" className="group inline-flex focus-visible:outline-(--color-focus) hover:decoration-transparent">
      <span className="group-hover:decoration-current group-hover:transition-colors group-hover:duration-150 underline underline-offset-2 decoration-2 decoration-transparent transition-colors duration-300 whitespace-normal">{children}</span>
      <span className="ml-0.5 whitespace-nowrap">&#8203;<Icon icon="external-link"/></span>
    </a>
  );
};
