import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Search, Filter, TrendingUp, 
  UserCircle, CalendarDays, AlertTriangle, 
  CheckCircle2, Clock, ChevronLeft, ChevronRight,
  BarChart3
} from 'lucide-react';

// --- MOCK DATABASE ---
const mockProgressData = [
  { id: 'PRJ-1042', name: 'Atal Vihar Phase 2', aeName: 'Rajesh Sharma', contractor: 'L&T Construction', physical: 85, targetDate: '2026-10-15', status: 'On Track' },
  { id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', aeName: 'Amit Patel', contractor: 'NCC Limited', physical: 32, targetDate: '2027-02-20', status: 'Delayed' },
  { id: 'PRJ-1044', name: 'Bilaspur MIG Heights', aeName: 'Rajesh Sharma', contractor: 'Simplex Infra', physical: 95, targetDate: '2026-06-30', status: 'Near Completion' },
  { id: 'PRJ-1045', name: 'Bastar Standalone Villas', aeName: 'Suresh Verma', contractor: 'Dilip Buildcon', physical: 15, targetDate: '2027-11-01', status: 'Critical' },
  { id: 'PRJ-1046', name: 'Durg Residential Complex', aeName: 'Amit Patel', contractor: 'Ahluwalia Contracts', physical: 60, targetDate: '2026-12-10', status: 'On Track' },
  { id: 'PRJ-1047', name: 'Raipur Commercial Plaza', aeName: 'Suresh Verma', contractor: 'L&T Construction', physical: 100, targetDate: '2026-01-15', status: 'Completed' },
];

// Extract unique AEs and Projects for dropdowns
const uniqueAEs = [...new Set(mockProgressData.map(item => item.aeName))];
const uniqueProjects = [...new Set(mockProgressData.map(item => item.name))];

const WorkProgress = () => {
  // State
  const [selectedAE, setSelectedAE] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- FILTERING LOGIC ---
  const filteredData = mockProgressData.filter(item => {
    const matchesAE = selectedAE ? item.aeName === selectedAE : true;
    const matchesProject = selectedProject ? item.name === selectedProject : true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.contractor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAE && matchesProject && matchesSearch;
  });

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- HELPERS ---
  const getStatusConfig = (status) => {
    switch(status) {
      case 'On Track': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <CheckCircle2 size={12} /> };
      case 'Delayed': return { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: <Clock size={12} /> };
      case 'Critical': return { color: 'text-red-500', bg: 'bg-red-500/10', icon: <AlertTriangle size={12} /> };
      case 'Near Completion': return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <TrendingUp size={12} /> };
      case 'Completed': return { color: 'text-slate-500', bg: 'bg-slate-500/10', icon: <CheckCircle2 size={12} /> };
      default: return { color: 'text-slate-500', bg: 'bg-slate-500/10', icon: <Clock size={12} /> };
    }
  };

  const ProgressBar = ({ value }) => {
    return (
      <div className="w-full">
        <div className="flex justify-between text-[10px] font-bold mb-1">
          <span className="text-[var(--color-text-main)]">{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--color-bg-surface)] rounded-full overflow-hidden border border-cghb-border/50">
          <motion.div 
            initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }}
            className="h-full bg-cghb-yellow rounded-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="border-b border-cghb-border pb-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase flex items-center gap-3">
          <BarChart3 className="text-cghb-yellow" size={28} />
          Work <span className="text-cghb-yellow">Progress</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
          Track and monitor the physical milestones of ongoing housing developments.
        </p>
      </div>

      {/* --- FILTER & SEARCH GATEWAY --- */}
      <div className="glass-panel p-6 rounded-xl border-t-4 border-t-cghb-yellow shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* AE Filter */}
          <div className="w-full">
            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <UserCircle size={14} /> Assignee (AE)
            </label>
            <select 
              value={selectedAE}
              onChange={(e) => { setSelectedAE(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors cursor-pointer font-medium shadow-sm"
            >
              <option value="">All Engineers</option>
              {uniqueAEs.map(ae => <option key={ae} value={ae}>{ae}</option>)}
            </select>
          </div>

          {/* Project Filter */}
          <div className="w-full">
            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 size={14} /> Select Project
            </label>
            <select 
              value={selectedProject}
              onChange={(e) => { setSelectedProject(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors cursor-pointer font-medium shadow-sm"
            >
              <option value="">All Projects</option>
              {uniqueProjects.map(proj => <option key={proj} value={proj}>{proj}</option>)}
            </select>
          </div>

          {/* Search Bar */}
          <div className="w-full">
            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search size={14} /> Search Records
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
              <input 
                type="text" 
                placeholder="ID, Name, or Contractor..." 
                value={searchTerm} 
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
                className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-9 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" 
              />
            </div>
          </div>

        </div>
      </div>

      {/* --- PROGRESS TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1000px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[25%]">Project Name</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Assignee (AE)</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%] text-center">Overall Progress</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Target Date</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[15%] border-l border-cghb-border">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border">
              <AnimatePresence>
                {currentItems.map((item, index) => {
                  const statusConfig = getStatusConfig(item.status);
                  return (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className="bg-transparent border-b border-cghb-border/50 hover:bg-cghb-border/5 transition-colors">
                      
                      {/* S.No */}
                      <td className="px-4 py-4 text-center text-[12px] font-bold text-[var(--color-text-muted)] truncate">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Project Name */}
                      <td className="px-4 py-4">
                        <div className="text-[13px] font-bold text-[var(--color-text-main)] truncate" title={item.name}>{item.name}</div>
                      </td>

                      {/* Team */}
                      <td className="px-4 py-4">
                        <div className="text-[12px] font-bold text-[var(--color-text-main)] truncate" title={item.aeName}>{item.aeName}</div>
                      </td>

                      {/* Overall Progress */}
                      <td className="px-4 py-4">
                        <ProgressBar value={item.physical} />
                      </td>

                      {/* Target Date */}
                      <td className="px-4 py-4">
                        <div className="text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-[var(--color-text-muted)]" /> {item.targetDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded ${statusConfig.bg} ${statusConfig.color} text-[10px] font-bold uppercase tracking-wider whitespace-nowrap`}>
                          {statusConfig.icon} {item.status}
                        </span>
                      </td>

                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {currentItems.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <Search size={32} className="text-[var(--color-text-muted)]/30" />
              No progress records found matching your filters.
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredData.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}</strong> of <strong className="text-[var(--color-text-main)]">{filteredData.length}</strong>
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

export default WorkProgress;