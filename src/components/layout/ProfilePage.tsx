import React, { useState, useEffect } from "react";
import { ShieldCheck, User, Lock } from "lucide-react";

const ProfilePage: React.FC = () => {
  const [fullName, setFullName] = useState("HR Manager");
  const [email, setEmail] = useState("hr@company.com");
  const [role, setRole] = useState("Human Resources");
  const [twoFA, setTwoFA] = useState(false);
  const [password, setPassword] = useState("");

  // 🔹 Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("profileName");
    const savedEmail = localStorage.getItem("profileEmail");
    const savedRole = localStorage.getItem("profileRole");
    const savedTwoFA = localStorage.getItem("profileTwoFA");

    if (savedName) setFullName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedRole) setRole(savedRole);
    if (savedTwoFA) setTwoFA(savedTwoFA === "true");
  }, []);

  // 🔹 Save profile changes
  const handleSave = () => {
    localStorage.setItem("profileName", fullName);
    localStorage.setItem("profileEmail", email);
    localStorage.setItem("profileRole", role);
    localStorage.setItem("profileTwoFA", String(twoFA));

    // ✅ Notify other components (like Header) immediately
    window.dispatchEvent(new Event("profileUpdated"));

    alert("✅ Profile updated successfully!");
  };

  const handlePasswordUpdate = () => {
    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters");
    } else {
      alert("✅ Password updated!");
      setPassword("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-500 mb-6">
        View and update your personal information.
      </p>

      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" /> Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded-md p-2"
            placeholder="Full Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md p-2"
            placeholder="Email"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-md p-2 col-span-2"
            placeholder="Role"
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600" /> Security
        </h2>
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-600">Two-Factor Authentication</span>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`px-4 py-2 rounded-md ${
              twoFA ? "bg-red-500" : "bg-purple-600"
            } text-white`}
          >
            {twoFA ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" /> Change Password
        </h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-md p-2"
          />
          <button
            onClick={handlePasswordUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
