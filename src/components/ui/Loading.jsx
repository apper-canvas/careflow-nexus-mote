import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-shimmer"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-shimmer"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
                <div className="h-6 w-6 bg-gray-200 rounded animate-shimmer"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-shimmer mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-shimmer mb-4"></div>
            <div className="h-64 bg-gray-200 rounded animate-shimmer"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-shimmer mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-shimmer"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
};

export default Loading;