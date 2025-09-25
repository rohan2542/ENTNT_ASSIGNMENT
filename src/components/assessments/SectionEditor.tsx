// src/components/sections/SectionEditor.tsx
import React from 'react';
import { AssessmentSection, Question } from '../../types';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { QuestionEditor } from './QuestionEditor';

interface SectionEditorProps {
  section: AssessmentSection;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (updates: Partial<AssessmentSection>) => void;
  onDelete: () => void;
  allQuestions: Question[]; // gives context for nested question editors
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  isActive,
  onActivate,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(section.title);
  const [activeQuestion, setActiveQuestion] = React.useState<string | null>(null);

  const handleSaveTitle = () => {
    onUpdate({ title });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveTitle();
    if (e.key === 'Escape') {
      setTitle(section.title);
      setIsEditing(false);
    }
  };

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: crypto.randomUUID(),
      type: 'short-text',
      title: 'Untitled question',
      required: false,
    };
    onUpdate({ questions: [...section.questions, newQ] });
    setActiveQuestion(newQ.id);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    const updatedQs = section.questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    onUpdate({ questions: updatedQs });
  };

  const handleDeleteQuestion = (id: string) => {
    onUpdate({ questions: section.questions.filter((q) => q.id !== id) });
    if (activeQuestion === id) setActiveQuestion(null);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
      {/* Section header */}
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

          {/* Inline section controls */}
          <div
            className="flex items-center space-x-2"
            onClick={(e) => e.stopPropagation()} // prevent toggle when clicking buttons
          >
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

      {/* Expandable content */}
      {isActive && (
        <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Questions</h4>
            <button
              onClick={handleAddQuestion}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {section.questions.map((question) => (
              <QuestionEditor
                key={question.id}
                question={question}
                allQuestions={section.questions} // provides context for dependencies/validations
                isActive={activeQuestion === question.id}
                onActivate={() => setActiveQuestion(question.id)}
                onUpdate={(updates) => handleUpdateQuestion(question.id, updates)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
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
