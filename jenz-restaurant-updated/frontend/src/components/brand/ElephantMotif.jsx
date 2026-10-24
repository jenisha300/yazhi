// A single elegant, traditional-style elephant silhouette — used sparingly
// as a heritage motif (section corners, footer, empty states). Deliberately
// simple and dignified rather than cartoonish.
const ElephantMotif = ({ className = "w-10 h-10 text-gold/70" }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
    <path
      d="M20 78 C14 78 10 73 10 66 C10 55 17 45 17 34 C17 20 28 10 44 10 C60 10 70 20 72 32 C80 33 86 40 86 49 C86 56 82 61 76 63 L76 78 C76 81 74 83 71 83 C68 83 66 81 66 78 L66 66 L52 66 L52 78 C52 81 50 83 47 83 C44 83 42 81 42 78 L42 68 C34 66 27 71 27 78 C27 81 25 83 22 83 C21 83 20 81 20 78 Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="60" cy="30" r="2.2" fill="currentColor" />
    <path d="M30 40 C 26 46, 26 54, 31 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default ElephantMotif;
