export function HouseMark({ className = "", strokeColor = "var(--gold)" }: { className?: string; strokeColor?: string }) {
  return (
    <svg
      viewBox="0 0 240 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* house outline */}
      <path
        d="M60 200 V110 L120 55 L180 110 V200"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M60 110 H180" stroke={strokeColor} strokeWidth="1.6" />
      <path d="M108 200 V160 H132 V200" stroke={strokeColor} strokeWidth="1.6" strokeLinejoin="round" />

      {/* left botanical sprig */}
      <path d="M60 200 C48 175 44 150 52 118" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M52 118 C38 122 30 116 24 100" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M55 140 C42 138 34 130 30 116" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M56 165 C44 168 34 162 28 150" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="23" cy="99" r="4.5" stroke={strokeColor} strokeWidth="1.2" />

      {/* right botanical sprig */}
      <path d="M180 110 C186 90 182 68 165 48" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M165 48 C170 60 180 63 195 58" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M172 70 C180 72 190 68 197 58" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M177 92 C186 92 194 86 199 76" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
