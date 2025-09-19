import { Skeleton } from '@heroui/react';

import DetailLayout from '@/components/layout/DetailLayout';

export default function LoadingProduct() {
  return (
    <DetailLayout title={<Skeleton className="h-8 w-3/5"/>} breadcrumb={<Skeleton className="h-4 w-1/5"/>}><Skeleton className="h-4 w-full"/> </DetailLayout>
  );
}
