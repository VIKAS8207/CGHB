import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Save, Plus, Trash2, CheckSquare, Square, 
  MoreVertical, Edit, Building2, HardHat, AlertCircle
} from 'lucide-react';

const ConstructionWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock: Categories available in this specific project
  const availableGroups = ['HIG', 'MIG', 'LIG', 'EWS', 'Others']; // This can be dynamic based on project data
  const [activeTab, setActiveTab] = useState(availableGroups[0]);

  // Houses State: 
  // Structure: { CRMIG: [{ id, houseNo, levels: {}, houseNoLocked: false, statusLocked: false }] }
  const [houseData, setHouseData] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  const levels = [
    { key: 'excavation', label: 'Excavation' },
    { key: 'foundation', label: 'Foundation' },
    { key: 'plinth', label: 'Plinth' },
    { key: 'lintel', label: 'Lintel' },
    { key: 'roof', label: 'Roof' },
    { key: 'slab', label: 'Slab Casting' },
    { key: 'finishing', label: 'Finishing' },
    { key: 'complete', label: 'Complete' }
  ];

  // Close dropdown on click outside or scroll
  useEffect(() => {
    const closeDropdown = () => setActiveDropdown(null);
    document.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", closeDropdown, true); 
    return () => {
      document.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", closeDropdown, true);
    };
  }, []);

  const addRow = () => {
    setHouseData(prev => ({
      ...prev,
      [activeTab]: [
        ...(prev[activeTab] || []), 
        { id: Date.now(), houseNo: '', levels: {}, houseNoLocked: false, statusLocked: false }
      ]
    }));
  };

  const updateLevel = (rowId, levelKey, value) => {
    setHouseData(prev => {
      const updatedRows = prev[activeTab].map(row => {
        if (row.id === rowId) {
          if (row.statusLocked) return row; // Prevent changes if status is locked

          let newLevels = { ...row.levels, [levelKey]: value };
          
          // Logic: If any stage is checked, auto-check everything before it
          if (value === true) {
            const levelIndex = levels.findIndex(l => l.key === levelKey);
            for (let i = 0; i <= levelIndex; i++) {
              newLevels[levels[i].key] = true;
            }
          }
          
          return { ...row, levels: newLevels };
        }
        return row;
      });
      return { ...prev, [activeTab]: updatedRows };
    });
  };

  // ACTIONS
  const handleUpdate = (rowId) => {
    setHouseData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(row => 
        row.id === rowId ? { ...row, houseNoLocked: true, statusLocked: true } : row
      )
    }));
  };

  const handleEdit = (rowId) => {
    setHouseData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(row => 
        row.id === rowId ? { ...row, houseNoLocked: true, statusLocked: false } : row
      )
    }));
  };

  const handleDelete = (rowId) => {
    if(window.confirm("Are you sure you want to remove this house record?")) {
      setHouseData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(row => row.id !== rowId)
      }));
    }
  };

  const currentRows = houseData[activeTab] || [];

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Construction <span className="text-cghb-yellow">Workshop</span>
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
            <Building2 size={14} className="text-cghb-yellow" /> Project ID: {id} <span className="opacity-50">|</span> Field Execution Tracker
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {availableGroups.map(group => (
          <button 
            key={group} 
            onClick={() => setActiveTab(group)}
            className={`px-6 py-2.5 rounded-lg text-[13px] font-bold tracking-wider uppercase transition-all shadow-sm
              ${activeTab === group 
                ? 'bg-cghb-yellow text-black' 
                : 'bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20'}`}
          >
            {group} Housing
          </button>
        ))}
      </div>

      {/* TABLE WORKSPACE */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-cghb-border bg-[var(--color-bg-surface)]">
          <h3 className="text-[14px] font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <HardHat size={16} className="text-cghb-yellow"/> {activeTab} Progress Log
          </h3>
          <button 
            onClick={addRow} 
            className="flex items-center gap-2 px-4 py-2 bg-cghb-yellow text-black rounded-lg text-[12px] font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-sm"
          >
            <Plus size={14} /> Add House
          </button>
        </div>

        {/* Removed min-h-[300px] so the table perfectly wraps its content */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[1200px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider w-[12%]">House No.</th>
                {levels.map(l => (
                  <th key={l.key} className="px-3 py-4 font-bold text-[10px] uppercase tracking-wider text-center">
                    <span className="block truncate max-w-[80px] mx-auto" title={l.label}>{l.label}</span>
                  </th>
                ))}
                <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider text-center w-[8%] border-l border-cghb-border">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={levels.length + 2} className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle size={32} className="opacity-30" />
                        No houses logged for {activeTab} yet. Click "Add House" to begin tracking.
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRows.map(row => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={row.id} className="hover:bg-cghb-border/5 transition-colors">
                      
                      {/* House Number Input */}
                      <td className="px-6 py-3">
                        <input 
                          disabled={row.houseNoLocked}
                          placeholder="e.g. A-101"
                          value={row.houseNo} 
                          onChange={(e) => setHouseData(prev => ({...prev, [activeTab]: prev[activeTab].map(r => r.id === row.id ? {...r, houseNo: e.target.value} : r)}))}
                          className="w-28 h-9 px-3 bg-[var(--color-bg-main)] border border-cghb-border text-[13px] font-bold text-[var(--color-text-main)] rounded-md focus:outline-none focus:border-cghb-yellow disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        />
                      </td>

                      {/* Checkboxes */}
                      {levels.map(l => (
                        <td key={l.key} className="px-3 py-3 text-center">
                          <button 
                            disabled={row.statusLocked}
                            onClick={() => updateLevel(row.id, l.key, !row.levels[l.key])}
                            className={`p-1.5 rounded transition-all ${row.statusLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-cghb-border/20'}`}
                          >
                            {row.levels[l.key] 
                              ? <CheckSquare className="text-cghb-yellow mx-auto" size={20} /> 
                              : <Square className="text-[var(--color-text-muted)] mx-auto" size={20} />
                            }
                          </button>
                        </td>
                      ))}

                      {/* Actions: 3 Dots Dropdown Trigger */}
                      <td className="px-4 py-3 text-center relative border-l border-cghb-border/50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            if (activeDropdown?.id === row.id) {
                              setActiveDropdown(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActiveDropdown({
                                id: row.id,
                                top: rect.bottom + 4,
                                left: rect.left - 130 
                              });
                            }
                          }} 
                          className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)] p-1.5 rounded transition-colors hover:bg-cghb-border/20"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- GLOBAL FIXED DROPDOWN MENU --- */}
      <AnimatePresence>
        {activeDropdown && (() => {
          const row = currentRows.find(r => r.id === activeDropdown.id);
          if (!row) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: activeDropdown.top, left: activeDropdown.left, zIndex: 9999 }}
              className="w-36 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-2xl flex flex-col py-1.5 text-left"
              onClick={(e) => e.stopPropagation()} 
            >
              <button 
                onClick={() => { handleUpdate(row.id); setActiveDropdown(null); }} 
                className="px-4 py-2.5 text-[12px] font-bold text-emerald-500 flex items-center gap-2.5 hover:bg-emerald-500/10"
              >
                <Save size={14} /> Update
              </button>
              <button 
                onClick={() => { handleEdit(row.id); setActiveDropdown(null); }} 
                className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10"
              >
                <Edit size={14} /> Edit Status
              </button>
              <button 
                onClick={() => { handleDelete(row.id); setActiveDropdown(null); }} 
                className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10 border-t border-cghb-border/50 mt-1 pt-2.5"
              >
                <Trash2 size={14} /> Delete
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default ConstructionWorkshop;