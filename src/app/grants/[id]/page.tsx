"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_GRANTS, MOCK_CHAT_HISTORY } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GrantDetail from "@/components/grants/GrantDetail";
import GrantExplainer from "@/components/grants/GrantExplainer";

export default function GrantDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const grant = MOCK_GRANTS.find(g => g.id === id) || MOCK_GRANTS[0];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-theme(spacing.16))] lg:h-screen lg:overflow-hidden">
      {/* Main Content - Left Side */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:h-full">
        <Link href="/grants">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Grants
          </Button>
        </Link>
        <GrantDetail grant={grant} />
      </div>

      {/* AI Chat Sidebar - Right Side */}
      <GrantExplainer grant={grant} initialMessages={MOCK_CHAT_HISTORY} />
    </div>
  );
}
