import { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import teamsData from "../data/teams.json";

export default function TeamsPage() {
  const [search, setSearch] = useState("");

  const filteredTeams = teamsData.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold text-white">Teams</h1>
          <p className="text-slate-400">Select a team to explore players.</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search teams..."
          className="w-full rounded-xl border border-slate-700 bg-panel px-4 py-2 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none md:w-72"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
      {filteredTeams.length === 0 ? <p className="text-slate-400">No teams found.</p> : null}
    </section>
  );
}
