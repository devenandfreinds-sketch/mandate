import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import type { Source } from "@mandate/shared";

export function SourceCitation({ sourceId }: { sourceId: string }) {
  const { data: source } = useQuery({
    queryKey: ["source", sourceId],
    queryFn: () => api.get<Source>(`/sources/${sourceId}`),
  });

  if (!source) return null;

  return (
    <li className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-b-0">
      <div>
        <div className="text-sm font-medium">{source.name}</div>
        {source.publisher && <div className="text-xs text-muted-foreground">{source.publisher}</div>}
        {source.citation && <p className="mt-1 text-xs text-muted-foreground">{source.citation}</p>}
      </div>
      {source.url && (
        <a href={source.url} target="_blank" rel="noreferrer" className="shrink-0 text-muted-foreground hover:text-foreground">
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </li>
  );
}
