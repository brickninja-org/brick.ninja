import DetailLayout from '@/components/layout/DetailLayout';
import { Skeleton } from '@/components/skeleton/Skeleton';

export default function LoadingItem() {
  return (
    <DetailLayout
      title={<Skeleton/>}
      breadcrumb={<Skeleton/>}
      icon={<Skeleton width={48} height={48}/>}
    >
      <Skeleton/>
    </DetailLayout>
  );
}
