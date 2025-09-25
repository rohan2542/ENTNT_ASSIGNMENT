// src/components/jobs/JobTagSelector.tsx
import React, { useState } from "react";

const AVAILABLE_TAGS = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Data Science",
  "DevOps",
  "JavaScript",
  "Python",
  "Java",
  "Senior",
  "Junior",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract"
];

interface JobTagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export const JobTagSelector: React.FC<JobTagSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="relative inline-block w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-left"
      >
        {value.length > 0 ? value.join(", ") : "Select tags"}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {AVAILABLE_TAGS.map((tag) => (
            <label
              key={tag}
              className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="mr-2"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
