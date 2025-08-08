/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from "react";

const useLocationSuggestion = (query: string) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location?keyword=${query}`);
        const json = await res.json();
        setSuggestions(json.data || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return suggestions
};

export default useLocationSuggestion;