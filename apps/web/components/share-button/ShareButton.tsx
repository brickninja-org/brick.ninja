'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@heroui/react';

import { useCallback, useEffect, useState } from 'react';
import { Button, cn } from '@heroui/react';
import { Icon } from '@brickninja-org/ui/icons';

export interface ShareButtonProps extends Omit<ButtonProps, 'startContent' | 'onPress'> {
  data: ShareData;
  flex?: boolean;
}

export const ShareButton: FC<ShareButtonProps> = ({ className, data, flex, ...props }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => setCanShare(navigator.canShare?.(data) ?? false), [data]);

  const handleShare = useCallback(() => {
    navigator.share(data);
  }, [data]);

  if (!canShare) {
    return null;
  }

  return (
    <Button className={cn({ 'flex-1': flex, className })} startContent={<Icon icon="external"/>} onPress={handleShare} {...props}>
      Share
    </Button>
  );
};
