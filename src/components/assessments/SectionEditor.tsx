import React from 'react';
import { AssessmentSection } from '../../types';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';

interface SectionEditorProps {
  section: AssessmentSection;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (updates: Partial<AssessmentSection>) => void;
  onDelete: () => void;
  onAddQuestion: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  isActive,
  onActivate,
  onUpdate,
  onDelete,
  onAddQuestion
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(section.title);

  const handleSaveTitle = () => {
    onUpdate({ title });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitle(section.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={onActivate}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isActive ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            
            {isEditing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyPress}
                className="text-lg font-medium bg-transparent border-b border-blue-500 outline-none"
                autoFocus
              />
            ) : (
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {section.title}
              </h3>
            )}
            
            <span className="text-sm text-gray-500">
              ({section.questions.length} questions)
            </span>
          </div>
          
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {isActive && (
        <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Questions</h4>
            <button
              onClick={onAddQuestion}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {section.questions.map((question, index) => (
              <div
                key={question.id}
                onClick={() => {
                  // This would trigger question selection in the parent component
                  // For now, we'll just log it
                  console.log('Question selected:', question.id);
                }}
                className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {question.title}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {question.type}
                      </span>
                      {question.required && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {section.questions.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No questions yet. Click "Add Question" to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};