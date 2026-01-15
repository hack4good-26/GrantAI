import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function GrantsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner text="Loading grants..." />
    </div>
  );
}
