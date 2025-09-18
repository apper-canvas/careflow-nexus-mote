import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  className = "",
  value = "",
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onChange) {
      onChange("");
    }
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        leftIcon="Search"
        rightIcon={searchTerm ? "X" : undefined}
        onRightIconClick={searchTerm ? handleClear : undefined}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;