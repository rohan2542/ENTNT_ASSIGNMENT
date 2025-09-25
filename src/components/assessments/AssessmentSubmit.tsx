// src/pages/AssessmentSubmit.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AssessmentResponse } from "../../types";
import { QuestionField } from "./QuestionField";
import { useAssessment } from "../../hooks/useAssessments";
import { db } from "../../lib/database";

export default function AssessmentSubmit() {
  const { id, jobId } = useParams<{ id?: string; jobId?: string }>();
  const param = id ?? jobId;

  // Fetch assessment details
  const { data: assessment, isLoading } = useAssessment(param ?? "");

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!assessment) return;

    try {
      // Construct response payload before saving
      const response: Omit<AssessmentResponse, "id"> = {
        assessmentId: assessment.id ?? crypto.randomUUID(),
        jobId: assessment.jobId || param || "unknown-job",
        candidateId: "demo-candidate", // replace with actual candidate ID in production
        submittedAt: new Date(),
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value,
        })),
      };

      await db.responses.add(response);
      alert("Assessment submitted successfully!");
    } catch (err) {
      console.error("Failed to save response:", err);
      alert("Failed to save response. Check console.");
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (!assessment) return <p className="p-6">Assessment not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{assessment.title}</h1>

      {/* Collapsible sections per assessment */}
      {assessment.sections.map((section) => {
        const isOpen = expandedSection === section.id;
        return (
          <div key={section.id} className="mb-4 border rounded-md">
            <button
              className="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-800 flex justify-between items-center"
              onClick={() => setExpandedSection(isOpen ? null : section.id)}
            >
              <span className="font-semibold">{section.title}</span>
              <span>{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="p-4">
                {section.questions.map((q) => (
                  <div key={q.id} className="mb-4">
                    <QuestionField
                      question={q}
                      value={answers[q.id]}
                      onChange={(val) =>
                        setAnswers({ ...answers, [q.id]: val })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
