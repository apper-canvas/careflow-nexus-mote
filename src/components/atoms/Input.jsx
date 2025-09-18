import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  ...props 
}, ref) => {
  const baseStyles = "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";
  
  const errorStyles = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  const inputElement = (
    <input
      type={type}
      className={cn(
        baseStyles,
        errorStyles,
        leftIcon && "pl-10",
        rightIcon && "pr-10",
        className
      )}
      ref={ref}
      {...props}
    />
  );

  if (leftIcon || rightIcon) {
    return (
      <div className="relative">
        {leftIcon && (
          <ApperIcon 
            name={leftIcon} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
          />
        )}
        {inputElement}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name={rightIcon} className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = "Input";

export default Input;