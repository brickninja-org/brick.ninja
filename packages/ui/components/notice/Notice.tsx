import type { FC, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { RefProp } from '../../lib/react';
import type { IconName } from '../../icons';

import { tv } from 'tailwind-variants';

import { Icon } from '../../icons';

const notice = tv({
  slots: {
    base: 'flex items-center gap-4 mb-4 p-4 border-l-4',
    content: 'flex-1',
  },
  variants: {
    type: {
      default: 'bg-blue-50 border-blue-500',
      error: 'bg-red-50 border-red-500',
      success: 'bg-green10-50 border-green-500',
      warning: 'bg-yellow-50 border-yellow-500',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

type NoticeVariants = VariantProps<typeof notice>;

export interface NoticeProps extends NoticeVariants, RefProp<HTMLDivElement> {
  icon?: IconName;
  children: ReactNode;

  /** Hide this notice from Google and other search engines */
  index?: boolean;
}

export const Notice: FC<NoticeProps> = ({ ref, type, icon, index, children }) => {
  const { base, content } = notice({ type });

  return (
    <div ref={ref} className={base({ type })} data-nosnippet={index === false ? true : undefined}>
      {icon && <Icon icon={icon} className="text-2xl"/>}
      <div className={content()}>{children}</div>
    </div>
  );
};
