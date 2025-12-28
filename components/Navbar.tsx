
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  LayoutGrid, 
  LogOut, 
  Shield, 
  ChevronDown, 
  Bell, 
  X, 
  Sparkles, 
  Bug, 
  Paintbrush, 
  Lock,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../App';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isDrawerOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Zap className="w-4 h-4 sm:w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight">mieltecity</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-4">
            <Link 
              to="/explore" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive('/explore') ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Explore</span>
            </Link>

            {/* Updates Trigger Button */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Updates</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full animate-pulse border border-[#020617]"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-white/10 mx-1 sm:mx-2"></div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                >
                  <img src={user.avatar} className="w-7 h-7 rounded-full border border-sky-500/50" alt={user.name} />
                  <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass border border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/developer-panel" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-sky-500/10 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-sky-400" />
                      Developer Panel
                    </Link>
                    
                    <button 
                      onClick={() => { signOut(); setIsDropdownOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="text-xs sm:text-sm font-bold text-white px-4 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Side Updates Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          <div className="relative w-full max-w-sm h-full glass border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-500/20">
                    <Sparkles className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Changelog</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Version 1.2.0</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Current Features Section */}
                <section>
                  <h3 className="text-xs font-black text-sky-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Current Features
                  </h3>
                  <div className="space-y-4">
                    {[
                      { t: 'Verified Badges', d: 'Trust system for top-tier creators and production code.' },
                      { t: 'Monetization Roadmap', d: 'Track progress to start selling your assets.' },
                      { t: 'One-Click Downloads', d: 'Get source code ZIPs instantly without wait times.' },
                      { t: 'Secure Storage', d: 'Code is protected with industry-standard encryption.' },
                      { t: 'Developer Dashboard', d: 'Full control over your contributions and stats.' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/2 border border-white/5 group hover:bg-white/5 transition-colors">
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">{item.t}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upcoming Improvements Section */}
                <section>
                  <h3 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Upcoming Updates
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                      <Paintbrush className="w-5 h-5 text-purple-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Improved UI/UX</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Polishing shadows, animations, and mobile layout for a smoother experience.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <Bug className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Bug Squashing</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Optimizing database calls and fixing identified glitches in the upload flow.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                      <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Hidden Pro Features</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Exclusive tools and early access perks for verified developers only.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-sky-500/10 border border-sky-500/20 text-center">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mb-2">Platform Goal</p>
                <p className="text-xs text-white font-medium leading-relaxed italic">
                  "Code samajhne ka nahi, use karne ka platform."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
