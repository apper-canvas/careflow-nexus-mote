import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      description: "Overview & key metrics"
    },
    {
      name: "Patients",
      href: "/patients",
      icon: "Users",
      description: "Patient records & profiles"
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: "Calendar",
      description: "Schedule & manage appointments"
    },
    {
      name: "Staff",
      href: "/staff",
      icon: "UserCheck",
      description: "Staff management & schedules"
    },
    {
      name: "Departments",
      href: "/departments",
      icon: "Building",
      description: "Department overview & resources"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "FileText",
      description: "Analytics & compliance reports"
    }
  ];

  // Desktop Sidebar - Static positioning
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              CareFlow
            </span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 hover:transform hover:scale-[1.01]"
                }`
              }
            >
              <ApperIcon
                name={item.icon}
                className="mr-3 h-5 w-5 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Stethoscope" className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-primary-800">Dr. Sarah Wilson</p>
                <p className="text-xs text-primary-600">Chief Medical Officer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar - Transform overlay
  const MobileSidebar = () => (
    <>
      {/* Mobile backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        />
      </div>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              CareFlow
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700"
                }`
              }
            >
              <ApperIcon
                name={item.icon}
                className="mr-3 h-5 w-5 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Stethoscope" className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-primary-800">Dr. Sarah Wilson</p>
                <p className="text-xs text-primary-600">Chief Medical Officer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;