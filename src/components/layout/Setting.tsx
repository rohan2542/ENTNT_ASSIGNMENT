import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  ClipboardList,
} from "lucide-react";

interface DashboardStats {
  jobs: { total: number; active: number; newThisWeek: number };
  candidates: { total: number; hired: number };
  assessments: { total: number; completed: number };
  interviews: { total: number; offers: number };
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<string[]>([]);

  // 🔹 Mock API (replace later with real API)
  useEffect(() => {
    async function fetchData() {
      try {
        const data: DashboardStats = {
          jobs: { total: 25, active: 20, newThisWeek: 3 },
          candidates: { total: 1000, hired: 183 },
          assessments: { total: 3, completed: 0 },
          interviews: { total: 171, offers: 173 },
        };
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchData();

    const savedActivity =
      JSON.parse(localStorage.getItem("dashboardActivity") || "[]") || [];
    setActivity(savedActivity);
  }, []);

  const addActivity = (msg: string) => {
    const updated = [
      `${new Date().toLocaleDateString()} - ${msg}`,
      ...activity,
    ].slice(0, 5);
    setActivity(updated);
    localStorage.setItem("dashboardActivity", JSON.stringify(updated));
  };

  if (!stats) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Jobs */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <span className="font-semibold">Total Jobs</span>
            </div>
          </div>
          <div className="bg-white p-6">
            <h2 className="text-2xl font-bold">{stats.jobs.total}</h2>
            <p className="text-sm text-gray-600">
              {stats.jobs.active} active · {stats.jobs.newThisWeek} this week
            </p>
          </div>
        </div>

        {/* Candidates */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Total Candidates</span>
            </div>
          </div>
          <div className="bg-white p-6">
            <h2 className="text-2xl font-bold">{stats.candidates.total}</h2>
            <p className="text-sm text-gray-600">
              {stats.candidates.hired} hired
            </p>
          </div>
        </div>

        {/* Assessments */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Assessments</span>
            </div>
          </div>
          <div className="bg-white p-6">
            <h2 className="text-2xl font-bold">{stats.assessments.total}</h2>
            <p className="text-sm text-gray-600">
              {stats.assessments.completed} completed
            </p>
          </div>
        </div>

        {/* Interviews */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">Interviews</span>
            </div>
          </div>
          <div className="bg-white p-6">
            <h2 className="text-2xl font-bold">{stats.interviews.total}</h2>
            <p className="text-sm text-gray-600">
              {stats.interviews.offers} pending offers
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Candidates</h3>
          <p className="text-sm text-gray-600 mb-3">
            Manage your candidate pipeline
          </p>
          <button
            onClick={() => {
              addActivity("👥 Opened Candidates");
              navigate("/candidates");
            }}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Go to Candidates
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Jobs</h3>
          <p className="text-sm text-gray-600 mb-3">
            Create and manage job postings
          </p>
          <button
            onClick={() => {
              addActivity("📄 Opened Jobs");
              navigate("/jobs");
            }}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Jobs
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Assessments</h3>
          <p className="text-sm text-gray-600 mb-3">
            Create candidate assessments
          </p>
          <button
            onClick={() => {
              addActivity("📝 Opened Assessments");
              navigate("/assessments");
            }}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Go to Assessments
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="bg-white rounded-xl shadow-md p-6 border">
        {activity.length === 0 ? (
          <p className="text-gray-600">No recent activity</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {activity.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 border-b last:border-0 pb-2"
              >
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {item.split(" - ")[0]}
                </span>
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-blue-500" />
                  {item.split(" - ")[1]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
