import React from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const AdminNavbar = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged Out");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
      <Link to="/admin">
        <img src={assets.logo} alt="logo" className="w-36 h-auto" />
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-1.5 sm:px-6 sm:py-2 bg-gray-800 hover:bg-gray-700 text-white transition rounded-full font-medium cursor-pointer border border-gray-600 text-sm flex items-center justify-center"
      >
        <LogOut width={15} height={15} className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
