import React from 'react';
import { Question } from '../../types';
import { Trash2, Plus, X } from 'lucide-react';

interface QuestionEditorProps {
  question: Question;
  allQuestions: Question[];
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

const QUESTION_TYPES = [
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multi-choice', label: 'Multi Choice' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'file', label: 'File Upload' }
];

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  allQuestions,
  onUpdate,
  onDelete
}) => {
  const [newOption, setNewOption] = React.useState('');

  const addOption = () => {
    if (newOption.trim()) {
      onUpdate({
        options: [...(question.options || []), newOption.trim()]
      });
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    const options = [...(question.options || [])];
    options.splice(index, 1);
    onUpdate({ options });
  };

  const handleConditionalChange = (field: string, value: any) => {
    onUpdate({
      conditionalLogic: {
        ...question.conditionalLogic,
        [field]: value
      } as any
    });
  };

  const hasOptions = question.type === 'single-choice' || question.type === 'multi-choice';
  const hasValidation = question.type === 'numeric' || question.type === 'long-text' || question.type === 'short-text';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Question</h3>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Title
          </label>
          <input
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Type
          </label>
          <select
            value={question.type}
            onChange={(e) => onUpdate({ type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {QUESTION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Required field
          </label>
        </div>
      </div>

      {/* Options for choice questions */}
      {hasOptions && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  value={option}
                  onChange={(e) => {
                    const options = [...(question.options || [])];
                    options[index] = e.target.value;
                    onUpdate({ options });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="flex items-center space-x-2">
              <input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addOption()}
                placeholder="Add new option..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addOption}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation for numeric/text questions */}
      {hasValidation && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Validation
          </label>
          <div className="grid grid-cols-2 gap-4">
            {question.type === 'numeric' && (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Value</label>
                  <input
                    type="number"
                    value={question.validation?.min || ''}
                    onChange={(e) => onUpdate({
                      validation: {
                        ...question.validation,
                        min: e.target.value ? Number(e.target.value) : undefined
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Value</label>
                  <input
                    type="number"
                    value={question.validation?.max || ''}
                    onChange={(e) => onUpdate({
                      validation: {
                        ...question.validation,
                        max: e.target.value ? Number(e.target.value) : undefined
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
            
            {(question.type === 'long-text' || question.type === 'short-text') && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Length</label>
                <input
                  type="number"
                  value={question.validation?.maxLength || ''}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...question.validation,
                      maxLength: e.target.value ? Number(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conditional Logic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conditional Logic
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Show this question only if:</label>
            <select
              value={question.conditionalLogic?.dependsOn || ''}
              onChange={(e) => handleConditionalChange('dependsOn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No condition (always show)</option>
              {allQuestions.filter(q => q.id !== question.id).map(q => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>
          
          {question.conditionalLogic?.dependsOn && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Condition</label>
                <select
                  value={question.conditionalLogic?.condition || 'equals'}
                  onChange={(e) => handleConditionalChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="equals">Equals</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Value</label>
                <input
                  value={question.conditionalLogic?.value || ''}
                  onChange={(e) => handleConditionalChange('value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};