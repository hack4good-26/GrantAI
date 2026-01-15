import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function HistoryLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner text="Loading search history..." />
    </div>
  );
}
