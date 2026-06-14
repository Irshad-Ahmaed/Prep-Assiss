import { cn } from "@/lib/utils";

interface PreprouteLogoProps {
  className?: string;
}

/** PrepRoute wordmark inspired by the Figma design — blue text with a small
 * route/pen glyph stroked across the top. */
export function PreprouteLogo({ className }: PreprouteLogoProps) {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <img src="/logo.png" alt="PrepRoute" className="h-10 w-auto object-contain" />
    </div>
  );
}
