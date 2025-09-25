import React from "react";
import clsx from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  centered?: boolean;   // NEW: allows optional centering
  className?: string;
}

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  centered = true,
  className = "",
}) => {
  const spinner = (
    <span
      role="status"
      aria-label="loading"
      className={clsx(
        "inline-block animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );

  return centered ? (
    <div className="w-full flex justify-center items-center">{spinner}</div>
  ) : (
    spinner
  );
};

export default LoadingSpinner;
