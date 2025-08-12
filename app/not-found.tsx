import { Button } from "@/components/ui/button";
import Link from "next/link";

const AccentGreen = "oklch(0.68 0.19 145)";

function Stacked404Icon(props: React.SVGProps<SVGSVGElement>) {
  // Minimal, black-outlined, transparent squares with a green bolt in the middle
  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      role="img"
      aria-label="Lost page illustration"
      {...props}
    >
      {/* soft radial glow */}
      <defs>
        <radialGradient id="g" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="360" height="240" fill="url(#g)" />

      {/* layered rounded diamonds (transparent centers) */}
      <g transform="translate(180 110) rotate(15)">
        {/* bottom */}
        <rect
          x="-110"
          y="-58"
          width="220"
          height="116"
          rx="26"
          transform="rotate(45)"
          fill="none"
          stroke="#D9D9D9"
          strokeWidth="6"
          opacity="0.55"
        />
        {/* middle */}
        <rect
          x="-110"
          y="-58"
          width="220"
          height="116"
          rx="26"
          transform="rotate(45)"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="6"
          opacity="0.75"
        />
        {/* top */}
        <rect
          x="-110"
          y="-58"
          width="220"
          height="116"
          rx="26"
          transform="rotate(45)"
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="6"
        />
      </g>

      {/* center plate with dumbbell & bolt (workout theme) */}
      <g transform="translate(180 110)">
        {/* faint plate */}
        <rect
          x="-64"
          y="-36"
          width="128"
          height="72"
          rx="20"
          fill="white"
          stroke="black"
          strokeWidth="5"
          opacity="0.95"
        />
        {/* dumbbell */}
        <g transform="translate(0, 4)">
          <rect
            x="-38"
            y="-8"
            width="76"
            height="16"
            rx="8"
            fill="white"
            stroke="black"
            strokeWidth="5"
          />
          <rect
            x="-62"
            y="-18"
            width="24"
            height="36"
            rx="10"
            fill="white"
            stroke="black"
            strokeWidth="5"
          />
          <rect
            x="38"
            y="-18"
            width="24"
            height="36"
            rx="10"
            fill="white"
            stroke="black"
            strokeWidth="5"
          />
        </g>
        {/* lightning bolt accent */}
        <path
          d="M 10 -44 L 36 -44 L 18 -14 L 42 -14 L 0 24 L 14 -4 L -6 -4 Z"
          fill={AccentGreen}
          stroke="black"
          strokeWidth="5"
          transform="translate(-6,-6) scale(0.8)"
        />
      </g>

      {/* tiny sparkles */}
      <g stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round">
        <path d="M40 70 h12" />
        <path d="M54 70 v12" />
        <path d="M320 130 h10" />
        <path d="M330 130 v10" />
        <path d="M72 188 h8" />
        <path d="M80 188 v8" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* main card */}
        <div className="relative rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur-md p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left: text */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-semibold tracking-wide text-sm text-[oklch(0.68_0.19_145)]">
                ERROR 404
              </p>
              <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-neutral-900">
                Ooops! Page not found
              </h1>
              <p className="mt-3 text-neutral-600 text-lg">
                Looks like this workout took a wrong turn. Let’s get you back to
                training.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Button asChild className="px-5">
                  <Link href="/">Go Back Home</Link>
                </Button>

                <Button asChild variant="outline" className="px-5">
                  <Link href="/programs/new">Create New Program</Link>
                </Button>
              </div>
            </div>

            {/* Right: illustration */}
            <div className="flex-1 max-w-[520px] w-full">
              <div className="relative mx-auto aspect-[3/2] w-full">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[oklch(0.98_0.01_250)/0.8] to-white/0" />
                <Stacked404Icon className="absolute inset-0 w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
