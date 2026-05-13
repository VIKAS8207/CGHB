import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Calendar, Camera, UploadCloud, 
  Save, Check, Image as ImageIcon, Search, Filter,
  ChevronLeft, ChevronRight, MapPin, Clock, X, AlertCircle
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database for Project Details
const mockProjects = [
  { id: 'PRJ-1042', name: 'Atal Vihar Phase 2', districtName: 'Raipur', scheme: 'Atal Vihar Yojana' },
  { id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', districtName: 'Raipur', scheme: 'EWS Housing' },
  { id: 'PRJ-1044', name: 'Bilaspur MIG Heights', districtName: 'Bilaspur', scheme: 'MIG Housing Dev' },
  { id: 'PRJ-1045', name: 'Bastar Standalone Villas', districtName: 'Bastar', scheme: 'Standalone' },
  { id: 'PRJ-1046', name: 'Durg Residential Complex', districtName: 'Durg', scheme: 'LIG Housing' },
];

const initialUpdates = [
  { id: 'UPD-001', projectId: 'PRJ-1042', date: '10 May 2026', time: '14:30', description: 'Foundation laying completed for Block A. Excavation for Block B has started.', image: 'foundation.jpg', reporter: 'Vikram Singh' },
  { id: 'UPD-002', projectId: 'PRJ-1042', date: '03 May 2026', time: '09:15', description: 'Site cleared and leveled. Raw materials for foundation arrived.', image: 'site_clear.jpg', reporter: 'Vikram Singh' },
];

const WeeklyUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole, user } = useAuth();

  const activeProject = mockProjects.find(p => p.id === id) || mockProjects[0];

  const [updates, setUpdates] = useState(initialUpdates.filter(u => u.projectId === activeProject.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const optionsDate = { day: '2-digit', month: 'short', year: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
      setCurrentDateTime({
        date: now.toLocaleDateString('en-GB', optionsDate),
        time: now.toLocaleTimeString('en-GB', optionsTime)
      });
    };
    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleBack = () => navigate(-1);

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !imageFile) return;

    const newUpdate = {
      id: `UPD-${Date.now()}`,
      projectId: activeProject.id,
      date: currentDateTime.date,
      time: currentDateTime.time,
      description: description,
      image: imageFile.name,
      reporter: user?.name || 'Authorized Personnel'
    };

    setUpdates([newUpdate, ...updates]);
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setCurrentPage(1);
  };

  const filteredUpdates = updates.filter(update => 
    update.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    update.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.reporter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUpdates = filteredUpdates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // FIX: Determine how many columns to use based on the user role
  const isCommissioner = userRole === ROLES.COMMISSIONER;

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
        <button 
          onClick={handleBack}
          className="p-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"
        >
          <ArrowLeft size={16}/>
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Weekly <span className="text-cghb-yellow">Update</span>
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
            <Building2 size={14}/> {activeProject.name} <span className="opacity-50">|</span> <MapPin size={12} className="text-cghb-yellow"/> {activeProject.districtName}
          </p>
        </div>
      </div>

      {/* DYNAMIC GRID: lg:grid-cols-3 for Engineers (with form), lg:grid-cols-1 for Commissioner (full width list) */}
      <div className={`grid grid-cols-1 ${isCommissioner ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6 items-start`}>
        
        {/* LEFT COLUMN: UPLOAD FORM (Only visible to non-commissioners) */}
        {!isCommissioner && (
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border-t-4 border-t-cghb-yellow shadow-lg sticky top-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-cghb-border/50">
              <h2 className="text-[14px] font-bold text-[var(--color-text-main)] flex items-center gap-2">
                <Camera size={16} className="text-cghb-yellow"/> Log Site Progress
              </h2>
              <div className="text-right">
                <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{currentDateTime.date}</div>
                <div className="text-[14px] font-black text-[var(--color-text-main)] font-mono">{currentDateTime.time}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Site Photograph</label>
                <div onClick={handleImageClick} className={`w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${imagePreview ? 'border-emerald-500/50 bg-black/20' : 'border-cghb-border bg-[var(--color-bg-surface)] hover:border-cghb-yellow hover:bg-cghb-border/10'}`}>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                  <AnimatePresence>
                    {imagePreview ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                        <img src={imagePreview} alt="Site Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                          <Camera size={24} className="mb-2"/>
                          <span className="text-[12px] font-bold uppercase tracking-wider">Retake Photo</span>
                        </div>
                        <button type="button" onClick={clearImage} className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors">
                          <X size={14}/>
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[var(--color-text-muted)] group-hover:text-cghb-yellow transition-colors">
                        <Camera size={32} className="mb-3"/>
                        <span className="text-[12px] font-bold uppercase tracking-wider">Tap to open Camera</span>
                        <span className="text-[10px] opacity-70 mt-1">or select from gallery</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Progress Description</label>
                <textarea required rows="4" placeholder="Describe the structural progress..." value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-xl p-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm resize-none" />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={!imageFile || !description.trim()} className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black text-[13px] font-bold uppercase tracking-wider h-11 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save size={16}/> Record Progress
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RIGHT COLUMN / FULL WIDTH COLUMN: TIMELINE LIST */}
        <div className={`${isCommissioner ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-4`}>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14}/>
              <input type="text" placeholder="Search logs..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
            </div>
            <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
              <Filter size={14}/> Filter logs
            </button>
          </div>

          <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
            <div className="w-full">
              <table className="w-full table-fixed text-left whitespace-nowrap">
                <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
                  <tr>
                    <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                    <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Timestamp</th>
                    <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[40%]">Progress Description</th>
                    <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Reporter</th>
                    <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[20%] border-l border-cghb-border">Attached Media</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cghb-border">
                  <AnimatePresence>
                    {currentUpdates.map((update, index) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={update.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                        <td className="px-4 py-4 text-center text-[12px] font-bold text-[var(--color-text-muted)] truncate">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-1.5 truncate"><Calendar size={12} className="text-cghb-yellow"/> {update.date}</div>
                          <div className="text-[11px] font-mono text-[var(--color-text-muted)] flex items-center gap-1.5 mt-0.5 truncate"><Clock size={10}/> {update.time}</div>
                        </td>
                        <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={update.description}>{update.description}</td>
                        <td className="px-4 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate">{update.reporter}</td>
                        <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                          <button className="mx-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-cghb-border/10 border border-cghb-border rounded-md text-[11px] font-bold text-[var(--color-text-main)] hover:bg-cghb-yellow hover:text-black transition-all">
                            <ImageIcon size={14}/> View Image
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {currentUpdates.length === 0 && (
                <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
                  <AlertCircle size={32} className="text-[var(--color-text-muted)]/30"/>
                  No progress updates found.
                </div>
              )}
            </div>
            <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
              <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
                Viewing <strong>{filteredUpdates.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUpdates.length)}</strong> of <strong>{filteredUpdates.length}</strong>
              </span>
              <div className="flex gap-1.5">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20">
                  <ChevronLeft size={14}/>
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button key={idx} onClick={() => paginate(idx + 1)} className={`h-8 w-8 flex items-center justify-center rounded-md text-[12px] font-bold transition-all ${currentPage === idx + 1 ? 'bg-cghb-yellow text-black' : 'border border-cghb-border text-[var(--color-text-main)] hover:bg-cghb-border/10'}`}>
                    {idx + 1}
                  </button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20">
                  <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyUpdate;