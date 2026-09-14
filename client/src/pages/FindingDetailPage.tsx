import { Link, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFindingBySlug } from "@/content/findings";
import { formatUtcDate } from "@/lib/utils";

export function FindingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const finding = slug ? getFindingBySlug(slug) : undefined;

  if (!finding) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Finding not found.</p>
        <Link to="/findings" className="mt-2 inline-block text-sm underline">
          ← Back to Findings
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link to="/findings" className="text-sm text-muted-foreground hover:underline">
        ← Back to Findings
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{finding.category}</Badge>
        <span className="text-xs text-muted-foreground">
          {formatUtcDate(finding.publishedDate, { year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>
      <h1 className="mt-2 text-2xl font-semibold">{finding.title}</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">{finding.dek}</p>

      <div className="mt-8 max-w-3xl space-y-8">
        {finding.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-lg font-semibold">{section.heading}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {section.note && (
              <Card className="mt-4 border-dashed">
                <CardContent className="py-3 text-xs text-muted-foreground">{section.note}</CardContent>
              </Card>
            )}
          </section>
        ))}

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {finding.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}
