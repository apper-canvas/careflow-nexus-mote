import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-orange-100 text-orange-800 border border-orange-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    critical: "bg-red-100 text-red-800 border border-red-200",
    urgent: "bg-orange-100 text-orange-800 border border-orange-200",
    stable: "bg-green-100 text-green-800 border border-green-200",
    observation: "bg-blue-100 text-blue-800 border border-blue-200",
    discharge: "bg-purple-100 text-purple-800 border border-purple-200"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;