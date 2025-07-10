import type { FC } from 'react';

import { Notice } from '@brickninja-org/ui/components/notice/Notice';

export interface RemovedFromApiNoticeProps {
  type: string;
}

export const RemovedFromApiNotice: FC<RemovedFromApiNoticeProps> = ({ type }) => {
  return (
    <Notice type="warning" icon="revision">
      This {type} is currently not available in the Brick Ninja API and you are seeing the last known version. The {type} has either been removed from the catalog or needs to be rediscovered.
    </Notice>
  );
};
