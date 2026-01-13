/**
 * LoadingSpinner Component
 * Center-aligned loading spinner with optional text
 */
export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  );
}
