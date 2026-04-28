import { useEffect, useMemo, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import MatchCard from "../components/MatchCard";
import {
  getHomeData,
  getLeaderboard,
  getLiveStreamConfig,
  listMediaImages
} from "../services/api";

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
  } catch (error) {
    return null;
  }
  return null;
}

export default function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [liveStreamUrl, setLiveStreamUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUploadedHero, setShowUploadedHero] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      setShowUploadedHero(window.scrollY > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      try {
        const [home, leaders, images, stream] = await Promise.all([
          getHomeData(),
          getLeaderboard(5),
          listMediaImages(),
          getLiveStreamConfig()
        ]);

        if (!isMounted) return;
        setHomeData(home);
        setLeaderboard(leaders);
        setGalleryImages(images);
        setLiveStreamUrl(stream?.stream_url || "");
      } catch {
        // Keep existing UI state on transient API failures while polling.
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllData();
    const timer = setInterval(loadAllData, 12000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const youtubeEmbedUrl = useMemo(() => toYoutubeEmbedUrl(liveStreamUrl), [liveStreamUrl]);

  return (
    <section className="min-h-screen pb-20">
      {/* Hero Section - Explicit Full Width and Viewport Height Control */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-accentMuted opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <HeroCarousel uploadedImages={galleryImages} useUploadedHero={showUploadedHero} />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-20 space-y-24 lg:space-y-40">
        
        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-12 px-2 sm:px-0">
          
          {/* Left Column: Matches */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="h-10 w-2 rounded-full bg-gradient-to-b from-accent to-accentMuted shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
              <h2 className="text-3xl font-bold uppercase tracking-[0.1em] text-white md:text-4xl">Upcoming Matches</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {!loading && homeData?.upcoming_matches?.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-slate-800 bg-panelSoft/30 p-12 text-center backdrop-blur-sm">
                  <p className="text-slate-400">No upcoming matches scheduled yet.</p>
                </div>
              ) : null}
              {homeData?.upcoming_matches?.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>

          {/* Right Column: Performers & Leaderboard */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-10">
            
            {/* Top Performers */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4">
                <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500"></div>
                <h2 className="text-2xl font-bold uppercase tracking-wider text-white">Top Performers</h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-panelSoft/80 to-panel/80 p-5 backdrop-blur-md transition hover:border-slate-600">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition duration-500 group-hover:bg-amber-500/20"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Top Scorer</p>
                  <p className="mt-2 text-xl font-bold text-white truncate group-hover:text-amber-50 transition-colors">
                    {homeData?.top_scorer?.name || "N/A"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    <span className="text-amber-500 text-lg font-bold mr-1">{homeData?.top_scorer?.runs || 0}</span> runs
                  </p>
                </div>
                
                <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-panelSoft/80 to-panel/80 p-5 backdrop-blur-md transition hover:border-slate-600">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition duration-500 group-hover:bg-accent/20"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Top Wicket Taker</p>
                  <p className="mt-2 text-xl font-bold text-white truncate group-hover:text-red-50 transition-colors">
                    {homeData?.top_wicket_taker?.name || "N/A"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    <span className="text-accent text-lg font-bold mr-1">{homeData?.top_wicket_taker?.wickets || 0}</span> wickets
                  </p>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4">
                <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                <h2 className="text-2xl font-bold uppercase tracking-wider text-white">Leaderboard</h2>
              </div>
              
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-panelSoft/20 p-4 backdrop-blur-sm">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className="group flex items-center justify-between rounded-xl border border-slate-700/30 bg-panel/50 px-4 py-3 transition hover:border-indigo-500/30 hover:bg-panelSoft hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400 transition-colors group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                        {index + 1}
                      </span>
                      <p className="font-bold text-slate-100 transition-colors group-hover:text-white">{player.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-400">
                        <span className="text-white mr-0.5">{player.runs}</span> R / <span className="text-white mr-0.5">{player.wickets}</span> W
                      </p>
                    </div>
                  </div>
                ))}
                {!loading && leaderboard.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">No players found.</p>
                ) : null}
              </div>
            </div>

          </div>
        </div>

        {/* Live Stream Section */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-panel shadow-2xl">
          {/* Subtle top glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <h2 className="text-3xl font-bold uppercase tracking-wider text-white">Live Stream</h2>
                </div>
                <p className="mt-2 text-sm text-slate-400 max-w-xl">Catch the action live directly from the tournament grounds.</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-inner aspect-video ring-1 ring-white/5">
              {youtubeEmbedUrl ? (
                <iframe
                  title="TPL Live Stream"
                  src={youtubeEmbedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : liveStreamUrl ? (
                <video controls className="h-full w-full" src={liveStreamUrl}>
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center space-y-4 bg-gradient-to-b from-slate-900 to-black p-4 text-center">
                  <div className="rounded-full bg-slate-800/80 p-5 ring-1 ring-white/10">
                    <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-300">Stream Offline</p>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">No live stream link is currently active. Please check back later.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-700/50 pb-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
              <h2 className="text-3xl font-bold uppercase tracking-wider text-white">Moments Gallery</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-700/50 bg-panelSoft/50 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                {galleryImages.length} Shots
              </span>
            </div>
          </div>

          {!loading && galleryImages.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-panelSoft/30 p-12 text-center backdrop-blur-sm">
              <p className="text-slate-400">No uploaded photos yet. Gallery is empty.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-white p-3 shadow-md transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] hover:-translate-y-1.5 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={image.full_url}
                      alt={image.original_name}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-[1.05] opacity-0"
                      onLoad={(e) => {
                        e.target.classList.remove('opacity-0');
                        e.target.classList.add('opacity-100');
                      }}
                    />
                    {/* Hover zoom-in icon overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                        <svg className="h-8 w-8 text-white stroke-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-6xl w-full flex flex-col items-center justify-center">
            <button 
              className="absolute -top-12 right-0 md:-right-12 md:top-0 z-[110] rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              aria-label="Close lightbox"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage.full_url} 
              alt={selectedImage.original_name} 
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              {selectedImage.original_name}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
