"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE: Record<NonNullable<AvatarProps["size"]>, { px: number; text: string }> = {
  sm: { px: 32, text: "text-[11px]" },
  md: { px: 48, text: "text-[15px]" },
  lg: { px: 80, text: "text-[26px]" },
};

const COLORS = [
  "#FF385C", "#00A699", "#FC642D", "#484848",
  "#7B61FF", "#00B4D8", "#2D6A4F", "#854D0E",
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return h;
}

export function Avatar({ src, firstName, lastName, size = "md", className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const bg = COLORS[hashName(fullName) % COLORS.length];
  const { px, text } = SIZE[size];

  const showImage = !!src && !imgError;

  return (
    <div
      className={cn("relative rounded-full overflow-hidden shrink-0 select-none", className)}
      style={{ width: px, height: px, background: showImage ? "#f2f2f2" : bg }}
    >
      {showImage && (
        <img
          src={src}
          alt={fullName}
          width={px}
          height={px}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
      {!showImage && (
        <span
          className={cn("absolute inset-0 flex items-center justify-center font-semibold text-white", text)}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
