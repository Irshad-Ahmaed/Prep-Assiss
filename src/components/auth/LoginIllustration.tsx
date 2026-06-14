/** Simple flat illustration of a pencil-character at a laptop, echoing the
 *  PrepRoute login Figma art (light blue accents on a desk). */
export function LoginIllustration() {
  return (
    <svg
      viewBox="0 0 600 500"
      className="h-auto w-full max-w-md"
      fill="none"
      role="img"
      aria-label="Illustration of a pencil character at a laptop"
    >
      {/* sparkles */}
      <g stroke="#1f2937" strokeWidth="2" strokeLinecap="round">
        <path d="M120 200 l0 16 M112 208 l16 0" />
        <path d="M460 290 l0 12 M454 296 l12 0" />
        <circle cx="380" cy="220" r="6" fill="none" />
      </g>

      {/* pencil body */}
      <g>
        <rect x="270" y="40" width="60" height="40" rx="4" fill="#cfe0ff" />
        <rect x="278" y="80" width="44" height="320" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
        <polygon points="278,400 322,400 300,440" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
        <polygon points="293,425 307,425 300,440" fill="#1f2937" />
        {/* face */}
        <circle cx="290" cy="190" r="3" fill="#1f2937" />
        <circle cx="310" cy="190" r="3" fill="#1f2937" />
        <path d="M291 200 q9 8 18 0" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* arms */}
        <path
          d="M278 235 q-30 10 -45 40 q-2 8 6 10"
          stroke="#1f2937"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M322 235 q40 0 60 30"
          stroke="#1f2937"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* laptop */}
      <g>
        <polygon points="180,300 320,300 340,260 200,260" fill="#f1f5f9" stroke="#1f2937" strokeWidth="2" />
        <rect x="160" y="300" width="200" height="14" rx="2" fill="#94a3b8" stroke="#1f2937" strokeWidth="2" />
      </g>

      {/* desk surface */}
      <rect x="60" y="320" width="480" height="14" rx="2" fill="#64748b" />
      {/* legs */}
      <line x1="100" y1="334" x2="100" y2="480" stroke="#1f2937" strokeWidth="2" />
      <line x1="500" y1="334" x2="500" y2="480" stroke="#1f2937" strokeWidth="2" />
      <line x1="240" y1="334" x2="240" y2="480" stroke="#1f2937" strokeWidth="2" />
      <line x1="360" y1="334" x2="360" y2="480" stroke="#1f2937" strokeWidth="2" />
    </svg>
  );
}
