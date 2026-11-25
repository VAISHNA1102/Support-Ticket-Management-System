
import { Link, useNavigate } from "react-router-dom";
import { Ticket, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Ticket size={22} color="white" />
          </div>
          <span className="text-white text-xl font-bold">
            SupportDesk
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <UserCircle size={20} />
            <span>{user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
