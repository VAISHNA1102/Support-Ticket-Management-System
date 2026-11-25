import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Activity,
  Send,
  Ticket,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();

  const dashboardPath =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";

  const fetchTicketData = async () => {
    try {
      const [ticketRes, commentRes, activityRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/comments/${id}`),
        api.get(`/activity/${id}`),
      ]);

      setTicket(ticketRes.data.ticket);
      setComments(commentRes.data.comments || []);
      setActivities(activityRes.data.activities || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api.post(`/comments/${id}`, {
        message: message.trim(),
      });

      setMessage("");
      await fetchTicketData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusStyles = {
    OPEN: "bg-blue-500/10 text-blue-400",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-400",
    RESOLVED: "bg-green-500/10 text-green-400",
    CLOSED: "bg-slate-500/10 text-slate-400",
  };

  const formatEvent = (eventType) => {
    return eventType.replaceAll("_", " ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <p className="text-center text-slate-400 mt-20">
          Loading ticket details...
        </p>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <p className="text-center text-red-400 mt-20">{error}</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Link to={dashboardPath} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Ticket information */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-blue-400 mb-3">
                <Ticket size={20} />
                <span className="text-sm">Ticket #{ticket._id.slice(-6)}</span>
              </div>

              <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                statusStyles[ticket.status] || "bg-slate-700 text-white"
              }`}
            >
              {ticket.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-slate-300 leading-7 mt-6">{ticket.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8 pt-6 border-t border-slate-800">
            <div>
              <p className="text-slate-500 text-sm">Category</p>
              <p className="text-white mt-1">{ticket.category}</p>
            </div>

            <div>
              <p className="text-slate-500 text-sm">Priority</p>
              <p className="text-white mt-1">{ticket.priority}</p>
            </div>

            <div>
              <p className="text-slate-500 text-sm">Created</p>
              <p className="text-white mt-1">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-sm">Last Updated</p>
              <p className="text-white mt-1">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comments */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-blue-400" size={21} />
              <h2 className="text-xl font-semibold text-white">
                Comments ({comments.length})
              </h2>
            </div>

            <div className="space-y-5 mb-8 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No comments yet. Start the conversation.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="border-b border-slate-800 pb-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white font-medium">
                        {comment.user?.name || "User"}
                      </p>

                      <span className="text-slate-500 text-xs">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm mt-2 leading-6">
                      {comment.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a comment..."
                maxLength={2000}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 resize-none"
              />

              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg"
              >
                <Send size={17} />
                {submitting ? "Sending..." : "Add Comment"}
              </button>
            </form>
          </section>

          {/* Activity history */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-purple-400" size={21} />
              <h2 className="text-xl font-semibold text-white">
                Activity History
              </h2>
            </div>

            {activities.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No activity recorded yet.
              </p>
            ) : (
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity._id} className="flex gap-3">
                    <div className="mt-1">
                      <Clock size={17} className="text-purple-400" />
                    </div>

                    <div>
                      <p className="text-white text-sm font-medium">
                        {formatEvent(activity.eventType)}
                      </p>

                      <p className="text-slate-400 text-sm mt-1">
                        {activity.description}
                      </p>

                      <p className="text-slate-500 text-xs mt-2">
                        By {activity.performedBy?.name || "Unknown"} ·{" "}
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default TicketDetails;
