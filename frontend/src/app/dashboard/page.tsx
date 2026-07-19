import DashboardOverview from '../../components/DashboardOverview';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <main>
      <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-400">Loading Dashboard...</div>}>
        <DashboardOverview />
      </Suspense>
    </main>
  );
}
