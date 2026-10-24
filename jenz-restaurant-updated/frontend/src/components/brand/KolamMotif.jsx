// Kolam-inspired decorative motifs for the Yāzhi identity.
// All pieces are purely decorative (aria-hidden, pointer-events disabled by
// their containers) and rendered in a single brass tone via `currentColor`
// so they can be tinted with a text-color utility class from the caller.
import kolamWatermark from "../../assets/images/brand/Kolam_15_15.svg";
// A tileable "pulli kolam" style unit: a grid of dots woven by a single
// continuous looping line — simplified and elegant rather than literal.
const KolamTile = ({ id }) => (
  <pattern id={id} width="64" height="96" patternUnits="userSpaceOnUse">
    <g fill="none" stroke="currentColor" strokeWidth="1.1">
      <path d="M8 0 C 24 8, 24 24, 8 32 C -8 40, -8 56, 8 64 C 24 72, 24 88, 8 96" />
      <path d="M56 0 C 40 8, 40 24, 56 32 C 72 40, 72 56, 56 64 C 40 72, 40 88, 56 96" />
      <path d="M8 32 C 24 24, 40 24, 56 32" />
      <path d="M8 64 C 24 56, 40 56, 56 64" />
    </g>
    <g fill="currentColor">
      <circle cx="8" cy="0" r="1.6" />
      <circle cx="8" cy="32" r="1.6" />
      <circle cx="8" cy="64" r="1.6" />
      <circle cx="8" cy="96" r="1.6" />
      <circle cx="56" cy="0" r="1.6" />
      <circle cx="56" cy="32" r="1.6" />
      <circle cx="56" cy="64" r="1.6" />
      <circle cx="56" cy="96" r="1.6" />
    </g>
  </pattern>
);

// Fixed, full-height decorative rail — meant to be mounted once (e.g. in
// App.jsx) and positioned along the left or right edge of the viewport.
// Never overlays content: it lives in its own narrow fixed strip with
// pointer-events disabled, sits low in the stacking order, and is dimmed /
// narrowed on small screens via the `.kolam-rail` CSS class.
export const KolamRail = ({ side = "right", className = "" }) => (
  <div
    className={`kolam-rail ${side} text-gold animate-kolam-drift ${className} flex flex-col items-center justify-around py-8`}
    aria-hidden="true"
  >
    {Array.from({ length: 6 }).map((_, i) => (
      <svg key={i} width="40" height="40" viewBox="0 0 512.001 512.001" fill="currentColor">
        <g>
          <g>
            <circle cx="161.393" cy="105.741" r="16.696"/>
          </g>
        </g>
        <g>
          <g>
            <circle cx="356.179" cy="105.741" r="16.696"/>
          </g>
        </g>
        <g>
          <g>
            <circle cx="256.004" cy="38.954" r="16.696"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M266.99,109.868c-6.283-5.511-15.696-5.511-21.979,0c-3.022,2.641-74.078,65.713-74.078,146.133
              s71.056,143.491,74.078,146.133c3.141,2.756,7.066,4.131,10.989,4.131s7.848-1.375,10.989-4.131
              c3.022-2.641,74.078-65.713,74.078-146.133S270.011,112.51,266.99,109.868z"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M466.187,199.603c-0.489-8.495-7.283-15.267-15.772-15.729c-2.314-0.098-42.609-1.937-86.52,11.643
              c6.377,18.6,10.563,38.864,10.563,60.484c0,63.348-34.941,115.647-60.36,145.357c31.604-5.956,69.817-18.946,98.731-47.193
              C471.003,297.354,466.405,203.57,466.187,199.603z"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M50.173,346.282c-26.719,14.308-43.764,30.045-44.883,31.09c-7.053,6.587-7.053,17.802,0,24.392
              c2.381,2.228,59.207,54.588,131.056,54.588c28.955,0,55.379-8.535,76.875-18.834C146.461,429.771,86.645,402.72,50.173,346.282z"
              />
          </g>
        </g>
        <g>
          <g>
            <path d="M506.71,377.372c-1.119-1.044-18.164-16.779-44.881-31.088c-36.475,56.45-96.296,83.488-163.049,91.234
              c21.494,10.298,47.918,18.833,76.873,18.833c71.849,0,128.675-52.359,131.056-54.588
              C513.764,395.176,513.764,383.96,506.71,377.372z"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M256.019,451.981c-11.493,7.317-25.462,14.964-41.429,21.508c15.773,8.381,31.014,13.72,36.203,15.423
              c3.341,1.092,6.971,1.125,10.413,0c5.189-1.703,20.431-7.041,36.203-15.423C281.487,466.961,267.51,459.27,256.019,451.981z"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M137.542,256.001c0-21.623,4.187-41.887,10.565-60.49c-43.908-13.585-84.202-11.749-86.523-11.636
              c-8.489,0.462-15.282,7.234-15.772,15.729c-0.217,3.967-4.815,97.751,53.359,154.562c28.917,28.243,67.126,41.233,98.725,47.19
              C172.49,371.659,137.542,319.355,137.542,256.001z"/>
          </g>
        </g>
      </svg>
    ))}
  </div>
);

// Small ornament for card / section corners.
export const KolamCorner = ({ className = "w-10 h-10 text-gold/50" }) => (
  <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 30 C 4 14, 14 4, 30 4" />
      <path d="M4 22 C 4 12, 12 4, 22 4" />
      <circle cx="4" cy="30" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="30" cy="4" r="1.8" fill="currentColor" stroke="none" />
    </g>
  </svg>
);

// Horizontal ornamental divider — a brass line with a small woven kolam knot
// at the centre. Alternative to the plain `.divider-gold` bar.
export const KolamDivider = ({ className = "" }) => (
  <svg viewBox="0 0 120 16" className={`h-4 w-28 mx-auto text-gold ${className}`} aria-hidden="true">
    <line x1="0" y1="8" x2="46" y2="8" stroke="currentColor" strokeWidth="1.4" />
    <line x1="74" y1="8" x2="120" y2="8" stroke="currentColor" strokeWidth="1.4" />
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M52 8 C 56 2, 64 2, 68 8 C 64 14, 56 14, 52 8 Z" />
    </g>
    <circle cx="60" cy="8" r="1.6" fill="currentColor" />
  </svg>
);

export const LeftWatermark = () => (
  <div className="kolam-watermark left" aria-hidden="true">
    <img src={kolamWatermark} alt="" />
  </div>
);

export default KolamRail;
