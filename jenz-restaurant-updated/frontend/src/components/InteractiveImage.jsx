import { useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Premium hover/tap image card.
 * Desktop: hovering zooms the image and reveals an overlay with title/description/action.
 * Mobile (no cursor): tapping the image toggles the same overlay; tapping the action
 * button (if provided) triggers onAction without needing a second tap.
 */
const InteractiveImage = ({
  src,
  title,
  description,
  actionLabel = "View Gallery",
  onAction,
  className = "",
  imgClassName = "",
  rounded = "rounded-2xl",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${rounded} group cursor-pointer shadow-premium select-none ${className}`}
      onClick={() => setOpen((o) => !o)}
      role={onAction ? "button" : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") setOpen((o) => !o);
      }}
    >
      <img
        src={src}
        alt={title}
        loading="lazy"
        className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${
          open ? "scale-110" : ""
        } ${imgClassName}`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/25 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${
          open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <p className="text-cream font-display text-base sm:text-lg leading-tight">{title}</p>
        {description && (
          <p className="text-cream/75 text-xs mt-1 mb-3 leading-relaxed line-clamp-2">{description}</p>
        )}
        {onAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="self-start inline-flex items-center gap-1 text-[11px] font-semibold bg-gold text-charcoal px-3 py-1.5 rounded-full hover:bg-goldLight transition"
          >
            {actionLabel} <ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractiveImage;
