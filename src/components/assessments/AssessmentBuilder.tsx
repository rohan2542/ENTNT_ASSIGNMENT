// src/components/assessments/AssessmentBuilder.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAssessment, useSaveAssessment } from '../../hooks/useAssessments';
import { Assessment, AssessmentSection, Question } from '../../types';
import { AssessmentPreview } from './AssessmentPreview';
import { SectionEditor } from './SectionEditor';
import { QuestionEditor } from './QuestionEditor';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Plus, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const AssessmentBuilder: React.FC = () => {
  const { id, jobId } = useParams<{ id?: string; jobId?: string }>();
  const location = useLocation();
  const isNewRoute = location.pathname.endsWith('/new');

  // Use job/assessment id from URL unless creating a new assessment
  const param = isNewRoute ? '' : id ?? jobId ?? '';
  const { data: fetchedAssessment, isLoading } = useAssessment(param);

  const saveMutation = useSaveAssessment();

  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  // Initialize builder state from server data or create default for "new" mode
  useEffect(() => {
    if (isLoading) return;

    if (fetchedAssessment) {
      setCurrentAssessment({
        ...fetchedAssessment,
        sections: fetchedAssessment.sections ?? [],
      });
      if (fetchedAssessment.sections?.length) {
        setActiveSection(fetchedAssessment.sections[0].id);
      }
      return;
    }

    if (isNewRoute && !currentAssessment) {
      const defaultSection: AssessmentSection = {
        id: crypto.randomUUID(),
        title: 'Default Section',
        questions: [],
      };

      setCurrentAssessment({
        id: crypto.randomUUID(),
        jobId: crypto.randomUUID(),
        title: '', // user can type later
        status: 'draft',
        sections: [defaultSection],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setActiveSection(defaultSection.id);
    }
  }, [fetchedAssessment, isNewRoute, isLoading]);

  // Save assessment with fallback auto-title if missing
  const saveAssessment = async (): Promise<Assessment | null> => {
    if (!currentAssessment) return null;

    const now = new Date();
    const title =
      currentAssessment.title?.trim() ||
      `Assessment - ${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

    return new Promise((resolve, reject) => {
      saveMutation.mutate(
        { ...currentAssessment, title, updatedAt: now },
        {
          onSuccess: (saved) => {
            setCurrentAssessment(saved);
            // Update URL with real id after first save
            if (isNewRoute && saved.id) {
              window.history.replaceState(null, '', `/assessments/${saved.id}/edit`);
            }
            resolve(saved);
          },
          onError: (err) => {
            toast.error('Failed to save assessment');
            reject(err);
          },
        }
      );
    });
  };

  // Manual save button handler (auto-generates title only for new assessments)
  const handleSave = () => {
    if (!currentAssessment) return;

    const now = new Date();
    let title = currentAssessment.title?.trim();

    if (!title && isNewRoute) {
      title = `Assessment - ${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }

    saveMutation.mutate(
      { ...currentAssessment, title: title || currentAssessment.title, updatedAt: now },
      {
        onSuccess: () => toast.success('Assessment saved!'),
        onError: () => toast.error('Failed to save assessment'),
      }
    );
  };

  // Section management
  const addSection = () => {
    if (!currentAssessment) return;

    const newSection: AssessmentSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      questions: [],
    };

    setCurrentAssessment({
      ...currentAssessment,
      sections: [...(currentAssessment.sections ?? []), newSection],
      updatedAt: new Date(),
    });

    setActiveSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    if (!currentAssessment) return;

    setCurrentAssessment({
      ...currentAssessment,
      sections: (currentAssessment.sections ?? []).map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
      updatedAt: new Date(),
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!currentAssessment) return;

    setCurrentAssessment({
      ...currentAssessment,
      sections: (currentAssessment.sections ?? []).filter((s) => s.id !== sectionId),
      updatedAt: new Date(),
    });

    if (activeSection === sectionId) setActiveSection(null);
  };

  // Question management
  const addQuestion = (sectionId: string) => {
    if (!currentAssessment) return;

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: 'short-text',
      title: 'New Question',
      required: false,
      options: [],
      validation: {},
      conditionalLogic: [],
    };

    setCurrentAssessment({
      ...currentAssessment,
      sections: (currentAssessment.sections ?? []).map((section) =>
        section.id === sectionId
          ? { ...section, questions: [...(section.questions ?? []), newQuestion] }
          : section
      ),
      updatedAt: new Date(),
    });

    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    if (!currentAssessment) return;

    setCurrentAssessment({
      ...currentAssessment,
      sections: (currentAssessment.sections ?? []).map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: (section.questions ?? []).map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : section
      ),
      updatedAt: new Date(),
    });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    if (!currentAssessment) return;

    setCurrentAssessment({
      ...currentAssessment,
      sections: (currentAssessment.sections ?? []).map((section) =>
        section.id === sectionId
          ? { ...section, questions: (section.questions ?? []).filter((q) => q.id !== questionId) }
          : section
      ),
      updatedAt: new Date(),
    });

    if (activeQuestion === questionId) setActiveQuestion(null);
  };

  // Loading and empty states
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No assessment loaded</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top header with title + save */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assessment Builder
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and edit assessment forms for this job
          </p>

          {/* Title input */}
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Assessment Title
            </label>
            <input
              id="title"
              type="text"
              value={currentAssessment?.title || ''}
              onChange={(e) =>
                setCurrentAssessment((prev) =>
                  prev ? { ...prev, title: e.target.value } : prev
                )
              }
              placeholder="Enter assessment name..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saveMutation.isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          <span>{saveMutation.isLoading ? 'Saving...' : 'Save Assessment'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: builder with sections + question editor */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sections</h2>
              <button
                onClick={addSection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center space-x-1 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {(currentAssessment.sections ?? []).map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onActivate={() => setActiveSection(section.id)}
                  onUpdate={(updates) => updateSection(section.id, updates)}
                  onDelete={() => deleteSection(section.id)}
                  onAddQuestion={() => addQuestion(section.id)}
                  onSelectQuestion={(id: string) => setActiveQuestion(id)}
                />
              ))}
            </div>
          </div>

          {activeQuestion && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Question Editor
              </h2>
              {(() => {
                for (const section of currentAssessment.sections ?? []) {
                  const question = (section.questions ?? []).find((q) => q.id === activeQuestion);
                  if (question) {
                    return (
                      <QuestionEditor
                        question={question}
                        allQuestions={currentAssessment.sections.flatMap((s) => s.questions ?? [])}
                        onUpdate={(updates) => updateQuestion(section.id, question.id, updates)}
                        onDelete={() => deleteQuestion(section.id, question.id)}
                      />
                    );
                  }
                }
                return null;
              })()}
            </div>
          )}
        </div>

        {/* Right: live preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Live Preview
          </h2>
          <AssessmentPreview assessment={currentAssessment} />
        </div>
      </div>
    </div>
  );
};
