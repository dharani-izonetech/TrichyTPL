import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getNews } from "../services/api";

import { toYoutubeEmbedUrl } from "../utils/youtube";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsDetail() {
      try {
        const data = await getNews(id);
        setNews(data);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-white uppercase">News Not Found</h2>
        <Link to="/news" className="mt-6 text-accent hover:underline uppercase tracking-widest font-bold">
          Back to News
        </Link>
      </div>
    );
  }

  const youtubeUrl = toYoutubeEmbedUrl(news.video_url);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <button
        onClick={() => navigate(-1)}
        className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-widest">Back to News</span>
      </button>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
            {news.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-bold uppercase tracking-widest">
            <span>{new Date(news.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {news.location && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                <span className="text-accent">{news.location}</span>
              </>
            )}
            <span className="h-1 w-1 rounded-full bg-slate-700"></span>
            <span>Season: {news.season || "2026"}</span>
            <span className="h-1 w-1 rounded-full bg-slate-700"></span>
            <span>By TPL Editorial</span>
          </div>
        </div>

        {youtubeUrl ? (
          <div className="aspect-video overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
            <iframe
              src={youtubeUrl}
              title={news.title}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        ) : news.image ? (
          <div className="aspect-video overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <img src={news.image} alt={news.title} className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div className="prose prose-invert max-w-none">
          <p className="text-xl font-medium leading-relaxed text-slate-300 first-letter:text-5xl first-letter:font-black first-letter:text-accent first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
            {news.content}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
