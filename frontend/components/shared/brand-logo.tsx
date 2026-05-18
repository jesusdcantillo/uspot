"use client";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  const baseClassName =
    "text-[1.5rem] font-extrabold tracking-tighter text-[#004ac6] sm:text-[1.6rem]";

  return (
    <span
      className={className ? `${baseClassName} ${className}` : baseClassName}
    >
      USpot
    </span>
  );
}
