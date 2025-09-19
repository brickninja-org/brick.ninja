import { Skeleton } from '@heroui/react';

import DetailLayout from '@/components/layout/DetailLayout';

export default function LoadingItem() {
  return (
    <DetailLayout
      title={<Skeleton className="h-8 w-full"/>}
      breadcrumb={<Skeleton className="h-4 w-1/5"/>}
      icon={<Skeleton className="h-12 w-12"/>}
    >
      <Skeleton className="h-4 w-full"/>
    </DetailLayout>
  );
}
