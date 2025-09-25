// src/components/questions/QuestionField.tsx
import React from 'react';
import { Question } from '../../types';
import { Upload } from 'lucide-react';
import Editor from "@monaco-editor/react";

interface QuestionFieldProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  isPreview?: boolean;
}

export const QuestionField: React.FC<QuestionFieldProps> = ({
  question,
  value,
  onChange,
  isPreview = false
}) => {
  const renderField = () => {
    switch (question.type) {
      case 'short-text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={question.validation?.maxLength}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            disabled={isPreview}
          />
        );

      case 'long-text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={question.validation?.maxLength}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
            disabled={isPreview}
          />
        );

      case 'numeric':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            min={question.validation?.min}
            max={question.validation?.max}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            disabled={isPreview}
          />
        );

      case 'single-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  disabled={isPreview}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multi-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter(v => v !== option));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  disabled={isPreview}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isPreview ? 'File upload field (preview mode)' : 'Upload a file'}
              </p>

              {!isPreview && (
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // only keep metadata, not the full File object
                      onChange({ name: file.name, size: file.size, type: file.type });
                    } else {
                      onChange(null);
                    }
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
                />
              )}
            </div>

            {value && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {value.name}
              </p>
            )}
          </div>
        );

      case 'coding':
        return (
          <div className="border rounded-md overflow-hidden">
            <Editor
              height="300px"
              defaultLanguage={question.language || "javascript"}
              value={value || question.starterCode || ""}
              onChange={(val) => onChange(val || "")}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        );

      case 'sql':
        return (
          <div className="border rounded-md overflow-hidden">
            <Editor
              height="200px"
              defaultLanguage="sql"
              value={value || ""}
              onChange={(val) => onChange(val || "")}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    if (question.validation?.min && question.validation?.max) {
      return `Value must be between ${question.validation.min} and ${question.validation.max}`;
    }
    if (question.validation?.maxLength) {
      return `Maximum ${question.validation.maxLength} characters`;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        {question.title}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}
      
      {getValidationMessage() && (
        <p className="text-xs text-gray-500">{getValidationMessage()}</p>
      )}
    </div>
  );
};
