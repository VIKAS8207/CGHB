import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, Building2, ArrowRight, ArrowLeft, Search, Filter, Eye, Edit,
  Calendar, ShieldCheck, Beaker, ClipboardList, HardHat, MoreVertical, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Global Database for the Table & Dropdowns
const mockProjects = [
  { id: 'PRJ-1042', name: 'Atal Vihar Phase 2', district: 'raipur', districtName: 'Raipur', scheme: 'Atal Vihar Yojana', status: 'Active', reportsFiled: 24 },
  { id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', district: 'raipur', districtName: 'Raipur', scheme: 'EWS Housing', status: 'Planning', reportsFiled: 8 },
  { id: 'PRJ-1044', name: 'Bilaspur MIG Heights', district: 'bilaspur', districtName: 'Bilaspur', scheme: 'MIG Housing Dev', status: 'Active', reportsFiled: 56 },
  { id: 'PRJ-1045', name: 'Bastar Standalone Villas', district: 'bastar', districtName: 'Bastar', scheme: 'Standalone', status: 'Completed', reportsFiled: 112 },
  { id: 'PRJ-1046', name: 'Durg Residential Complex', district: 'durg', districtName: 'Durg', scheme: 'LIG Housing', status: 'Active', reportsFiled: 15 },
];

const SiteVisit = () => {
  const { userRole, user } = useAuth(); 

  // Auto-fill the district based on the assigned engineer's profile (Mocked to 'raipur' for now)
  const assignedDistrict = user?.district || 'raipur';
  const assignedDistrictName = mockProjects.find(p => p.district === assignedDistrict)?.districtName || 'Raipur';

  // State for the Top Form (Quick Select)
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // State for Navigation: null means we are on Page 1. If it has data, we are on Page 2.
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  
  // Search & Table States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- ACTIONS ---

  const handleQuickSelectSubmit = (e) => {
    e.preventDefault();
    const project = mockProjects.find(p => p.id === selectedProjectId);
    if (project) setActiveWorkspace(project);
  };

  const handleTableAction = (project) => {
    setActiveWorkspace(project);
  };

  const handleBack = () => {
    setActiveWorkspace(null);
    setSelectedProjectId('');
  };

  // Close 3-dot dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    // Add scroll listener to prevent floating dropdowns
    window.addEventListener("scroll", handleClickOutside, true); 
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleClickOutside, true);
    };
  }, []);

  // --- FILTERS & PAGINATION ---
  // The dropdown ONLY shows projects assigned to the engineer's specific district
  const filteredProjectsForDropdown = mockProjects.filter(p => p.district === assignedDistrict);

  const searchResults = mockProjects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.districtName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                Field <span className="text-cghb-yellow">Operations</span>
              </h1>
              <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
                Access site inspection data, quality control benchmarks, and lab reports.
              </p>
            </div>

            {/* --- TOP SECTION: QUICK SELECT GATEWAY --- */}
            <div className="glass-panel p-6 rounded-xl border-t-4 border-t-cghb-yellow relative overflow-hidden">
              <div className="absolute top-0 right-10 w-64 h-64 bg-cghb-yellow/5 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-8 h-8 bg-cghb-yellow/10 text-cghb-yellow flex items-center justify-center rounded-lg">
                  <HardHat size={16} />
                </div>
                <h2 className="text-[15px] font-bold text-[var(--color-text-main)]">Quick Access Gateway</h2>
              </div>

              <form onSubmit={handleQuickSelectSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end relative z-10">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} /> 1. Assigned District
                  </label>
                  {/* Read-only field showing assigned district */}
                  <div className="w-full h-11 md:h-10 bg-[var(--color-bg-main)] border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 flex items-center font-bold opacity-70 cursor-not-allowed shadow-inner">
                    {assignedDistrictName}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building2 size={14} /> 2. Target Project
                  </label>
                  <select 
                    required 
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full h-11 md:h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors cursor-pointer font-medium shadow-sm"
                  >
                    <option value="" disabled>Select Project...</option>
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
                    className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black text-[13px] font-bold uppercase tracking-wider h-11 md:h-10 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Access Site Data <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </div>

            {/* --- BOTTOM SECTION: DIRECTORY TABLE --- */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
                <input type="text" placeholder="Search Master Repository..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-11 md:h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
              </div>
              <button className="flex items-center justify-center gap-2 h-11 md:h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
                <Filter size={14} /> Filter
              </button>
            </div>

            <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden relative">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1000px]">
                  <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
                    <tr>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Project ID</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[25%]">Project Name</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">District</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Scheme</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%] text-center">Reports</th>
                      <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[10%] border-l border-cghb-border">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cghb-border/50">
                    <AnimatePresence>
                      {currentProjects.map((project, index) => (
                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={project.id} className="bg-transparent hover:bg-cghb-border/5 transition-colors">
                          <td className="px-3 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate">{indexOfFirstItem + index + 1}</td>
                          <td className="px-3 py-4 font-mono text-[11px] font-bold text-[var(--color-text-main)] truncate" title={project.id}>{project.id}</td>
                          <td className="px-3 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={project.name}>{project.name}</td>
                          
                          <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.districtName}>
                            <span className="flex items-center gap-1"><MapPin size={10} className="text-cghb-yellow shrink-0"/>{project.districtName}</span>
                          </td>
                          
                          <td className="px-3 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.scheme}>{project.scheme}</td>
                          
                          <td className="px-3 py-4 text-center">
                            <span className="px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                              {project.reportsFiled} Filed
                            </span>
                          </td>

                          {/* Actions: 3 Dots Dropdown */}
                          <td className="px-3 py-4 text-center border-l border-cghb-border/50">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); 
                                if (activeDropdown === project.id) {
                                  setActiveDropdown(null);
                                } else {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setActiveDropdown({
                                    id: project.id,
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
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {currentProjects.length === 0 && (
                  <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
                    <HardHat size={32} className="text-[var(--color-text-muted)]/30" />
                    No active sites found.
                  </div>
                )}
              </div>

              {/* --- ALWAYS VISIBLE PAGINATION --- */}
              <div className="border-t border-cghb-border px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--color-bg-surface)]">
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
        /* PAGE 2: THE SITE VISIT OPTIONS HUB (ROUTING LINKS)        */
        /* ========================================================= */
          <motion.div
            key="page2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* --- HUB HEADER & BACK BUTTON --- */}
            <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
              <button 
                onClick={handleBack}
                className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
                  Site <span className="text-cghb-yellow">Workspace</span>
                </h1>
                <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
                  <Building2 size={14} /> {activeWorkspace.name} <span className="opacity-50">|</span> {activeWorkspace.id}
                </p>
              </div>
            </div>

            {/* --- OPTIONS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Option 1: Weekly Update */}
              <Link to={`/dashboard/site-visit/${activeWorkspace.id}/weekly-update`} className="glass-panel p-6 rounded-xl hover:border-cghb-yellow transition-colors group cursor-pointer relative overflow-hidden">
                <div className="w-10 h-10 bg-[var(--color-bg-main)] border border-cghb-border rounded-lg flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-cghb-yellow group-hover:scale-110 transition-all mb-4 shadow-sm">
                  <Calendar size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-[var(--color-text-main)] mb-1">Weekly Update</h3>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Progress & Milestones</p>
              </Link>

              {/* Option 2: Quality Aspect */}
              <Link to={`/dashboard/site-visit/${activeWorkspace.id}/quality-aspect`} className="glass-panel p-6 rounded-xl hover:border-cghb-yellow transition-colors group cursor-pointer relative overflow-hidden">
                <div className="w-10 h-10 bg-[var(--color-bg-main)] border border-cghb-border rounded-lg flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-cghb-yellow group-hover:scale-110 transition-all mb-4 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-[var(--color-text-main)] mb-1">Quality Aspect</h3>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Compliance & Standards</p>
              </Link>

              {/* Option 3: Material Testing */}
              <Link to={`/dashboard/site-visit/${activeWorkspace.id}/material-testing`} className="glass-panel p-6 rounded-xl hover:border-cghb-yellow transition-colors group cursor-pointer relative overflow-hidden">
                <div className="w-10 h-10 bg-[var(--color-bg-main)] border border-cghb-border rounded-lg flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-cghb-yellow group-hover:scale-110 transition-all mb-4 shadow-sm">
                  <Beaker size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-[var(--color-text-main)] mb-1">Material Testing</h3>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Field Sample Analysis</p>
              </Link>

              {/* Option 4: Onsite Testing Lab */}
              <Link to={`/dashboard/site-visit/${activeWorkspace.id}/onsite-testing`} className="glass-panel p-6 rounded-xl hover:border-cghb-yellow transition-colors group cursor-pointer relative overflow-hidden">
                <div className="w-10 h-10 bg-[var(--color-bg-main)] border border-cghb-border rounded-lg flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-cghb-yellow group-hover:scale-110 transition-all mb-4 shadow-sm">
                  <ClipboardList size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-[var(--color-text-main)] mb-1">Onsite Testing Lab</h3>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Lab Results & Certs</p>
              </Link>

            </div>

            {/* Context Summary */}
            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-emerald-500 bg-emerald-500/5">
              <h4 className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Active Field Data Target</h4>
              <p className="text-[13px] text-[var(--color-text-main)] font-medium">
                You are submitting field operational reports for <strong className="text-cghb-yellow">{activeWorkspace.name}</strong>. Reports submitted here will trigger immediate notification to the Department Head overseeing the {activeWorkspace.districtName} grid.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* --- GLOBAL FIXED DROPDOWN MENU --- */}
      <AnimatePresence>
        {activeDropdown && (() => {
          const project = mockProjects.find(p => p.id === activeDropdown.id);
          if (!project) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: activeDropdown.top, left: activeDropdown.left, zIndex: 9999 }}
              className="w-36 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-2xl flex flex-col py-1.5 text-left"
              onClick={(e) => e.stopPropagation()} 
            >
              <button onClick={() => { handleTableAction(project); setActiveDropdown(null); }} className="px-4 py-3 md:py-2.5 text-[13px] md:text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                <Eye size={14} /> Open Site
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default SiteVisit;