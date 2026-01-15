import { Grant, ParsedDocuments } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  FileText,
  Download
} from "lucide-react";
import { extractGrantTitle } from "@/lib/utils";

interface GrantDetailProps {
  grant: Grant;
}

export default function GrantDetail({ grant }: GrantDetailProps) {
  const title = extractGrantTitle(grant);

  // Parse documents_required JSON
  let parsedDocuments: ParsedDocuments | null = null;
  let documentsText: string | null = null;

  if (grant.documents_required) {
    try {
      const parsed = JSON.parse(grant.documents_required);
      // Validate it has the expected structure
      if (parsed && typeof parsed === 'object' && (parsed.items || parsed.text)) {
        parsedDocuments = parsed;
      } else {
        // If JSON but wrong structure, treat as plain text
        documentsText = grant.documents_required;
      }
    } catch (e) {
      // Not valid JSON, treat as plain text
      documentsText = grant.documents_required;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {grant.application_status && (
            <Badge className="bg-green-100 text-green-800 border-none">
              {grant.application_status}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        {grant.about_grant && (
          <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
            {grant.about_grant}
          </p>
        )}
      </div>

      {/* Detailed Sections */}
      <div className="space-y-6">
        {grant.about_grant && (
          <section>
            <h3 className="text-2xl font-bold mb-3">About This Grant</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {grant.about_grant}
            </div>
          </section>
        )}

        {grant.who_can_apply && (
          <>
            <Separator />
            <section>
              <h3 className="text-2xl font-bold mb-3">Who Can Apply</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {grant.who_can_apply}
              </div>
            </section>
          </>
        )}

        {grant.when_can_apply && (
          <>
            <Separator />
            <section>
              <h3 className="text-2xl font-bold mb-3">When to Apply</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {grant.when_can_apply}
              </div>
            </section>
          </>
        )}

        {grant.funding_info && (
          <>
            <Separator />
            <section>
              <h3 className="text-2xl font-bold mb-3">Funding Information</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {grant.funding_info}
              </div>
            </section>
          </>
        )}

        {grant.how_to_apply && (
          <>
            <Separator />
            <section>
              <h3 className="text-2xl font-bold mb-3">How to Apply</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {grant.how_to_apply}
              </div>
            </section>
          </>
        )}

        {(parsedDocuments || documentsText) && (
          <>
            <Separator />
            <section>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Documents Required
              </h3>
              {parsedDocuments && parsedDocuments.items && parsedDocuments.items.length > 0 ? (
                <ul className="space-y-2">
                  {parsedDocuments.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : parsedDocuments && parsedDocuments.text ? (
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {parsedDocuments.text}
                </div>
              ) : documentsText ? (
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {documentsText}
                </div>
              ) : null}
            </section>
          </>
        )}

        {grant.links && grant.links.length > 0 && (
          <>
            <Separator />
            <section>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Download className="h-6 w-6" />
                Download Forms & Templates
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {grant.links.map((link, index) => {
                  const filename = link.split('/').pop()?.split('%20').join(' ') || `Document ${index + 1}`;
                  return (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">{decodeURIComponent(filename)}</span>
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {grant.grant_url && (
          <div className="pt-4">
            <a href={grant.grant_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full md:w-auto">
                Visit Official Grant Page
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
