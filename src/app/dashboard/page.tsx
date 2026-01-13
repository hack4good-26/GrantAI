import SearchForm from "@/components/search/SearchForm";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-5xl">
        <SearchForm />
      </div>
    </div>
  );
}
