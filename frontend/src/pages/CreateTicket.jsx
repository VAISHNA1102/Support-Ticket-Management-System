
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Ticket, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "TECHNICAL",
    priority: "MEDIUM",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.title.trim().length < 5) {
      setError("Title must contain at least 5 characters.");
      return;
    }

    if (formData.description.trim().length < 10) {
      setError("Description must contain at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/tickets", {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
      });

      navigate("/user/dashboard", {
        state: { message: "Ticket created successfully!" },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">

        <Link
          to="/user/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400">
              <Ticket size={25} />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Create Support Ticket
            </h1>
          </div>

          <p className="text-slate-400 mb-8">
            Describe your issue and our support team will assist you.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Ticket Title
              </label>

              <input
                type="text"
                name="title"
                required
                minLength={5}
                maxLength={100}
                value={formData.title}
                onChange={handleChange}
                placeholder="Briefly describe your issue"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />
              <p className="text-slate-500 text-xs mt-2">
                Minimum 5 and maximum 100 characters.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Description
              </label>

              <textarea
                name="description"
                required
                minLength={10}
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain your issue in detail..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="BILLING">Billing</option>
                  <option value="GENERAL">General</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                <Send size={18} />
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/user/dashboard")}
                className="px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg transition"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateTicket;
