import { cn } from "@/lib/utils";

interface PreprouteLogoProps {
  className?: string;
}

/** PrepRoute wordmark inspired by the Figma design — blue text with a small
 * route/pen glyph stroked across the top. */
export function PreprouteLogo({ className }: PreprouteLogoProps) {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className="relative text-2xl font-extrabold tracking-tight text-primary">
        <svg
          aria-hidden
          viewBox="0 0 120 24"
          className="absolute -top-2.5 left-2 h-5 w-24 text-foreground"
          fill="none"
        >
          <path
            d="M3 18 C 20 4, 45 22, 65 10 C 85 0, 105 12, 116 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
          <circle cx="116" cy="6" r="2.4" fill="currentColor" />
        </svg>
        Prep<span className="text-primary">Route</span>
      </span>
    </div>
  );
}
