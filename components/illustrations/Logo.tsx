/** Logo simple : goutte d'eau stylisée avec vague */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pf-logo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1fe0ca" />
          <stop offset="1" stopColor="#2578eb" />
        </linearGradient>
      </defs>
      <path d="M16 2C16 2 5 14 5 20.5a11 11 0 0 0 22 0C27 14 16 2 16 2Z" fill="url(#pf-logo)" />
      <path
        d="M8.5 21c2-1.6 3.8-1.6 5.8 0s3.8 1.6 5.8 0 2.6-1.3 3.4-.7"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
