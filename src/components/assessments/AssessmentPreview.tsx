import React, { useState } from 'react';
import { Assessment } from '../../types';
import { AssessmentForm } from './AssessmentForm';

interface AssessmentPreviewProps {
  assessment: Assessment;
}

export const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
      <AssessmentForm
        assessment={assessment}
        responses={responses}
        onResponseChange={handleResponseChange}
        isPreview={true}
      />
    </div>
  );
};