import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Search, Filter, ChevronLeft, ChevronRight, 
  X, Phone, Mail, UserCog, Save, Building2, Eye, Edit, 
  Trash2, AlertCircle, MoreVertical, MapPin, Stamp 
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Data updated to flat structure (no sub-fields, no status)
const initialEngineers = [
  { id: 'EMP-8021', name: 'Rajesh Sharma', role: 'Civil Engineer', phone: '+91 98765 43210', email: 'rajesh.s@cghb.gov.in', zone: 'Raipur South' },
  { id: 'EMP-8022', name: 'Priya Patel', role: 'Structural Lead', phone: '+91 98765 43211', email: 'priya.p@cghb.gov.in', zone: 'Nava Raipur' },
  { id: 'EMP-8034', name: 'Amit Kumar', role: 'Site Supervisor', phone: '+91 98765 43212', email: 'amit.k@cghb.gov.in', zone: 'Bilaspur' },
  { id: 'EMP-8045', name: 'Suresh Iyer', role: 'Electrical Engineer', phone: '+91 98765 43213', email: 'suresh.i@cghb.gov.in', zone: 'Durg' },
];

const Engineers = () => {
  const { userRole } = useAuth(); // Get role for access control
  
  const [engineers, setEngineers] = useState(initialEngineers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Track which 3-dot dropdown is currently open
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Form State
  const [formData, setFormData] = useState({
    empId: '', name: '', role: '', phone: '', email: '', zone: ''
  });

  // --- ACTIONS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setEngineers(engineers.map(eng => eng.id === editingId ? { ...eng, ...formData, id: formData.empId } : eng));
      setEditingId(null);
    } else {
      const newEngineer = { ...formData, id: formData.empId };
      setEngineers([newEngineer, ...engineers]);
      setCurrentPage(1);
    }
    setFormData({ empId: '', name: '', role: '', phone: '', email: '', zone: '' });
    setIsFormOpen(false);
  };

  const handleEdit = (eng) => {
    setEditingId(eng.id);
    setFormData({
      empId: eng.id, name: eng.name, role: eng.role, phone: eng.phone, email: eng.email, zone: eng.zone
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to remove this engineer record?")) {
      setEngineers(engineers.filter(eng => eng.id !== id));
    }
  };

  const handleView = (name) => {
    alert(`Opening Detailed Profile for ${name}`);
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredEngineers = engineers.filter(eng => 
    eng.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    eng.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eng.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEngineers = [...filteredEngineers].sort((a, b) => a.name.localeCompare(b.name));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEngineers = sortedEngineers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEngineers.length / itemsPerPage) || 1; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- COMMAND CENTER HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cghb-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Engineer <span className="text-cghb-yellow">Directory</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
            {userRole === ROLES.COMMISSIONER 
              ? "View and monitor technical staff across all active zones."
              : "Manage, onboard, and assign CGHB technical personnel."}
          </p>
        </div>
        
        {/* RIGHT ALIGNED BUTTON: Opens the form engine */}
        {userRole !== ROLES.COMMISSIONER && (
          <button 
            onClick={() => { setIsFormOpen(!isFormOpen); if(isFormOpen) setEditingId(null); }}
            className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all
              ${isFormOpen ? 'bg-[var(--color-bg-main)] text-[var(--color-text-main)] border border-cghb-border hover:bg-cghb-border/20' : 'bg-cghb-yellow text-black hover:opacity-90 shadow-md shadow-cghb-yellow/10'}`}
          >
            {isFormOpen ? <><X size={16} /> Close Form</> : <><UserPlus size={16} /> Add Engineer</>}
          </button>
        )}
      </div>

      {/* --- GENERIC KPI DASHBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-cghb-yellow flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Engineers</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{engineers.length}</h3>
          </div>
          <div className="w-12 h-12 bg-cghb-yellow/10 text-cghb-yellow rounded-full flex items-center justify-center">
            <UserCog size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Active Zones Covered</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">
              {new Set(engineers.map(e => e.zone)).size}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Civil & Structural</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">
              {engineers.filter(e => e.role.includes('Civil') || e.role.includes('Structural')).length}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <MapPin size={24} />
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
                      {editingId ? <Edit size={18} /> : <UserCog size={18} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? `Update Personnel Record: ${editingId}` : 'Personnel Registration'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">Onboard and assign new engineering staff.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                      <input type="text" required placeholder="e.g., Vikram Singh" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Employee ID</label>
                      <input type="text" required placeholder="e.g., EMP-9012" value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm uppercase" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Specialization</label>
                      <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select Role...</option>
                        <option value="Civil Engineer" className="text-black">Civil Engineer</option>
                        <option value="Structural Lead" className="text-black">Structural Lead</option>
                        <option value="Electrical Engineer" className="text-black">Electrical Engineer</option>
                        <option value="Site Supervisor" className="text-black">Site Supervisor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Contact Number</label>
                      <input type="tel" required placeholder="+91 90000 00000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Official Email</label>
                      <input type="email" required placeholder="name@cghb.gov.in" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Primary Zone</label>
                      <select required value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select Zone...</option>
                        <option value="Raipur North" className="text-black">Raipur North</option>
                        <option value="Raipur South" className="text-black">Raipur South</option>
                        <option value="Nava Raipur" className="text-black">Nava Raipur</option>
                        <option value="Bilaspur" className="text-black">Bilaspur</option>
                        <option value="Durg" className="text-black">Durg</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-cghb-border/50 mt-2">
                    <button type="submit" className={`flex items-center gap-2 text-black text-[13px] font-bold uppercase tracking-wider h-11 px-8 rounded-lg transition-all shadow-md ${editingId ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-cghb-yellow shadow-cghb-yellow/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                      <Save size={16} /> {editingId ? 'Save Changes' : 'Confirm Registration'}
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
          <input type="text" placeholder="Search personnel by name, ID, or zone..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- DATA TABLE (MODERN & PROFESSIONAL) --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full">
          <table className="w-full table-fixed text-left whitespace-nowrap">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                {/* Widths explicitly defined to 100% */}
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Emp ID</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[22%]">Full Name</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[16%]">Specialization</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[14%]">Phone</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Email</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Assigned Zone</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentEngineers.map((eng, index) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={eng.id} className="bg-transparent border-b border-cghb-border/50 last:border-0">
                    <td className="px-4 py-4 text-center text-[12px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                    <td className="px-4 py-4 font-mono text-[12px] font-bold text-[var(--color-text-main)] truncate" title={eng.id}>{eng.id}</td>
                    <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-text-main)] truncate" title={eng.name}>{eng.name}</td>
                    <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={eng.role}>{eng.role}</td>
                    <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={eng.phone}>{eng.phone}</td>
                    <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={eng.email}>{eng.email}</td>
                    <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={eng.zone}>{eng.zone}</td>
                    
                    {/* Actions: 3 Dots Dropdown */}
                    <td className="px-4 py-4 text-center relative border-l border-cghb-border/50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveDropdown(activeDropdown === eng.id ? null : eng.id);
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === eng.id && (
                        <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                          <button onClick={() => { handleView(eng.name); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                            <Eye size={14} /> View Profile
                          </button>
                          {userRole !== ROLES.COMMISSIONER && (
                            <>
                              <button onClick={() => { handleEdit(eng); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => { handleDelete(eng.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10">
                                <Trash2 size={14} /> Remove
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

          {currentEngineers.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <AlertCircle size={32} className="text-[var(--color-text-muted)]/30" />
              No personnel found matching the criteria.
            </div>
          )}
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredEngineers.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedEngineers.length)}</strong> of <strong className="text-[var(--color-text-main)]">{sortedEngineers.length}</strong>
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

export default Engineers;