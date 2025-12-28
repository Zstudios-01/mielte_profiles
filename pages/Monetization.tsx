
import React from 'react';
import { 
  ArrowLeft, 
  Coins, 
  BadgeCheck, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const Monetization: React.FC = () => {
  const { user } = useAuth();

  // Mock stats for requirements
  const monthlyDownloads = 12; // Example
  const targetDownloads = 50;
  const progressPercent = Math.min((monthlyDownloads / targetDownloads) * 100, 100);

  const requirements = [
    {
      icon: <Download className="w-5 h-5 text-sky-400" />,
      title: "Popularity Requirement",
      desc: `Min. ${targetDownloads} new downloads per month across your projects.`,
      status: monthlyDownloads >= targetDownloads ? "Completed" : `${monthlyDownloads}/${targetDownloads}`,
      isDone: monthlyDownloads >= targetDownloads
    },
    {
      icon: <BadgeCheck className="w-5 h-5 text-purple-400" />,
      title: "Identity Verification",
      desc: "Complete the KYC process with a valid Developer ID.",
      status: "Pending",
      isDone: false
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Code Quality Audit",
      desc: "Maintain a zero-security-warning history for at least 3 months.",
      status: "Evaluating",
      isDone: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/developer-panel" className="p-3 rounded-xl glass hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Seller Verification</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Monetization Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 rounded-3xl border-white/5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Revenue Share</div>
            <div className="text-3xl font-extrabold text-white">90%</div>
            <div className="text-[10px] text-emerald-500 font-bold mt-1">To Developer</div>
        </div>
        <div className="glass p-6 rounded-3xl border-white/5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Withdrawal Limit</div>
            <div className="text-3xl font-extrabold text-white">$50.00</div>
            <div className="text-[10px] text-slate-500 font-bold mt-1">Minimum Payout</div>
        </div>
        <div className="glass p-6 rounded-3xl border-white/5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Status</div>
            <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xl">
                <Zap className="w-5 h-5" fill="currentColor" />
                Unverified
            </div>
            <div className="text-[10px] text-slate-500 font-bold mt-1">Standard User</div>
        </div>
      </div>

      <div className="glass p-8 sm:p-12 rounded-[3rem] border-white/5 relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12">
            <Coins className="w-64 h-64" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-white mb-4">Progression Tracker</h2>
        <p className="text-slate-400 text-sm mb-10 max-w-lg">
            Complete the milestones below to unlock the ability to put price tags on your premium source code assets.
        </p>

        <div className="space-y-8">
            {requirements.map((req, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {req.icon}
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-white">{req.title}</h4>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                req.isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'
                            }`}>
                                {req.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{req.desc}</p>
                        
                        {idx === 0 && (
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-gradient-to-right from-sky-500 to-indigo-500 transition-all duration-1000"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-sky-500 text-white text-center">
        <Lock className="w-10 h-10 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-extrabold mb-2">Request Early Access</h3>
        <p className="text-sky-100 text-sm mb-8 max-w-md mx-auto">
            High-quality creators can skip the download requirement by submitting a professional portfolio for manual review.
        </p>
        <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold hover:bg-sky-50 transition-all shadow-2xl shadow-sky-950/20 active:scale-95">
            Submit Portfolio
        </button>
      </div>
    </div>
  );
};

export default Monetization;
