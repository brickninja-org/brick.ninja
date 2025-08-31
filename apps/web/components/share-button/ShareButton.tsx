'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@heroui/react';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@brickninja-org/ui/icons';

export interface ShareButtonProps extends Omit<ButtonProps, 'startContent' | 'onPress'> {
  data: ShareData;
}

export const ShareButton: FC<ShareButtonProps> = ({ data, ...props }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => setCanShare(navigator.canShare?.(data) ?? false), [data]);

  const handleShare = useCallback(() => {
    navigator.share(data);
  }, [data]);

  if (!canShare) {
    return null;
  }

  return (
    <Button startContent={<Icon icon="external"/>} onPress={handleShare} {...props}>
      Share
    </Button>
  );
};
