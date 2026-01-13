import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number; // 0 to 1
  className?: string;
}

export default function MatchScore({ score, className }: MatchScoreProps) {
  const percentage = Math.round(score * 100);
  
  // Determine color based on score
  let colorClass = "bg-muted text-muted-foreground border-border";
  if (score >= 0.8) {
    colorClass = "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
  } else if (score >= 0.6) {
    colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
  } else {
    colorClass = "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "flex items-center justify-center w-16 h-16 rounded-full border-4 text-xl font-bold",
          colorClass
        )}
      >
        {percentage}%
      </div>
      <span className="text-xs font-medium mt-1 text-muted-foreground uppercase tracking-wide">
        Match
      </span>
    </div>
  );
}
