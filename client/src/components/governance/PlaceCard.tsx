import { Link } from "react-router-dom";
import type { JurisdictionSummary } from "@mandate/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlaceCard({ place }: { place: JurisdictionSummary }) {
  return (
    <Link to={`/places/${place.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{place.name}</CardTitle>
            <Badge variant="outline">{place.kind === "metro_region" ? "Metro Region" : "City"}</Badge>
          </div>
          <CardDescription className="line-clamp-2">{place.summary}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{place.population ? `${(place.population / 1000).toFixed(0)}k residents` : "Population unknown"}</span>
          <span>{place.governanceModelName}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
