import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSignature, Search, Filter, Calendar, MapPin, 
  Plus, Edit, Trash2, Eye, UploadCloud, X, Save, 
  ChevronLeft, ChevronRight, MoreVertical, Download, Check, AlertCircle,
  ArrowLeft, LayoutList, FileText
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database for NITs (Updated id 2 to hasDoc: false to show the Orange badge)
const initialNits = [
  { 
    id: '1', refNo: 'CGHB/RPR/26/042', description: 'Construction of 50 LIG Houses at Phase 2', 
    location: 'Raipur', lastDate: '2026-05-20', openingDate: '2026-05-22', awardDate: '2026-06-05', approvedBy: 'Chief Engineer', hasDoc: true 
  },
  { 
    id: '2', refNo: 'CGHB/BSP/26/089', description: 'MIG Heights Boundary Wall Construction', 
    location: 'Bilaspur', lastDate: '2026-05-25', openingDate: '2026-05-27', awardDate: '2026-06-10', approvedBy: 'Board Resolution', hasDoc: false 
  },
  { 
    id: '3', refNo: 'SUDA/RPR/26/011', description: 'Nava Raipur EWS Water Supply Pipeline', 
    location: 'Nava Raipur', lastDate: '2026-05-30', openingDate: '2026-06-01', awardDate: '2026-06-15', approvedBy: 'State Govt', hasDoc: true 
  },
];

