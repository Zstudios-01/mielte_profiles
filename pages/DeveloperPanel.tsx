
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  LayoutGrid, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  ChevronRight,
  Database,
  Coins,
  BadgeCheck,
  X,
  Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { fetchProjects, deleteProject } from '../lib/supabase';
import { Project, Category } from '../types';

const DeveloperPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Custom UI State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUserProjects = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await fetchProjects();
      const userProjects = data
        .filter((item: any) => item.email.toLowerCase() === user.email.toLowerCase())
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          coverImage: item.image_url,
          category: item.category as Category,
          downloadCount: item.downloads,
          developer: { name: item.email.split('@')[0], avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.email}` },
          email: item.email,
          fileSize: item.file_size,
          tags: [item.category],
          isVerified: true,
          zip_url: item.zip_url 
        }));
      setProjects(userProjects);
    } catch (err) {
      console.error("Load projects error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) navigate('/signin');
    else loadUserProjects();
  }, [user]);

  const executeDelete = async () => {
    if (!user || !confirmDeleteId) return;

    const projectId = confirmDeleteId;
    setConfirmDeleteId(null);
    setIsDeleting(projectId);
    
    try {
      await deleteProject(projectId, user.email);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      showToast("Project removed from database successfully.");
    } catch (err: any) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      
      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="text-sm font-bold">{toast.message}</span>
            <button onClick={() => setToast(null)}><X className="w-4 h-4 ml-2 opacity-50 hover:opacity-100" /></button>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)}></div>
          <div className="relative glass w-full max-w-sm p-8 rounded-[2rem] border-white/10 shadow-2xl animate-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Project?</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              This action will permanently remove the source code from MielteCity public explore.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="py-3.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="py-3.5 bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20">
            <Shield className="w-6 h-6 text-sky-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Dev Dashboard</h1>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link to="/upload" className="w-full sm:w-auto bg-sky-500 px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 active:scale-95">
            <Plus className="w-4 h-4" /> New Upload
          </Link>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-white/5 shadow-2xl mb-12">
        <div className="p-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Active Projects</h3>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold">{projects.length} Total</span>
        </div>
        
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Fetching entries...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-24 text-center">
             <LayoutGrid className="w-12 h-12 text-slate-800 mx-auto mb-4" />
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No active projects found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {projects.map(p => (
              <div key={p.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-white/2 transition-colors group">
                <img src={p.coverImage} className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-xl" />
                <div className="flex-grow text-center sm:text-left">
                  <h4 className="font-bold text-white text-lg mb-1">{p.title}</h4>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="bg-white/5 px-2 py-1 rounded text-slate-400">{p.category}</span>
                    <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> {p.downloadCount}</span>
                    <span className="font-mono">{p.fileSize}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={p.zip_url} target="_blank" className="p-3.5 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:border-white/10 transition-all"><ExternalLink className="w-5 h-5" /></a>
                  <button 
                    onClick={() => setConfirmDeleteId(p.id)} 
                    disabled={isDeleting === p.id}
                    className="p-3.5 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10 active:scale-90"
                  >
                    {isDeleting === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monetization Section */}
      <Link 
        to="/monetization" 
        className="block glass p-8 sm:p-10 rounded-[2.5rem] border-sky-500/20 hover:border-sky-500/40 transition-all group overflow-hidden relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coins className="w-40 h-40" />
        </div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-sky-500/10 rounded-[2rem] flex items-center justify-center border border-sky-500/20 shrink-0">
                <Coins className="w-10 h-10 text-sky-500" />
            </div>
            <div className="flex-grow text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-white mb-2">Monetization & Seller Hub</h3>
                <p className="text-slate-400 text-sm max-w-xl">
                    Turn your code into a revenue stream. Complete the verification requirements to start selling your premium assets and earning 90% of every sale.
                </p>
            </div>
            <div className="bg-white text-slate-950 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 group-hover:bg-sky-400 group-hover:text-white transition-all active:scale-95">
                Check Eligibility
                <ChevronRight className="w-5 h-5" />
            </div>
        </div>
      </Link>
    </div>
  );
};

export default DeveloperPanel;
