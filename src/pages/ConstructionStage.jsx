import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // FIX: Imported useNavigate
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, HardHat, AlertCircle, Edit2, Eye 
} from 'lucide-react';

// Mock data reflecting your required fields
const initialConstructionData = [
  { id: 'PRJ-1042', name: 'Atal Vihar Phase 2', status: 'Active', physicalProgress: 65, crmig: 20, jmig: 30, lig: 50, seg: 10 },
  { id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', status: 'Active', physicalProgress: 30, crmig: 0, jmig: 0, lig: 100, seg: 0 },
  { id: 'PRJ-1044', name: 'Bilaspur MIG Heights', status: 'Completed', physicalProgress: 100, crmig: 40, jmig: 40, lig: 0, seg: 0 },
];

const ConstructionStage = () => {
  const navigate = useNavigate(); // FIX: Initialized hook
  const [data, setData] = useState(initialConstructionData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans space-y-6">
      <div className="border-b border-cghb-border pb-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase flex items-center gap-3">
          <HardHat className="text-cghb-yellow" size={28} />
          Construction <span className="text-cghb-yellow">Stage</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search project by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all" />
        </div>
      </div>

      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[1100px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider w-[20%]">Project Name</th>
                <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[25%] text-center">Physical Progress</th>
                <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[10%] text-center">CRMIG</th>
                <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[10%] text-center">JMIG</th>
                <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[10%] text-center">LIG</th>
                <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[10%] text-center">SEG</th>
                <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              {currentData.map((p) => (
                <tr key={p.id} className="hover:bg-cghb-border/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-[13px] text-[var(--color-text-main)]">{p.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-[var(--color-bg-surface)] rounded-full border border-cghb-border/50 overflow-hidden">
                        <div className="bg-cghb-yellow h-full" style={{ width: `${p.physicalProgress}%` }} />
                      </div>
                      <span className="text-[11px] font-black w-8 text-right">{p.physicalProgress}%</span>
                    </div>
                  </td>
                  {[p.crmig, p.jmig, p.lig, p.seg].map((val, i) => (
                    <td key={i} className="px-4 py-4 text-center text-[12px] font-bold text-[var(--color-text-main)]">
                      {val > 0 ? val : <span className="text-[var(--color-text-muted)] opacity-50 font-normal">NA</span>}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    {p.status === 'Completed' ? (
                      <button 
                        onClick={() => navigate(`/dashboard/construction-stage/${p.id}?mode=view`)}
                        className="flex items-center gap-1.5 mx-auto px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg text-[11px] font-bold border border-blue-500/20 hover:bg-blue-500/20"
                      >
                        <Eye size={14} /> View
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/dashboard/construction-stage/${p.id}`)}
                        className="flex items-center gap-1.5 mx-auto px-3 py-1.5 bg-cghb-yellow text-black rounded-lg text-[11px] font-bold hover:scale-105 transition-all"
                      >
                        <Edit2 size={14} /> Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConstructionStage;