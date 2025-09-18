import React from "react";
import { Card, CardBody } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendDirection = "up",
  color = "primary",
  subtitle,
  onClick
}) => {
  const colorVariants = {
    primary: {
      bg: "bg-gradient-to-br from-primary-50 to-primary-100",
      icon: "text-primary-500",
      trend: trendDirection === "up" ? "text-green-500" : "text-red-500"
    },
    success: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      icon: "text-green-500",
      trend: trendDirection === "up" ? "text-green-500" : "text-red-500"
    },
    warning: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      icon: "text-orange-500",
      trend: trendDirection === "up" ? "text-green-500" : "text-red-500"
    },
    danger: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      icon: "text-red-500",
      trend: trendDirection === "up" ? "text-green-500" : "text-red-500"
    },
    info: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      icon: "text-blue-500",
      trend: trendDirection === "up" ? "text-green-500" : "text-red-500"
    }
  };

  const colors = colorVariants[color];

  return (
    <Card 
      hover={!!onClick} 
      className={onClick ? "cursor-pointer" : ""}
      onClick={onClick}
    >
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <ApperIcon 
                  name={trendDirection === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={`h-4 w-4 mr-1 ${colors.trend}`} 
                />
                <span className={`text-sm font-medium ${colors.trend}`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <ApperIcon name={icon} className={`h-6 w-6 ${colors.icon}`} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatsCard;