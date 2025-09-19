'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@heroui/react';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@heroui/react';

import { Iconify } from '@/components/iconify';

interface ShareButtonProps extends Pick<ButtonProps, 'className' | 'ref' | 'variant'> {
  data: ShareData,
}

const ShareButton: FC<ShareButtonProps> = ({ data, variant = 'tertiary', ...props }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => setCanShare(navigator.canShare?.(data) ?? false), [data]);

  const handleShare = useCallback(() => {
    navigator.share(data);
  }, [data]);

  if (!canShare) {
    return null;
  }

  return (
    <Button variant={variant} onPress={handleShare} {...props}>
      <Iconify icon="nodes-right"/>
      Share
    </Button>
  );
};

export type { ShareButtonProps };
export { ShareButton };
