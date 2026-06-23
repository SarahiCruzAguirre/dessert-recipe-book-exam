import React from "react";

interface CatFavoriteIconProps {
  className?: string;
  filled?: boolean;
}

export default function CatFavoriteIcon({ className = "w-5 h-5", filled = false }: CatFavoriteIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cat head and ears outline/fill */}
      <path
        d="M12 5.5c-1.2 0-2.4.2-3.5.6L4.5 2.5l1.6 5.2c-2.1 1.9-3.5 4.6-3.5 7.8c0 4.4 4.2 8 9.4 8s9.4-3.6 9.4-8c0-3.2-1.4-5.9-3.5-7.8l1.6-5.2l-4 3.6c-1.1-.4-2.3-.6-3.5-.6z"
        fill={filled ? "currentColor" : "none"}
      />
      {/* Eyes */}
      <circle
        cx="8.5"
        cy="13"
        r="1"
        fill={filled ? "#f2efea" : "currentColor"}
        stroke="none"
      />
      <circle
        cx="15.5"
        cy="13"
        r="1"
        fill={filled ? "#f2efea" : "currentColor"}
        stroke="none"
      />
      {/* Nose */}
      <path
        d="M11.5 15.5h1l-0.5 0.8z"
        fill={filled ? "#f2efea" : "currentColor"}
        stroke="none"
      />
    </svg>
  );
}
