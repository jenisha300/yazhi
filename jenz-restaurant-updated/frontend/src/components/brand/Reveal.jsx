import { useEffect, useRef, useState } from "react";

// Lightweight scroll-reveal wrapper — no animation library required.
// Adds `.reveal` / `.reveal-scale` (defined in index.css) and toggles
// `.is-visible` once the element enters the viewport. Automatically becomes
// a no-op (content simply visible) when the user prefers reduced motion,
// via the plain CSS media query in index.css.
const Reveal = ({
  children,
  as: Tag = "div",
  variant = "up", // "up" | "scale"
  delay = 0,
  className = "",
  once = true,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`${variant === "scale" ? "reveal-scale" : "reveal"} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
