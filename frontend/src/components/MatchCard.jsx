import React from "react";

function formatDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function statusClass(status) {
  if (status === "Live") return "bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
  if (status === "Completed") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  return "bg-amber-500/10 text-amber-500 border-amber-500/30";
}

export default function MatchCard({ match }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-panel/40 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accentMuted/50 hover:bg-panel hover:shadow-[0_8px_30px_rgb(251,146,60,0.12)]">
      {/* Decorative gradient blob on hover */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/5 blur-[80px] transition-all duration-500 group-hover:bg-accent/15"></div>
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-700/50 pb-4">
          <div className="flex flex-col">
            <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${statusClass(match.status)}`}>
              {match.status === "Live" && <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>}
              {match.status}
            </span>
          </div>
          <div className="sm:text-right">
            <p className="text-xs sm:text-sm font-medium text-slate-300">{formatDate(match.date_time)}</p>
            <p className="mt-1 flex sm:justify-end items-center gap-1.5 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {match.venue}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-2">
          <div className="flex-1 w-full text-center sm:text-left">
            <h3 className="text-lg font-bold leading-tight text-white md:text-xl transition-colors group-hover:text-amber-50">
              {match.team_a?.name || "Team A"}
            </h3>
          </div>
          <div className="flex items-center gap-2 px-2 text-[10px] font-black italic text-slate-600 sm:px-4 sm:text-sm">
            <div className="h-px w-4 bg-slate-800 sm:w-8"></div>
            VS
            <div className="h-px w-4 bg-slate-800 sm:w-8"></div>
          </div>
          <div className="flex-1 w-full text-center sm:text-right">
            <h3 className="text-lg font-bold leading-tight text-white md:text-xl transition-colors group-hover:text-amber-50">
              {match.team_b?.name || "Team B"}
            </h3>
          </div>
        </div>
      </div>
    </article>
  );
}
