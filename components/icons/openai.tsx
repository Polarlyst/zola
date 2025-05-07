import * as React from "react"
import type { SVGProps } from "react"

interface HospitalIconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  size?: number | string;
  color?: string;
  title?: string; // For accessibility
}

const HospitalIcon = ({
  size = 24, // Default size can be adjusted, 24 is a common icon size
  color,
  title = "Hospital", // Default accessible title
  className,
  style,
  ...rest
}: HospitalIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24" // Adjusted viewBox for a typical 24x24 icon design
    fill="none"
    aria-hidden={title ? undefined : "true"}
    focusable="false"
    role="img" // Good for accessibility
    className={className}
    style={style}
    {...rest}
  >
    {title && <title>{title}</title>}
    <path
      fill={color || "currentColor"} // Use prop 'color' or CSS 'currentColor'
      // fillRule="evenodd" // Not strictly necessary for this simple path, but can be kept
      // clipRule="evenodd" // Not strictly necessary for this simple path, but can be kept
      // Path data for a simple cross (hospital symbol)
      d="M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6V5Z"
    />
    {/*
      Alternative cross path (thicker, more like a plus sign):
      d="M19 11h-6V5a1 1 0 10-2 0v6H5a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2z"
    */}
    {/*
      Another alternative (solid block cross):
      d="M10 4 H14 V10 H20 V14 H14 V20 H10 V14 H4 V10 H10 Z"
    */}
  </svg>
)
export default OpenAI

// How to use it:
// import HospitalIcon from './HospitalIcon'; // Adjust path as needed
//
// function MyComponent() {
//   return (
//     <div>
//       <HospitalIcon /> {/* Default size and color (currentColor) */}
//       <HospitalIcon size={32} color="red" />
//       <HospitalIcon size="2em" className="my-hospital-icon" style={{ color: 'blue' }} />
//     </div>
//   );
// }
