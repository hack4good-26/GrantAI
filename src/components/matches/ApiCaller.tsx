"use client";

import { useEffect } from "react";

interface ApiCallerProps {
  serviceIdeaId: string;
  query: string;
}

export default function ApiCaller({ serviceIdeaId, query }: ApiCallerProps) {
  useEffect(() => {
    // Call the API to trigger console logs
    const callApi = async () => {
      try {
        const response = await fetch(
          `/api/service-ideas/${serviceIdeaId}/matches?query=${encodeURIComponent(query)}`
        );
        // We don't need to use the response, just trigger the API call for console logs
        if (!response.ok) {
          console.error('API call failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error calling API:', error);
      }
    };

    if (serviceIdeaId && query) {
      callApi();
    }
  }, [serviceIdeaId, query]);

  // This component doesn't render anything
  return null;
}
