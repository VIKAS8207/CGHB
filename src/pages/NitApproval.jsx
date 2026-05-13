import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSignature, Search, Filter, Calendar, MapPin, 
  Plus, Edit, Trash2, Eye, UploadCloud, X, Save, 
  ChevronLeft, ChevronRight, MoreVertical, Download, Check
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database for NITs
const initialNits = [
  { 
    id: '1', refNo: 'CGHB/RPR/26/042', description: 'Construction of 50 LIG Houses at Phase 2', 
    location: 'Raipur', lastDate: '2026-05-20', openingDate: '2026-05-22', awardDate: '2026-06-05', approvedBy: 'Chief Engineer', hasDoc: true 
  },
  { 
    id: '2', refNo: 'CGHB/BSP/26/089', description: 'MIG Heights Boundary Wall Construction', 
    location: 'Bilaspur', lastDate: '2026-05-25', openingDate: '2026-05-27', awardDate: '2026-06-10', approvedBy: 'Board Resolution', hasDoc: true 
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
  
  // Track which 3-dot dropdown is currently open
  const [activeDropdown, setActiveDropdown] = useState(null);
  
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
      setNits(nits.map(n => n.id === editingId ? { ...n, ...formData } : n));
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
    setFileName('existing_document.pdf'); // Mocking an already uploaded file state
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this NIT?")) {
      setNits(nits.filter(n => n.id !== id));
    }
  };

  const handleView = (refNo) => {
    alert(`Opening Detailed NIT View for ${refNo}`);
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

      {/* --- GATEWAY: SELECT PROJECT TO UPLOAD NIT (Hidden for Commissioner) --- */}
      {userRole !== ROLES.COMMISSIONER && !isFormOpen && (
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-cghb-yellow relative overflow-hidden">
          <div className="absolute top-0 right-10 w-64 h-64 bg-cghb-yellow/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-cghb-yellow/10 text-cghb-yellow flex items-center justify-center rounded-lg">
              <UploadCloud size={16} />
            </div>
            <h2 className="text-[15px] font-bold text-[var(--color-text-main)]">NIT Publication Gateway</h2>
          </div>

          <form onSubmit={handleOpenForm} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end relative z-10">
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">1. Select District</label>
              <select required value={selectedDistrict} onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedProject(''); }} className="w-full h-10 bg-transparent border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-md px-3 focus:outline-none focus:border-cghb-yellow transition-colors font-medium cursor-pointer">
                <option value="" disabled>Choose District...</option>
                <option value="Raipur" className="text-black bg-white">Raipur</option>
                <option value="Bilaspur" className="text-black bg-white">Bilaspur</option>
                <option value="Durg" className="text-black bg-white">Durg</option>
                <option value="Bastar" className="text-black bg-white">Bastar</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">2. Target Project</label>
              <select required value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} disabled={!selectedDistrict} className="w-full h-10 bg-transparent border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-md px-3 focus:outline-none focus:border-cghb-yellow transition-colors font-medium disabled:opacity-50 cursor-pointer">
                <option value="" disabled>{selectedDistrict ? "Select Project..." : "Select District First"}</option>
                {selectedDistrict === 'Raipur' && <><option className="text-black bg-white">Atal Vihar Phase 2</option><option className="text-black bg-white">Nava Raipur EWS</option></>}
                {selectedDistrict === 'Bilaspur' && <option className="text-black bg-white">Bilaspur MIG Heights</option>}
                {selectedDistrict === 'Durg' && <option className="text-black bg-white">Durg Residential</option>}
                {selectedDistrict === 'Bastar' && <option className="text-black bg-white">Bastar Standalone Villas</option>}
              </select>
            </div>
            <div>
              <button type="submit" disabled={!selectedProject} className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black text-[13px] font-bold uppercase tracking-wider h-10 rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                Generate Form <Plus size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

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
                      <label className={`w-full h-11 border border-dashed rounded-lg flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all ${fileName ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-cghb-border text-[var(--color-text-muted)] bg-cghb-border/5 hover:border-cghb-yellow hover:text-cghb-yellow'}`}>
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
      </div>

      {/* --- NIT MASTER TABLE (LOCKED UI) --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full">
          {/* table-fixed explicitly prevents horizontal scrolling */}
          <table className="w-full table-fixed text-left whitespace-nowrap">
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
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">Doc</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentNits.map((nit, index) => (
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
                    
                    <td className="px-3 py-3.5 text-center">
                      {nit.hasDoc 
                        ? <button className="mx-auto flex items-center justify-center text-[var(--color-text-muted)] hover:text-cghb-yellow transition-colors" title="Download Document"><Download size={16} strokeWidth={2.5}/></button> 
                        : <span className="text-[var(--color-text-muted)]/30">-</span>}
                    </td>

                    {/* Actions: 3 Dots Dropdown */}
                    <td className="px-3 py-3.5 text-center relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveDropdown(activeDropdown === nit.id ? null : nit.id);
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === nit.id && (
                        <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                          <button onClick={() => { handleView(nit.refNo); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                            <Eye size={14} /> View
                          </button>
                          {userRole !== ROLES.COMMISSIONER && (
                            <>
                              <button onClick={() => { handleEdit(nit); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => { handleDelete(nit.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10">
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

          {currentNits.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <FileSignature size={32} className="text-[var(--color-text-muted)]/30" />
              No NIT records found.
            </div>
          )}
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
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
    </div>
  );
};

export default NitApproval;