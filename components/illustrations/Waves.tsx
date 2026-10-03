/** Vagues décoratives pour le bas des bandeaux */
export function Waves({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M0 40c120 25 240 25 360 0s240-25 360 0 240 25 360 0 240-25 360 0v50H0z"
        fill="currentColor"
        opacity=".35"
      />
      <path d="M0 60c120 20 240 20 360 0s240-20 360 0 240 20 360 0 240-20 360 0v30H0z" fill="currentColor" />
    </svg>
  );
}
