import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container>
        <div className="text-center">
          <p className="font-mono text-sm text-primary">// 404</p>
          <Heading size="h1" as="h1" className="mt-4">
            Page not found
          </Heading>
          <p className="mt-4 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
