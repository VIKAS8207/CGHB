import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, CheckSquare, Square } from 'lucide-react';

const ConstructionWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock: Categories found in this project (in a real app, you'd fetch this from the project object)
  const availableGroups = ['CRMIG', 'JMIG', 'LIG', 'SEG'];
  const [activeTab, setActiveTab] = useState(availableGroups[0]);

  // Houses State: { CRMIG: [{ id, houseNo, levels: { ... }, isLocked: false }] }
  const [houseData, setHouseData] = useState({});

  const levels = ['excavation', 'foundation', 'plinth', 'lintel', 'roof', 'slab', 'finishing', 'complete'];

  const addRow = () => {
    setHouseData(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), { id: Date.now(), houseNo: '', levels: {}, isLocked: false }]
    }));
  };

  const updateLevel = (rowId, level, value) => {
    setHouseData(prev => {
      const updatedRows = prev[activeTab].map(row => {
        if (row.id === rowId) {
          let newLevels = { ...row.levels, [level]: value };
          // Logic: If 'complete' is checked, auto-check everything before it
          if (level === 'complete' && value === true) {
            levels.forEach(l => newLevels[l] = true);
          }
          return { ...row, levels: newLevels };
        }
        return row;
      });
      return { ...prev, [activeTab]: updatedRows };
    });
  };

  const lockRow = (rowId) => {
    setHouseData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(row => row.id === rowId ? { ...row, isLocked: true } : row)
    }));
  };

  const deleteRow = (rowId) => {
    setHouseData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(row => row.id !== rowId)
    }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-[12px] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
        <ArrowLeft size={16} /> Back to Construction Stage
      </button>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {availableGroups.map(group => (
          <button 
            key={group} 
            onClick={() => setActiveTab(group)}
            className={`px-4 py-2 rounded-lg text-[12px] font-bold ${activeTab === group ? 'bg-cghb-yellow text-black' : 'bg-[var(--color-bg-surface)] border border-cghb-border'}`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cghb-border text-[10px] uppercase text-[var(--color-text-muted)]">
              <th className="p-3">House No.</th>
              {levels.map(l => <th key={l} className="p-3 text-center">{l}</th>)}
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {(houseData[activeTab] || []).map(row => (
              <tr key={row.id} className="border-b border-cghb-border/50">
                <td className="p-3">
                  <input 
                    disabled={row.isLocked}
                    value={row.houseNo} 
                    onChange={(e) => setHouseData(prev => ({...prev, [activeTab]: prev[activeTab].map(r => r.id === row.id ? {...r, houseNo: e.target.value} : r)}))}
                    className="w-24 h-9 p-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded"
                  />
                </td>
                {levels.map(l => (
                  <td key={l} className="p-3 text-center">
                    <button onClick={() => updateLevel(row.id, l, !row.levels[l])}>
                      {row.levels[l] ? <CheckSquare className="text-cghb-yellow" size={20} /> : <Square size={20} />}
                    </button>
                  </td>
                ))}
                <td className="p-3 flex gap-2">
                  {!row.isLocked && <button onClick={() => lockRow(row.id)} className="bg-emerald-500 text-white p-2 rounded"><Save size={14} /></button>}
                  <button onClick={() => deleteRow(row.id)} className="bg-red-500 text-white p-2 rounded"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} className="mt-4 flex items-center gap-2 text-[12px] font-bold text-cghb-yellow hover:text-cghb-yellow/80">
          <Plus size={16} /> Add Row
        </button>
      </div>
    </div>
  );
};

export default ConstructionWorkshop;