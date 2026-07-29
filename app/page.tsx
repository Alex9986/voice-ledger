import { Suspense } from 'react';
import { getRecords } from '@/app/actions';
import StatsOverview from '@/app/components/StatsOverview';
import ExpensePieChart from '@/app/components/ExpensePieChart';
import MonthlyTrend from '@/app/components/MonthlyTrend';
import RecordList from '@/app/components/RecordList';
import ExportButton from '@/app/components/ExportButton';

async function RecordsContent() {
  const records = await getRecords();

  return (
    <div className="space-y-5">
      <div className="animate-slide-up">
        <StatsOverview records={records} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <ExpensePieChart records={records} />
        <MonthlyTrend records={records} />
      </div>

      {/* Export */}
      <div className="flex justify-end animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <ExportButton records={records} />
      </div>

      {/* Records */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <RecordList initialRecords={records} />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RecordsContent />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, var(--card-bg) 0%, #e4e4e7 50%, var(--card-bg) 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div
          className="h-64 rounded-xl animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, var(--card-bg) 0%, #e4e4e7 50%, var(--card-bg) 100%)',
            backgroundSize: '200% 100%',
          }}
        />
        <div
          className="h-64 rounded-xl animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, var(--card-bg) 0%, #e4e4e7 50%, var(--card-bg) 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
      <div
        className="h-10 rounded-lg animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, var(--card-bg) 0%, #e4e4e7 50%, var(--card-bg) 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-16 rounded-lg animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, var(--card-bg) 0%, #e4e4e7 50%, var(--card-bg) 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </div>
  );
}
