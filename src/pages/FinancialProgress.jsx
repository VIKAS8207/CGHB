import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, IndianRupee, ArrowRight, Building2, 
  MapPin, PieChart, Activity, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

// NEW: Imported Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database for Financial Overview
export const mockFinancialProjects = [
  { 
    id: 'PRJ-1042', name: 'Atal Vihar Phase 2', district: 'Raipur', scheme: 'Atal Vihar Yojana', 
    status: 'Active', totalDeclared: 45.50, totalReleased: 12.00, lastUpdate: '12 May 2026' 
  },
  { 
    id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', district: 'Raipur', scheme: 'EWS Housing', 
    status: 'Planning', totalDeclared: 120.00, totalReleased: 0.00, lastUpdate: '05 May 2026' 
  },
  { 
    id: 'PRJ-1044', name: 'Bilaspur MIG Heights', district: 'Bilaspur', scheme: 'MIG Housing Dev', 
    status: 'Active', totalDeclared: 85.25, totalReleased: 45.00, lastUpdate: '01 May 2026' 
  },
  { 
    id: 'PRJ-1045', name: 'Bastar Standalone Villas', district: 'Bastar', scheme: 'Standalone', 
    status: 'Completed', totalDeclared: 12.00, totalReleased: 12.00, lastUpdate: '15 Apr 2026' 
  },
];

const FinancialProgress = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth(); // NEW: Added to check user role
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState(''); // NEW: State for project filter dropdown
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- FILTER & PAGINATION ---
  // NEW: Updated to filter by both search term and the new dropdown filter
  const searchResults = mockFinancialProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterProject === '' || p.name === filterProject;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Extract unique project names for the dropdown
  const uniqueProjectNames = [...new Set(mockFinancialProjects.map(item => item.name))];

  // --- KPI CALCULATIONS ---
  const totalStateDeclared = mockFinancialProjects.reduce((sum, p) => sum + p.totalDeclared, 0);
  const totalStateReleased = mockFinancialProjects.reduce((sum, p) => sum + p.totalReleased, 0);
  const overallProgress = totalStateDeclared > 0 ? Math.round((totalStateReleased / totalStateDeclared) * 100) : 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="border-b border-cghb-border pb-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase flex items-center gap-3">
          <IndianRupee className="text-cghb-yellow" size={28} />
          Financial <span className="text-cghb-yellow">Progress</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
          Monitor declared budgets, track released funds, and audit financial bills across all active projects.
        </p>
      </div>

      {/* --- KPI DASHBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-cghb-yellow flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Allocated Funds Declared</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">₹{totalStateDeclared.toFixed(2)} <span className="text-[14px] text-[var(--color-text-muted)]">Cr</span></h3>
          </div>
          <div className="w-12 h-12 bg-cghb-yellow/10 text-cghb-yellow rounded-full flex items-center justify-center">
            <PieChart size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Funds Released</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">₹{totalStateReleased.toFixed(2)} <span className="text-[14px] text-[var(--color-text-muted)]">Cr</span></h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Overall Fund Utilization</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{overallProgress}%</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* --- TABLE SEARCH CONTROLS --- */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search Project Name, District, or ID..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-11 md:h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        
        {/* NEW: Filter button replaced with a fully workable select dropdown */}
        <div className="relative">
          <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-main)] pointer-events-none" />
          <select 
            value={filterProject}
            onChange={(e) => {setFilterProject(e.target.value); setCurrentPage(1);}}
            className="flex items-center justify-center gap-2 h-11 md:h-10 pl-10 pr-8 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all cursor-pointer appearance-none focus:outline-none focus:border-cghb-yellow"
          >
            <option value="">All Projects</option>
            {uniqueProjectNames.map(name => (
              <option key={name} value={name} className="text-black">{name}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
            <ChevronRight size={14} className="rotate-90" />
          </div>
        </div>
      </div>

      {/* --- MASTER TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden relative">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1100px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Project Details</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">District</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Declared Budget</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Total Released</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[18%]">Financial Progress</th>
                
                {/* NEW: Action header only visible to non-commissioners */}
                {userRole !== ROLES.COMMISSIONER && (
                  <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[15%] border-l border-cghb-border">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentProjects.length === 0 ? (
                  <tr><td colSpan={userRole !== ROLES.COMMISSIONER ? "7" : "6"} className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium"><AlertCircle size={32} className="mx-auto mb-3 opacity-30"/> No financial records found.</td></tr>
                ) : (
                  currentProjects.map((project, index) => {
                    const percentage = project.totalDeclared > 0 ? Math.round((project.totalReleased / project.totalDeclared) * 100) : 0;
                    
                    return (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={project.id} className="hover:bg-cghb-border/5 transition-colors cursor-pointer group" onClick={() => navigate(`/dashboard/financial-progress/${project.id}`)}>
                        <td className="px-4 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="text-[13px] font-bold text-[var(--color-text-main)] truncate">{project.name}</div>
                          <div className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">{project.id}</div>
                        </td>
                        <td className="px-4 py-4 text-[11px] text-[var(--color-text-muted)] truncate"><span className="flex items-center gap-1"><MapPin size={10} className="text-cghb-yellow shrink-0"/>{project.district}</span></td>
                        
                        <td className="px-4 py-4 text-[13px] font-mono font-bold text-[var(--color-text-main)] truncate">₹{project.totalDeclared.toFixed(2)} Cr</td>
                        <td className="px-4 py-4 text-[13px] font-mono font-bold text-emerald-500 truncate">₹{project.totalReleased.toFixed(2)} Cr</td>
                        
                        <td className="px-4 py-4 pr-8">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Funded</span>
                            <span className="text-[11px] font-black text-cghb-yellow">{percentage}%</span>
                          </div>
                          <div className="w-full bg-[var(--color-bg-surface)] border border-cghb-border/50 rounded-full h-1.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} className="bg-cghb-yellow h-1.5 rounded-full" />
                          </div>
                        </td>
                        
                        {/* NEW: Action cell only visible to non-commissioners */}
                        {userRole !== ROLES.COMMISSIONER && (
                          <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                            <button className="mx-auto flex items-center justify-center gap-2 px-4 py-2 bg-cghb-yellow text-black rounded-lg text-[11px] font-bold uppercase tracking-wider group-hover:scale-105 transition-all shadow-md">
                              Manage Funds <ArrowRight size={14} />
                            </button>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--color-bg-surface)]">
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
    </div>
  );
};

export default FinancialProgress;