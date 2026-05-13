import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, PlusCircle, Search, Filter, 
  IndianRupee, Edit, Trash2, Eye, Save, AlertCircle,
  ChevronLeft, ChevronRight, Building2, MoreVertical, X
} from 'lucide-react';

// Import Auth Context and Roles
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Data (Status removed)
const initialSchemes = [
  { id: 'SCH-001', officialName: 'Atal Vihar Yojana', agencyDepartment: 'CGHB Urban', schemeCategory: 'LIG / EWS', schemeType: 'Greenfield', budget: '₹150 Cr' },
  { id: 'SCH-002', officialName: 'Mor Makan Mor Aas', agencyDepartment: 'SUDA', schemeCategory: 'EWS', schemeType: 'Redevelopment', budget: '₹85 Cr' },
  { id: 'SCH-003', officialName: 'Nava Raipur Premium', agencyDepartment: 'NRDA', schemeCategory: 'HIG', schemeType: 'High-Rise', budget: '₹320 Cr' },
  { id: 'SCH-004', officialName: 'Bilaspur Heights', agencyDepartment: 'CGHB Urban', schemeCategory: 'MIG', schemeType: 'Greenfield', budget: '₹110 Cr' },
  { id: 'SCH-005', officialName: 'Durg Residential', agencyDepartment: 'CGHB Rural', schemeCategory: 'LIG', schemeType: 'Slum Rehab', budget: '₹45 Cr' },
  { id: 'SCH-006', officialName: 'Bastar Eco Villas', agencyDepartment: 'NRDA', schemeCategory: 'Mixed Use', schemeType: 'Greenfield', budget: '₹210 Cr' },
  { id: 'SCH-007', officialName: 'Raipur Smart City', agencyDepartment: 'SUDA', schemeCategory: 'HIG', schemeType: 'Redevelopment', budget: '₹500 Cr' },
];

