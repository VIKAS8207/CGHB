import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Files, Search, Filter, MapPin, Building2, ArrowRight, ArrowLeft, 
  FolderOpen, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Check, 
  UploadCloud, MoreVertical, FileText, Plus, Download
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Global Database (Updated with the docs arrays for the workspace)
const initialProjects = [
  { 
    id: 'PRJ-1042', name: 'Atal Vihar Phase 2', district: 'raipur', districtName: 'Raipur', scheme: 'Atal Vihar Yojana', status: 'Active',
    docs: { 
      drawing: [{ id: 1, name: 'Master Layout', desc: 'Final approved CAD', file: 'layout.pdf' }], 
      order: [], material: [], siteOrder: [] 
    } 
  },
  { 
    id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', district: 'raipur', districtName: 'Raipur', scheme: 'EWS Housing', status: 'Planning',
    docs: { drawing: [], order: [], material: [], siteOrder: [] } 
  },
  { 
    id: 'PRJ-1044', name: 'Bilaspur MIG Heights', district: 'bilaspur', districtName: 'Bilaspur', scheme: 'MIG Housing Dev', status: 'Active',
    docs: { drawing: [], order: [], material: [{ id: 2, name: 'Cement Specs', desc: 'Grade 43 requirements', file: 'specs.pdf' }], siteOrder: [] } 
  },
  { 
    id: 'PRJ-1045', name: 'Bastar Standalone Villas', district: 'bastar', districtName: 'Bastar', scheme: 'Standalone', status: 'Completed',
    docs: { drawing: [], order: [], material: [], siteOrder: [] } 
  },
  { 
    id: 'PRJ-1046', name: 'Durg Residential Complex', district: 'durg', districtName: 'Durg', scheme: 'LIG Housing', status: 'Active',
    docs: { drawing: [], order: [], material: [], siteOrder: [] } 
  },
];

// Calculate total documents across all categories for a project
const getTotalDocs = (docs) => {
  return Object.values(docs).reduce((acc, curr) => acc + curr.length, 0);
};

