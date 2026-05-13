import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye, UploadCloud, X, Save, 
  ChevronLeft, ChevronRight, MoreVertical, Download, Check, Handshake,
  FileCheck, CalendarDays
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database for Tender Agreements
const initialAgreements = [
  { id: '1', district: 'Raipur', project: 'Atal Vihar Phase 2', agmtNo: 'AGMT/2026-27/0047', nitRef: 'NIT-2026-042', raRef: 'RA/2026-27/0047', woNoDate: 'WO-102 | 10 May 2026', agmtDate: '2026-05-15', description: 'Construction of 50 LIG Houses at Phase 2', approvedBy: 'Chief Engineer', hasDoc: true },
  { id: '2', district: 'Nava Raipur', project: 'Nava Raipur EWS', agmtNo: 'AGMT/2026-27/0048', nitRef: 'NIT-2026-044', raRef: 'RA/2026-27/0048', woNoDate: 'WO-105 | 12 May 2026', agmtDate: '2026-05-18', description: 'EWS Multi-story Block Construction', approvedBy: 'Board Resolution', hasDoc: true },
  { id: '3', district: 'Bilaspur', project: 'Bilaspur MIG Heights', agmtNo: 'AGMT/2026-27/0049', nitRef: 'NIT-2026-049', raRef: 'RA/2026-27/0049', woNoDate: 'WO-110 | 01 May 2026', agmtDate: '2026-05-05', description: 'Boundary Wall and Pathway Layout', approvedBy: 'State Govt', hasDoc: false },
];

