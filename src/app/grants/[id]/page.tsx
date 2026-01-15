import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GrantDetail from "@/components/grants/GrantDetail";
import GrantExplainer from "@/components/grants/GrantExplainer";
import type { Grant } from "@/lib/types";

export default async function GrantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const returnTo = query.from;
  const backHref = typeof returnTo === "string" && returnTo.startsWith("/")
    ? returnTo
    : "/grants";
  const backLabel = backHref.startsWith("/results") ? "Back to Matches" : "Back to Grants";
  const supabase = getSupabase();
  
  const { data: grant, error } = await supabase
    .from('grants_vectors')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !grant) {
    notFound();
  }

  return (
    <div className="relative min-h-[calc(100vh-theme(spacing.16))]">
      <div className="p-6 md:p-8">
        <Link href={backHref}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
        <GrantDetail grant={grant as Grant} />
      </div>

      <GrantExplainer grant={grant as Grant} />
    </div>
  );
}
