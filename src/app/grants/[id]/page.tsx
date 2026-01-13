export default function GrantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Grant Details</h1>
      <p className="text-muted-foreground">Grant ID: {params.id}</p>
      <p className="text-muted-foreground">Grant detail page will be implemented here.</p>
    </div>
  );
}
