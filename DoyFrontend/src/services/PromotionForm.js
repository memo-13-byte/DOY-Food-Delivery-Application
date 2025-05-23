// src/services/PromotionForm.js
"use client"; // Important for client-side functionality

import React, { useState, useEffect } from 'react';
import { Tag, FileText, List, Percent, ToggleRight, Calendar, Edit2, Info } from 'lucide-react';

// Assuming these are defined elsewhere or imported from a shared components file.
// If not, you need to define them at the top of this file or in a central location.
// NOTE: The base Input component's className below is general.
// The specific styling for dark/light mode and rounded corners comes from where it's USED.
const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 ${className}`}
    {...props}
  />
);


const Label = ({ className, htmlFor, children }) => (
  <label
    className={`block text-sm font-medium mb-1 text-gray-900 dark:text-gray-200 ${className}`}
    htmlFor={htmlFor}
  >
    {children}
  </label>
);


// Define PROMOTION_TYPES if not imported from elsewhere
const PROMOTION_TYPES = ['PERCENTAGE_OFF', 'FIXED_AMOUNT_OFF', 'NEW_CUSTOMER_FIXED_AMOUNT_OFF', 'NEW_CUSTOMER_PERCENTAGE_OFF'];

function PromotionForm({ onSubmit, initialData = {}, darkMode }) { // 'darkMode' is received as a prop
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [promotionType, setPromotionType] = useState(PROMOTION_TYPES[0]);
  const [discountValue, setDiscountValue] = useState(0);
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setPromotionType(initialData.promotionType || PROMOTION_TYPES[0]);
      setDiscountValue(initialData.discountValue || 0);
      setActive(initialData.active !== undefined ? initialData.active : true);
      setStartDate(initialData.startDate || '');
      setEndDate(initialData.endDate || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      promotionType,
      discountValue: parseFloat(discountValue), // Ensure it's a number
      active,
      startDate: startDate || null, // Send null if empty
      endDate: endDate || null, // Send null if empty
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6"> {/* Add some spacing between form groups */}
        {/* Name Input */}
        <div className="space-y-3">
          <Label
            htmlFor="name"
            className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
          >
            <Tag className="h-4 w-4 mr-2" /> Name:
          </Label>
          <div className="flex">
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              // !!! CORRECTED CLASSNAME !!!
              className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
            />
            <button
              type="button"
              className={`bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
            >
              <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
            </button>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="space-y-3">
          <Label
            htmlFor="description"
            className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
          >
            <FileText className="h-4 w-4 mr-2" /> Description:
          </Label>
          <div className="flex">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              // !!! CORRECTED CLASSNAME !!!
              className={`w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200 resize-y`}
            />
            <button
              type="button"
              className={`bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
            >
              <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
            </button>
          </div>
        </div>

        {/* Promotion Type Select */}
        <div className="space-y-3">
          <Label
            htmlFor="promotionType"
            className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
          >
            <List className="h-4 w-4 mr-2" /> Promotion Type:
          </Label>
          <div className="relative flex">
            <select
              id="promotionType"
              value={promotionType}
              onChange={(e) => setPromotionType(e.target.value)}
              required
              // !!! CORRECTED CLASSNAME !!!
              className={`w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200 appearance-none`}
            >
              {PROMOTION_TYPES.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <svg
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-800"} pointer-events-none`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <button
              type="button"
              className={`bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
            >
              <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
            </button>
          </div>
        </div>

        {/* Discount Value/Percentage Input */}
        <div className="space-y-3">
          <Label
            htmlFor="discountValue"
            className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
          >
            <Percent className="h-4 w-4 mr-2" /> Discount Value/Percentage:
          </Label>
          <div className="flex">
            <Input
              type="number"
              id="discountValue"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              step="0.01"
              required
              // !!! CORRECTED CLASSNAME !!!
              className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
            />
            <button
              type="button"
              className={`bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
            >
              <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
            </button>
          </div>
          <small className={`mt-1 text-xs text-gray-900 dark:text-gray-200 flex items-center`}>
            <Info className="h-3 w-3 mr-1" /> (Enter '10' for 10% if percentage type, or '5.00' for fixed amount)
          </small>
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            // !!! CORRECTED CLASSNAME !!!
            className={`h-4 w-4 ${darkMode ? "bg-gray-700 border-gray-600 checked:bg-amber-400" : "bg-amber-50 border-amber-100 checked:bg-amber-500"} focus:ring-amber-300 rounded transition-colors duration-200`}
          />
          <Label
            htmlFor="active"
            className={`text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} font-medium flex items-center`}
          >
            <ToggleRight className="h-4 w-4 mr-2" /> Active:
          </Label>
        </div>

        {/* Start Date Input */}
        <div className="space-y-3">
          <Label
            htmlFor="startDate"
            className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
          >
            <Calendar className="h-4 w-4 mr-2" /> Start Date:
          </Label>
          <div className="flex">
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              // !!! CORRECTED CLASSNAME !!!
              className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
            />
            <button
              type="button"
              className={`bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
            >
              <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
            </button>
          </div>
          <small className={`mt-1 text-xs text-gray-900 dark:text-gray-200 flex items-center`}>
            <Info className="h-3 w-3 mr-1" /> (Leave empty for new customer promotions that are always on based on 'active' flag)
          </small>
        </div>

        {/* End Date Input */}
        <div className="space-y-3">
          <Label
            htmlFor="endDate"
            className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
          >
            <Calendar className="h-4 w-4 mr-2" /> End Date:
          </Label>
          <div className="flex">
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // !!! CORRECTED CLASSNAME !!!
              className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
            />
            <button
              type="button"
              className={`bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
            >
              <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
            </button>
          </div>
          <small className={`mt-1 text-xs text-gray-900 dark:text-gray-200 flex items-center`}>
            <Info className="h-3 w-3 mr-1" /> (Leave empty for new customer promotions that are always on based on 'active' flag)
          </small>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md font-medium mt-6 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
            bg-gradient-to-r from-[#fbbe24] to-[#fbbe24] hover:from-[#d49a08] hover:to-[#d49a08] text-amber-900
            dark:from-[#6c5ce7] dark:to-[#5b4bc9] dark:hover:from-[#5b4bc9] dark:hover:to-[#4a3ab9] dark:text-white`}
        >
          {initialData.promotionId ? 'Update' : 'Create'} Promotion
        </button>
      </div>
    </form>
  );
}

export default PromotionForm; 