const TenderAgreement = () => {
  const { userRole } = useAuth();

  const [agreements, setAgreements] = useState(initialAgreements);
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Streamlined Form Data
  const [formData, setFormData] = useState({
    agmtNo: '', nitRef: '', raRef: '', woNoDate: '', agmtDate: '', description: '', approvedBy: ''
  });

  // Calculate quick stats
  const totalAgreements = agreements.length;
  const recentExecutions = agreements.filter(a => new Date(a.agmtDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length; // Last 30 days
  const documentedAgreements = agreements.filter(a => a.hasDoc).length;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAgreements(agreements.map(a => a.id === editingId ? { ...a, ...formData, hasDoc: fileName !== '' ? true : a.hasDoc } : a));
      setEditingId(null);
    } else {
      const newAgreement = {
        id: Date.now().toString(),
        district: selectedDistrict,
        project: selectedProject,
        ...formData,
        hasDoc: fileName !== ''
      };
      setAgreements([newAgreement, ...agreements]);
      setCurrentPage(1);
    }
    
    // Reset Form
    setFormData({ agmtNo: '', nitRef: '', raRef: '', woNoDate: '', agmtDate: '', description: '', approvedBy: '' });
    setFileName('');
    setIsFormOpen(false);
  };

  const handleEdit = (agmt) => {
    setEditingId(agmt.id);
    setSelectedDistrict(agmt.district);
    setSelectedProject(agmt.project);
    setFormData({
      agmtNo: agmt.agmtNo, nitRef: agmt.nitRef, raRef: agmt.raRef, 
      woNoDate: agmt.woNoDate, agmtDate: agmt.agmtDate, description: agmt.description, approvedBy: agmt.approvedBy
    });
    setFileName(agmt.hasDoc ? 'agreement_document.pdf' : ''); 
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this Agreement record?")) {
      setAgreements(agreements.filter(a => a.id !== id));
    }
  };

  const handleView = (agmtNo) => {
    alert(`Opening Detailed View for Agreement: ${agmtNo}`);
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- FILTER & PAGINATION ---
  const filteredAgreements = agreements.filter(agmt => 
    agmt.project.toLowerCase().includes(searchTerm.toLowerCase()) || 
    agmt.agmtNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agmt.nitRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agmt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgreements = filteredAgreements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgreements.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cghb-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Tender <span className="text-cghb-yellow">Agreements</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
            {userRole === ROLES.COMMISSIONER 
              ? "View and monitor executed tender agreements and contractor commitments."
              : "Register, upload, and manage executed tender agreements."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-cghb-yellow flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Agreements</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{totalAgreements}</h3>
          </div>
          <div className="w-12 h-12 bg-cghb-yellow/10 text-cghb-yellow rounded-full flex items-center justify-center">
            <Handshake size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Recent Executions (30D)</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{recentExecutions}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <CalendarDays size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Digitized Copies</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{documentedAgreements}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <FileCheck size={24} />
          </div>
        </div>
      </div>

      {userRole !== ROLES.COMMISSIONER && !isFormOpen && (
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-cghb-yellow relative overflow-hidden">
          <div className="absolute top-0 right-10 w-64 h-64 bg-cghb-yellow/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-cghb-yellow/10 text-cghb-yellow flex items-center justify-center rounded-lg">
              <UploadCloud size={16} />
            </div>
            <h2 className="text-[15px] font-bold text-[var(--color-text-main)]">Agreement Registration Gateway</h2>
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
              <button type="submit" disabled={!selectedProject} className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black text-[13px] font-bold uppercase tracking-wider h-10 rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                Generate Form <Plus size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

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
                      {editingId ? <Edit size={18} /> : <Handshake size={18} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? 'Update Agreement Details' : 'Register Tender Agreement'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">{editingId ? `Ref: ${formData.agmtNo}` : `Project: ${selectedProject}`}</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsFormOpen(false); setEditingId(null); setFileName(''); setFormData({agmtNo: '', nitRef: '', raRef: '', woNoDate: '', agmtDate: '', description: '', approvedBy: ''}); }} className="text-[11px] font-bold text-red-500 uppercase hover:underline flex items-center gap-1">
                    <X size={14} /> Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Agreement No.</label>
                      <input type="text" required placeholder="e.g., AGMT/2024-25/0047" value={formData.agmtNo} onChange={e => setFormData({...formData, agmtNo: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Linked NIT / Tender No.</label>
                      <input type="text" required placeholder="e.g., NIT-2024-042" value={formData.nitRef} onChange={e => setFormData({...formData, nitRef: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Linked Rate Approval No.</label>
                      <input type="text" required placeholder="e.g., RA/2024-25/0047" value={formData.raRef} onChange={e => setFormData({...formData, raRef: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Work Order No. & Date</label>
                      <input type="text" required placeholder="e.g., WO-102 | 10 May 2026" value={formData.woNoDate} onChange={e => setFormData({...formData, woNoDate: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Agreement Date (Execution)</label>
                      <input type="date" required value={formData.agmtDate} onChange={e => setFormData({...formData, agmtDate: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Approved By</label>
                      <input type="text" required placeholder="e.g., Chief Engineer, MD" value={formData.approvedBy} onChange={e => setFormData({...formData, approvedBy: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Name / Description of Work</label>
                      <input type="text" required placeholder="e.g., Construction of 50 LIG Houses at Phase 2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Agreement Document (.pdf)</label>
                      <label className={`w-full h-11 border border-dashed rounded-lg flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all shadow-sm ${fileName ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-cghb-border text-[var(--color-text-muted)] bg-[var(--color-bg-surface)] hover:border-cghb-yellow hover:text-cghb-yellow'}`}>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        {fileName ? (
                          <span className="flex items-center gap-2 truncate px-3"><Check size={14} /> {fileName}</span>
                        ) : (
                          <span className="flex items-center gap-2"><UploadCloud size={16} /> Select Document</span>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-cghb-border/50 mt-2">
                    <button type="submit" className={`flex items-center gap-2 text-black text-[13px] font-bold uppercase tracking-wider h-11 px-8 rounded-lg transition-all shadow-md ${editingId ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-cghb-yellow shadow-cghb-yellow/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                      <Save size={16} /> {editingId ? 'Save Changes' : 'Log Agreement'}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search Project, Agreement No, or NIT Ref..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full">
          
          <table className="w-full table-fixed text-left whitespace-nowrap">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">S.No</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Agreement No.</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Refs (NIT / RA)</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[14%]">Project Name</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Work Description</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">WO No. & Date</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Agmt Date</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Approved By</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%] border-l border-cghb-border">Doc</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentAgreements.map((agmt, index) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={agmt.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                    <td className="px-3 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                    
                    <td className="px-3 py-4 font-mono text-[11px] font-bold text-[var(--color-text-main)] truncate" title={agmt.agmtNo}>{agmt.agmtNo}</td>
                    
                    <td className="px-3 py-4">
                      <div className="font-mono text-[10px] text-[var(--color-text-main)] truncate" title={agmt.nitRef}>{agmt.nitRef}</div>
                      <div className="font-mono text-[10px] text-[var(--color-text-muted)] truncate mt-0.5" title={agmt.raRef}>{agmt.raRef}</div>
                    </td>
                    
                    <td className="px-3 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={agmt.project}>{agmt.project}</td>
                    <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={agmt.description}>{agmt.description}</td>
                    <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={agmt.woNoDate}>{agmt.woNoDate}</td>
                    <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={agmt.agmtDate}>{agmt.agmtDate}</td>
                    <td className="px-3 py-4 text-[11px] font-bold text-[var(--color-text-main)] truncate" title={agmt.approvedBy}>{agmt.approvedBy}</td>
                    
                    <td className="px-3 py-4 text-center border-l border-cghb-border/50">
                      {agmt.hasDoc 
                        ? <button className="mx-auto flex items-center justify-center text-[var(--color-text-muted)] hover:text-cghb-yellow transition-colors" title="Download Document"><Download size={16} strokeWidth={2.5} /></button> 
                        : <span className="text-[var(--color-text-muted)]/30">-</span>}
                    </td>

                    <td className="px-3 py-4 text-center relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveDropdown(activeDropdown === agmt.id ? null : agmt.id);
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === agmt.id && (
                        <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                          <button onClick={() => { handleView(agmt.agmtNo); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                            <Eye size={14} /> View
                          </button>
                          {userRole !== ROLES.COMMISSIONER && (
                            <>
                              <button onClick={() => { handleEdit(agmt); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => { handleDelete(agmt.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10">
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

          {currentAgreements.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <Handshake size={32} className="text-[var(--color-text-muted)]/30" />
              No agreement records found.
            </div>
          )}
        </div>

        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredAgreements.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAgreements.length)}</strong> of <strong className="text-[var(--color-text-main)]">{filteredAgreements.length}</strong>
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

export default TenderAgreement;