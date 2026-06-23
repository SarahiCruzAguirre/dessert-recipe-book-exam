/**
 * SIDE: Client-side (Presenter Component)
 * Description: SVG vector illustration of a cute winking cat barista holding a coffee cup.
 */

import React from "react";

interface CatCoffeeProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function CatCoffee({ className = "", width = 200, height = 200 }: CatCoffeeProps) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className={className}
    >
      {/* Background shadow */}
      <ellipse cx="100" cy="180" rx="50" ry="10" fill="#e5ded4" opacity="0.8" />

      {/* Coffee Steam */}
      <path
        d="M 122 105 Q 120 95 125 90"
        fill="none"
        stroke="#6b4a3a"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M 130 105 Q 128 97 133 93"
        fill="none"
        stroke="#6b4a3a"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Cat Tail */}
      <path
        d="M 68 150 Q 45 140 50 120 Q 55 105 52 108"
        fill="none"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cat Body */}
      <path
        d="M 65 170 C 60 110, 70 85, 100 85 C 130 85, 140 110, 135 170 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Barista Apron (City Hunter Blue `#0725b0`) */}
      <path
        d="M 80 130 L 120 130 L 125 170 L 75 170 Z"
        fill="#0725b0"
        stroke="#0725b0"
        strokeWidth="2"
      />
      {/* Apron straps */}
      <path
        d="M 80 130 L 75 110"
        stroke="#0725b0"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 120 130 L 125 110"
        stroke="#0725b0"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Cat Ears */}
      {/* Left Ear */}
      <path
        d="M 70 90 L 65 67 L 85 83 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 72 86 L 69 74 L 81 82 Z"
        fill="#e57c7c"
      />
      {/* Right Ear */}
      <path
        d="M 130 90 L 135 67 L 115 83 Z"
        fill="#f2efea"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 128 86 L 131 74 L 119 82 Z"
        fill="#e57c7c"
      />

      {/* Winking Face */}
      {/* Left Eye (Winking/Closed line) */}
      <path
        d="M 78 110 Q 84 114 90 110"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right Eye (Open Circle) */}
      <circle cx="118" cy="110" r="3" fill="#0725b0" />
      
      {/* Nose/Mouth */}
      <path
        d="M 97 116 Q 100 119 103 116"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      {/* Rosy Cheeks */}
      <circle cx="75" cy="114" r="3" fill="#e57c7c" opacity="0.6" />
      <circle cx="123" cy="114" r="3" fill="#e57c7c" opacity="0.6" />

      {/* Coffee Cup */}
      {/* Cup Body */}
      <path
        d="M 112 120 L 138 120 L 134 140 L 116 140 Z"
        fill="#e5ded4"
        stroke="#0725b0"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Cup handle */}
      <path
        d="M 138 125 C 145 125, 145 135, 137 135"
        fill="none"
        stroke="#0725b0"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Coffee logo on cup (small heart) */}
      <path
        d="M 123 128 C 123 128, 124 126, 125 127 C 126 126, 127 128, 127 128 L 125 131 Z"
        fill="#0725b0"
      />

      {/* Paws */}
      {/* Left Paw */}
      <circle cx="85" cy="138" r="6" fill="#f2efea" stroke="#0725b0" strokeWidth="3" />
      {/* Right Paw holding cup */}
      <circle cx="115" cy="130" r="6" fill="#f2efea" stroke="#0725b0" strokeWidth="3" />
    </svg>
  );
}
