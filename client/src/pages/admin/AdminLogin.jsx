import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("admin-token", "true");
      toast.success("Admin Sign In successful");
      navigate("/admin");
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Admin Sign In
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-700 transition"
              placeholder="Enter admin username"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-700 transition"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-primary hover:bg-primary-dull text-black py-3 rounded-lg font-bold text-lg transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
