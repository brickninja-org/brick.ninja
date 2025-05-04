import type { FC, ReactElement, ReactNode } from 'react';
import type { IconProp } from '../../icons';

import Link from 'next/link';

import { Icon } from '../../icons';
import { Composite, CompositeItem } from '../focus/Composite';
import { Tip } from '../tip/Tip';
import { cn } from '../../lib';

export interface SwitchProps {
  children: ReactElement<SwitchControlProps>[]
}

export type SwitchControlProps = {
  children?: ReactNode;
  active?: boolean;
  clickAction?: () => void;
  icon?: IconProp;
  tip?: ReactNode;
} & (
  | { type?: 'button', href?: never, replace?: never, scroll?: never, clickAction: () => void, name?: string, value?: string }
  | { type: 'link', href: string, replace?: boolean, scroll?: boolean, name?: never, value?: never }
  | { type: 'radio', href?: never, replace?: never, scroll?: never, name: string, value: string }
);

export const Switch: FC<SwitchProps> & { Control: FC<SwitchControlProps> } = ({ children }: SwitchProps) => {
  return (
    <Composite className="flex gap-1 p-1 rounded-xs shadow-[inset_0_0_0_1px_var(--color-border-dark)] bg-background transition-shadow">
      {children}
    </Composite>
  );
};

Switch.Control = ({ children, active, type = 'button', href, clickAction, name, value, icon, tip, replace, scroll }: SwitchControlProps) => {
  const Element = type === 'link' ? Link : type === 'radio' ? 'label' : 'button';

  const element = (
    <Element href={href!} replace={replace} scroll={scroll} onClick={clickAction} className={cn('flex flex-auto justify-center gap-2 py-1.5 px-3 rounded-xs bg-transparent text-foreground transition-all duration-300 hover:bg-background-light focus-visible:shadow-focus')} name={type === 'button' ? name : undefined} value={type === 'button' ? value : undefined}>
      {type === 'radio' && <input type="radio" name={name} value={value} className="hidden" defaultChecked={active}/>}
      {icon && (<Icon icon={icon} className=""/>)}
      {children && (<span>{children}</span>)}
    </Element>
  );

  return tip
    ? <Tip tip={tip}><CompositeItem render={element} data-active={active}/></Tip>
    : <CompositeItem render={element}/>;
};

Switch.Control.displayName = 'Switch.Control';
