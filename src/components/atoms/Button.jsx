import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md transform hover:scale-[1.02]",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-300 hover:border-gray-400",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md transform hover:scale-[1.02]",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500 shadow-sm hover:shadow-md transform hover:scale-[1.02]",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md transform hover:scale-[1.02]",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    outline: "border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className={cn("animate-spin", children ? "mr-2 h-4 w-4" : "h-4 w-4")} />
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} className={cn("h-4 w-4", children ? "mr-2" : "")} />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} className={cn("h-4 w-4", children ? "ml-2" : "")} />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;