const Documentation = () => {
  const { userRole } = useAuth();

  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Gateway State
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // Workspace State (Page 2)
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('drawing');

  // Document Builder State
  const [newDocName, setNewDocName] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocFile, setNewDocFile] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- ACTIONS ---

  const handleQuickSelectSubmit = (e) => {
    e.preventDefault();
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      setActiveWorkspace(project);
      setActiveTab('drawing');
      resetDocBuilder();
    }
  };

  const handleTableAction = (project) => {
    setActiveWorkspace(project);
    setActiveTab('drawing');
    resetDocBuilder();
  };

  const handleBack = () => {
    setActiveWorkspace(null);
    setSelectedProjectId('');
  };

  const resetDocBuilder = () => {
    setNewDocName('');
    setNewDocDesc('');
    setNewDocFile('');
  };

  // Workspace Document Operations
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

    setProjects(projects.map(p => p.id === updatedWorkspace.id ? updatedWorkspace : p));
    setActiveWorkspace(updatedWorkspace);
    resetDocBuilder();
  };

  const handleDeleteDocument = (docId) => {
    const updatedWorkspace = { ...activeWorkspace };
    updatedWorkspace.docs[activeTab] = updatedWorkspace.docs[activeTab].filter(d => d.id !== docId);
    
    setProjects(projects.map(p => p.id === updatedWorkspace.id ? updatedWorkspace : p));
    setActiveWorkspace(updatedWorkspace);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter & Pagination
  const filteredProjectsForDropdown = projects.filter(p => p.district === selectedDistrict);

  const searchResults = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tab definitions
  const TABS = [
    { id: 'drawing', label: 'Site Drawings' },
    { id: 'order', label: 'Order Details' },
    { id: 'material', label: 'Material Specs' },
    { id: 'siteOrder', label: 'Site Orders' }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      <AnimatePresence mode="wait">
        
        {/* ========================================================= */}
        {/* PAGE 1: GATEWAY & DIRECTORY TABLE                         */}
        {/* ========================================================= */}
        {!activeWorkspace ? (
          <motion.div 
            key="page1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* --- HEADER --- */}
            <div className="border-b border-cghb-border pb-4">
              <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
                Global <span className="text-cghb-yellow">Documentation</span>
              </h1>
              <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
                {userRole === ROLES.COMMISSIONER 
                  ? "Access and review master files, blueprints, and standard operating procedures."
                  : "Upload and index master project files into the central repository."}
              </p>
            </div>

            {/* --- TOP SECTION: QUICK SELECT GATEWAY --- */}
            {userRole !== ROLES.COMMISSIONER && (
              <div className="glass-panel p-6 rounded-xl border-t-4 border-t-cghb-yellow relative overflow-hidden">
                <div className="absolute top-0 right-10 w-64 h-64 bg-cghb-yellow/5 blur-3xl pointer-events-none rounded-full" />
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-8 h-8 bg-cghb-yellow/10 text-cghb-yellow flex items-center justify-center rounded-lg">
                    <FolderOpen size={16} />
                  </div>
                  <h2 className="text-[15px] font-bold text-[var(--color-text-main)]">Quick Access Gateway</h2>
                </div>

                <form onSubmit={handleQuickSelectSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end relative z-10">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">1. Filter District</label>
                    <select 
                      value={selectedDistrict}
                      onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedProjectId(''); }}
                      className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors cursor-pointer font-medium shadow-sm"
                    >
                      <option value="" disabled>All Districts...</option>
                      <option value="raipur" className="text-black bg-white">Raipur</option>
                      <option value="bilaspur" className="text-black bg-white">Bilaspur</option>
                      <option value="bastar" className="text-black bg-white">Bastar</option>
                      <option value="durg" className="text-black bg-white">Durg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">2. Target Project</label>
                    <select 
                      required 
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      disabled={!selectedDistrict}
                      className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors cursor-pointer font-medium disabled:opacity-50 shadow-sm"
                    >
                      <option value="" disabled>
                        {selectedDistrict ? "Select Project..." : "Select District First"}
                      </option>
                      {filteredProjectsForDropdown.map(project => (
                        <option key={project.id} value={project.id} className="text-black bg-white">
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button 
                      type="submit" 
                      disabled={!selectedProjectId}
                      className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black text-[13px] font-bold uppercase tracking-wider h-10 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Open Workspace <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --- BOTTOM SECTION: DIRECTORY TABLE --- */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
                <input type="text" placeholder="Search Master Repository..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
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
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Project ID</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[25%]">Project Name</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">District</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Scheme</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%] text-center">Files</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[10%] border-l border-cghb-border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {currentProjects.map((project, index) => (
                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={project.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                          <td className="px-3 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                          <td className="px-3 py-4 font-mono text-[11px] font-bold text-[var(--color-text-main)] truncate" title={project.id}>{project.id}</td>
                          <td className="px-3 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={project.name}>{project.name}</td>
                          
                          <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.districtName}>
                            <span className="flex items-center gap-1"><MapPin size={10} className="text-cghb-yellow shrink-0"/>{project.districtName}</span>
                          </td>
                          
                          <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.scheme}>{project.scheme}</td>
                          
                          <td className="px-3 py-4 text-center">
                            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                              {getTotalDocs(project.docs)} Docs
                            </span>
                          </td>

                          {/* Actions: 3 Dots Dropdown */}
                          <td className="px-3 py-4 text-center relative border-l border-cghb-border/50">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); 
                                setActiveDropdown(activeDropdown === project.id ? null : project.id);
                              }} 
                              className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {activeDropdown === project.id && (
                              <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                                <button onClick={() => { handleTableAction(project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                                  {userRole === ROLES.COMMISSIONER ? <><Eye size={14} /> Review</> : <><FolderOpen size={14} /> Open</>}
                                </button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {currentProjects.length === 0 && (
                  <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
                    <Files size={32} className="text-[var(--color-text-muted)]/30" />
                    No project repositories found.
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
        /* PAGE 2: THE DOCUMENT OPTIONS HUB                          */
        /* ========================================================= */
          <motion.div
            key="page2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* --- HUB HEADER & BACK BUTTON --- */}
            <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
              <button 
                onClick={handleBack}
                className="p-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
                  Document <span className="text-cghb-yellow">Workspace</span>
                </h1>
                <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
                  <Building2 size={14} /> {activeWorkspace.name} <span className="opacity-50">|</span> {activeWorkspace.id}
                </p>
              </div>
            </div>

            {/* --- TOP-LEFT ALIGNED TAB MENU --- */}
            <div className="flex gap-6 border-b border-cghb-border/50">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); resetDocBuilder(); }}
                  className={`pb-3 text-[14px] font-bold uppercase tracking-wider transition-all relative ${activeTab === tab.id ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeDocTab" className="absolute bottom-[-1px] left-0 w-full h-[4px] bg-cghb-yellow rounded-t-full" />
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
                            <button className="text-[var(--color-text-muted)] hover:text-cghb-yellow transition-colors p-1.5 rounded hover:bg-cghb-border/10" title="Download">
                              <Download size={16} />
                            </button>
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
                          className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-md px-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="text" placeholder="Brief description..." value={newDocDesc} onChange={e => setNewDocDesc(e.target.value)} 
                          className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-md px-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <label className="w-full h-9 border border-dashed border-cghb-border bg-[var(--color-bg-main)] rounded-md flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:border-cghb-yellow hover:text-cghb-yellow text-[var(--color-text-muted)] shadow-sm">
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => { if (e.target.files.length > 0) setNewDocFile(e.target.files[0].name); }} />
                          {newDocFile ? <span className="flex items-center gap-1.5 text-emerald-500"><Check size={12}/> {newDocFile}</span> : <span className="flex items-center gap-1.5"><UploadCloud size={14}/> Select File</span>}
                        </label>
                      </td>
                      <td className="px-4 py-3 text-center border-l border-cghb-border/50">
                        <button 
                          onClick={handleAddDocument}
                          disabled={!newDocName.trim() || !newDocFile}
                          className="w-8 h-8 mx-auto flex items-center justify-center bg-cghb-yellow text-black rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
                  No documents uploaded in this category.
                </div>
              )}
            </div>

            {/* Context Summary */}
            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-blue-500 bg-blue-500/5 mt-4">
              <h4 className="text-[12px] font-bold text-blue-600 uppercase tracking-widest mb-2">Repository Active</h4>
              <p className="text-[13px] text-[var(--color-text-main)] font-medium">
                You are managing documents for <strong className="text-cghb-yellow">{activeWorkspace.name}</strong> under the {activeWorkspace.scheme}. Any files uploaded here will automatically be indexed and available to assigned personnel in the {activeWorkspace.districtName} district.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documentation;