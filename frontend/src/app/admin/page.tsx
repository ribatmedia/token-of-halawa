import { Suspense } from 'react';
import DashboardOverview from '@/components/DashboardOverview';

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-[#030712] text-emerald-500 font-bold">Loading...</div>}>
      <DashboardOverview defaultRole="admin" />
    </Suspense>
  );
}
