export default function MatchResultsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Match Results</h1>
      <p className="text-muted-foreground">Service Idea ID: {params.id}</p>
      <p className="text-muted-foreground">Match results will be implemented here.</p>
    </div>
  );
}
