// src/components/assessments/QuestionEditor.tsx
import React from "react";
import { Question } from "../../types";
import { Trash2, Plus, X } from "lucide-react";

interface Props {
  question: Question;
  allQuestions?: Question[]; // optional for conditional targets
  isActive?: boolean;
  onActivate?: () => void;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

const QUESTION_TYPES = [
  { value: "short-text", label: "Short Text" },
  { value: "long-text", label: "Long Text" },
  { value: "single-choice", label: "Single Choice" },
  { value: "multi-choice", label: "Multi Choice" },
  { value: "numeric", label: "Numeric" },
  { value: "file", label: "File Upload" },
];

const CONDITION_OPTIONS = [
  { value: "equals", label: "Equals" },
  { value: "not-equals", label: "Not equals" },
  { value: "greater", label: "Greater than" },
  { value: "less", label: "Less than" },
];

export const QuestionEditor: React.FC<Props> = ({
  question,
  allQuestions = [],
  isActive = false,
  onActivate,
  onUpdate,
  onDelete,
}) => {
  /** ---------- OPTIONS ---------- **/
  const addOption = () => {
    onUpdate({ options: [...(question.options || []), "New option"] });
  };

  const updateOption = (index: number, value: string) => {
    const opts = [...(question.options || [])];
    opts[index] = value;
    onUpdate({ options: opts });
  };

  const removeOption = (index: number) => {
    const opts = [...(question.options || [])];
    opts.splice(index, 1);
    onUpdate({ options: opts });
  };

  /** ---------- CONDITIONAL LOGIC ---------- **/
  const addCondition = () => {
    const existing = question.conditionalLogic ?? [];
    onUpdate({
      conditionalLogic: [
        ...existing,
        { dependsOn: "", condition: "equals", value: "" },
      ],
    });
  };

  const updateCondition = (idx: number, partial: Partial<any>) => {
    const arr = [...(question.conditionalLogic || [])];
    arr[idx] = { ...arr[idx], ...partial };
    onUpdate({ conditionalLogic: arr });
  };

  const removeCondition = (idx: number) => {
    const arr = [...(question.conditionalLogic || [])];
    arr.splice(idx, 1);
    onUpdate({ conditionalLogic: arr });
  };

  /** ---------- FLAGS ---------- **/
  const hasOptions =
    question.type === "single-choice" || question.type === "multi-choice";
  const hasValidation =
    question.type === "numeric" ||
    question.type === "long-text" ||
    question.type === "short-text";

  return (
    <div
      onClick={onActivate}
      className={`p-4 rounded-md border transition-colors cursor-pointer ${
        isActive
          ? "border-blue-400 bg-white dark:bg-gray-900"
          : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Edit Question
        </h3>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Settings */}
      <div className="space-y-4 mt-4">
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
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
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
          <label
            htmlFor="required"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            Required field
          </label>
        </div>
      </div>

      {/* Options */}
      {hasOptions && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {question.options?.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeOption(i)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4 inline mr-1" /> Add Option
            </button>
          </div>
        </div>
      )}

      {/* Validation */}
      {hasValidation && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Validation
          </label>
          <div className="grid grid-cols-2 gap-4">
            {question.type === "numeric" && (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Min Value
                  </label>
                  <input
                    type="number"
                    value={question.validation?.min ?? ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...question.validation,
                          min: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Max Value
                  </label>
                  <input
                    type="number"
                    value={question.validation?.max ?? ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...question.validation,
                          max: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
            {(question.type === "long-text" ||
              question.type === "short-text") && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Max Length
                </label>
                <input
                  type="number"
                  value={question.validation?.maxLength ?? ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: {
                        ...question.validation,
                        maxLength: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conditional Logic */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conditional Logic
        </label>
        <div className="space-y-3">
          {(question.conditionalLogic || []).map((cond, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-3 items-end">
              {/* Depends On */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Depends On
                </label>
                <select
                  value={cond.dependsOn}
                  onChange={(e) =>
                    updateCondition(idx, { dependsOn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select question --</option>
                  {allQuestions
                    .filter((q) => q.id !== question.id)
                    .map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title}
                      </option>
                    ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Condition
                </label>
                <select
                  value={cond.condition}
                  onChange={(e) =>
                    updateCondition(idx, { condition: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CONDITION_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Value</label>
                <div className="flex items-center space-x-2">
                  <input
                    value={cond.value ?? ""}
                    onChange={(e) =>
                      updateCondition(idx, { value: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeCondition(idx)}
                    className="p-2 text-red-400 hover:text-red-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCondition}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 transition"
          >
            <Plus className="w-3 h-3 inline mr-1" /> Add Condition
          </button>
        </div>
      </div>
    </div>
  );
};
