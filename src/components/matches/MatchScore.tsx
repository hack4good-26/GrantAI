import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number; // 0 to 1
  className?: string;
}

export default function MatchScore({ score, className }: MatchScoreProps) {
  const percentage = Math.round(score * 100);
  
  // Determine color based on score
  let colorClass = "bg-gray-100 text-gray-800";
  if (score >= 0.8) {
    colorClass = "bg-green-100 text-green-800 border-green-200";
  } else if (score >= 0.6) {
    colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
  } else {
    colorClass = "bg-orange-100 text-orange-800 border-orange-200";
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
