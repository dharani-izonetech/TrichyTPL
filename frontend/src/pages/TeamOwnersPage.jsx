import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import owners from "../data/owners.json";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function TeamOwnersPage() {
  return (
    <section className="min-h-screen py-10 px-4 md:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white md:text-5xl">
          Team Owners
        </h1>
        <div className="mt-2 h-1 w-12 bg-accent shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
        <p className="mt-4 text-slate-400 max-w-2xl text-base">
          Meet the visionaries behind the teams of Oxina TPL T20.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 lg:grid-cols-1"
      >
        {owners.map((owner) => (
          <Link to={`/owner/${owner.id}`} key={owner.id}>
            <motion.article
              variants={itemVariants}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-panelSoft/20 backdrop-blur-md transition-all duration-500 hover:border-accent/30 hover:bg-panelSoft/30 cursor-pointer"
            >
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Owner Image (More compact) */}
              <div className="relative h-[300px] w-full shrink-0 md:h-auto md:w-1/4 overflow-hidden">
                <img
                  src={owner.image}
                  alt={owner.owner_name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x600/1e293b/ffffff?text=Image+Not+Found";
                  }}
                />
              </div>

              {/* Right Side: Details (More compact) */}
              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10 md:w-3/4">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
                    {owner.team_name}
                  </span>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white lg:text-4xl">
                    {owner.owner_name}
                  </h2>
                </div>

                <div className="mb-8 space-y-4">
                  <p className="text-base leading-relaxed text-slate-300">
                    {owner.description}
                  </p>

                  <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Primary Business
                        </span>
                        <span className="text-xl font-bold text-white">
                          {owner.business}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center justify-center rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Status: Principal
                          </span>
                        </div>
                        <div className="flex items-center justify-center rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Season: 2026
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </Link>
        ))}
      </motion.div>
    </section>
  );
}
