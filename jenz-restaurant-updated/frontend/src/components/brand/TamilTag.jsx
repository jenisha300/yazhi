// A small bilingual label used as a section "eyebrow" throughout the site —
// the English word stacked above its Tamil equivalent, e.g.
//   <TamilTag en="Taste" ta="சுவை" />
const TamilTag = ({ en, ta, align = "center", className = "" }) => (
  <div
    className={`inline-flex flex-col ${
      align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center"
    } leading-none ${className}`}
  >
    <span className="uppercase tracking-[0.3em] text-gold text-xs font-semibold">{en}</span>
    {ta && <span className="font-tamil-display text-goldDark/80 text-lg mt-1.5">{ta}</span>}
  </div>
);

export default TamilTag;
