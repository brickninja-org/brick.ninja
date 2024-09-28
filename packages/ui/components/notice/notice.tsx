import { forwardRef, type ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { Icon, type IconName } from '../../icons';

const notice = tv({
  slots: {
    base: 'flex items-center gap-4 mb-4 p-4 border-l-4',
    content: 'flex-1',
  },
  variants: {
    type: {
      default: 'bg-blue-100 border-blue-500',
      error: 'bg-red-100 border-red-500',
      success: 'bg-green-100 border-green-500',
      warning: 'bg-yellow-100 border-yellow-500',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

type NoticeVariants = VariantProps<typeof notice>;

export interface NoticeProps extends NoticeVariants {
  icon?: IconName;
  children: ReactNode;

  /** Hide this notice from Google and other search engines */
  index?: boolean;
}

export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice({ type, icon, index, children }, ref) {
  const { base, content } = notice({ type });

  return (
    <div ref={ref} className={base({ type })} data-nosnippet={index === false ? true : undefined}>
      {icon && <Icon icon={icon} className="text-2xl"/>}
      <div className={content()}>{children}</div>
    </div>
  );
});
