import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [ticketRes, dashboardRes] = await Promise.all([
        api.get("/admin/tickets", {
          params: {
            search,
            status,
            priority,
            page,
            limit: 10,
          },
        }),
        api.get("/admin/dashboard"),
      ]);

      setTickets(ticketRes.data.tickets || []);
      setTotalPages(ticketRes.data.totalPages || 1);
      setStats(dashboardRes.data.stats || dashboardRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load admin dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [search, status, priority, page]);

  const updateTicket = async (ticketId, field, value) => {
    try {
      await api.patch(`/admin/tickets/${ticketId}`, {
        [field]: value,
      });

      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update ticket.");
    }
  };

  const statCards = [
    {
      title: "Total Tickets",
      value: stats.totalTickets ?? tickets.length,
      icon: Ticket,
      color: "text-blue-400",
    },
    {
      title: "Open Tickets",
      value: stats.openTickets ?? 0,
      icon: AlertCircle,
      color: "text-yellow-400",
    },
    {
      title: "In Progress",
      value: stats.inProgressTickets ?? 0,
      icon: Clock,
      color: "text-purple-400",
    },
    {
      title: "Resolved",
      value: stats.resolvedTickets ?? 0,
      icon: CheckCircle,
      color: "text-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">
              Manage and monitor all support tickets.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-sm">{card.title}</p>
                  <Icon className={card.color} size={22} />
                </div>

                <p className="text-3xl font-bold text-white mt-4">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">Filter Tickets</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </section>

        <div className="flex items-center justify-between mt-5">
          <p className="text-slate-400 text-sm">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        {/* Tickets table */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800">
            <h2 className="text-white font-semibold text-lg">
              All Support Tickets
            </h2>
          </div>

          {error && <p className="text-red-400 p-5">{error}</p>}

          {loading ? (
            <p className="text-slate-400 p-6">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-slate-400 p-6">No tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/60 text-slate-400 text-sm">
                  <tr>
                    <th className="p-4">Ticket</th>
                    <th className="p-4">Created By</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="border-t border-slate-800">
                      <td className="p-4">
                        <p className="text-white font-medium">{ticket.title}</p>
                        <p className="text-slate-500 text-xs mt-1">
                          {ticket.category}
                        </p>
                      </td>

                      <td className="p-4 text-slate-300 text-sm">
                        {ticket.createdBy?.name || "Unknown"}
                      </td>

                      <td className="p-4">
                        <select
                          value={ticket.priority}
                          onChange={(e) =>
                            updateTicket(ticket._id, "priority", e.target.value)
                          }
                          className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-white text-sm"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            updateTicket(ticket._id, "status", e.target.value)
                          }
                          className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-white text-sm"
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>

                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <Link
                          to={`/tickets/${ticket._id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
