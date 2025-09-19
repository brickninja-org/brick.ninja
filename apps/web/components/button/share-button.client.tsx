'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@/components/button';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/button';

interface ShareButtonProps extends Pick<ButtonProps, 'className' | 'flex' | 'ref' | 'variant'> {
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
    <Button icon="nodes-right" variant={variant} onPress={handleShare} {...props}>
      Share
    </Button>
  );
};

ShareButton.displayName = 'BrickCatalog.ShareButton';

export type { ShareButtonProps };
export { ShareButton };
