import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry = null, type = "default" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notFound":
        return "Search";
      case "permission":
        return "Lock";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Error";
      case "notFound":
        return "Not Found";
      case "permission":
        return "Access Denied";
      default:
        return "Oops! Something went wrong";
    }
  };

  const getErrorDescription = () => {
    switch (type) {
      case "network":
        return "Please check your internet connection and try again.";
      case "notFound":
        return "The resource you're looking for could not be found.";
      case "permission":
        return "You don't have permission to access this resource.";
      default:
        return "We encountered an unexpected error. Please try again.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={getErrorIcon()} className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-500 mb-1 max-w-md">
        {message || getErrorDescription()}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;