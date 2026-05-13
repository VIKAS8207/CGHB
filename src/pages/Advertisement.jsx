import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Search, Filter, Calendar, 
  Plus, Edit, Trash2, Eye, UploadCloud, X, Save, 
  ChevronLeft, ChevronRight, MoreVertical, Download, Check, Newspaper
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database for Advertisements (Updated with arrays for media and Approved By field)
const initialAds = [
  { id: '1', district: 'Raipur', project: 'Atal Vihar Phase 2', refNo: 'NIT-2026-042', media: ['Print (Local) - Dainik Bhaskar', 'Web Portal - CGHB Site'], date: '2026-05-15', approvedBy: 'Chief Engineer', hasDoc: true },
  { id: '2', district: 'Nava Raipur', project: 'Nava Raipur EWS', refNo: 'NIT-2026-044', media: ['Print (National) - Times of India'], date: '2026-05-02', approvedBy: 'Board Resolution', hasDoc: true },
  { id: '3', district: 'Bastar', project: 'Bastar Villas', refNo: 'NIT-2026-039', media: ['Web Portal - State Procure'], date: '2026-04-28', approvedBy: 'State Govt', hasDoc: true },
];

const Advertisement = () => {
  const { userRole } = useAuth(); // Get role for access control

  const [ads, setAds] = useState(initialAds);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track which 3-dot dropdown is currently open
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Gateway Selection State
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileName, setFileName] = useState('');
  
  // Dynamic Media Addition State
  const [mediaType, setMediaType] = useState('Print (Local)');
  const [firmName, setFirmName] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Streamlined Form Data
  const [formData, setFormData] = useState({
    refNo: '', mediaList: [], date: '', approvedBy: ''
  });

  // Calculate quick stats
  const totalCampaigns = ads.length;
  const printCampaigns = ads.filter(a => a.media.some(m => m.toLowerCase().includes('print'))).length;
  const webCampaigns = ads.filter(a => a.media.some(m => m.toLowerCase().includes('web'))).length;

  // --- ACTIONS ---
  const handleOpenForm = (e) => {
    e.preventDefault();
    if (!selectedDistrict || !selectedProject) return;
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  // Logic to add a single media entry to the dynamic list
  const handleAddMedia = () => {
    if (firmName.trim() === '') return;
    const newEntry = `${mediaType} - ${firmName}`;
    if (!formData.mediaList.includes(newEntry)) {
      setFormData(prev => ({ ...prev, mediaList: [...prev.mediaList, newEntry] }));
    }
    setFirmName(''); // Clear input after adding
  };

  const handleRemoveMedia = (entryToRemove) => {
    setFormData(prev => ({
      ...prev,
      mediaList: prev.mediaList.filter(entry => entry !== entryToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.mediaList.length === 0) {
      alert("Please add at least one media channel.");
      return;
    }

    if (editingId) {
      setAds(ads.map(ad => ad.id === editingId ? { ...ad, refNo: formData.refNo, date: formData.date, approvedBy: formData.approvedBy, media: formData.mediaList } : ad));
      setEditingId(null);
    } else {
      const newAd = {
        id: Date.now().toString(),
        district: selectedDistrict,
        project: selectedProject,
        refNo: formData.refNo,
        date: formData.date,
        approvedBy: formData.approvedBy,
        media: formData.mediaList,
        hasDoc: fileName !== ''
      };
      setAds([newAd, ...ads]);
      setCurrentPage(1);
    }
    
    // Reset Form
    setFormData({ refNo: '', mediaList: [], date: '', approvedBy: '' });
    setFileName('');
    setMediaType('Print (Local)');
    setFirmName('');
    setIsFormOpen(false);
  };

  const handleEdit = (ad) => {
    setEditingId(ad.id);
    setSelectedDistrict(ad.district);
    setSelectedProject(ad.project);
    setFormData({
      refNo: ad.refNo, mediaList: ad.media, date: ad.date, approvedBy: ad.approvedBy
    });
    setFileName('advertisement_copy.pdf'); // Mock existing file
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this advertisement record?")) {
      setAds(ads.filter(ad => ad.id !== id));
    }
  };

  const handleView = (project) => {
    alert(`Opening Advertisement Details for ${project}`);
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- FILTER & PAGINATION ---
  const filteredAds = ads.filter(ad => 
    ad.project.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ad.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.approvedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cghb-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Tender <span className="text-cghb-yellow">Advertisement</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
            {userRole === ROLES.COMMISSIONER 
              ? "View and monitor tender publication campaigns."
              : "Manage and publish approved tenders to public portals and print media."}
          </p>
        </div>
      </div>

      {/* --- KPI DASHBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-cghb-yellow flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Campaigns</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{totalCampaigns}</h3>
          </div>
          <div className="w-12 h-12 bg-cghb-yellow/10 text-cghb-yellow rounded-full flex items-center justify-center">
            <Megaphone size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Print Media Ads</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{printCampaigns}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <Newspaper size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Web Portals Sync</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{webCampaigns}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <UploadCloud size={24} />
          </div>
        </div>
      </div>

      {/* --- GATEWAY: SELECT PROJECT (Hidden for Commissioner) --- */}
      {userRole !== ROLES.COMMISSIONER && !isFormOpen && (
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-cghb-yellow relative overflow-hidden">
          <div className="absolute top-0 right-10 w-64 h-64 bg-cghb-yellow/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-cghb-yellow/10 text-cghb-yellow flex items-center justify-center rounded-lg">
              <Megaphone size={16} />
            </div>
            <h2 className="text-[15px] font-bold text-[var(--color-text-main)]">Advertisement Publication Gateway</h2>
          </div>

          <form onSubmit={handleOpenForm} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end relative z-10">
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">1. Select District</label>
              <select required value={selectedDistrict} onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedProject(''); }} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors font-medium cursor-pointer shadow-sm">
                <option value="" disabled>Choose District...</option>
                <option value="Raipur" className="text-black bg-white">Raipur</option>
                <option value="Bilaspur" className="text-black bg-white">Bilaspur</option>
                <option value="Durg" className="text-black bg-white">Durg</option>
                <option value="Bastar" className="text-black bg-white">Bastar</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">2. Target Project</label>
              <select required value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} disabled={!selectedDistrict} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors font-medium disabled:opacity-50 cursor-pointer shadow-sm">
                <option value="" disabled>{selectedDistrict ? "Select Project..." : "Select District First"}</option>
                {selectedDistrict === 'Raipur' && <><option className="text-black bg-white">Atal Vihar Phase 2</option><option className="text-black bg-white">Nava Raipur EWS</option></>}
                {selectedDistrict === 'Bilaspur' && <option className="text-black bg-white">Bilaspur MIG Heights</option>}
                {selectedDistrict === 'Durg' && <option className="text-black bg-white">Durg Residential</option>}
                {selectedDistrict === 'Bastar' && <option className="text-black bg-white">Bastar Standalone Villas</option>}
              </select>
            </div>
            <div>
              <button type="submit" disabled={!selectedProject} className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black text-[13px] font-bold uppercase tracking-wider h-10 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                Generate Ad Form <Plus size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- FORM ENGINE (Hidden for Commissioner) --- */}
      {userRole !== ROLES.COMMISSIONER && (
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="overflow-hidden w-full"
            >
              <div className={`bg-[var(--color-bg-main)] border p-8 rounded-2xl shadow-lg relative mt-1 ${editingId ? 'border-blue-500/50' : 'border-cghb-border'}`}>
                
                <div className="flex items-center justify-between mb-8 border-b border-cghb-border/50 pb-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${editingId ? 'bg-blue-500 text-white border-blue-600' : 'bg-cghb-yellow/10 text-cghb-yellow border-cghb-yellow/20'}`}>
                      {editingId ? <Edit size={18} /> : <Megaphone size={18} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? 'Update Advertisement Details' : 'Create Advertisement'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">{editingId ? `Campaign for: ${selectedProject}` : `Project: ${selectedProject} | District: ${selectedDistrict}`}</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsFormOpen(false); setEditingId(null); setFileName(''); setFormData({refNo: '', mediaList: [], date: '', approvedBy: ''}) }} className="text-[11px] font-bold text-red-500 uppercase hover:underline flex items-center gap-1">
                    <X size={14} /> Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Row 1: Core Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">NIT Reference</label>
                      <input type="text" required placeholder="e.g., NIT-2026-042" value={formData.refNo} onChange={e => setFormData({...formData, refNo: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Publication Date</label>
                      <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Approved By</label>
                      <input type="text" required placeholder="e.g., State Government, Board Resolution" value={formData.approvedBy} onChange={e => setFormData({...formData, approvedBy: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                  </div>

                  {/* Row 2: Dynamic Media Addition Builder */}
                  <div className="bg-cghb-border/5 border border-cghb-border/50 rounded-xl p-5 shadow-sm">
                    <h3 className="text-[12px] font-bold text-[var(--color-text-main)] uppercase tracking-widest mb-4">Media Channel Builder</h3>
                    
                    {/* Inputs to Add */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Media Type</label>
                        <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm cursor-pointer">
                          <option value="Print (Local)" className="text-black">Print (Local)</option>
                          <option value="Print (National)" className="text-black">Print (National)</option>
                          <option value="Web Portal" className="text-black">Web Portal</option>
                          <option value="E-Procurement" className="text-black">E-Procurement</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Firm / Portal Name</label>
                        <input type="text" placeholder="e.g., Dainik Bhaskar, CGHB Official Site" value={firmName} onChange={e => setFirmName(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddMedia(); } }} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                      </div>
                      <div>
                        <button type="button" onClick={handleAddMedia} disabled={!firmName.trim()} className="w-full flex items-center justify-center gap-2 bg-[var(--color-text-main)] text-[var(--color-bg-main)] text-[12px] font-bold uppercase tracking-wider h-10 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                          Add Media <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Display Selected Media Tags */}
                    {formData.mediaList.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-cghb-border/50">
                        {formData.mediaList.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-cghb-border/10 border border-cghb-border px-3 py-1.5 rounded-md shadow-sm">
                            <span className="text-[12px] font-bold text-[var(--color-text-main)]">{entry}</span>
                            <button type="button" onClick={() => handleRemoveMedia(entry)} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors ml-1">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 3: Document Upload & Submit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Advertisement Document / Image</label>
                      <label className={`w-full h-11 border border-dashed rounded-lg flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all shadow-sm ${fileName ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-cghb-border text-[var(--color-text-muted)] bg-[var(--color-bg-surface)] hover:border-cghb-yellow hover:text-cghb-yellow'}`}>
                        <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                        {fileName ? (
                          <span className="flex items-center gap-2 truncate px-3"><Check size={14} /> {fileName}</span>
                        ) : (
                          <span className="flex items-center gap-2"><UploadCloud size={16} /> Select File</span>
                        )}
                      </label>
                    </div>

                    <div className="flex justify-end pt-4 md:pt-0 border-t border-cghb-border/50 md:border-0 mt-2 md:mt-0">
                      <button type="submit" className={`flex items-center gap-2 text-black text-[13px] font-bold uppercase tracking-wider h-11 px-8 rounded-lg transition-all shadow-md ${editingId ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-cghb-yellow shadow-cghb-yellow/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                        <Save size={16} /> {editingId ? 'Save Changes' : 'Publish Advertisement'}
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* --- TABLE SEARCH CONTROLS --- */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search Project, NIT Ref, or Channel..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- ADVERTISEMENT MASTER TABLE (LOCKED UI) --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full">
          {/* table-fixed prevents horizontal scroll */}
          <table className="w-full table-fixed text-left whitespace-nowrap">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                {/* Total Widths = 100% */}
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[22%]">Project Name</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">NIT Reference</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[24%]">Media Channels</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Date</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Approved By</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[6%] border-l border-cghb-border">Doc</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[6%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentAds.map((ad, index) => (
                  // NO HOVER STYLES HERE
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={ad.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                    <td className="px-3 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                    <td className="px-3 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={ad.project}>{ad.project}</td>
                    <td className="px-3 py-4 font-mono text-[11px] font-bold text-[var(--color-text-main)] truncate" title={ad.refNo}>{ad.refNo}</td>
                    
                    {/* Media Channels rendered as minimal badges inside a truncated container */}
                    <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={ad.media.join(', ')}>
                      <div className="flex gap-1.5 overflow-hidden">
                        {ad.media.map((channel, i) => (
                          <span key={i} className="bg-cghb-border/10 border border-cghb-border/50 px-1.5 py-0.5 rounded truncate max-w-[120px] shrink-0">
                            {channel}
                          </span>
                        ))}
                      </div>
                    </td>
                    
                    <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={ad.date}>
                      <span className="flex items-center gap-1"><Calendar size={10} className="text-[var(--color-text-muted)] shrink-0"/>{ad.date}</span>
                    </td>
                    
                    <td className="px-3 py-4 text-[11px] font-bold text-[var(--color-text-main)] truncate" title={ad.approvedBy}>{ad.approvedBy}</td>

                    <td className="px-3 py-4 text-center border-l border-cghb-border/50">
                      {ad.hasDoc 
                        ? <button className="mx-auto flex items-center justify-center text-[var(--color-text-muted)] hover:text-cghb-yellow transition-colors" title="Download Document"><Download size={16} strokeWidth={2.5}/></button> 
                        : <span className="text-[var(--color-text-muted)]/30">-</span>}
                    </td>

                    {/* Actions: 3 Dots Dropdown */}
                    <td className="px-3 py-4 text-center relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveDropdown(activeDropdown === ad.id ? null : ad.id);
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === ad.id && (
                        <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                          <button onClick={() => { handleView(ad.project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                            <Eye size={14} /> View Ad
                          </button>
                          {userRole !== ROLES.COMMISSIONER && (
                            <>
                              <button onClick={() => { handleEdit(ad); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => { handleDelete(ad.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10">
                                <Trash2 size={14} /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {currentAds.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <Megaphone size={32} className="text-[var(--color-text-muted)]/30" />
              No campaigns found matching the criteria.
            </div>
          )}
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredAds.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAds.length)}</strong> of <strong className="text-[var(--color-text-main)]">{filteredAds.length}</strong>
          </span>
          <div className="flex gap-1.5">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20">
              <ChevronLeft size={14} />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx} onClick={() => paginate(idx + 1)} className={`h-8 w-8 flex items-center justify-center rounded-md text-[12px] font-bold transition-all ${currentPage === idx + 1 ? 'bg-cghb-yellow text-black shadow-sm' : 'border border-cghb-border text-[var(--color-text-main)] hover:bg-cghb-border/10'}`}>
                {idx + 1}
              </button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Advertisement;
