
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, X, CheckCircle2, Zap, CreditCard, Loader2, AlertCircle, LayoutGrid } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { Project, Category } from '../types';
import { useAuth } from '../App';
import { recordOrder, fetchProjects } from '../lib/supabase';

const Explore: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjects();
      const mapped: Project[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        coverImage: item.image_url,
        category: item.category as Category,
        downloadCount: item.downloads,
        developer: { 
          name: item.email.split('@')[0], 
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.email}` 
        },
        email: item.email,
        fileSize: item.file_size,
        tags: [item.category],
        isVerified: true,
        zip_url: item.zip_url 
      }));
      setProjects(mapped);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const categories: (Category | 'All')[] = ['All', 'Frontend', 'Backend', 'Fullstack', 'AI/ML', 'Web3', 'Mobile'];

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
                           p.title.toLowerCase().includes(term) || 
                           p.category.toLowerCase().includes(term);
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, projects]);

  const handleDownloadClick = (project: Project) => {
    setSelectedProject(project);
    setShowCheckout(true);
    setErrorMsg(null);
  };

  const handleConfirmOrder = async () => {
    if (!selectedProject) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      await recordOrder({
        project_id: selectedProject.id,
        project_title: selectedProject.title,
        category: selectedProject.category,
        user_email: user?.email || 'guest@mieltecity.com',
        user_name: user?.name || 'Guest User',
        amount: 0, 
      });
      setIsSuccess(true);
      setTimeout(() => {
        const zipUrl = selectedProject.zip_url;
        if (zipUrl) window.open(zipUrl, '_blank');
        setShowCheckout(false);
        setIsSuccess(false);
        setSelectedProject(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record order.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col gap-6 mb-8 sm:mb-12">
        <div className="relative max-w-2xl mx-auto w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search assets by title or tech..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all text-white shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Fixed Mobile Category Scrolling and Overlap */}
        <div className="relative">
          <div className="flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-0 -mx-4 sm:mx-0 pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-none snap-start px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all border whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20' 
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Fader for mobile scrolling feedback */}
          <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none sm:hidden"></div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                <div key={i} className="glass aspect-square rounded-xl animate-pulse"></div>
            ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-24 text-center">
            <LayoutGrid className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-500">No assets matching your search</h3>
            <button 
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                className="mt-4 text-sky-400 font-bold hover:underline"
            >
                Clear all filters
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={handleDownloadClick} />
            ))}
        </div>
      )}

      {showCheckout && selectedProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => !isProcessing && setShowCheckout(false)}></div>
          <div className="relative glass w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {isSuccess ? (
               <div className="p-16 text-center flex flex-col items-center justify-center gap-6">
                 <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-white">Downloading...</h2>
               </div>
            ) : (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-extrabold text-white">Download Asset</h2>
                  <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                <div className="flex gap-5 mb-8 p-5 bg-white/5 rounded-3xl border border-white/5">
                  <img src={selectedProject.coverImage} className="w-20 h-20 rounded-2xl object-cover shadow-2xl" />
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-white line-clamp-1">{selectedProject.title}</h4>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest">{selectedProject.category}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span className="text-[10px] text-slate-500 font-mono">{selectedProject.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                    <button 
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 active:scale-95 disabled:opacity-50"
                    >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" fill="white" />}
                    Confirm & Download
                    </button>
                    <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">Free Production-Grade Asset</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;