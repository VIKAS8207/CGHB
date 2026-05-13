import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, CheckCircle, Clock, Building2, 
  ArrowLeft, FileSearch, UploadCloud, Trash2, 
  ChevronLeft, ChevronRight, MoreVertical, Plus, Check, FileText
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database matched to the Translated Hindi Headers
// Structure: docs object holds arrays for multiple file uploads
const initialSanctions = [
  { 
    id: 'TS-2026-088', projectName: 'Atal Vihar Phase 3', zone: 'Raipur South', agency: 'CGHB Urban', scheme: 'Atal Vihar Yojana',
    adminSanction: 'Granted', tenderSanction: 'Pending', progressStage: 'Pre-Tender Preparation', description: 'Construction of 150 Units',
    docs: { tsLetter: [], estimate: [], boq: [], drawing: [] } 
  },
  { 
    id: 'TS-2026-089', projectName: 'Nava Raipur EWS Tower', zone: 'Nava Raipur', agency: 'NRDA', scheme: 'EWS Housing',
    adminSanction: 'Granted', tenderSanction: 'Awaiting', progressStage: 'Documentation', description: 'Multi-story EWS Block',
    docs: { 
      tsLetter: [{ id: 1, name: 'Official Req', desc: 'Main Request Letter', file: 'req.pdf' }], 
      estimate: [{ id: 2, name: 'Cost Est', desc: 'PWD Standard Est', file: 'est.pdf' }], 
      boq: [{ id: 3, name: 'Main BOQ', desc: 'Material List', file: 'boq.pdf' }], 
      drawing: [{ id: 4, name: 'Site Plan', desc: 'AutoCAD Export', file: 'plan.pdf' }] 
    } 
  },
  { 
    id: 'TS-2026-090', projectName: 'Bilaspur Commercial Plaza', zone: 'Bilaspur Central', agency: 'SUDA', scheme: 'Smart City Dev',
    adminSanction: 'Pending', tenderSanction: 'Pending', progressStage: 'Initial Survey', description: 'Commercial Complex',
    docs: { tsLetter: [], estimate: [{ id: 5, name: 'Rough Est', desc: 'Initial costing', file: 'est.pdf' }], boq: [], drawing: [] } 
  },
];

// Helper to check if ALL requirements have at least one document
const calculateTSStatus = (docs) => {
  if (docs.tsLetter.length > 0 && docs.estimate.length > 0 && docs.boq.length > 0 && docs.drawing.length > 0) {
    return 'Approved';
  }
  return 'Awaiting';
};

