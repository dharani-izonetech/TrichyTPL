import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroCarousel from "../components/HeroCarousel";
import {
  getLiveStreamConfig,
  listMediaImages
} from "../services/api";
import teamsData from "../data/teams.json";

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

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function HomePage() {
  const [teams] = useState(teamsData);
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
        const [images, stream] = await Promise.all([
          listMediaImages(),
          getLiveStreamConfig()
        ]);

        if (!isMounted) return;
        setGalleryImages(images || []);
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
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        {/* Inside-Text Animated Glass Title */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center select-none flex flex-col items-center md:top-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="relative text-xl font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] md:text-4xl">
              <span className="relative z-10">
                IPL Auction <span className="text-accent">2026</span>
              </span>

              <span
                className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/60 to-transparent bg-[length:200%_100%] animate-[shimmer-text_4s_linear_infinite] bg-clip-text text-transparent"
                aria-hidden="true"
                style={{ WebkitBackgroundClip: 'text' }}
              >
                IPL Auction 2026
              </span>
            </h1>
            <div className="mt-2 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60 mx-auto md:w-32"></div>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-accentMuted opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <HeroCarousel useUploadedHero={false} />
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-12 space-y-20 md:px-8 md:mt-20 md:space-y-32 lg:space-y-40">

        {/* Participating Teams */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
          className="flex flex-col gap-6 md:gap-8"
        >
          <div className="flex items-center gap-4 border-b border-white/10 pb-4 md:pb-6">
            <div className="h-8 w-1.5 rounded-full bg-accent md:h-10 md:w-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white md:text-4xl">Teams</h2>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {teams.slice(0, 8).map((team) => (
              <motion.div key={team.id} variants={cardVariants}>
                <Link
                  to="/teams"
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-panelSoft/30 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-accent md:gap-4 md:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 overflow-hidden shadow-inner group-hover:ring-2 group-hover:ring-accent transition-all duration-300 md:h-20 md:w-20">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt={team.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl font-black uppercase tracking-wider text-white md:text-3xl">
                        {team.short_name || team.name.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-center text-xs font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors md:text-lg">
                    {team.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Live Stream */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-panel p-4 md:rounded-3xl md:p-10 shadow-2xl"
        >
          <div className="flex flex-col gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wider text-white md:text-3xl">Live Stream</h2>
            </div>
            <p className="text-xs text-slate-400 md:text-sm">Catch the action live from the tournament grounds.</p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black aspect-video ring-1 ring-white/5 md:rounded-2xl">
            {youtubeEmbedUrl ? (
              <iframe
                title="TPL Live Stream"
                src={youtubeEmbedUrl}
                className="h-full w-full"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900/50 p-6 text-center">
                <p className="text-sm font-bold text-slate-300 md:text-lg">Stream Offline</p>
                <p className="text-[10px] text-slate-500 mt-1 md:text-xs">No live stream active at the moment.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Moments Gallery */}
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4 md:pb-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1.5 rounded-full bg-accent md:h-10 md:w-2"></div>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white md:text-4xl">Gallery</h2>
            </div>
            <div className="rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-md md:px-6 md:py-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-xs">
                {galleryImages.length} Moments
              </span>
            </div>
          </div>

          <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 md:gap-6 md:space-y-6">
            {galleryImages.map((image) => (
              <article
                key={image.id}
                className="group relative break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl transition duration-500 hover:-translate-y-1 md:rounded-[2.5rem] cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.full_url}
                  alt={image.original_name}
                  loading="lazy"
                  className="w-full h-auto transition duration-700 group-hover:scale-105"
                />
                {/* Clean Hover State */}
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-5xl w-full flex flex-col items-center justify-center">
            <button
              className="absolute -top-12 right-0 rounded-full bg-white/10 p-3 text-white hover:bg-accent transition-all md:-top-16 md:right-0"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage.full_url}
              alt={selectedImage.original_name}
              className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain md:rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
