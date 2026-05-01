import { Link } from "react-router-dom";

import amicoLogo from "../assets/players/team-logos/amico.png";
import vayalurLogo from "../assets/players/team-logos/vayalur.png";
import samayapuramLogo from "../assets/players/team-logos/samayapuram.png";
import thillaiLogo from "../assets/players/team-logos/thilai.png"; // ✅ fixed
import izoneLogo from "../assets/players/team-logos/izone.png";
import srirangamLogo from "../assets/players/team-logos/srirangam.png";
import gunturLogo from "../assets/players/team-logos/guntur.png";
import cantonmentLogo from "../assets/players/team-logos/cantonment.png";
import moraisLogo from "../assets/players/team-logos/morais.png";
import rockfortLogo from "../assets/players/team-logos/rockfort.png";

const teamLogos = {
  "Amico Mavericks": amicoLogo,
  "Vayalur Warriors": vayalurLogo,
  "Samayapuram Samaritan": samayapuramLogo,
  "Thillai Thunders": thillaiLogo,
  "Izone Thiruverumbur": izoneLogo,
  "Srirangam Superstars": srirangamLogo,
  "Guntur Kaalai": gunturLogo,
  "Cantonment Saamy": cantonmentLogo,
  "Morais Dominators": moraisLogo,
  "Rockfort Rider": rockfortLogo
};

export default function TeamCard({ team }) {
  const logo = teamLogos[team.name]; // ✅ FIXED

  return (
    <Link
      to={`/players?teamId=${team.id}`}
      className="group rounded-2xl border border-slate-700/70 bg-panel p-5 transition hover:-translate-y-1 hover:border-accent/70 hover:bg-panelSoft"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{team.name}</h3>
          <p className="mt-2 text-sm text-slate-300">
            Captain: {team.captain}
          </p>
        </div>

        {logo ? (
          <img
            src={logo}
            alt={`${team.name} logo`}
            className="h-14 w-14 rounded-xl border border-slate-700 object-cover"
          />
        ) : (
          <div className="grid h-14 w-14 place-content-center rounded-xl border border-slate-700 text-xs text-slate-400">
            {team.short_name || "Logo"}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-accentMuted group-hover:text-amber-300">
        View Team
      </p>
    </Link>
  );
}