import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function GrantDetailLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner text="Loading grant details..." />
    </div>
  );
}
