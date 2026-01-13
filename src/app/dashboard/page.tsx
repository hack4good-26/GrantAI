import SearchForm from "@/components/search/SearchForm";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background">
      <div className="w-full max-w-5xl">
        <SearchForm />
      </div>
    </div>
  );
}
