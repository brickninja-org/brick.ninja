import { tv, type VariantProps } from 'tailwind-variants';

const notice = tv({
  slots: {
    base: 'flex items-center gap-4 mb-4 p-4 border-l-4',
    content: 'flex-1',
  },
  variants: {
    color: {
      default: 'bg-primary-100 border-primary-500',
      error: 'bg-danger-100 border-danger-500',
      success: 'bg-success-100 border-success-500',
      warning: 'bg-warning-100 border-warning-500',
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
