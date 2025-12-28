
import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Zap, ShieldCheck, LayoutGrid, ChevronRight, Code2, Rocket, Globe } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="px-6">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto pt-16 sm:pt-24 pb-24 sm:pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-8">
          <Zap className="w-3 h-3" fill="currentColor" />
          The Ultimate Code Repository
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Don’t just learn code, <br />
          <span className="gradient-text">make it work.</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop wasting hours on long tutorials. Download production-ready source code, components, and logic snippets that you can drop into your project immediately.
        </p>
        
        <div className="flex justify-center">
          <Link 
            to="/explore" 
            className="w-full sm:w-auto px-10 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-extrabold text-lg shadow-2xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            Start Exploring
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="glass p-8 rounded-3xl border-white/5">
            <ShieldCheck className="w-8 h-8 text-sky-400 mb-6" />
            <h3 className="text-xl font-bold mb-3 text-white">Clean Architecture</h3>
            <p className="text-slate-400 text-sm leading-relaxed">We enforce strict folder structures and naming conventions so you don't inherit technical debt.</p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5">
            <Rocket className="w-8 h-8 text-purple-400 mb-6" />
            <h3 className="text-xl font-bold mb-3 text-white">Rapid Prototyping</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Build complex features in minutes, not days. Focus on your unique product value, not boilerplate.</p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5">
            <Globe className="w-8 h-8 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold mb-3 text-white">Developer Driven</h3>
            <p className="text-slate-400 text-sm leading-relaxed">A platform built for engineers who value time over endless learning cycles. Utility first.</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto py-20 text-center border-t border-white/5">
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-sky-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Efficiency Over Everything</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              MielteCity was founded on a simple realization: the internet is full of "How-To" guides, but short on "Here-It-Is" assets. We bridge that gap by providing a curated marketplace of functional code blocks.
            </p>
            <div className="flex gap-8 sm:gap-16">
                <div className="text-center">
                    <div className="text-3xl font-extrabold text-white mb-1">98%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Time Saved</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-extrabold text-white mb-1">2.4k+</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Projects</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-extrabold text-white mb-1">0ms</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Latency</div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;