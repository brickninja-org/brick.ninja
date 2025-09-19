import { Skeleton } from '@heroui/react';

import DetailLayout from '@/components/layout/DetailLayout';

export default function LoadingBuild() {
  return (
    <DetailLayout title={<Skeleton className="h-6 w-1/2"/>} breadcrumb={<Skeleton className="h-4 w-1/4"/>}><Skeleton className="h-4 w-full"/></DetailLayout>
  );
}
