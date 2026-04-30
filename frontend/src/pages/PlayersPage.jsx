import roster from "../data/players.json";
import "../styles/TeamsSection.css";

export default function PlayersPage() {
  const leadership = roster.leadership || {};
  const players = roster.sections.flatMap((section) => section.players || []);

  return (
    <section className="teams-container relative">
      {/* Team Leadership Section */}
      <div className="mb-10 space-y-5">
        <div className="teams-header">
          <div className="header-accent"></div>
          <h2 className="teams-title">Team Leadership</h2>
        </div>

        <div className="leadership-grid">
          {/* Owner Card */}
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

          {/* Manager Card */}
          {leadership.manager && (
            <article className="leadership-card manager">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-transparent to-transparent"></div>
              <div className="relative z-10 flex items-center gap-5">
                <div className="leadership-image-wrapper relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={leadership.manager.image}
                    alt={leadership.manager.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="role-badge">{leadership.manager.role}</span>
                  <h3 className="mt-2 text-2xl font-bold uppercase tracking-[0.04em] text-white leading-tight">
                    {leadership.manager.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">
                    {leadership.manager.description}
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Coach Card */}
          {leadership.coach && (
            <article className="leadership-card coach">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/10 via-transparent to-transparent"></div>
              <div className="relative z-10 flex items-center gap-5">
                <div className="leadership-image-wrapper relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={leadership.coach.image}
                    alt={leadership.coach.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="role-badge">{leadership.coach.role}</span>
                  <h3 className="mt-2 text-2xl font-bold uppercase tracking-[0.04em] text-white leading-tight">
                    {leadership.coach.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">
                    {leadership.coach.description}
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* Players Section */}
      {players.length > 0 ? (
        <div>
          <div className="teams-header">
            <div className="header-accent squad-accent"></div>
            <h2 className="teams-title">Players</h2>
          </div>
          <div className="players-grid">
            {players.map((player) => (
              <article key={player.id} className="player-card">
                <div className="player-image-box">
                  <img
                    src={player.image}
                    alt={player.name}
                    loading="lazy"
                    className="player-image"
                  />
                </div>

                <div className="player-overlay">
                  <h2 className="player-name">{player.name}</h2>
                  <p className="player-role">{player.role}</p>
                  <p className="player-profile">{player.profile}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
          No players available.
        </div>
      )}
    </section>
  );
}
