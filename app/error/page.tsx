import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Something went wrong — PRGRM",
};

export default async function ErrorPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const message = params?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo width={56} height={56} />
        </div>

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
          {message
            ? decodeURIComponent(message)
            : "An unexpected error occurred. Please try again or head back home."}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild className="rounded-full px-5">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
