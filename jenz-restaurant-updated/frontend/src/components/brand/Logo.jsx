import logo from "../../assets/images/brand/logo.png";

// Official Yāzhi — யாழி logo. Always rendered at its native aspect ratio;
// never stretched, cropped, or recoloured. Use the `size` presets to fit
// different contexts (navbar, footer, auth screens, admin sidebar…).
const SIZE_MAP = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
  "2xl": "h-32 w-32",
};

const Logo = ({ size = "md", className = "", alt = "Yāzhi — யாழி" }) => (
  <img
    src={logo}
    alt={alt}
    className={`${SIZE_MAP[size] || SIZE_MAP.md} w-auto object-contain select-none ${className}`}
    draggable={false}
  />
);

export default Logo;
