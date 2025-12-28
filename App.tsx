
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Loader2
} from 'lucide-react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import UploadPage from './pages/UploadPage';
import SignIn from './pages/SignIn';
import DeveloperPanel from './pages/DeveloperPanel';
import Monetization from './pages/Monetization';
import Navbar from './components/Navbar';
import { User } from './types';
import { supabase, signInWithGoogle, signOutUser } from './lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUser = (supabaseUser: any): User => {
    const email = supabaseUser.email || 'guest';
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name || email.split('@')[0] || 'User',
      email: email,
      avatar: supabaseUser.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'developer'
    };
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await signOutUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      <Router>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow pt-14 sm:pt-16">
            {loading ? (
              <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <Zap className="w-12 h-12 text-sky-500 animate-pulse" />
                  <Loader2 className="w-12 h-12 text-sky-400 absolute inset-0 animate-spin opacity-30" />
                </div>
                <p className="text-slate-500 font-bold animate-pulse text-xs uppercase tracking-widest">Initialising MielteCity...</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/developer-panel" element={<DeveloperPanel />} />
                <Route path="/monetization" element={<Monetization />} />
              </Routes>
            )}
          </main>
          
          <footer className="border-t border-white/5 py-12 px-6 mt-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" fill="white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">mieltecity</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    A premium digital asset marketplace for modern developers. Quality source code at your fingertips.
                  </p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Terms of Service</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                        By using MielteCity, you agree that all code is provided "as is" without warranty. Commercial use depends on specific project licenses included in the ZIP files.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Privacy Policy</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                        We respect your privacy. We only collect email data for authentication and order tracking. Your source code is stored securely using industry-standard encryption.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Safety & Security</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                        Every upload is manually scanned. We maintain a zero-tolerance policy for malware, obfuscated trackers, or leaked API keys within hosted source code.
                    </p>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-600 text-xs">© 2025 MielteCity. Built for the builders.</p>
                <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    <a href="#" className="hover:text-white transition-colors">Documentation</a>
                    <a href="mailto:hackeruchiha928@gmail.com" className="hover:text-white transition-colors">Support</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;