import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import pic1 from "../../pics/pic6.png";
import oxinaLogo from "../assets/oxina-logo.png";

const links = [
  { label: "Home", to: "/" },
  { label: "Teams", to: "/teams" },
  { label: "Team Owners", to: "/team-owners" },
  { label: "News", to: "/news" },
  { label: "Live Match", to: "/live-match" },
  { label: "Gallery", to: "/gallery" }
];

function navClass({ isActive }) {
  return [
    "rounded-full px-4 py-2 text-xs font-bold transition-all duration-300",
    isActive
      ? "bg-accent text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  ].join(" ");
}

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60] border-b border-white/5 bg-bg/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-white group">
          <div className="relative">
            <img 
              src={oxinaLogo} 
              alt="TPL" 
              className="h-10 w-10 rounded-full border border-white/10 object-cover transition-transform duration-500 group-hover:rotate-12" 
            />
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-lg font-black uppercase tracking-widest md:text-2xl md:tracking-[0.2em]">Oxina TPL T20</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}

          <NavLink to={isAuthenticated ? "/admin" : "/admin/login"} className={navClass}>
            Admin
          </NavLink>

          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="ml-2 rounded-full border border-white/10 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 transition hover:bg-red-500 hover:text-white hover:border-red-500"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 lg:hidden"
        >
          <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""}`}></span>
          <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
          <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-x-0 top-[73px] z-[55] flex flex-col gap-2 border-b border-white/5 bg-bg/95 p-6 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {links.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => 
              `rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest transition-all ${
                isActive ? "bg-accent text-white" : "text-slate-300 hover:bg-white/5"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink 
          to={isAuthenticated ? "/admin" : "/admin/login"} 
          onClick={() => setIsOpen(false)}
          className={({ isActive }) => 
            `rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest transition-all ${
              isActive ? "bg-accent text-white" : "text-slate-300 hover:bg-white/5"
            }`
          }
        >
          Admin
        </NavLink>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-widest text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
