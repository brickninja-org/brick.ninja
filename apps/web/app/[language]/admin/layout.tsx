import type { ReactNode } from 'react';

import { Navbar } from '@/components/layout/Navbar';
import { ensureUserIsAdmin } from './admin';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await ensureUserIsAdmin();

  return (
    <div>
      <Navbar path="/admin/" items={[
        { segment: 'users', label: 'Users', icon: 'user' },
        { segment: 'reviews', label: 'Reviews', icon: 'review-queue' },
        { segment: 'apps', label: 'Apps', icon: 'apps' },
        { segment: 'views', label: 'Page Views', icon: 'eye' },
        { segment: 'jobs', label: 'Jobs', icon: 'jobs' },
      ]}/>
      {children}
    </div>
  );
}

export const metadata = {
  title: {
    template: 'Admin: %s',
    default: ''
  }
};
