import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TEAM = [
  { name: "Deven Mishra", role: "Founder & Data Lead" },
  { name: "Jack Rogers", role: "Social Media Manager" },
  { name: "Cole Ryan", role: "Research Lead" },
];

export function TeamPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Team</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">The people behind Mandate.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {TEAM.map((person) => (
          <Card key={person.name}>
            <CardHeader>
              <CardTitle className="text-base">{person.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{person.role}</CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
