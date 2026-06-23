/**
 * SIDE: Client-side (Presenter Component)
 * Description: SVG vector illustration of a cute cat wearing a chef's hat holding a baguette.
 */

import React from "react";

interface CatBaguetteProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function CatBaguette({ className = "", width = 200, height = 200 }: CatBaguetteProps) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className={className}
    >
      {/* Background shadow */}
      <ellipse cx="100" cy="180" rx="45" ry="10" fill="#e5ded4" opacity="0.8" />

      {/* Sparkles */}
      <path
        d="M 40 45 L 43 53 L 51 56 L 43 59 L 40 67 L 37 59 L 29 56 L 37 53 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="1.5"
      />
      <path
        d="M 160 55 L 162 61 L 168 63 L 162 65 L 160 71 L 158 65 L 152 63 L 158 61 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="1.5"
      />

      {/* Cat Tail */}
      <path
        d="M 70 160 Q 50 170 48 145 Q 46 120 54 125"
        fill="none"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cat Body */}
      <path
        d="M 70 170 C 65 110, 75 90, 100 90 C 125 90, 135 110, 130 170 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Cat Ears */}
      {/* Left Ear */}
      <path
        d="M 72 95 L 68 72 L 88 88 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 74 91 L 71 79 L 83 87 Z"
        fill="#e57c7c"
      />
      {/* Right Ear */}
      <path
        d="M 128 95 L 132 72 L 112 88 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 126 91 L 129 79 L 117 87 Z"
        fill="#e57c7c"
      />

      {/* Chef's Hat */}
      <path
        d="M 85 78 C 85 62, 115 62, 115 78 C 120 75, 118 67, 108 67 C 103 57, 97 57, 92 67 C 82 67, 80 75, 85 78 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 87 78 H 113 V 83 H 87 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="3.5"
      />

      {/* Baguette (held diagonally in front of body) */}
      <path
        d="M 60 155 C 50 150, 130 90, 140 100 C 145 105, 70 165, 60 155 Z"
        fill="#6b4a3a"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Baguette cuts */}
      <path d="M 80 135 L 85 142" stroke="#f2efea" strokeWidth="3" strokeLinecap="round" />
      <path d="M 98 122 L 103 129" stroke="#f2efea" strokeWidth="3" strokeLinecap="round" />
      <path d="M 116 109 L 121 116" stroke="#f2efea" strokeWidth="3" strokeLinecap="round" />

      {/* Happy face */}
      {/* Eyes */}
      <path
        d="M 82 112 Q 86 116 90 112"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 110 112 Q 114 116 118 112"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Nose/Mouth */}
      <path
        d="M 98 119 Q 100 122 102 119"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Whiskers */}
      <line x1="68" y1="120" x2="58" y2="120" stroke="#0725b0" strokeWidth="2" strokeLinecap="round" />
      <line x1="68" y1="125" x2="60" y2="127" stroke="#0725b0" strokeWidth="2" strokeLinecap="round" />
      <line x1="132" y1="120" x2="142" y2="120" stroke="#0725b0" strokeWidth="2" strokeLinecap="round" />
      <line x1="132" y1="125" x2="140" y2="127" stroke="#0725b0" strokeWidth="2" strokeLinecap="round" />

      {/* Paws (holding the baguette) */}
      <circle cx="85" cy="138" r="7" fill="#f2efea" stroke="#0725b0" strokeWidth="3.5" />
      <circle cx="112" cy="120" r="7" fill="#f2efea" stroke="#0725b0" strokeWidth="3.5" />

      {/* Cheeks */}
      <circle cx="78" cy="116" r="3" fill="#e57c7c" opacity="0.6" />
      <circle cx="122" cy="116" r="3" fill="#e57c7c" opacity="0.6" />
    </svg>
  );
}
