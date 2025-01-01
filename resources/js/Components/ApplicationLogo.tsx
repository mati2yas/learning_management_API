import { SVGAttributes } from 'react';

interface ApplicationLogoProps extends SVGAttributes<SVGElement> {
  primaryColor?: string;
  secondaryColor?: string;
}

export default function ApplicationLogo({
  primaryColor = '#4F46E5',
  secondaryColor = '#818CF8',
  ...props
}: ApplicationLogoProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Base of the L */}
      <path
        d="M20 80 L60 80 L60 70 L30 70 L30 20 L20 20 Z"
        fill="url(#grad1)"
        filter="url(#shadow)"
      />
      
      {/* Top layer of the L for 3D effect */}
      <path
        d="M25 75 L55 75 L55 65 L35 65 L35 25 L25 25 Z"
        fill={primaryColor}
      />
      
      {/* Highlight */}
      <path
        d="M27 27 L27 73 L53 73 L53 71 L29 71 L29 27 Z"
        fill="white"
        fillOpacity="0.3"
      />
      
      {/* Additional decorative element */}
      <circle
        cx="70"
        cy="30"
        r="15"
        fill={secondaryColor}
        filter="url(#shadow)"
      />
      <path
        d="M65 30 L75 30 M70 25 L70 35"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

