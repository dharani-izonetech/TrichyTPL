import { useEffect, useMemo, useState } from "react";
import { getLiveMatch, getLiveStreamConfig } from "../services/api";

function formatScore(match, inningsTeam) {
  if (!match) return "0/0 (0.0)";
  if (inningsTeam === "A") {
    return `${match.team_a_runs}/${match.team_a_wickets} (${match.team_a_overs})`;
  }
  return `${match.team_b_runs}/${match.team_b_wickets} (${match.team_b_overs})`;
}

function toYoutubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (parsed.pathname.startsWith("/live/")) {
        const videoId = parsed.pathname.split("/").filter(Boolean)[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
    }
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function LiveMatchPage() {
  const [liveData, setLiveData] = useState({ match: null });
  const [liveStreamUrl, setLiveStreamUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    let isMounted = true;

    const load = async () => {
      try {
        const [liveMatch, streamConfig] = await Promise.all([getLiveMatch(), getLiveStreamConfig()]);
        if (!isMounted) return;
        setLiveData(liveMatch);
        setLiveStreamUrl(streamConfig?.stream_url || "");
      } catch {
        // Keep existing UI state on transient API failures while polling.
      } finally {
        if (isMounted) setLoading(false);
        timer = setTimeout(load, 12000);
      }
    };

    load();
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const currentInningsTeam = useMemo(() => {
    if (!liveData.match) return "A";
    return liveData.match.current_innings === 1 ? "A" : "B";
  }, [liveData.match]);
  const youtubeEmbedUrl = useMemo(() => toYoutubeEmbedUrl(liveStreamUrl), [liveStreamUrl]);

  const inningsLabel =
    currentInningsTeam === "A" ? liveData.match?.team_a?.name || "Team A" : liveData.match?.team_b?.name || "Team B";

  return (
    <section className="space-y-6 pb-20">
      {/* Live Scorecard - Only shown when active to avoid empty message */}
      {liveData.match && (
        <div className="panel border-accent/40 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">Live <span className="text-accent">Match</span></h1>
              <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">{liveData.match.venue}</p>
            </div>
            <span className="rounded-full bg-red-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-600/20 animate-pulse">
              Live Now
            </span>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-2xl font-black text-white md:text-3xl">
                {liveData.match.team_a?.name} <span className="text-slate-500 mx-2 text-xl font-normal">vs</span> {liveData.match.team_b?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">{inningsLabel} Batting</p>
              <p className="text-5xl font-black text-white tracking-tighter">
                {formatScore(liveData.match, currentInningsTeam)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stream Section - Dimensions kept exactly as requested */}
      <div className="panel border-white/5 bg-panel/40 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 w-1.5 rounded-full bg-accent"></div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Live Match <span className="text-accent">Stream</span></h2>
        </div>
        
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-700 bg-black">
          {youtubeEmbedUrl ? (
            <iframe
              title="TPL Live Stream (Live Match Page)"
              src={youtubeEmbedUrl}
              className="h-[240px] w-full md:h-[460px]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : liveStreamUrl ? (
            <video controls className="h-[240px] w-full md:h-[460px]" src={liveStreamUrl}>
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="grid h-[240px] place-content-center p-4 text-center text-slate-400 md:h-[460px] bg-slate-900/50 backdrop-blur-sm">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 mx-auto">
                <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Stream Active</p>
            </div>
          )}
        </div>
      </div>

      {liveData.match && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="panel bg-panelSoft/30 border-white/5 backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-widest text-accent mb-4">Current Field</p>
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-300">Striker: <span className="text-white uppercase ml-2">{liveData.striker_name || "---"}</span></p>
              <p className="text-sm font-bold text-slate-300">Non-Striker: <span className="text-white uppercase ml-2">{liveData.non_striker_name || "---"}</span></p>
              <p className="text-sm font-bold text-slate-300">Bowler: <span className="text-white uppercase ml-2 text-accent">{liveData.bowler_name || "---"}</span></p>
            </div>
          </div>

          <div className="panel bg-panelSoft/30 border-white/5 backdrop-blur-md">
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4">Ball-by-Ball</h2>
            <div className="max-h-60 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {liveData.match.commentary?.length ? (
                liveData.match.commentary.map((line, index) => (
                  <p key={`${line}-${index}`} className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs text-slate-300 italic">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Waiting for commentary...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
