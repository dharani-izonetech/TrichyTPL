import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import teamsData from "../data/teams.json";
import "../styles/TeamsSection.css";

export default function PlayersPage() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId") || "1";
  const [roster, setRoster] = useState(null);
  const [loading, setLoading] = useState(true);

  const team = teamsData.find((t) => t.id.toString() === teamId);
  const teamName = team ? team.name : "Team Squad";

  useEffect(() => {
    window.scrollTo(0, 0);

    // Dynamically load the team roster
    const loadRoster = async () => {
      setLoading(true);
      try {
        // Using dynamic import for the specific team file
        const module = await import(`../data/players/team${teamId}.json`);
        setRoster(module.default);
      } catch (err) {
        console.error("Failed to load roster for team:", teamId, err);
        setRoster(null);
      } finally {
        setLoading(false);
      }
    };

    loadRoster();
  }, [teamId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (!roster) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-panel/40 px-6 py-16 text-center text-slate-400">
        Roster not found for this team.
      </div>
    );
  }

  const leadership = roster.leadership || {};
  const players = (roster.sections || []).flatMap((section) => section.players || []);

  return (
    <section className="teams-container relative">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white md:text-5xl">
          {teamName}
        </h1>
        <div className="mt-3 h-1.5 w-20 bg-accent shadow-[0_4px_15px_rgba(239,68,68,0.3)]"></div>
      </div>

      {/* Team Leadership Section */}
      <div className="mb-10 space-y-5">
        <div className="teams-header">
          <div className="header-accent"></div>
          <h2 className="teams-title">Team Leadership</h2>
        </div>

        <div className="leadership-grid">
          {leadership.owner && (
            <article className="owner-card">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent"></div>
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl transition duration-500 group-hover:bg-amber-400/20"></div>

              <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="owner-info">
                  <div className="owner-image-wrapper">
                    <img
                      src={leadership.owner.image}
                      alt={leadership.owner.name}
                      loading="lazy"
                      className="owner-image"
                    />
                  </div>
                  <div>
                    <span className="role-badge">{leadership.owner.role}</span>
                    <h3 className="owner-name">{leadership.owner.name}</h3>
                    <p className="owner-desc">{leadership.owner.description}</p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Manager and Coach cards hidden as requested */}
          {/*
          {leadership.manager && (
            <article className="leadership-card manager">
              ... (Manager details)
            </article>
          )}

          {leadership.coach && (
            <article className="leadership-card coach">
              ... (Coach details)
            </article>
          )}
          */}
        </div>
      </div>

      {/* Players Section commented out as requested */}
      {/*
      {players.length > 0 ? (
        <div>
          ... (Players grid)
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-panel/40 px-6 py-16 text-center text-slate-400">
          No players available.
        </div>
      )}
      */}

      <div className="mt-12 rounded-2xl border border-dashed border-slate-700 bg-panel/40 px-6 py-12 text-center text-slate-400">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Squad & Staff Details Coming Soon</p>
      </div>
    </section>
  );
}
