export function WheatSprig({
  className = "",
  strokeColor = "var(--gold)",
}: {
  className?: string;
  strokeColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M30 200 C28 150 32 100 30 20" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      {[30, 55, 80, 105, 130, 155].map((y, i) => (
        <g key={y}>
          <path
            d={`M30 ${y} C18 ${y - 10} 10 ${y - 4} 6 ${y + 8}`}
            stroke={strokeColor}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d={`M30 ${y + 12} C42 ${y + 2} 50 ${y + 8} 54 ${y + 20}`}
            stroke={strokeColor}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path d="M30 20 C24 8 30 2 30 2 C30 2 36 8 30 20" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
