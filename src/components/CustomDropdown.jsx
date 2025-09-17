import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomDropdown = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-xs text-gray-600 mb-1 brockman-font">{label}</label>
      )}
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 brockman-font"
      >
        <span className="text-left flex-1 brockman-font">{value}</span>
        <FaChevronDown
          className={`ml-2 h-3 w-3 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-orange-200 max-h-60 overflow-auto">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors text-left brockman-font ${
                opt === value
                  ? "bg-gradient-to-r from-rose-400 to-rose-400 text-white"
                  : "hover:bg-orange-50 text-gray-800"
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;