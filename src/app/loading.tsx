import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <LoadingSpinner size="lg" text="로딩 중..." />
    </div>
  );
}