const TechnicalSanction = () => {
  const { userRole } = useAuth();
  
  const [sanctions, setSanctions] = useState(initialSanctions);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track 3-dot dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Workspace State (Page 2)
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('tsLetter');

  // Document Builder Inputs
  const [newDocName, setNewDocName] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocFile, setNewDocFile] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Actions
  const handleOpenWorkspace = (project) => {
    setActiveWorkspace(project);
    setActiveTab('tsLetter');
    setNewDocName(''); setNewDocDesc(''); setNewDocFile('');
  };

  const handleBack = () => {
    setActiveWorkspace(null);
  };

  const handleAddDocument = () => {
    if (!newDocName.trim() || !newDocFile) return;

    const newDoc = {
      id: Date.now(),
      name: newDocName,
      desc: newDocDesc,
      file: newDocFile
    };

    const updatedWorkspace = { ...activeWorkspace };
    updatedWorkspace.docs[activeTab].push(newDoc);

    // Update global state which automatically updates the status logic
    setSanctions(sanctions.map(s => s.id === updatedWorkspace.id ? updatedWorkspace : s));
    setActiveWorkspace(updatedWorkspace);

    // Reset Inputs
    setNewDocName(''); setNewDocDesc(''); setNewDocFile('');
  };

  const handleDeleteDocument = (docId) => {
    const updatedWorkspace = { ...activeWorkspace };
    updatedWorkspace.docs[activeTab] = updatedWorkspace.docs[activeTab].filter(d => d.id !== docId);
    
    setSanctions(sanctions.map(s => s.id === updatedWorkspace.id ? updatedWorkspace : s));
    setActiveWorkspace(updatedWorkspace);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter & Pagination
  const searchResults = sanctions.filter(s => 
    s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSanctions = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tab definitions for rendering
  const TABS = [
    { id: 'tsLetter', label: 'TS Letter' },
    { id: 'estimate', label: 'Detailed Estimate' },
    { id: 'boq', label: 'BOQ Document' },
    { id: 'drawing', label: 'Drawings & Plan' }
  ];

  return (
    <div className="w-full max-w-[1500px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      <AnimatePresence mode="wait">
        
        {/* ========================================================= */}
        {/* PAGE 1: SCRUTINY MASTER TABLE                             */}
        {/* ========================================================= */}
        {!activeWorkspace ? (
          <motion.div 
            key="page1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* --- HEADER --- */}
            <div>
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
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
                <input type="text" placeholder="Search Project Name, Zone, or Agency..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
              </div>
              <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
                <Filter size={14} /> Filter
              </button>
            </div>

            {/* --- MASTER TABLE (LOCKED UI - TRANSLATED FIELDS) --- */}
            <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
              <div className="w-full">
                <table className="w-full table-fixed text-left whitespace-nowrap">
                  <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
                    <tr>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">S.No</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[14%]">Name of Work</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Zone</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Agency</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Scheme</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[9%]">Tech. Sanc.</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[9%]">Admin. Sanc.</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[9%]">Tender Sanc.</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Progress Stage</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Work Desc.</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%] border-l border-cghb-border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {currentSanctions.map((sanction, index) => {
                        const tsStatus = calculateTSStatus(sanction.docs);
                        
                        return (
                          <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={sanction.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                            <td className="px-3 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                            <td className="px-3 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={sanction.projectName}>{sanction.projectName}</td>
                            <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={sanction.zone}>{sanction.zone}</td>
                            <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={sanction.agency}>{sanction.agency}</td>
                            <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={sanction.scheme}>{sanction.scheme}</td>
                            
                            {/* Auto-Calculated Technical Sanction Status */}
                            <td className="px-3 py-4">
                              {tsStatus === 'Awaiting' ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-bold uppercase tracking-wider">
                                  <Clock size={10} /> Awaiting
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                                  <CheckCircle size={10} /> Approved
                                </span>
                              )}
                            </td>

                            <td className="px-3 py-4 text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={sanction.adminSanction}>{sanction.adminSanction}</td>
                            <td className="px-3 py-4 text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={sanction.tenderSanction}>{sanction.tenderSanction}</td>
                            <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={sanction.progressStage}>{sanction.progressStage}</td>
                            <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={sanction.description}>{sanction.description}</td>
                            
                            {/* Actions: 3 Dots Dropdown */}
                            <td className="px-3 py-4 text-center relative border-l border-cghb-border/50">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  setActiveDropdown(activeDropdown === sanction.id ? null : sanction.id);
                                }} 
                                className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              {activeDropdown === sanction.id && (
                                <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                                  {userRole === ROLES.COMMISSIONER ? (
                                    <button onClick={() => { handleOpenWorkspace(sanction); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                                      <FileSearch size={14} /> Review Docs
                                    </button>
                                  ) : (
                                    <button onClick={() => { handleOpenWorkspace(sanction); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                                      <UploadCloud size={14} /> Workspace
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>

                {currentSanctions.length === 0 && (
                  <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
                    <FileSearch size={32} className="text-[var(--color-text-muted)]/30" />
                    No project records found.
                  </div>
                )}
              </div>

              {/* --- ALWAYS VISIBLE PAGINATION --- */}
              <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
                <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
                  Viewing <strong className="text-[var(--color-text-main)]">{searchResults.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, searchResults.length)}</strong> of <strong className="text-[var(--color-text-main)]">{searchResults.length}</strong>
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
          </motion.div>
        ) : (

        /* ========================================================= */
        /* PAGE 2: THE SCRUTINY WORKSPACE HUB                        */
        /* ========================================================= */
          <motion.div
            key="page2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* --- HUB HEADER & BACK BUTTON --- */}
            <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
              <button onClick={handleBack} className="p-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"><ArrowLeft size={16} /></button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
                  {userRole === ROLES.COMMISSIONER ? 'Scrutiny Workspace' : 'Document Upload Workspace'}
                </h1>
                <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
                  <Building2 size={14} /> {activeWorkspace.projectName} <span className="opacity-50">|</span> {activeWorkspace.agency}
                </p>
              </div>
              
              {/* Dynamic Status Indicator */}
              <div className="ml-auto">
                {calculateTSStatus(activeWorkspace.docs) === 'Approved' ? (
                  <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-[13px] font-bold uppercase tracking-wider">
                    <CheckCircle size={16} /> TS Requirements Met
                  </span>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-600 border border-orange-500/20 rounded-lg text-[13px] font-bold uppercase tracking-wider">
                    <Clock size={16} /> Awaiting Documents
                  </span>
                )}
              </div>
            </div>

            {/* --- TOP-LEFT ALIGNED TAB MENU --- */}
            <div className="flex gap-6 border-b border-cghb-border/50">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-[14px] font-bold uppercase tracking-wider transition-all relative ${activeTab === tab.id ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 w-full h-[4px] bg-cghb-yellow rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* --- TAB CONTENT: INLINE DOCUMENT BUILDER TABLE --- */}
            <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden mt-4">
              <table className="w-full text-left whitespace-nowrap table-fixed">
                <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b border-cghb-border">
                  <tr>
                    <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider w-[25%]">Document Name</th>
                    <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider w-[40%]">Description</th>
                    <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider w-[25%]">File</th>
                    <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider text-center w-[10%] border-l border-cghb-border">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cghb-border/50">
                  {/* Map Existing Documents */}
                  <AnimatePresence>
                    {activeWorkspace.docs[activeTab].map((doc) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={doc.id} className="bg-transparent">
                        <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-text-main)] truncate" title={doc.name}>{doc.name}</td>
                        <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-muted)] truncate" title={doc.desc}>{doc.desc}</td>
                        <td className="px-4 py-4 text-[12px] font-bold text-blue-500 truncate cursor-pointer hover:underline flex items-center gap-2" title={doc.file}>
                          <FileText size={14} /> {doc.file}
                        </td>
                        <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                          {userRole !== ROLES.COMMISSIONER ? (
                            <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10" title="Remove Document">
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <span className="text-[var(--color-text-muted)]/30">-</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {/* Document Builder Input Row (Hidden for Commissioner) */}
                  {userRole !== ROLES.COMMISSIONER && (
                    <tr className="bg-[var(--color-bg-surface)]">
                      <td className="px-4 py-3">
                        <input 
                          type="text" placeholder="Enter doc name..." value={newDocName} onChange={e => setNewDocName(e.target.value)} 
                          className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-md px-3 focus:outline-none focus:border-cghb-yellow transition-all" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="text" placeholder="Brief description..." value={newDocDesc} onChange={e => setNewDocDesc(e.target.value)} 
                          className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-md px-3 focus:outline-none focus:border-cghb-yellow transition-all" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <label className="w-full h-9 border border-dashed border-cghb-border bg-[var(--color-bg-main)] rounded-md flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:border-cghb-yellow hover:text-cghb-yellow text-[var(--color-text-muted)]">
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => { if (e.target.files.length > 0) setNewDocFile(e.target.files[0].name); }} />
                          {newDocFile ? <span className="flex items-center gap-1.5 text-emerald-500"><Check size={12}/> {newDocFile}</span> : <span className="flex items-center gap-1.5"><UploadCloud size={14}/> Select File</span>}
                        </label>
                      </td>
                      <td className="px-4 py-3 text-center border-l border-cghb-border/50">
                        <button 
                          onClick={handleAddDocument}
                          disabled={!newDocName.trim() || !newDocFile}
                          className="w-8 h-8 mx-auto flex items-center justify-center bg-cghb-yellow text-black rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="Add Document"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {activeWorkspace.docs[activeTab].length === 0 && userRole === ROLES.COMMISSIONER && (
                <div className="p-8 text-center text-[var(--color-text-muted)] text-[13px] font-medium border-t border-cghb-border/50">
                  No documents uploaded for this category yet.
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicalSanction;