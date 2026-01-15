import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ResultsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner text="Finding matching grants..." />
    </div>
  );
}
