export default function MatchesPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Match Results</h1>
      {searchParams.id ? (
        <p className="text-muted-foreground">Service Idea ID: {searchParams.id}</p>
      ) : (
        <p className="text-muted-foreground">No service idea ID provided.</p>
      )}
      <p className="text-muted-foreground">Match results will be implemented here.</p>
    </div>
  );
}
