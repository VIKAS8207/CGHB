import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, CheckCircle, Clock, Building2, 
  ArrowLeft, FileSearch, UploadCloud, Trash2, 
  ChevronLeft, ChevronRight, MoreVertical, Plus, 
  Check, FileText, Download, AlertCircle, Eye, LayoutList
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database (Agency and Progress Stage removed)
const initialSanctions = [
  { 
    id: 'TS-2026-088', projectName: 'Atal Vihar Phase 3', zone: 'Raipur South', scheme: 'Atal Vihar Yojana', description: 'Construction of 150 Units',
    docs: [{ id: 1, name: 'TS Approval Letter', desc: 'Main Technical Sanction', file: 'TS_Phase3.pdf' }] 
  },
  { 
    id: 'TS-2026-089', projectName: 'Nava Raipur EWS Tower', zone: 'Nava Raipur', scheme: 'EWS Housing', description: 'Multi-story EWS Block',
    docs: [] // Empty -> Triggers "Upload Req."
  },
  { 
    id: 'TS-2026-090', projectName: 'Bilaspur Commercial Plaza', zone: 'Bilaspur Central', scheme: 'Smart City Dev', description: 'Commercial Complex',
    docs: [{ id: 2, name: 'Detailed Estimate', desc: 'Approved Costing', file: 'Est_Plaza.pdf' }] 
  },
];

// Helper to check TS Status based on docs
const calculateTSStatus = (docs) => {
  return docs.length > 0 ? 'Approved' : 'Awaiting';
};

// --- INDEPENDENT INPUT ROW FOR MULTI-UPLOAD ---
const InputRow = ({ onSave }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');

  const handleAdd = () => {
    onSave({ name, desc, file: fileName });
    setName(''); setDesc(''); setFileName('');
  };

  return (
    <tr className="bg-[var(--color-bg-surface)]">
      <td className="px-4 py-3">
        <input type="text" placeholder="Enter doc name..." value={name} onChange={e => setName(e.target.value)} className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
      </td>
      <td className="px-4 py-3">
        <input type="text" placeholder="Brief description..." value={desc} onChange={e => setDesc(e.target.value)} className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
      </td>
      <td className="px-4 py-3">
        <label className="w-full h-9 border border-dashed border-cghb-border bg-[var(--color-bg-main)] rounded-lg flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:border-cghb-yellow hover:text-cghb-yellow text-[var(--color-text-muted)] shadow-sm">
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => { if (e.target.files.length > 0) setFileName(e.target.files[0].name); }} />
          {fileName ? <span className="flex items-center gap-1.5 text-emerald-500"><Check size={12}/> {fileName}</span> : <span className="flex items-center gap-1.5"><UploadCloud size={14}/> Select File</span>}
        </label>
      </td>
      <td className="px-4 py-3 text-center border-l border-cghb-border/50">
        <button onClick={handleAdd} disabled={!name.trim() || !fileName} className="w-8 h-8 mx-auto flex items-center justify-center bg-cghb-yellow text-black rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" title="Add Document">
          <Plus size={16} strokeWidth={3} />
        </button>
      </td>
    </tr>
  );
};

