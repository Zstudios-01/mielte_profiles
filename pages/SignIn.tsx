
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, CheckCircle2, Loader2, AlertCircle, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../App';
import { signInWithEmail, signUpWithEmail } from '../lib/supabase';

const SignIn: React.FC = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/upload');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await signIn();
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        setSuccessMsg('Check your email! Verification link sent.');
        setEmail('');
        setPassword('');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md glass p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/20 mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 text-sm">
            Access production-grade code snippets instantly.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm animate-in slide-in-from-top-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <p>{successMsg}</p>
          </div>
        )}

        <div className="space-y-6">
          <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-3 bg-white text-slate-950 py-3.5 px-6 rounded-2xl font-bold text-base hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              className="w-5 h-5" 
              alt="Google Logo" 
            />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 text-slate-600 my-2">
            <div className="h-[1px] flex-grow bg-white/10"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">or use email</span>
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-sky-500/10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-slate-400 hover:text-sky-400 transition-colors font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        <div className="mt-8 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-200/70 leading-relaxed font-medium">
            New users must verify their email unless "Confirm Email" is disabled in Supabase Dashboard.
          </p>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
          Secure authentication powered by <br />
          <span className="text-slate-400 font-bold">Supabase Auth Protocol</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
