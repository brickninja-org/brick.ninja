import { tv, type VariantProps } from 'tailwind-variants';

const notice = tv({
  slots: {
    base: 'flex items-center gap-4 mb-4 p-4 border-l-4',
    content: 'flex-1',
  },
  variants: {
    color: {
      default: 'bg-blue-100 border-blue-500',
      error: 'bg-red-100 border-red-500',
      success: 'bg-green-100 border-green-500',
      warning: 'bg-yellow-100 border-yellow-500',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

type NoticeVariants = VariantProps<typeof notice>;

export interface NoticeProps extends NoticeVariants {
  ref?: (element: HTMLDivElement | null) => void;
  startContent?: React.ReactNode;
  children: React.ReactNode;
}

export const Notice: React.FC<NoticeProps> = (props) => {
  const { color, ref, startContent, children } = props;

  return (
    <div ref={ref} className={notice({ color }).base()} role="alert">
      {startContent}
      <div className={notice().content()}>{children}</div>
    </div>
  );
};