const Schemes = () => {
  const { userRole } = useAuth();

  const [schemes, setSchemes] = useState(initialSchemes);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track 3-dot dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    officialName: '',
    agencyDepartment: '',
    schemeCategory: '',
    schemeType: '',
    budget: '',
  });

  // Dynamic KPI Calculations
  const uniqueAgencies = new Set(schemes.map(s => s.agencyDepartment)).size;
  const totalBudget = schemes.reduce((acc, curr) => {
    const val = parseFloat(curr.budget.replace(/[^0-9.]/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- ACTIONS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setSchemes(schemes.map(s => s.id === editingId ? {
        ...s, ...formData, budget: formData.budget.includes('Cr') ? formData.budget : `₹${formData.budget} Cr`
      } : s));
      setEditingId(null);
    } else {
      const newScheme = {
        id: `SCH-00${schemes.length + 1}`,
        ...formData,
        budget: `₹${formData.budget} Cr`,
      };
      setSchemes([newScheme, ...schemes]);
      setCurrentPage(1); 
    }
    setFormData({ officialName: '', agencyDepartment: '', schemeCategory: '', schemeType: '', budget: '' });
    setIsFormOpen(false);
  };

  const handleEdit = (scheme) => {
    setEditingId(scheme.id);
    setFormData({
      officialName: scheme.officialName,
      agencyDepartment: scheme.agencyDepartment,
      schemeCategory: scheme.schemeCategory,
      schemeType: scheme.schemeType,
      budget: scheme.budget.replace(/[^0-9.]/g, ''),
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this scheme?")) {
      setSchemes(schemes.filter(s => s.id !== id));
    }
  };

  const handleView = (name) => {
    alert(`Opening Detailed View for ${name}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // --- FILTER & SORT LOGIC ---
  const filteredSchemes = schemes.filter(scheme => 
    scheme.officialName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    scheme.agencyDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSchemes = [...filteredSchemes].sort((a, b) => b.id.localeCompare(a.id));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchemes = sortedSchemes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedSchemes.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- COMMAND CENTER HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cghb-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Master <span className="text-cghb-yellow">Schemes</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
            {userRole === ROLES.COMMISSIONER 
              ? "Monitor active government housing program portfolios."
              : "Initialize and manage new government housing schemes."}
          </p>
        </div>
        
        {/* RIGHT ALIGNED BUTTON: Opens the form engine */}
        {userRole !== ROLES.COMMISSIONER && (
          <button 
            onClick={() => { setIsFormOpen(!isFormOpen); if(isFormOpen) setEditingId(null); }}
            className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all
              ${isFormOpen ? 'bg-[var(--color-bg-main)] text-[var(--color-text-main)] border border-cghb-border hover:bg-cghb-border/20' : 'bg-cghb-yellow text-black hover:opacity-90 shadow-md shadow-cghb-yellow/10'}`}
          >
            {isFormOpen ? <><X size={16} /> Close Form</> : <><PlusCircle size={16} /> Initialize Scheme</>}
          </button>
        )}
      </div>

      {/* --- GENERIC KPI DASHBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-cghb-yellow flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Active Schemes</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{schemes.length}</h3>
          </div>
          <div className="w-12 h-12 bg-cghb-yellow/10 text-cghb-yellow rounded-full flex items-center justify-center">
            <LayoutGrid size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Participating Agencies</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{uniqueAgencies}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Portfolio Budget</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">₹{totalBudget} Cr</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
        </div>
      </div>

      {/* --- FORM ENGINE (Hidden for Commissioner) --- */}
      {userRole !== ROLES.COMMISSIONER && (
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="overflow-hidden w-full"
            >
              <div className={`bg-[var(--color-bg-main)] border p-8 rounded-2xl shadow-lg relative mt-1 ${editingId ? 'border-blue-500/50' : 'border-cghb-border'}`}>
                <div className="flex items-center justify-between mb-8 border-b border-cghb-border/50 pb-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${editingId ? 'bg-blue-500 text-white border-blue-600' : 'bg-cghb-yellow/10 text-cghb-yellow border-cghb-yellow/20'}`}>
                      {editingId ? <Edit size={18} /> : <PlusCircle size={18} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? `Update Scheme Details: ${editingId}` : 'Scheme Initialization Form'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">Define master parameters for the new housing program.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Official Name</label>
                      <input 
                        required type="text" placeholder="e.g., Rajiv Gandhi Awas Yojana"
                        value={formData.officialName} onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                        className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Agency / Department</label>
                      <input 
                        required type="text" placeholder="e.g., CGHB Urban, SUDA"
                        value={formData.agencyDepartment} onChange={(e) => setFormData({ ...formData, agencyDepartment: e.target.value })}
                        className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Scheme Category</label>
                      <input 
                        required type="text" placeholder="e.g., EWS, HIG, Mixed Use"
                        value={formData.schemeCategory} onChange={(e) => setFormData({ ...formData, schemeCategory: e.target.value })}
                        className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Type of Scheme</label>
                      <input 
                        required type="text" placeholder="e.g., Greenfield, Slum Rehab"
                        value={formData.schemeType} onChange={(e) => setFormData({ ...formData, schemeType: e.target.value })}
                        className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Total Budget (Cr)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
                        <input 
                          required type="number" placeholder="e.g., 250"
                          value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg pl-10 pr-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-cghb-border/50 mt-2">
                    <button type="submit" className={`flex items-center gap-2 text-black text-[13px] font-bold uppercase tracking-wider h-11 px-8 rounded-lg transition-all shadow-md ${editingId ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-cghb-yellow shadow-cghb-yellow/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                      <Save size={16} /> {editingId ? 'Save Changes' : 'Deploy Scheme'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* --- TABLE SEARCH CONTROLS --- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input 
            type="text" placeholder="Search schemes by name, agency, or ID..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
            className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" 
          />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- DATA TABLE (MODERN & STRICT FIXED) --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full">
          <table className="w-full table-fixed text-left whitespace-nowrap">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                {/* Widths finely tuned to equal 100% */}
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Scheme ID</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[28%]">Official Name</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Agency</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Category</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Type</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Budget</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentSchemes.map((scheme, index) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={scheme.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                    <td className="px-4 py-4 text-center text-[12px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                    <td className="px-4 py-4 font-mono text-[12px] font-bold text-[var(--color-text-main)] truncate" title={scheme.id}>{scheme.id}</td>
                    <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-text-main)] truncate" title={scheme.officialName}>{scheme.officialName}</td>
                    <td className="px-4 py-4 text-[13px] font-medium text-[var(--color-text-main)] truncate" title={scheme.agencyDepartment}>{scheme.agencyDepartment}</td>
                    <td className="px-4 py-4 text-[13px] font-medium text-[var(--color-text-main)] truncate" title={scheme.schemeCategory}>{scheme.schemeCategory}</td>
                    <td className="px-4 py-4 text-[13px] font-medium text-[var(--color-text-main)] truncate" title={scheme.schemeType}>{scheme.schemeType}</td>
                    <td className="px-4 py-4 font-black text-[13px] text-[var(--color-text-main)] truncate" title={scheme.budget}>{scheme.budget}</td>
                    
                    {/* Actions: 3 Dots Dropdown */}
                    <td className="px-4 py-4 text-center relative border-l border-cghb-border/50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveDropdown(activeDropdown === scheme.id ? null : scheme.id);
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === scheme.id && (
                        <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                          <button onClick={() => { handleView(scheme.officialName); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                            <Eye size={14} /> View
                          </button>
                          {userRole !== ROLES.COMMISSIONER && (
                            <>
                              <button onClick={() => { handleEdit(scheme); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => { handleDelete(scheme.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10">
                                <Trash2 size={14} /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {currentSchemes.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <AlertCircle size={32} className="text-[var(--color-text-muted)]/30" />
              No schemes found matching the criteria.
            </div>
          )}
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredSchemes.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedSchemes.length)}</strong> of <strong className="text-[var(--color-text-main)]">{sortedSchemes.length}</strong>
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

export default Schemes;