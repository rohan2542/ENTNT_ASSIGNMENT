import React from 'react';
import { Assessment, Question } from '../../types';
import { QuestionField } from './QuestionField';

interface AssessmentFormProps {
  assessment: Assessment;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  isPreview?: boolean;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  assessment,
  responses,
  onResponseChange,
  isPreview = false
}) => {
  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.conditionalLogic?.dependsOn) {
      return true;
    }

    const dependentValue = responses[question.conditionalLogic.dependsOn];
    const expectedValue = question.conditionalLogic.value;

    return dependentValue === expectedValue;
  };

  return (
    <div className="space-y-8">
      {assessment.sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
            {section.title}
          </h2>
          
          <div className="space-y-4">
            {section.questions
              .filter(shouldShowQuestion)
              .map((question) => (
                <QuestionField
                  key={question.id}
                  question={question}
                  value={responses[question.id]}
                  onChange={(value) => onResponseChange(question.id, value)}
                  isPreview={isPreview}
                />
              ))}
          </div>
        </div>
      ))}

      {!isPreview && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Submit Assessment
          </button>
        </div>
      )}
    </div>
  );
};