import { useState, useEffect } from "react";
import { listNews, createNews, deleteNews, updateNews, uploadMediaImages } from "../../services/api";
import useAdminPanelContext from "./useAdminPanelContext";
import { getYoutubeThumbnail } from "../../utils/youtube";

const initialForm = {
  title: "",
  content: "",
  location: "",
  season: "",
  image: "",
  video_url: "",
  date: ""
};

// Helper to format date for date input
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  return localISOTime;
};

export default function AdminNewsPage() {
  const { withFeedback, loading: contextLoading } = useAdminPanelContext();
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const data = await listNews();
      setNewsList(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = form.image;

      // Handle File Upload if selected
      if (selectedFile) {
        const uploadResult = await uploadMediaImages([selectedFile]);
        if (uploadResult && uploadResult.length > 0) {
          finalImageUrl = uploadResult[0].file_url;
        }
      }

      // If date is empty, don't send it so backend can use default
      const payload = {
        ...form,
        image: finalImageUrl,
        date: form.date ? new Date(form.date).toISOString() : null
      };

      if (editingId) {
        await withFeedback(() => updateNews(editingId, payload), "News updated successfully!");
      } else {
        await withFeedback(() => createNews(payload), "News created successfully!");
      }
      setForm(initialForm);
      setEditingId(null);
      setSelectedFile(null);
      fetchNews();
    } catch (error) {
      // Error is handled by withFeedback or we can show it if needed
      console.error("Error saving news:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      try {
        await withFeedback(() => deleteNews(id), "News deleted successfully.");
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white">Manage News</h2>
      </div>

      {/* News Form */}
      <div className="rounded-[1.5rem] border border-white/5 bg-panelSoft/20 p-8 backdrop-blur-md">
        <h3 className="mb-6 text-lg font-bold uppercase tracking-widest text-accent">
          {editingId ? "Edit Article" : "Create New Article"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-accent outline-none transition-colors"
                placeholder="Article Title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date (Optional)</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-accent outline-none transition-colors appearance-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-accent outline-none transition-colors"
                placeholder="Event Location"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Season</label>
              <input
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-accent outline-none transition-colors"
                placeholder="e.g. 2026"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">YouTube Video Link (Optional)</label>
            <input
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-accent outline-none transition-colors"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-2.5 text-xs text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white hover:file:bg-red-600 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Or Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-accent outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Content</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-accent outline-none transition-colors h-40"
              placeholder="The full text of the news article..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-accent px-8 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : editingId ? "Update Article" : "Publish News"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                  setSelectedFile(null);
                }}
                className="rounded-xl border border-white/10 px-8 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* News List */}
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase tracking-widest text-white">Published Articles</h3>
        <div className="grid gap-4">
          {newsList.map((news) => (
            <div key={news.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-panelSoft/20 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <img
                  src={news.image || getYoutubeThumbnail(news.video_url) || "https://via.placeholder.com/100x100?text=No+Image"}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">{news.title}</h4>
                  <p className="text-[10px] text-slate-400 italic line-clamp-1 mb-1">
                    {news.content?.substring(0, 80)}.....
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    {new Date(news.date).toLocaleDateString()} {news.location ? `• ${news.location}` : ""} {news.season ? `• ${news.season}` : ""} {news.video_url ? "• Includes Video" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(news.id);
                    setForm({
                      title: news.title,
                      content: news.content,
                      location: news.location || "",
                      season: news.season || "",
                      image: news.image || "",
                      video_url: news.video_url || "",
                      date: formatDateForInput(news.date)
                    });
                    setSelectedFile(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(news.id)}
                  className="rounded-lg border border-red-500/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {newsList.length === 0 && <p className="text-slate-500 text-center py-10">No articles published yet.</p>}
        </div>
      </div>
    </section>
  );
}
