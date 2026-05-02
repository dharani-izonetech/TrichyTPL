import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  getLiveStreamConfig,
  listMediaImages
} from "../services/api";
import getErrorMessage from "../utils/errorMessage";

const adminTabs = [
  { label: "Overview", to: "/admin", end: true },
  { label: "News", to: "/admin/news" },
  { label: "Uploads", to: "/admin/uploads" },
  { label: "Stream", to: "/admin/stream" }
];

function tabClass({ isActive }) {
  return [
    "rounded-lg px-3 py-2 text-xs font-semibold transition",
    isActive ? "bg-accent text-white" : "bg-panelSoft text-slate-200 hover:bg-slate-700"
  ].join(" ");
}

export default function AdminPanelPage() {
  const [mediaImages, setMediaImages] = useState([]);
  const [liveVideoLink, setLiveVideoLink] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [mediaRows, streamConfig] = await Promise.all([
        listMediaImages(),
        getLiveStreamConfig()
      ]);
      setMediaImages(Array.isArray(mediaRows) ? mediaRows : []);
      setLiveVideoLink(streamConfig?.stream_url || "");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load admin data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const withFeedback = useCallback(
    async (action, successMessage = "Saved successfully.") => {
      setError("");
      setMessage("");
      try {
        await action();
        setMessage(successMessage);
        await refreshData();
      } catch (err) {
        setError(getErrorMessage(err, "Operation failed."));
      }
    },
    [refreshData]
  );

  const contextValue = useMemo(
    () => ({
      mediaImages,
      liveVideoLink,
      setLiveVideoLink,
      withFeedback,
      loading,
      refreshData
    }),
    [mediaImages, liveVideoLink, withFeedback, loading, refreshData]
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-700 bg-panel p-6 shadow-glow">
        <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
        <p className="mt-1 text-slate-300">
          Manage uploads and stream settings using separate pages.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-panelSoft p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Uploaded Images</p>
            <p className="mt-1 text-2xl font-semibold text-white">{mediaImages.length}</p>
          </div>
        </div>
      </div>

      <div className="sticky top-[76px] z-30 overflow-x-auto rounded-xl border border-slate-700 bg-panel/95 p-2 backdrop-blur">
        <div className="flex w-max gap-2">
          {adminTabs.map((tab) => (
            <NavLink key={tab.to} end={tab.end} to={tab.to} className={tabClass}>
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {message ? (
        <p className="rounded-xl border border-emerald-700 bg-emerald-900/30 p-3 text-sm font-semibold text-emerald-300">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-red-800 bg-red-950/40 p-3 text-sm font-semibold text-red-300">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-700 bg-panel p-6 text-sm text-slate-300">Loading admin data...</div>
      ) : null}

      <Outlet context={contextValue} />
    </section>
  );
}
