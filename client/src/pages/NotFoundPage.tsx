import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { buttonClassName } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <PageContainer className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className={buttonClassName()}>
        Return home
      </Link>
    </PageContainer>
  );
}
