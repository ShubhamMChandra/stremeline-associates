import Link from "next/link";
import { Container, Button } from "@repo/ui";

/**
 * What this does: Global 404 page
 * Why it's here: Catches unknown routes with a plain message and a way home
 * How it works: Server component; one tilted sticky note and a link back to the pile
 * Dependencies: @repo/ui
 */

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center">
      <Container>
        <span
          aria-hidden="true"
          className="inline-flex size-28 rotate-[-6deg] rounded-[2px] bg-[#F9D3DA] p-3 text-[14px] font-medium text-[#2B2722] shadow-[0_1px_1px_rgba(60,45,10,0.06),0_12px_20px_-14px_rgba(60,45,10,0.4)]"
        >
          404
        </span>
        <h1 className="mt-10 text-[clamp(2.25rem,1.7rem+2vw,3.5rem)] leading-[1.02] font-bold tracking-[-0.035em]">
          This page fell off the pile.
        </h1>
        <p className="mt-4 max-w-xl text-[17px] text-foreground/70">
          It doesn&apos;t exist or it has moved.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </Container>
    </div>
  );
}
