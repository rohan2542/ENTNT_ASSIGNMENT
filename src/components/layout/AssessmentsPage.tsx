// src/components/layout/AssessmentsPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../lib/database";
import { Assessment } from "../../types";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const data = await db.assessments.toArray();
      if (!mounted) return;

      // Deduplicate using jobId if available, otherwise id
      const fixed = data.map((a) => ({ ...a }));
      const map = new Map<string, Assessment>();
      for (const a of fixed) {
        const key = a.jobId ?? a.id;
        if (key) map.set(key, a);
      }
      setAssessments(Array.from(map.values()));
    };

    load();

    const handler = async () => {
      const data = await db.assessments.toArray();
      const fixed = data.map((a) => ({ ...a, id: a.id ?? crypto.randomUUID() }));
      const map = new Map<string, Assessment>();
      for (const a of fixed) {
        const key = a.jobId ?? a.id;
        if (key) map.set(key, a);
      }
      setAssessments(Array.from(map.values()));
    };

    window.addEventListener("assessments:updated", handler);

    return () => {
      mounted = false;
      window.removeEventListener("assessments:updated", handler);
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <Link
          to="/assessments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <p className="text-gray-500">No assessments yet. Click "New Assessment".</p>
      ) : (
        <div className="space-y-4">
          {assessments.map((a) => (
            <div
              key={a.jobId ?? a.id}
              className="p-4 bg-white shadow rounded-md flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{a.title || "Untitled Assessment"}</h2>
                <p className="text-sm text-gray-500">
                  {a.sections?.length ?? 0} sections
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/assessments/${a.id}/edit`}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Edit
                </Link>
                <Link
                  to={`/assessments/${a.id}/submit`}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Candidate View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
