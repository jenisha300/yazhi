import { useEffect, useRef } from "react";

// Subtle depth-of-scroll effect for hero imagery and decorative layers.
// Moves the wrapped element a few percent slower/faster than the page scroll
// to create a gentle parallax "layers merging into each other" feel —
// implemented with a single rAF-throttled scroll listener (no WebGL, no
// animation library) and fully disabled for prefers-reduced-motion.
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Parallax = ({ children, speed = 0.15, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const node = ref.current;
    if (!node) return;

    let ticking = false;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const distance = elCenter - viewportCenter;
      node.style.transform = `translate3d(0, ${(distance * speed * -1).toFixed(2)}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`parallax-el ${className}`}>
      {children}
    </div>
  );
};

export default Parallax;
