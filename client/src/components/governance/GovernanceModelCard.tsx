import { Link } from "react-router-dom";
import type { GovernanceModelSummary } from "@mandate/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GovernanceModelCard({ model }: { model: GovernanceModelSummary }) {
  return (
    <Link to={`/governance-models/${model.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: model.colorHex ?? undefined }} />
            <CardTitle>{model.name}</CardTitle>
          </div>
          <CardDescription>{model.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">
            {model.jurisdictionCount} jurisdiction{model.jurisdictionCount === 1 ? "" : "s"}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
