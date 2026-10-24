// Decorative banana-leaf accent — a simple swirl of two overlapping leaf
// blades, used behind/beside food content to reinforce the South Indian
// dining identity without illustrating anything literal.
const BananaLeafAccent = ({ className = "w-16 h-16 text-banana/25" }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true" fill="none">
    <path
      d="M100 20 C 70 20 40 45 30 85 C 60 90 95 70 100 40 C 102 32 102 25 100 20 Z"
      fill="currentColor"
    />
    <path
      d="M95 30 C 70 34 48 52 38 80"
      stroke="currentColor"
      strokeOpacity="0.6"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export default BananaLeafAccent;
