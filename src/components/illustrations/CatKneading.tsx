import React from "react";

interface CatKneadingProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function CatKneading({ className = "", width = 200, height = 200 }: CatKneadingProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className={className}
    >
      {/* Background soft shadow */}
      <ellipse cx="100" cy="170" rx="60" ry="12" fill="#e5ded4" opacity="0.8" />

      {/* Dough */}
      <path
        d="M 50 160 Q 30 165 50 175 Q 100 180 150 175 Q 170 165 150 160 Q 100 155 50 160 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="65" cy="168" r="2" fill="#6b4a3a" opacity="0.3" />
      <circle cx="135" cy="168" r="2" fill="#6b4a3a" opacity="0.3" />

      {/* Rolling Pin */}
      <path
        d="M 25 145 H 175 V 153 H 25 Z"
        fill="#6b4a3a"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Rolling Pin handles */}
      <path
        d="M 15 147 H 25 V 151 H 15 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="3.5"
      />
      <path
        d="M 175 147 H 185 V 151 H 175 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="3.5"
      />

      {/* Cat Body */}
      <path
        d="M 60 150 C 50 110, 60 80, 100 80 C 140 80, 150 110, 140 150 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Calico Spots (Orange and Brownish Black) */}
      {/* Spot 1: Orange on left side of head */}
      <path
        d="M 65 92 Q 80 82 85 100 Q 75 110 65 92 Z"
        fill="#d97706"
      />
      {/* Spot 2: Brown on right body side */}
      <path
        d="M 125 110 Q 140 115 135 130 Q 120 135 125 110 Z"
        fill="#6b4a3a"
      />

      {/* Cat Tail */}
      <path
        d="M 135 145 Q 165 140 160 120 Q 155 110 158 112"
        fill="none"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Cat Ears */}
      {/* Left Ear */}
      <path
        d="M 65 85 L 60 62 L 82 78 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 68 81 L 65 69 L 77 77 Z"
        fill="#e57c7c"
      />
      {/* Right Ear */}
      <path
        d="M 135 85 L 140 62 L 118 78 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 132 81 L 135 69 L 123 77 Z"
        fill="#e57c7c"
      />

      {/* Chef's Hat */}
      <path
        d="M 80 68 C 80 50, 120 50, 120 68 C 125 65, 122 55, 110 55 C 105 45, 95 45, 90 55 C 78 55, 75 65, 80 68 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 83 68 H 117 V 73 H 83 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="3.5"
      />

      {/* Happy closed eyes */}
      <path
        d="M 72 105 Q 78 111 84 105"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 116 105 Q 122 111 128 105"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Nose and Mouth (w-shaped) */}
      <path
        d="M 96 112 Q 100 116 104 112"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 100 112 Q 100 109 100 110"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3"
      />
      
      {/* Rosy Cheeks */}
      <circle cx="68" cy="111" r="4" fill="#e57c7c" opacity="0.6" />
      <circle cx="132" cy="111" r="4" fill="#e57c7c" opacity="0.6" />

      {/* Whiskers */}
      <line x1="52" y1="110" x2="42" y2="108" stroke="#0725b0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="116" x2="40" y2="117" stroke="#0725b0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="148" y1="110" x2="158" y2="108" stroke="#0725b0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="148" y1="116" x2="160" y2="117" stroke="#0725b0" strokeWidth="2.5" strokeLinecap="round" />

      {/* Paws Kneading */}
      {/* Left Paw */}
      <circle cx="78" cy="142" r="10" fill="#f2efea" stroke="#0725b0" strokeWidth="4" />
      {/* Right Paw */}
      <circle cx="122" cy="142" r="10" fill="#f2efea" stroke="#0725b0" strokeWidth="4" />
    </svg>
  );
}
