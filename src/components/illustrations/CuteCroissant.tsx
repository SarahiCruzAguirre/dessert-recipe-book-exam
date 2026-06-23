/**
 * SIDE: Client-side (Presenter Component)
 * Description: SVG vector illustration of a cute walking croissant with a smiley face.
 */

import React from "react";

interface CuteCroissantProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function CuteCroissant({ className = "", width = 120, height = 120 }: CuteCroissantProps) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={width}
      height={height}
      className={className}
    >
      {/* Legs (walking) */}
      <path
        d="M 50 85 Q 45 100 38 98"
        fill="none"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 70 85 Q 75 100 82 98"
        fill="none"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Main Croissant Body segments */}
      {/* Outer/Back layers */}
      <path
        d="M 20 60 C 20 25, 100 25, 100 60 C 85 75, 35 75, 20 60 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Layer 2 */}
      <path
        d="M 30 60 C 30 35, 90 35, 90 60 C 80 70, 40 70, 30 60 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Layer 3 */}
      <path
        d="M 42 60 C 42 43, 78 43, 78 60 C 72 67, 48 67, 42 60 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Center cap */}
      <path
        d="M 50 60 C 50 48, 70 48, 70 60 C 66 65, 54 65, 50 60 Z"
        fill="#6b4a3a"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Smiley Face */}
      {/* Eyes */}
      <circle cx="53" cy="56" r="3" fill="#0725b0" />
      <circle cx="67" cy="56" r="3" fill="#0725b0" />
      
      {/* Mouth */}
      <path
        d="M 58 60 Q 60 63 62 60"
        fill="none"
        stroke="#0725b0"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Cheeks */}
      <ellipse cx="48" cy="59" rx="3.5" ry="2" fill="#e57c7c" opacity="0.7" />
      <ellipse cx="72" cy="59" rx="3.5" ry="2" fill="#e57c7c" opacity="0.7" />

      {/* Details/Shine */}
      <path
        d="M 28 48 Q 40 40 50 45"
        fill="none"
        stroke="#f2efea"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
