'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@heroui/react';

import { useCallback, useEffect, useState } from 'react';
import { Button, cn } from '@heroui/react';
import { Icon } from '@brickninja-org/ui/icons';

export interface ShareButtonProps {
  data: ShareData;
  flex?: boolean;
  variant?: ButtonProps['variant'];
}

export const ShareButton: FC<ShareButtonProps> = ({ data, flex, variant }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => setCanShare(navigator.canShare?.(data) ?? false), [data]);

  const handleShare = useCallback(() => {
    navigator.share(data);
  }, [data]);

  if (!canShare) {
    return null;
  }

  return (
    <Button className={cn({ 'flex-1': flex })} startContent={<Icon icon="external"/>} variant={variant} onPress={handleShare}>
      Share
    </Button>
  );
};
