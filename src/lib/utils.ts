import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Grant } from "./types";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get grant title
 * Now uses the direct title field from the database
 */
export function extractGrantTitle(grant: Grant): string {
  // Prefer the title field (added in Supabase schema)
  if (grant.title) {
    return grant.title;
  }

  // Legacy fallback: extract from about_grant if title is missing
  if (grant.about_grant) {
    const firstSentence = grant.about_grant.split(/\.\s|\n/)[0];
    if (firstSentence.length > 80) {
      return firstSentence.substring(0, 77) + "...";
    }
    return firstSentence;
  }

  return "Grant Information";
}

/**
 * Extract funding amount text from funding_info field
 * Returns the first line or a placeholder
 */
export function extractFundingAmount(grant: Grant): string {
  if (!grant.funding_info) {
    return "Funding available";
  }

  // Get first line
  const firstLine = grant.funding_info.split('\n')[0].trim();
  return firstLine || "Funding available";
}

/**
 * Extract deadline/timeline from when_can_apply field
 * Returns the first line or a placeholder
 */
export function extractDeadline(grant: Grant): string {
  if (!grant.when_can_apply) {
    return "See application details";
  }

  // Get first line
  const firstLine = grant.when_can_apply.split('\n')[0].trim();
  return firstLine || "See application details";
}
