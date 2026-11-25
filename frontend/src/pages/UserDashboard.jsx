
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tickets from the backend
  const fetchTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/tickets/my-tickets");
      setTickets(response.data.tickets || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets when the dashboard first loads
  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      OPEN: "bg-blue-500/10 text-blue-400",
      IN_PROGRESS: "bg-yellow-500/10 text-yellow-400",
      RESOLVED: "bg-green-500/10 text-green-400",
      CLOSED: "bg-slate-500/10 text-slate-400",
    };

    return styles[status] || "bg-slate-500/10 text-slate-400";
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      LOW: "text-green-400",
      MEDIUM: "text-yellow-400",
      HIGH: "text-red-400",
    };

    return styles[priority] || "text-slate-400";
  };

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              My Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Manage and track all your support requests.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={fetchTickets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg"
            >
              <RefreshCw size={18} />
              {loading ? "Refreshing..." : "Refresh Tickets"}
            </button>

            <Link
              to="/user/create-ticket"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              <Plus size={20} />
              Create Ticket
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Tickets"
            count={tickets.length}
            icon={<Ticket size={22} />}
            color="text-blue-400"
          />

          <StatCard
            title="Open"
            count={openTickets}
            icon={<AlertCircle size={22} />}
            color="text-blue-400"
          />

          <StatCard
            title="In Progress"
            count={inProgressTickets}
            icon={<Clock size={22} />}
            color="text-yellow-400"
          />

          <StatCard
            title="Resolved"
            count={resolvedTickets}
            icon={<CheckCircle size={22} />}
            color="text-green-400"
          />
        </div>

        {/* Ticket List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold text-white">
              My Support Tickets
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              View the latest updates on your requests.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading tickets...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-red-400">
              {error}
              <button
                onClick={fetchTickets}
                className="block mx-auto mt-3 text-blue-400 hover:text-blue-300"
              >
                Try Again
              </button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <Ticket size={40} className="mx-auto text-slate-600 mb-4" />

              <h3 className="text-white text-lg font-semibold">
                No tickets yet
              </h3>

              <p className="text-slate-400 mt-2">
                Create your first support ticket to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-sm">
                  <tr>
                    <th className="p-4">Ticket</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="border-t border-slate-800 hover:bg-slate-800/30"
                    >
                      <td className="p-4">
                        <p className="text-white font-medium">
                          {ticket.title}
                        </p>

                        <p className="text-slate-500 text-xs mt-1">
                          #{ticket._id.slice(-6)}
                        </p>
                      </td>

                      <td className="p-4 text-slate-300">
                        {ticket.category}
                      </td>

                      <td className={`p-4 font-medium ${getPriorityStyle(ticket.priority)}`}>
                        {ticket.priority}
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(ticket.status)}`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <Link
                          to={`/tickets/${ticket._id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function StatCard({ title, count, icon, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{title}</p>
        <span className={color}>{icon}</span>
      </div>

      <p className="text-3xl font-bold text-white mt-4">
        {count}
      </p>
    </div>
  );
}

export default UserDashboard;
