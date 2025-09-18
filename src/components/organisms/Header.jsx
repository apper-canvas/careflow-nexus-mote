import React from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Header = ({ onMenuClick, onSearch, searchValue, onSearchChange }) => {
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </Button>
            
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-900">Hospital Dashboard</h1>
              <p className="text-sm text-gray-500">{currentDate}</p>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-lg mx-4">
            <SearchBar
              placeholder="Search patients, staff, or appointments..."
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearch}
              className="w-full"
            />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Emergency Alert Button */}
            <Button
              variant="danger"
              size="sm"
              icon="AlertTriangle"
              className="hidden sm:flex animate-pulse-gentle"
            >
              Emergency
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ApperIcon name="Bell" className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">3</span>
                </span>
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="outline" size="sm" icon="Plus">
                New Patient
              </Button>
              <Button variant="primary" size="sm" icon="Calendar">
                Schedule
              </Button>
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-sm">
                <div className="font-medium text-gray-900">Dr. Sarah Wilson</div>
                <div className="text-gray-500">Chief Medical Officer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;