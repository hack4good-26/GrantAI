import SearchForm from "@/components/search/SearchForm";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 md:px-8 md:py-16 lg:p-24">
      <SearchForm />
    </div>
  );
}
