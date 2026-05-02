import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import owners from "../data/owners.json";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function OwnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const owner = owners.find((o) => o.id === parseInt(id));

  if (!owner) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-white uppercase">Owner Not Found</h2>
        <Link to="/team-owners" className="mt-6 text-accent hover:underline uppercase tracking-widest font-bold">
          Back to Owners List
        </Link>
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto py-12"
    >
      {/* Back Button */}
      <motion.button
        variants={itemVariants}
        onClick={() => navigate(-1)}
        className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-widest">Back to Owners</span>
      </motion.button>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        {/* Left: Hero Image */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 relative group overflow-hidden rounded-[2rem] border border-white/5 bg-panelSoft shadow-2xl"
        >
          <img
            src={owner.image}
            alt={owner.owner_name}
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x800/1e293b/ffffff?text=Image+Not+Found";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <span className="text-xs font-black uppercase tracking-widest text-accent mb-2 block">
              {owner.team_name}
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white">
              {owner.owner_name}
            </h1>
          </div>
        </motion.div>

        {/* Right: Detailed Content */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-4">
              <span className="h-px w-8 bg-accent"></span>
              Profile            </h3>
            <p className="text-xl leading-relaxed text-slate-300 font-medium">
              {owner.description}
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-md">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Primary Business
            </span>
            <span className="text-2xl font-black text-white">
              {owner.business}
            </span>
          </div>

          {/* Stats Section */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-4">
              <span className="h-px w-8 bg-accent"></span>
              Legacy & Impact
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-2xl font-black text-white">{owner.stats?.experience}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Years Experience</div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-500 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-2xl font-black text-white">{owner.stats?.projects}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Projects Led</div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-500 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-2xl font-black text-white">{owner.stats?.teams}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Teams Managed</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.section>
  );
}
