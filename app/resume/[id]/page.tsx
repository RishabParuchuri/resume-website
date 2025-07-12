"use client";

import { useEffect, useState } from "react";
import { Portfolio, PortfolioData }from "@/templates/Portfolio";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Resume({ params }: Props) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const resolvedParams = await params;
        const res = await fetch(`/api/resume/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch resume");
        }
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Unknown error");
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchResume();
  }, [params]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return <Portfolio data={data} />;
}
