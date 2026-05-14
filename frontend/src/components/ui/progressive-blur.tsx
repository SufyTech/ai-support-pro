interface ProgressiveBlurProps {
  blurIntensity?: number;
  className?: string;
  direction: "left" | "right";
}

export function ProgressiveBlur({
  blurIntensity = 1,
  className = "",
  direction,
}: ProgressiveBlurProps) {
  const gradientDirection =
    direction === "left"
      ? "from-void/50 to-transparent"
      : "from-transparent to-void/50";

  return (
    <div
      className={`bg-gradient-to-r ${gradientDirection} ${className}`}
      style={{
        backdropFilter: `blur(${blurIntensity * 8}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity * 8}px)`,
      }}
    />
  );
}