const TechnicalSanction = () => {
  const { userRole } = useAuth();
  const isCommissioner = userRole === ROLES.COMMISSIONER;
  
  const [sanctions, setSanctions] = useState(initialSanctions);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fixed Global Dropdown Menu State
  const [dropdownConfig, setDropdownConfig] = useState(null);

  // Navigation States (These dictate which "Page" is currently showing)
  const [uploadingRecord, setUploadingRecord] = useState(null); // Upload Workspace Page
  const [viewingRecord, setViewingRecord] = useState(null); // View Page

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- GLOBALLY CLOSE DROPDOWN ON SCROLL OR CLICK ---
  useEffect(() => {
    const closeDropdown = () => setDropdownConfig(null);
    document.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", closeDropdown, true); 
    return () => {
      document.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", closeDropdown, true);
    };
  }, []);

  // Actions
  const handleBack = () => {
    setUploadingRecord(null);
    setViewingRecord(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this technical sanction record and all its documents?")) {
      setSanctions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddDocToRecord = (docData) => {
    const newDoc = { id: Date.now(), ...docData };
    setSanctions(prev => prev.map(s => {
      if (s.id === uploadingRecord.id) {
        const updated = { ...s, docs: [...s.docs, newDoc] };
        setUploadingRecord(updated); // Update local view
        return updated;
      }
      return s;
    }));
  };

  const handleDeleteDocFromRecord = (docId) => {
    setSanctions(prev => prev.map(s => {
      if (s.id === uploadingRecord.id) {
        const updated = { ...s, docs: s.docs.filter(d => d.id !== docId) };
        setUploadingRecord(updated); // Update local view
        return updated;
      }
      return s;
    }));
  };

  // Filter & Pagination
  const searchResults = sanctions.filter(s => 
    s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSanctions = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // ============================================================================
  // VIEW 3: MULTI-DOCUMENT UPLOAD WORKSPACE
  // ============================================================================
  if (uploadingRecord) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">Document <span className="text-cghb-yellow">Workspace</span></h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <UploadCloud size={14} className="text-cghb-yellow" /> {uploadingRecord.projectName} <span className="opacity-50">|</span> {uploadingRecord.id}
            </p>
          </div>
          <div className="ml-auto">
            {calculateTSStatus(uploadingRecord.docs) === 'Approved' ? (
              <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-[13px] font-bold uppercase tracking-wider shadow-sm">
                <CheckCircle size={16} /> TS Requirements Met
              </span>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-600 border border-orange-500/20 rounded-lg text-[13px] font-bold uppercase tracking-wider shadow-sm">
                <Clock size={16} /> Awaiting Documents
              </span>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-bg-main)] shadow-md rounded-lg border border-cghb-border flex flex-col w-full overflow-hidden mt-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap table-fixed min-w-[800px]">
              <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b border-cghb-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider w-[25%]">Document Name</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider w-[40%]">Description</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider w-[25%]">File</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-center w-[10%] border-l border-cghb-border">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cghb-border/50">
                <AnimatePresence>
                  {uploadingRecord.docs.map((doc) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={doc.id} className="bg-transparent hover:bg-cghb-border/5 transition-colors">
                      <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-text-main)] truncate">{doc.name}</td>
                      <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-muted)] truncate">{doc.desc}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-blue-500 truncate cursor-pointer hover:underline flex items-center gap-2">
                        <FileText size={14} /> {doc.file}
                      </td>
                      <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                        {!isCommissioner ? (
                          <button onClick={() => handleDeleteDocFromRecord(doc.id)} className="text-red-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10" title="Remove Document">
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <span className="text-[var(--color-text-muted)]/30">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {/* Independent Input Row */}
                <InputRow onSave={handleAddDocToRecord} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: PROFILE/DETAILS PAGE
  // ============================================================================
  if (viewingRecord) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">Sanction <span className="text-cghb-yellow">Details</span></h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <LayoutList size={14} className="text-cghb-yellow" /> {viewingRecord.projectName} <span className="opacity-50">|</span> {viewingRecord.id}
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-xl border border-cghb-border shadow-sm space-y-10">
          <div>
            <h3 className="text-[12px] font-black text-cghb-yellow uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">1. Core Allocation Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Project ID</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingRecord.id}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Zone</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingRecord.zone}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Scheme</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingRecord.scheme}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Work Description</span><span className="block text-[14px] font-medium text-[var(--color-text-main)] truncate" title={viewingRecord.description}>{viewingRecord.description}</span></div>
              
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Admin. Sanction</span>
                <span className="block text-[15px] font-black text-emerald-500">Approved</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Tender Sanction</span>
                <span className="block text-[15px] font-black text-orange-500">Pending</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">2. Technical Sanction Documents ({viewingRecord.docs.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {viewingRecord.docs.length === 0 ? (
                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-600 text-[13px] font-bold flex items-center gap-2">
                  <AlertCircle size={16}/> No documents have been uploaded for this sanction yet.
                </div>
              ) : (
                viewingRecord.docs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-[var(--color-bg-main)] border border-cghb-border/50 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-500 flex items-center justify-center rounded-lg"><FileText size={18}/></div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[var(--color-text-main)]">{doc.name}</h4>
                        <p className="text-[12px] text-[var(--color-text-muted)]">{doc.desc}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[12px] font-bold text-[var(--color-text-main)] hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm">
                      <Download size={14}/> Download {doc.file}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PAGE 1: MAIN DASHBOARD & DIRECTORY
  // ============================================================================
  return (
    <div className="w-full max-w-[1500px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="border-b border-cghb-border pb-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
          Technical <span className="text-cghb-yellow">Sanction</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
          {userRole === ROLES.COMMISSIONER 
            ? "Monitor technical sanction status and scrutinize attached documents."
            : "Manage project documents to automatically secure Technical Sanctions."}
        </p>
      </div>

      {/* --- TABLE SEARCH CONTROLS --- */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search Project Name, Zone, or ID..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- MASTER TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-lg border border-cghb-border flex flex-col w-full overflow-hidden relative">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1200px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[16%]">Name of Work</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Zone</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Scheme</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Tech. Sanc.</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Admin. Sanc.</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Tender Sanc.</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Work Desc.</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[15%]">TS Document</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%] border-l border-cghb-border">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentSanctions.length === 0 ? (
                  <tr><td colSpan="10" className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium"><FileSearch size={32} className="mx-auto mb-3 opacity-30"/> No technical sanctions found.</td></tr>
                ) : (
                  currentSanctions.map((sanction, index) => {
                    const tsStatus = calculateTSStatus(sanction.docs);
                    const hasDocs = sanction.docs && sanction.docs.length > 0;
                    
                    return (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={sanction.id} className="hover:bg-cghb-border/5 transition-colors">
                        <td className="px-4 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={sanction.projectName}>{sanction.projectName}</td>
                        <td className="px-4 py-4 text-[11px] text-[var(--color-text-muted)] truncate" title={sanction.zone}>{sanction.zone}</td>
                        <td className="px-4 py-4 text-[11px] text-[var(--color-text-muted)] truncate" title={sanction.scheme}>{sanction.scheme}</td>
                        
                        {/* Auto-Calculated Technical Sanction Status */}
                        <td className="px-4 py-4">
                          {tsStatus === 'Awaiting' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-bold uppercase tracking-wider"><Clock size={10} /> Awaiting</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider"><CheckCircle size={10} /> Approved</span>
                          )}
                        </td>

                        {/* Hardcoded Approvals */}
                        <td className="px-4 py-4 text-[11px] font-bold text-emerald-500 truncate">Approved</td>
                        <td className="px-4 py-4 text-[11px] font-bold text-orange-500 truncate">Pending</td>
                        
                        <td className="px-4 py-4 text-[11px] text-[var(--color-text-muted)] truncate" title={sanction.description}>{sanction.description}</td>
                        
                        {/* Inline Document Action */}
                        <td className="px-4 py-4 text-center">
                          {hasDocs ? (
                            <button className="mx-auto flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20">
                              <Download size={14}/> {sanction.docs[0].file} {sanction.docs.length > 1 && `(+${sanction.docs.length - 1})`}
                            </button>
                          ) : (
                            <span className="mx-auto flex items-center justify-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-orange-500/20 max-w-[120px] uppercase tracking-wider">
                              <AlertCircle size={12}/> Upload Req.
                            </span>
                          )}
                        </td>

                        {/* GLOBAL ACTION BUTTON */}
                        <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (dropdownConfig?.id === sanction.id) {
                                setDropdownConfig(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setDropdownConfig({
                                  id: sanction.id,
                                  top: rect.bottom + 4,
                                  left: rect.left - 130 // Ensures dropdown stays on screen
                                });
                              }
                            }} 
                            className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)] p-1 rounded transition-colors hover:bg-cghb-border/20"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{searchResults.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, searchResults.length)}</strong> of <strong className="text-[var(--color-text-main)]">{searchResults.length}</strong>
          </span>
          <div className="flex gap-1.5">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20"><ChevronLeft size={14} /></button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx} onClick={() => paginate(idx + 1)} className={`h-8 w-8 flex items-center justify-center rounded-md text-[12px] font-bold transition-all ${currentPage === idx + 1 ? 'bg-cghb-yellow text-black shadow-sm' : 'border border-cghb-border text-[var(--color-text-main)] hover:bg-cghb-border/10'}`}>{idx + 1}</button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* --- GLOBAL FIXED DROPDOWN MENU --- */}
      <AnimatePresence>
        {dropdownConfig && (() => {
          const sanction = sanctions.find(s => s.id === dropdownConfig.id);
          if (!sanction) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: dropdownConfig.top, left: dropdownConfig.left, zIndex: 9999 }}
              className="w-40 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-2xl flex flex-col py-1.5 text-left"
              onClick={(e) => e.stopPropagation()} 
            >
              <button onClick={() => { setViewingRecord(sanction); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                <Eye size={14} /> View Details
              </button>
              {!isCommissioner && (
                <>
                  <button onClick={() => { setUploadingRecord(sanction); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                    <UploadCloud size={14} /> Manage Docs
                  </button>
                  <button onClick={() => { handleDelete(sanction.id); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10 border-t border-cghb-border/50 mt-1 pt-2.5">
                    <Trash2 size={14} /> Delete Full
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

export default TechnicalSanction;