import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment, useSaveAssessment } from '../../hooks/useAssessments';
import { Assessment, AssessmentSection, Question } from '../../types';
import { AssessmentPreview } from './AssessmentPreview';
import { SectionEditor } from './SectionEditor';
import { QuestionEditor } from './QuestionEditor';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Plus, Save } from 'lucide-react';

export const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: assessment, isLoading } = useAssessment(jobId!);
  const saveMutation = useSaveAssessment();
  
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  React.useEffect(() => {
    if (assessment) {
      setCurrentAssessment(assessment);
    } else if (jobId) {
      setCurrentAssessment({
        jobId,
        sections: [],
        updatedAt: new Date()
      });
    }
  }, [assessment, jobId]);

  const handleSave = () => {
    if (currentAssessment) {
      saveMutation.mutate(currentAssessment);
    }
  };

  const addSection = () => {
    if (!currentAssessment) return;
    
    const newSection: AssessmentSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      questions: []
    };
    
    setCurrentAssessment({
      ...currentAssessment,
      sections: [...currentAssessment.sections, newSection]
    });
    
    setActiveSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    if (!currentAssessment) return;
    
    setCurrentAssessment({
      ...currentAssessment,
      sections: currentAssessment.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!currentAssessment) return;
    
    setCurrentAssessment({
      ...currentAssessment,
      sections: currentAssessment.sections.filter(section => section.id !== sectionId)
    });
    
    if (activeSection === sectionId) {
      setActiveSection(null);
    }
  };

  const addQuestion = (sectionId: string) => {
    if (!currentAssessment) return;
    
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: 'short-text',
      title: 'New Question',
      required: false
    };
    
    setCurrentAssessment({
      ...currentAssessment,
      sections: currentAssessment.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    });
    
    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    if (!currentAssessment) return;
    
    setCurrentAssessment({
      ...currentAssessment,
      sections: currentAssessment.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId ? { ...question, ...updates } : question
              )
            }
          : section
      )
    });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    if (!currentAssessment) return;
    
    setCurrentAssessment({
      ...currentAssessment,
      sections: currentAssessment.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter(question => question.id !== questionId)
            }
          : section
      )
    });
    
    if (activeQuestion === questionId) {
      setActiveQuestion(null);
    }
  };

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
        <div className="text-gray-500 text-lg">Failed to load assessment</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assessment Builder</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and edit assessment forms for this job
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          <span>{saveMutation.isPending ? 'Saving...' : 'Save Assessment'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder */}
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
              {currentAssessment.sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onActivate={() => setActiveSection(section.id)}
                  onUpdate={(updates) => updateSection(section.id, updates)}
                  onDelete={() => deleteSection(section.id)}
                  onAddQuestion={() => addQuestion(section.id)}
                />
              ))}
            </div>
          </div>

          {/* Question Editor */}
          {activeQuestion && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Editor</h2>
              {(() => {
                for (const section of currentAssessment.sections) {
                  const question = section.questions.find(q => q.id === activeQuestion);
                  if (question) {
                    return (
                      <QuestionEditor
                        question={question}
                        allQuestions={currentAssessment.sections.flatMap(s => s.questions)}
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

        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h2>
          <AssessmentPreview assessment={currentAssessment} />
        </div>
      </div>
    </div>
  );
};