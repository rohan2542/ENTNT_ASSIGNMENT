// src/components/assessments/AssessmentForm.tsx
import React, { useState } from "react";
import { Assessment, Question } from "../../types";
import { QuestionField } from "./QuestionField";

interface AssessmentFormProps {
  assessment: Assessment;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  isPreview?: boolean;
  onSubmit?: (responses: Record<string, any>) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  assessment,
  responses,
  onResponseChange,
  isPreview = false,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handles conditional visibility based on other responses
  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.conditionalLogic?.length) return true;

    return question.conditionalLogic.every((logic) => {
      const dependentValue = responses[logic.dependsOn];
      switch (logic.condition) {
        case "equals":
          return dependentValue === logic.value;
        case "not-equals":
          return dependentValue !== logic.value;
        case "greater":
          return Number(dependentValue) > Number(logic.value);
        case "less":
          return Number(dependentValue) < Number(logic.value);
        default:
          return true;
      }
    });
  };

  // Validates a single question based on type, required flag, and constraints
  const validateQuestion = (q: Question, value: any): string | null => {
    if (!shouldShowQuestion(q)) return null;

    if (q.required && (value === null || value === undefined || value === "")) {
      return "This field is required.";
    }

    if (q.type === "numeric" && value !== null && value !== undefined && value !== "") {
      if (q.validation?.min !== undefined && value < q.validation.min) {
        return `Must be at least ${q.validation.min}`;
      }
      if (q.validation?.max !== undefined && value > q.validation.max) {
        return `Must be at most ${q.validation.max}`;
      }
    }

    if ((q.type === "short-text" || q.type === "long-text") && q.validation?.maxLength) {
      if ((value?.length || 0) > q.validation.maxLength) {
        return `Must be at most ${q.validation.maxLength} characters.`;
      }
    }

    return null;
  };

  // Runs validation before submit, skips checks in preview mode
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview) return;

    const newErrors: Record<string, string> = {};
    (assessment.sections ?? []).forEach((section) => {
      section.questions.forEach((q) => {
        const err = validateQuestion(q, responses[q.id]);
        if (err) newErrors[q.id] = err;
      });
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && onSubmit) {
      onSubmit(responses);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {(assessment.sections ?? []).map((section) => (
        <div key={section.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.questions
              .filter(shouldShowQuestion)
              .map((q) => (
                <div key={q.id}>
                  <QuestionField
                    question={q}
                    value={responses[q.id]}
                    onChange={(val) => onResponseChange(q.id, val)}
                    isPreview={isPreview}
                  />
                  {errors[q.id] && (
                    <p className="text-sm text-red-500 mt-1">{errors[q.id]}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {!isPreview && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      )}
    </form>
  );
};
