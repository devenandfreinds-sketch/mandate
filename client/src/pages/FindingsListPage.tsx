import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findings } from "@/content/findings";
import { formatUtcDate } from "@/lib/utils";

export function FindingsListPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Findings</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">
        Short, single-question research notes drawn from Mandate's own data. Every number here traces to a
        primary source, and every finding says plainly what it doesn't show, not just what it does.
      </p>

      <div className="mt-8 space-y-4">
        {findings.map((f) => (
          <Link key={f.slug} to={`/findings/${f.slug}`}>
            <Card className="transition-colors hover:border-foreground/30">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{f.category}</Badge>
                  <span className="text-xs text-muted-foreground">{formatUtcDate(f.publishedDate, { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.dek}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
