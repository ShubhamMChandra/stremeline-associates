import Link from "next/link";
import { Container, Button } from "@repo/ui";

/**
 * What this does: Global 404 page
 * Why it's here: Catches unknown routes with a plain message and a way home
 * How it works: Server component, left-aligned editorial heading on the paper ground
 * Dependencies: @repo/ui
 */

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center">
      <Container>
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-4 text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
          Page not found
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </Container>
    </div>
  );
}
