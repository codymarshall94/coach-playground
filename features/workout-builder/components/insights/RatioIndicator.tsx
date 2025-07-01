export function RatioIndicator({
  value,
  labelLeft = "Pull",
  labelRight = "Push",
  ideal = 1.0,
  normalized = false,
}: {
  value: number;
  labelLeft?: string;
  labelRight?: string;
  ideal?: number;
  normalized?: boolean;
}) {
  // Use rawValue for logic, displayValue for visual %
  const rawValue = Math.max(0, Math.min(2, value));
  const displayValue = normalized ? rawValue / (1 + rawValue) : rawValue;
  const percent = Math.max(0, Math.min(1, displayValue)) * 100;
  const idealPercent = normalized
    ? ideal / (1 + ideal)
    : (Math.max(0, Math.min(2, ideal)) / 2) * 100;

  // Enhanced color logic with more nuanced ranges
  let markerColor = "bg-emerald-500 shadow-emerald-500/50";
  let markerBorder = "border-emerald-600";

  if (rawValue < 0.6) {
    markerColor = "bg-violet-500 shadow-violet-500/50";
    markerBorder = "border-violet-600";
  } else if (rawValue > 1.4) {
    markerColor = "bg-rose-500 shadow-rose-500/50";
    markerBorder = "border-rose-600";
  } else if (rawValue < 0.8 || rawValue > 1.2) {
    markerColor = "bg-amber-500 shadow-amber-500/50";
    markerBorder = "border-amber-600";
  }

  return (
    <div className="space-y-3 p-4 bg-background rounded-xl border border-border shadow-sm">
      {/* Header with labels */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
          <span className="text-sm font-medium text-muted-foreground">
            {labelLeft}
          </span>
        </div>

        <div className="text-center">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ratio
          </div>
          <div className="text-lg font-bold text-foreground">
            {value.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {labelRight}
          </span>
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
        </div>
      </div>

      {/* Enhanced progress bar */}
      <div className="relative">
        {/* Background track */}
        <div className="h-3 bg-gradient-to-r from-violet-100 via-muted to-rose-100 rounded-full border border-border overflow-hidden">
          {/* Gradient overlay for visual zones */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50/50 via-emerald-50/50 to-rose-50/50"></div>
        </div>

        {/* Ideal marker (thin line) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-muted rounded-full opacity-60"
          style={{ left: `calc(${idealPercent}% - 1px)` }}
        ></div>

        {/* Current value marker */}
        <div
          className={`absolute -top-1 w-5 h-5 rounded-full ${markerColor} ${markerBorder} border-2 shadow-lg transition-all duration-300 ease-out transform hover:scale-110`}
          style={{ left: `calc(${percent}% - 10px)` }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0.5 bg-white/30 rounded-full"></div>
        </div>

        {/* Tick marks */}
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-px h-2 bg-muted"></div>
              <span className="text-xs text-muted-foreground mt-1">
                {(i * 0.5).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex justify-center">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            rawValue < 0.6
              ? "bg-violet-100 text-violet-700 border border-violet-200"
              : rawValue > 1.4
              ? "bg-rose-100 text-rose-700 border border-rose-200"
              : rawValue < 0.8 || rawValue > 1.2
              ? "bg-amber-100 text-amber-700 border border-amber-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}
        >
          {rawValue < 0.6
            ? `${labelLeft} Dominant`
            : rawValue > 1.4
            ? `${labelRight} Dominant`
            : rawValue < 0.8 || rawValue > 1.2
            ? "Slightly Imbalanced"
            : "Well Balanced"}
        </div>
      </div>
    </div>
  );
}

// Demo component to show different states
export default function Component() {
  const examples = [
    { value: 0.4, labelLeft: "Pull", labelRight: "Push" },
    { value: 0.9, labelLeft: "Strength", labelRight: "Cardio" },
    { value: 1.1, labelLeft: "Work", labelRight: "Rest" },
    { value: 1.6, labelLeft: "Input", labelRight: "Output" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Ratio Indicators
          </h1>
          <p className="text-slate-600">
            Enhanced visual ratio comparison component
          </p>
        </div>

        <div className="grid gap-6">
          {examples.map((example, index) => (
            <RatioIndicator
              key={index}
              value={example.value}
              labelLeft={example.labelLeft}
              labelRight={example.labelRight}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
