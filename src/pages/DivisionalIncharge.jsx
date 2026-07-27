import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Search, Filter, ChevronLeft, ChevronRight, 
  X, Phone, Mail, UserCog, Save, Eye, Edit, 
  Trash2, AlertCircle, MoreVertical, MapPin, ArrowLeft
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Data tailored for Divisional Incharges
const initialIncharges = [
  { id: 'DIV-1011', name: 'Alok Tiwari', designation: 'Divisional Incharge (DI)', district: 'Raipur', phone: '+91 98111 22233', email: 'alok.t@cghb.gov.in' },
  { id: 'DIV-1012', name: 'Sunita Rao', designation: 'Executive Engineer (EE)', district: 'Bilaspur', phone: '+91 98222 33344', email: 'sunita.r@cghb.gov.in' },
  { id: 'DIV-1013', name: 'Manish Verma', designation: 'Divisional Incharge (DI)', district: 'Durg', phone: '+91 98333 44455', email: 'manish.v@cghb.gov.in' },
  { id: 'DIV-1014', name: 'Pankaj Mishra', designation: 'Executive Engineer (EE)', district: 'Bastar', phone: '+91 98444 55566', email: 'pankaj.m@cghb.gov.in' },
];

const DivisionalIncharge = () => {
  const { userRole } = useAuth(); // Get role for access control
  
  const [incharges, setIncharges] = useState(initialIncharges);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingIncharge, setViewingIncharge] = useState(null); 
  
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Form State
  const [formData, setFormData] = useState({
    empId: '', name: '', designation: '', district: '', phone: '', email: ''
  });

  // --- ACTIONS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setIncharges(incharges.map(inc => inc.id === editingId ? { ...inc, ...formData, id: formData.empId } : inc));
      setEditingId(null);
    } else {
      const newIncharge = { ...formData, id: formData.empId };
      setIncharges([newIncharge, ...incharges]);
      setCurrentPage(1);
    }
    setFormData({ empId: '', name: '', designation: '', district: '', phone: '', email: '' });
    setIsFormOpen(false);
  };

  const handleEdit = (inc) => {
    setEditingId(inc.id);
    setFormData({
      empId: inc.id, name: inc.name, designation: inc.designation, district: inc.district, phone: inc.phone, email: inc.email
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to remove this Divisional Incharge record?")) {
      setIncharges(incharges.filter(inc => inc.id !== id));
    }
  };

  const handleView = (inc) => {
    setViewingIncharge(inc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown when clicking anywhere else or scrolling
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleClickOutside, true);
    }
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredIncharges = incharges.filter(inc => 
    inc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedIncharges = [...filteredIncharges].sort((a, b) => a.name.localeCompare(b.name));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncharges = sortedIncharges.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedIncharges.length / itemsPerPage) || 1; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // ============================================================================
  // PAGE 2: DETAILED VIEW PAGE (Renders instead of Directory if viewingIncharge is set)
  // ============================================================================
  if (viewingIncharge) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        
        {/* HEADER & BACK BUTTON */}
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button 
            onClick={() => setViewingIncharge(null)} 
            className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
              Incharge <span className="text-cghb-yellow">Profile</span>
            </h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <UserCog size={14} className="text-cghb-yellow" /> {viewingIncharge.name} <span className="opacity-50">|</span> {viewingIncharge.id}
            </p>
          </div>
        </div>

        {/* DETAILED CONTENT */}
        <div className="glass-panel p-8 md:p-10 rounded-xl border border-cghb-border shadow-sm space-y-10">
          
          {/* Section 1: Professional Identity */}
          <div>
            <h3 className="text-[12px] font-black text-cghb-yellow uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">1. Professional Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Full Name</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingIncharge.name || '-'}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Employee ID</span>
                <span className="block text-[15px] font-mono font-black text-[var(--color-text-main)]">{viewingIncharge.id || '-'}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Designation</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingIncharge.designation || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Assignment & Contact */}
          <div>
            <h3 className="text-[12px] font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">2. Assignment & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 flex items-center justify-center rounded-lg shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Assigned District</span>
                  <span className="block text-[14px] font-bold text-[var(--color-text-main)]">{viewingIncharge.district || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 flex items-center justify-center rounded-lg shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Contact Number</span>
                  <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingIncharge.phone || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-lg shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Official Email</span>
                  <span className="block text-[14px] font-medium text-[var(--color-text-main)] truncate max-w-[150px]" title={viewingIncharge.email}>{viewingIncharge.email || '-'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================================
  // PAGE 1: MAIN DIRECTORY & FORM
  // ============================================================================
  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- COMMAND CENTER HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cghb-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Divisional <span className="text-cghb-yellow">Incharge</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
            Manage, onboard, and assign top-level district personnel.
          </p>
        </div>
        
        {/* RIGHT ALIGNED BUTTON: Opens the form engine (Accessible to Commissioner) */}
        {userRole === ROLES.COMMISSIONER && (
          <button 
            onClick={() => { setIsFormOpen(!isFormOpen); if(isFormOpen) setEditingId(null); }}
            className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all
              ${isFormOpen ? 'bg-[var(--color-bg-main)] text-[var(--color-text-main)] border border-cghb-border hover:bg-cghb-border/20' : 'bg-cghb-yellow text-black hover:opacity-90 shadow-md shadow-cghb-yellow/10'}`}
          >
            {isFormOpen ? <><X size={16} /> Close Form</> : <><UserPlus size={16} /> Add Incharge</>}
          </button>
        )}
      </div>

      {/* --- FORM ENGINE (Visible to Commissioner) --- */}
      {userRole === ROLES.COMMISSIONER && (
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
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? `Update Incharge Record: ${editingId}` : 'Divisional Incharge Registration'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">Onboard and assign new district leadership staff.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Perfectly Symmetrical 6-Field Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Row 1 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                      <input type="text" required placeholder="e.g., Alok Tiwari" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Employee ID</label>
                      <input type="text" required placeholder="e.g., DIV-9012" value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm uppercase" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Designation</label>
                      <select required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select Designation...</option>
                        <option value="Divisional Incharge (DI)" className="text-black">Divisional Incharge (DI)</option>
                        <option value="Executive Engineer (EE)" className="text-black">Executive Engineer (EE)</option>
                      </select>
                    </div>
                    
                    {/* Row 2 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Assigned District</label>
                      <select required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select District...</option>
                        <option value="Raipur" className="text-black">Raipur</option>
                        <option value="Bilaspur" className="text-black">Bilaspur</option>
                        <option value="Durg" className="text-black">Durg</option>
                        <option value="Bastar" className="text-black">Bastar</option>
                        <option value="Korba" className="text-black">Korba</option>
                        <option value="Raigarh" className="text-black">Raigarh</option>
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
      <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search by name, ID, designation, or district..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- DATA TABLE (MODERN & PROFESSIONAL) --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1000px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Emp ID</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%]">Full Name</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[16%]">Designation</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">District</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Phone</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Email</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentIncharges.map((inc, index) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={inc.id} className="bg-transparent border-b border-cghb-border/50 last:border-0 hover:bg-cghb-border/5 transition-colors">
                    <td className="px-4 py-4 text-center text-[12px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                    <td className="px-4 py-4 font-mono text-[12px] font-bold text-[var(--color-text-main)] truncate" title={inc.id}>{inc.id}</td>
                    <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-text-main)] truncate" title={inc.name}>{inc.name}</td>
                    <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={inc.designation}>{inc.designation}</td>
                    <td className="px-4 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={inc.district}>{inc.district}</td>
                    <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={inc.phone}>{inc.phone}</td>
                    <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-main)] truncate" title={inc.email}>{inc.email}</td>
                    
                    {/* Actions: 3 Dots Dropdown */}
                    <td className="px-4 py-4 text-center relative border-l border-cghb-border/50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          if (activeDropdown === inc.id) {
                            setActiveDropdown(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveDropdown({
                              id: inc.id,
                              top: rect.bottom + 4,
                              left: rect.left - 130 
                            });
                          }
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)] p-1 rounded transition-colors hover:bg-cghb-border/20"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === inc.id && (
                        <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                          <button onClick={() => { handleView(inc); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                            <Eye size={14} /> View Profile
                          </button>
                          {userRole === ROLES.COMMISSIONER && (
                            <>
                              <button onClick={() => { handleEdit(inc); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => { handleDelete(inc.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10 border-t border-cghb-border/50 mt-1 pt-2.5">
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

          {currentIncharges.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <AlertCircle size={32} className="text-[var(--color-text-muted)]/30" />
              No divisional leadership personnel found.
            </div>
          )}
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredIncharges.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedIncharges.length)}</strong> of <strong className="text-[var(--color-text-main)]">{sortedIncharges.length}</strong>
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

export default DivisionalIncharge;