// src/pages/Assessments.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Assessment } from "../types";
import { db } from "../db";

export default function Assessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    // Load all assessments from IndexedDB
    db.assessments.toArray().then(setAssessments);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <Link
          to="/assessments/builder"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <p className="text-gray-500">
          No assessments yet. Click "New Assessment".
        </p>
      ) : (
        <div className="space-y-4">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="p-4 bg-white shadow rounded-md flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{a.title}</h2>
                <p className="text-sm text-gray-500">
                  {a.sections.length} sections
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
