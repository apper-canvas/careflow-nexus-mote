import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing to show here yet.", 
  icon = "Database",
  action = null,
  actionLabel = "Add New",
  type = "default" 
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "patients":
        return {
          icon: "Users",
          title: "No patients found",
          description: "Start by registering your first patient or adjust your search criteria.",
          actionLabel: "Register Patient"
        };
      case "appointments":
        return {
          icon: "Calendar",
          title: "No appointments scheduled",
          description: "Schedule appointments to see them listed here.",
          actionLabel: "Schedule Appointment"
        };
      case "staff":
        return {
          icon: "UserCheck",
          title: "No staff members found",
          description: "Add staff members to manage your hospital operations.",
          actionLabel: "Add Staff Member"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "Try adjusting your search terms or filters.",
          actionLabel: "Clear Search"
        };
      case "departments":
        return {
          icon: "Building",
          title: "No departments found",
          description: "Set up departments to organize your hospital structure.",
          actionLabel: "Add Department"
        };
      default:
        return {
          icon: icon,
          title: title,
          description: description,
          actionLabel: actionLabel
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={config.icon} className="h-10 w-10 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md leading-relaxed">
        {config.description}
      </p>
      
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {config.actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;