const NitApproval = () => {
  const { userRole } = useAuth(); // Get role for access control

  const [nits, setNits] = useState(initialNits);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track which 3-dot dropdown is currently open (Stores object with id and coordinates)
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // View Details State
  const [viewingNit, setViewingNit] = useState(null);

  // Gateway Selection State
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileName, setFileName] = useState(''); // Tracks the uploaded file name
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Streamlined Form Data
  const [formData, setFormData] = useState({
    refNo: '', description: '', location: '', 
    lastDate: '', openingDate: '', awardDate: '', approvedBy: ''
  });

  // --- ACTIONS ---
  const handleOpenForm = (e) => {
    e.preventDefault();
    if (!selectedDistrict || !selectedProject) return;
    
    // Auto-fill location based on gateway selection
    setFormData(prev => ({ ...prev, location: selectedDistrict }));
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setNits(nits.map(n => n.id === editingId ? { ...n, ...formData, hasDoc: fileName !== '' || n.hasDoc } : n));
      setEditingId(null);
    } else {
      const newNit = {
        id: Date.now().toString(),
        ...formData,
        hasDoc: fileName !== '' 
      };
      setNits([newNit, ...nits]);
      setCurrentPage(1);
    }
    
    // Reset Form
    setFormData({ refNo: '', description: '', location: '', lastDate: '', openingDate: '', awardDate: '', approvedBy: '' });
    setFileName('');
    setIsFormOpen(false);
  };

  const handleEdit = (nit) => {
    setEditingId(nit.id);
    setFormData({
      refNo: nit.refNo, description: nit.description, location: nit.location, 
      lastDate: nit.lastDate, openingDate: nit.openingDate, awardDate: nit.awardDate, approvedBy: nit.approvedBy
    });
    setFileName(nit.hasDoc ? 'existing_document.pdf' : ''); // Mock existing document if present
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this NIT?")) {
      setNits(nits.filter(n => n.id !== id));
    }
  };

  const handleView = (nit) => {
    setViewingNit(nit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setViewingNit(null);
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleClickOutside, true); 
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleClickOutside, true);
    };
  }, []);

  // --- FILTER & PAGINATION ---
  const filteredNits = nits.filter(nit => 
    nit.refNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    nit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nit.approvedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNits = filteredNits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNits.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // ============================================================================
  // VIEW 2: PROFILE/DETAILS PAGE
  // ============================================================================
  if (viewingNit) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">NIT <span className="text-cghb-yellow">Details</span></h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <LayoutList size={14} className="text-cghb-yellow" /> Tender Ref: {viewingNit.refNo} <span className="opacity-50">|</span> Location: {viewingNit.location}
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-xl border border-cghb-border shadow-sm space-y-10">
          <div>
            <h3 className="text-[12px] font-black text-cghb-yellow uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">1. Core Tender Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-4">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Work Description</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingNit.description}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">NIT Reference No.</span>
                <span className="block text-[15px] font-mono font-black text-[var(--color-text-main)]">{viewingNit.refNo}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Location / District</span>
                <span className="block text-[15px] font-bold text-[var(--color-text-main)]">{viewingNit.location}</span>
              </div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Last Submission Date</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingNit.lastDate}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Bid Opening Date</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingNit.openingDate}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Estimated Award Date</span><span className="block text-[14px] font-medium text-orange-500">{viewingNit.awardDate}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Approved By</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingNit.approvedBy}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-black text-emerald-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">2. Official Document Attached</h3>
            <div className="grid grid-cols-1 gap-4">
              {viewingNit.hasDoc ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--color-bg-main)] border border-cghb-border/50 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-lg shrink-0"><FileText size={18}/></div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--color-text-main)]">NIT_Document_Copy.pdf</h4>
                      <p className="text-[12px] text-[var(--color-text-muted)]">Official published NIT document</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[12px] font-bold text-[var(--color-text-main)] hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm">
                    <Download size={14}/> Download
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-600 text-[13px] font-bold flex items-center gap-2">
                  <AlertCircle size={16}/> No document has been uploaded for this NIT yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 1: MAIN DASHBOARD & DIRECTORY
  // ============================================================================
  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cghb-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Notice Inviting <span className="text-cghb-yellow">Tender (NIT)</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
            {userRole === ROLES.COMMISSIONER 
              ? "View and monitor published Notice Inviting Tenders across all districts."
              : "Generate, upload, and manage Notice Inviting Tenders for approved projects."}
          </p>
        </div>
      </div>

      {/* --- MASSIVE NIT FORM (Hidden for Commissioner) --- */}
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
                      {editingId ? <Edit size={18} /> : <FileSignature size={18} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? 'Update NIT Details' : 'Generate Notice Inviting Tender'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">{editingId ? `Ref: ${formData.refNo}` : `Project: ${selectedProject}`}</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsFormOpen(false); setEditingId(null); setFileName(''); }} className="text-[11px] font-bold text-red-500 uppercase hover:underline flex items-center gap-1">
                    <X size={14} /> Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Tender Ref. Number</label>
                      <input type="text" required placeholder="e.g., CGHB/RPR/26/042" value={formData.refNo} onChange={e => setFormData({...formData, refNo: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Location</label>
                      <input type="text" required placeholder="e.g., Raipur" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Approved By</label>
                      <input type="text" required placeholder="e.g., Chief Engineer" value={formData.approvedBy} onChange={e => setFormData({...formData, approvedBy: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Work Description</label>
                      <input type="text" required placeholder="e.g., Construction of 50 LIG Houses" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                  </div>

                  {/* Row 3: Dates & Functional File Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Last Submission Date</label>
                      <input type="date" required value={formData.lastDate} onChange={e => setFormData({...formData, lastDate: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Bid Opening Date</label>
                      <input type="date" required value={formData.openingDate} onChange={e => setFormData({...formData, openingDate: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Est. Award Date</label>
                      <input type="date" required value={formData.awardDate} onChange={e => setFormData({...formData, awardDate: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    
                    {/* Functional Document Upload */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Final NIT Document</label>
                      <label className={`w-full h-11 border border-dashed rounded-lg flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all shadow-sm ${fileName ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-cghb-border text-[var(--color-text-muted)] bg-[var(--color-bg-surface)] hover:border-cghb-yellow hover:text-cghb-yellow'}`}>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        {fileName ? (
                          <span className="flex items-center gap-2 truncate px-3"><Check size={14} /> {fileName}</span>
                        ) : (
                          <span className="flex items-center gap-2"><UploadCloud size={16} /> Select PDF</span>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-cghb-border/50 mt-2">
                    <button type="submit" className={`flex items-center gap-2 text-black text-[13px] font-bold uppercase tracking-wider h-11 px-8 rounded-lg transition-all shadow-md ${editingId ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-cghb-yellow shadow-cghb-yellow/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                      <Save size={16} /> {editingId ? 'Save Changes' : 'Publish NIT'}
                    </button>
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
          <input type="text" placeholder="Search Ref No, Work Description, Location..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
        {/* NEW: Standalone Add NIT button when form is closed */}
        {userRole !== ROLES.COMMISSIONER && !isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 h-10 px-5 bg-cghb-yellow text-black rounded-lg text-[13px] font-bold shadow-md hover:scale-105 transition-all"
          >
            <Plus size={14} /> Add NIT
          </button>
        )}
      </div>

      {/* --- NIT MASTER TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden relative">
        <div className="w-full overflow-x-auto">
          {/* table-fixed explicitly prevents horizontal scrolling */}
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1300px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                {/* Total Widths = 100% */}
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">S.No</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[14%]">Tender Ref No.</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[22%]">Work Description</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Location</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Last Date</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Bid Opening</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Award Date</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Approved By</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[14%]">Document Status</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[6%] border-l border-cghb-border">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentNits.length === 0 ? (
                  <tr><td colSpan="10" className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium"><FileSignature size={32} className="mx-auto mb-3 opacity-30" />No NIT records found.</td></tr>
                ) : (
                  currentNits.map((nit, index) => (
                    // STRICTLY NO HOVER STYLES HERE
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={nit.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                      <td className="px-3 py-3.5 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                      <td className="px-3 py-3.5 font-mono text-[11px] font-bold text-[var(--color-text-main)] truncate" title={nit.refNo}>{nit.refNo}</td>
                      <td className="px-3 py-3.5 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={nit.description}>{nit.description}</td>
                      
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={nit.location}>
                        <span className="flex items-center gap-1"><MapPin size={10} className="text-[var(--color-text-muted)] shrink-0"/>{nit.location}</span>
                      </td>
                      
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={nit.lastDate}>
                        <span className="flex items-center gap-1"><Calendar size={10} className="text-[var(--color-text-muted)] shrink-0"/>{nit.lastDate}</span>
                      </td>
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={nit.openingDate}>{nit.openingDate}</td>
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={nit.awardDate}>{nit.awardDate}</td>
                      <td className="px-3 py-3.5 text-[11px] font-bold text-[var(--color-text-main)] truncate" title={nit.approvedBy}>{nit.approvedBy}</td>
                      
                      {/* STYLISH DOCUMENT BADGES FROM REFERENCE */}
                      <td className="px-3 py-3.5 text-center">
                        {nit.hasDoc ? (
                          <span className="mx-auto flex items-center justify-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-lg text-[11px] font-bold border border-emerald-500/20 max-w-[120px] uppercase tracking-wider">
                            <Check size={14}/> Approved
                          </span>
                        ) : (
                          <span className="mx-auto flex items-center justify-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-orange-500/20 max-w-[120px] uppercase tracking-wider">
                            <AlertCircle size={12}/> Upload Req.
                          </span>
                        )}
                      </td>

                      {/* Actions: 3 Dots Dropdown Trigger */}
                      <td className="px-3 py-3.5 text-center relative border-l border-cghb-border/50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            if (activeDropdown?.id === nit.id) {
                              setActiveDropdown(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActiveDropdown({
                                id: nit.id,
                                top: rect.bottom + 4,
                                left: rect.left - 130 
                              });
                            }
                          }} 
                          className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)] p-1 rounded transition-colors hover:bg-cghb-border/20"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredNits.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredNits.length)}</strong> of <strong className="text-[var(--color-text-main)]">{filteredNits.length}</strong>
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

      {/* --- GLOBAL FIXED DROPDOWN MENU --- */}
      <AnimatePresence>
        {activeDropdown && (() => {
          const nit = nits.find(r => r.id === activeDropdown.id);
          if (!nit) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: activeDropdown.top, left: activeDropdown.left, zIndex: 9999 }}
              className="w-40 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-2xl flex flex-col py-1.5 text-left"
              onClick={(e) => e.stopPropagation()} 
            >
              <button onClick={() => { handleView(nit); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                <Eye size={14} /> View Details
              </button>
              {userRole !== ROLES.COMMISSIONER && (
                <>
                  <button onClick={() => { handleEdit(nit); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => { handleDelete(nit.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10 border-t border-cghb-border/50 mt-1 pt-2.5">
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default NitApproval;