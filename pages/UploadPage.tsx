
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  FileCode, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  FileArchive,
  ArrowLeft,
  Lock,
  Loader2,
  Terminal,
  Copy,
  Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { useAuth } from '../App';
import { uploadToStorage, saveProjectToDatabase } from '../lib/supabase';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<{message: string, isRls: boolean} | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend' as Category,
    readme: '',
    envExample: '',
  });

  const [files, setFiles] = useState<{
    image: File | null;
    zip: File | null;
  }>({
    image: null,
    zip: null
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePublish = async () => {
    if (!user || !files.image || !files.zip) {
      setUploadError({ message: "Missing required files or user session.", isRls: false });
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const sizeInKB = (files.zip.size / 1024).toFixed(2) + " KB";

      // 1. Upload Assets
      const imageUrl = await uploadToStorage('project-images', files.image);
      const zipUrl = await uploadToStorage('project-zips', files.zip);

      // 2. Save Metadata
      await saveProjectToDatabase({
        title: formData.title,
        description: formData.description,
        email: user.email.toLowerCase(),
        category: formData.category,
        image_url: imageUrl,
        zip_url: zipUrl,
        downloads: 0,
        file_size: sizeInKB
      });

      setStep(3);
    } catch (err: any) {
      console.error("Full Upload Error:", err);
      const isRls = err.message?.toLowerCase().includes('row-level security') || err.code === '42501';
      setUploadError({ 
        message: err.message || "Something went wrong during the upload.", 
        isRls 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const categories: Category[] = ['Frontend', 'Backend', 'Fullstack', 'AI/ML', 'Web3', 'Mobile'];

  const copySql = () => {
    const sql = `ALTER TABLE dev_uploads ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow All Select" ON dev_uploads FOR SELECT USING (true);\nCREATE POLICY "Allow Auth Insert" ON dev_uploads FOR INSERT WITH CHECK (true);\nCREATE POLICY "Owners can delete" ON public.dev_uploads FOR DELETE USING ( (select auth.jwt() ->> 'email') = email );`;
    navigator.clipboard.writeText(sql);
    showToast("SQL Fixed Policy Copied!");
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
          <Lock className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-4xl font-extrabold mb-4">Developers Only</h2>
        <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto">
          To maintain high-quality production code, only signed-in developers can upload projects.
        </p>
        <Link 
          to="/signin" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-bold text-lg shadow-xl shadow-sky-500/20 transition-all"
        >
          Sign In Now
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center animate-in slide-in-from-bottom-8 duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-4xl font-extrabold mb-4 text-white tracking-tight">Project Published!</h2>
        <p className="text-slate-400 text-lg mb-12">
          Your code is now live and available for other developers to use.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/explore" className="w-full sm:w-auto px-10 py-4 bg-sky-500 text-white rounded-2xl font-bold transition-all hover:bg-sky-400 shadow-xl shadow-sky-500/20">
            View on Explore
          </Link>
          <button 
            onClick={() => { setStep(1); setFiles({ image: null, zip: null }); setUploadError(null); }}
            className="w-full sm:w-auto px-10 py-4 glass text-white rounded-2xl font-bold transition-all hover:bg-white/5"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in duration-700 relative">
      
      {/* Custom Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4">
          <div className="bg-sky-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm">
            <Bell className="w-4 h-4" />
            {toast}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-2.5 rounded-xl glass hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Publish Asset</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Contributor Workspace</p>
        </div>
      </div>

      {uploadError && (
        <div className={`mb-12 p-8 rounded-[2rem] border ${uploadError.isRls ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-start gap-6">
            <div className={`p-3 rounded-2xl ${uploadError.isRls ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                <AlertCircle className={`w-6 h-6 shrink-0 ${uploadError.isRls ? 'text-amber-500' : 'text-red-500'}`} />
            </div>
            <div className="space-y-4 flex-grow">
              <h4 className={`text-xl font-bold ${uploadError.isRls ? 'text-amber-200' : 'text-red-200'}`}>
                {uploadError.isRls ? 'Policy Collision Detected' : 'Transmission Failure'}
              </h4>
              <p className={`text-sm leading-relaxed ${uploadError.isRls ? 'text-amber-200/50' : 'text-red-200/50'}`}>
                {uploadError.isRls 
                  ? "Supabase RLS is blocking the operation. You must update the policies in the SQL Editor to allow metadata insertion." 
                  : uploadError.message}
              </p>
              
              {uploadError.isRls && (
                <div className="space-y-4 pt-2">
                  <div className="bg-slate-950/80 rounded-2xl p-6 font-mono text-[10px] text-emerald-400 border border-emerald-500/10 relative group">
                    <button 
                      onClick={copySql}
                      className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-emerald-500" />
                    </button>
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {`ALTER TABLE dev_uploads ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Allow All Select" ON dev_uploads FOR SELECT USING (true);\nCREATE POLICY "Allow Auth Insert" ON dev_uploads FOR INSERT WITH CHECK (true);\nCREATE POLICY "Owners can delete" ON public.dev_uploads FOR DELETE USING ( (select auth.jwt() ->> 'email') = email );`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Progress Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {[
            { n: 1, t: 'Project Details', d: 'Basic info & categorization' },
            { n: 2, t: 'Source Code', d: 'Visuals & ZIP archive' }
          ].map(s => (
            <div 
              key={s.n}
              className={`p-6 rounded-3xl border transition-all ${
                step === s.n ? 'bg-sky-500/10 border-sky-500/30 shadow-2xl shadow-sky-500/5' : 'bg-white/2 border-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                  step === s.n ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {s.n}
                </span>
                <span className={`font-bold tracking-tight ${step === s.n ? 'text-white' : 'text-slate-500'}`}>{s.t}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.d}</p>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-8">
          {step === 1 && (
            <div className="glass p-10 rounded-[2.5rem] space-y-8 animate-in slide-in-from-right-8 duration-500 border-white/5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Project Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Modern Dashboard UI"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all font-medium"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Brief Description</label>
                <textarea 
                  rows={4}
                  placeholder="Explain what this code does and how to use it."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all resize-none font-medium leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories.map(c => (
                          <button
                            key={c}
                            onClick={() => setFormData({...formData, category: c})}
                            className={`p-4 rounded-xl text-xs font-bold border transition-all ${
                                formData.category === c 
                                ? 'bg-sky-500/10 border-sky-500/40 text-sky-400' 
                                : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                            }`}
                          >
                              {c}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.description}
                  className="w-full py-5 bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-sky-500/20 active:scale-[0.98]"
                >
                  Continue to Upload
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              {/* Image Upload */}
              <div className="glass p-10 rounded-[2.5rem] border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-sky-400" />
                  Cover Preview
                </h3>
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-500/30 hover:bg-sky-500/5 transition-all group overflow-hidden relative shadow-inner"
                >
                  {files.image ? (
                    <>
                      <img src={URL.createObjectURL(files.image)} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <Upload className="w-8 h-8 text-white" />
                        <p className="text-white text-sm font-bold">Replace Cover</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Select Screenshot</p>
                      <p className="text-[10px] text-slate-700 mt-2 font-mono">16:9 Aspect Ratio Recommended</p>
                    </>
                  )}
                  <input 
                    ref={imageInputRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => setFiles({...files, image: e.target.files?.[0] || null})}
                  />
                </div>
              </div>

              {/* ZIP Upload */}
              <div className="glass p-10 rounded-[2.5rem] border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <FileArchive className="w-6 h-6 text-purple-400" />
                  Source Code
                </h3>
                <div 
                  onClick={() => zipInputRef.current?.click()}
                  className="p-10 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
                >
                  {files.zip ? (
                    <div className="flex items-center gap-6 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20 w-full animate-in zoom-in">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <FileArchive className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-base font-bold text-white truncate">{files.zip.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{(files.zip.size / (1024 * 1024)).toFixed(2)} MB ARCHIVE</p>
                      </div>
                      <button 
                        className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setFiles({...files, zip: null}) }}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileCode className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-center">Click to Drop .ZIP Folder</p>
                      <p className="text-[10px] text-slate-700 mt-2 font-mono">Full Production Source Required</p>
                    </>
                  )}
                  <input 
                    ref={zipInputRef} 
                    type="file" 
                    accept=".zip" 
                    className="hidden" 
                    onChange={e => setFiles({...files, zip: e.target.files?.[0] || null})}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setStep(1)}
                  disabled={isUploading}
                  className="flex-1 py-5 glass text-white rounded-2xl font-bold transition-all hover:bg-white/10 flex items-center justify-center"
                >
                  Back to Details
                </button>
                <button 
                  onClick={handlePublish}
                  disabled={!files.image || !files.zip || isUploading}
                  className="flex-[2] py-5 bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-sky-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" />
                  )}
                  {isUploading ? 'Securing Content...' : 'Finalize & Publish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
