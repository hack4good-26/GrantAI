/**
 * EmptyState Component
 * Displays helpful message when no data is available
 */
export default function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description?: string; 
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
