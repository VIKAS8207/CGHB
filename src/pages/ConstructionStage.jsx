import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, HardHat, AlertCircle, Edit2, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';

// Mock data reflecting your new housing categories
const initialConstructionData = [
  { id: 'PRJ-1042', name: 'Atal Vihar Phase 2', status: 'Active', physicalProgress: 65, hig: 10, mig: 20, lig: 150, ews: 50, others: 0 },
  { id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', status: 'Active', physicalProgress: 30, hig: 0, mig: 0, lig: 50, ews: 100, others: 0 },
  { id: 'PRJ-1044', name: 'Bilaspur MIG Heights', status: 'Completed', physicalProgress: 100, hig: 20, mig: 80, lig: 0, ews: 0, others: 0 },
  { id: 'PRJ-1045', name: 'Raigarh Admin Complex', status: 'Active', physicalProgress: 0, hig: 5, mig: 0, lig: 15, ews: 0, others: 2 },
];

const ConstructionStage = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState(initialConstructionData);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-cghb-border pb-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase flex items-center gap-3">
          <HardHat className="text-cghb-yellow" size={28} />
          Construction <span className="text-cghb-yellow">Stage</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
          Monitor physical execution progress and house-wise completion tracking across all active projects.
        </p>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input 
            type="text" 
            placeholder="Search project by name..." 
            value={searchTerm} 
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
            className="w-full h-11 md:h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" 
          />
        </div>
        <button className="flex items-center justify-center gap-2 h-11 md:h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* MASTER DATA TABLE */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border overflow-hidden flex flex-col relative">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1100px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-6 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[18%]">Project Name</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[22%] text-center">Physical Progress</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[7%] text-center">HIG</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[7%] text-center">MIG</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[7%] text-center">LIG</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[7%] text-center">EWS</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[7%] text-center">Others</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[12%] border-l border-cghb-border">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentData.length === 0 ? (
                  <tr><td colSpan="9" className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium"><AlertCircle size={32} className="mx-auto mb-3 opacity-30"/> No projects found in this stage.</td></tr>
                ) : (
                  currentData.map((p, index) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={p.id} className="hover:bg-cghb-border/5 transition-colors">
                      
                      <td className="px-4 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate">{indexOfFirstItem + index + 1}</td>
                      
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-[var(--color-text-main)] truncate">{p.name}</div>
                        <div className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">{p.id}</div>
                      </td>
                      
                      <td className="px-4 py-4 pr-6">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Completion</span>
                          <span className="text-[11px] font-black text-cghb-yellow">{p.physicalProgress}%</span>
                        </div>
                        <div className="w-full bg-[var(--color-bg-surface)] border border-cghb-border/50 rounded-full h-1.5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${p.physicalProgress}%` }} transition={{ duration: 1 }} className="bg-cghb-yellow h-1.5 rounded-full" />
                        </div>
                      </td>

                      {/* Map through the new housing categories */}
                      {[p.hig, p.mig, p.lig, p.ews, p.others].map((val, i) => (
                        <td key={i} className="px-2 py-4 text-center text-[12px] font-bold text-[var(--color-text-main)]">
                          {val > 0 ? (
                            <span className="px-2 py-1 bg-[var(--color-bg-surface)] border border-cghb-border rounded-md shadow-sm">{val}</span>
                          ) : (
                            <span className="text-[var(--color-text-muted)] opacity-50 font-normal">- NA -</span>
                          )}
                        </td>
                      ))}

                      <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                        {p.status === 'Completed' ? (
                          <button 
                            onClick={() => navigate(`/dashboard/construction-stage/${p.id}?mode=view`)}
                            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all shadow-sm border border-blue-500/20"
                          >
                            <Eye size={14} /> View Log
                          </button>
                        ) : (
                          <button 
                            onClick={() => navigate(`/dashboard/construction-stage/${p.id}`)}
                            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-cghb-yellow text-black rounded-lg text-[11px] font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-md"
                          >
                            <Edit2 size={14} /> Update
                          </button>
                        )}
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

export default ConstructionStage;