import * as React from "react"
import type { SVGProps } from "react"

interface HospitalIconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  size?: number | string;
  color?: string;
  title?: string; // For accessibility
}

const HospitalIcon = ({ // <<<--- Defined as HospitalIcon
  size = 24,
  color,
  title = "Hospital",
  className,
  style,
  ...rest
}: HospitalIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden={title ? undefined : "true"}
    focusable="false"
    role="img"
    className={className}
    style={style}
    {...rest}
  >
    {title && <title>{title}</title>}
    <path
      fill={color || "currentColor"}
      d="M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6V5Z"
    />
  </svg>
)

export default HospitalIcon // <<<--- CORRECTED EXPORT
