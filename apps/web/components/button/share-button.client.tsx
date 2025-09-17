'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@/components/button';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/button';
import { Iconify } from '@/components/iconify';

export interface ShareButtonProps extends Omit<ButtonProps, 'onPress'> {
  data: ShareData,
}

export const ShareButton: FC<ShareButtonProps> = ({ data, variant = 'tertiary', ...props }) => {
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
