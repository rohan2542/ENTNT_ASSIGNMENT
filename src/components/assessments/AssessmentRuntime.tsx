import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment, useSubmitAssessment } from '../../hooks/useAssessments';
import { AssessmentForm } from './AssessmentForm';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const AssessmentRuntime: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: assessment, isLoading } = useAssessment(jobId!);
  const submitMutation = useSubmitAssessment();
  
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assessment) return;

    // Validate required fields
    const allQuestions = assessment.sections.flatMap(section => section.questions);
    const missingRequired = allQuestions.filter(q => 
      q.required && (!responses[q.id] || responses[q.id] === '')
    );

    if (missingRequired.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        jobId: jobId!,
        answers: Object.entries(responses).map(([questionId, value]) => ({
          questionId,
          value
        }))
      });
      
      navigate('/assessments/thank-you');
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Assessment not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assessment</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please complete all sections of this assessment. Required fields are marked with *.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <AssessmentForm
            assessment={assessment}
            responses={responses}
            onResponseChange={handleResponseChange}
          />
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};