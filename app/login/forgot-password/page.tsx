import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Mail, Send } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export const metadata = {
  title: "Forgot Password — PRGRM",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;
  const success = params?.success;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo width={72} height={72} />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{decodeURIComponent(error)}</span>
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">
            <Send className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Check your email for a password reset link. It may take a minute to
              arrive.
            </span>
          </div>
        )}

        {!success && (
          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@domain.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              formAction={requestPasswordReset}
              className="w-full rounded-full"
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
