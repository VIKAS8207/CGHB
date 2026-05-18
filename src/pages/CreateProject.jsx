import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, ChevronLeft, ChevronRight, 
  X, MapPin, Save, Building2, Eye, Edit, Trash2, AlertCircle, Stamp, MoreVertical, LayoutList, ArrowLeft
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Data
const initialProjects = [
  { id: 'PRJ-1042', workType: 'Construction', sanctionYear: '2025-26', district: 'Raipur', city: 'Naya Raipur', ward: 'Ward 12', projectName: 'Atal Vihar Phase 2', agency: 'CGHB Urban', scheme: 'Atal Vihar Yojana', description: '50 LIG Houses', physicalStatus: 'In Progress', approvedBy: 'Board Resolution', lastModified: '12 May 2026', engineer: 'Rajesh Sharma', area: '45000', address: 'Sector 4, Phase 2 Grid' },
  { id: 'PRJ-1043', workType: 'Development', sanctionYear: '2025-26', district: 'Raipur', city: 'Arang', ward: 'GP Sector 3', projectName: 'Nava Raipur EWS Block C', agency: 'SUDA', scheme: 'EWS Housing', description: 'EWS Multi-story Block', physicalStatus: 'Tender Floated', approvedBy: 'State Government', lastModified: '10 May 2026', engineer: 'Priya Patel', area: '120000', address: 'Block C Main Road' },
  { id: 'PRJ-1044', workType: 'Repair/Maintenance', sanctionYear: '2024-25', district: 'Bilaspur', city: 'Bilaspur City', ward: 'Ward 45', projectName: 'Bilaspur MIG Heights', agency: 'CGHB Urban', scheme: 'MIG Housing Dev', description: 'Boundary Wall Repair', physicalStatus: 'Completed', approvedBy: 'Chief Engineer TS', lastModified: '01 May 2026', engineer: 'Amit Kumar', area: '15000', address: 'MIG Colony South' },
];

const CreateProject = () => {
  const { userRole } = useAuth(); // Get role for access control
  
  const [projects, setProjects] = useState(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingProject, setViewingProject] = useState(null); // State for the View Page
  
  // Track which 3-dot dropdown is currently open
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Form State
  const [formData, setFormData] = useState({
    workType: '', sanctionYear: '', ward: '',
    projectName: '', agency: '', scheme: '', description: '', 
    physicalStatus: '', approvedBy: '', engineer: '', district: '', city: '', area: '', address: ''
  });

  // --- ACTIONS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (editingId) {
      setProjects(projects.map(p => p.id === editingId ? { ...p, ...formData, lastModified: today } : p));
      setEditingId(null);
    } else {
      const newProject = {
        id: `PRJ-10${projects.length + 45}`,
        ...formData,
        lastModified: today,
      };
      setProjects([newProject, ...projects]);
      setCurrentPage(1);
    }
    
    // Reset Form
    setFormData({ workType: '', sanctionYear: '', ward: '', projectName: '', agency: '', scheme: '', description: '', physicalStatus: '', approvedBy: '', engineer: '', district: '', city: '', area: '', address: '' });
    setIsFormOpen(false);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      workType: project.workType || '', sanctionYear: project.sanctionYear || '', ward: project.ward || '',
      projectName: project.projectName || '', agency: project.agency || '', scheme: project.scheme || '', description: project.description || '', 
      physicalStatus: project.physicalStatus || '', approvedBy: project.approvedBy || '', engineer: project.engineer || '', 
      district: project.district || '', city: project.city || '', area: project.area || '', address: project.address || ''
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this project record? This action cannot be undone.")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleView = (project) => {
    setViewingProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredProjects = projects.filter(p => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.agency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => b.id.localeCompare(a.id));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ============================================================================
  // PAGE 2: DETAILED VIEW PAGE (Renders instead of Dashboard if viewingProject is set)
  // ============================================================================
  if (viewingProject) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        
        {/* HEADER & BACK BUTTON */}
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button 
            onClick={() => setViewingProject(null)} 
            className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
              Project <span className="text-cghb-yellow">Details</span>
            </h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <LayoutList size={14} className="text-cghb-yellow" /> {viewingProject.projectName} <span className="opacity-50">|</span> {viewingProject.id}
            </p>
          </div>
        </div>

        {/* DETAILED CONTENT */}
        <div className="glass-panel p-8 md:p-10 rounded-xl border border-cghb-border shadow-sm space-y-10">
          
          {/* Section 1: Overview */}
          <div>
            <h3 className="text-[12px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">1. Master Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Work Type</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingProject.workType || '-'}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Sanction Year</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingProject.sanctionYear || '-'}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Area (Sq.Ft)</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingProject.area ? `${viewingProject.area} Sq.Ft` : '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div>
            <h3 className="text-[12px] font-black text-cghb-yellow uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">2. Location Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">District</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.district || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">City / Town</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.city || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">GP / Ward</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.ward || '-'}</span>
              </div>
              <div className="md:col-span-3 bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Precise Address</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.address || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Execution Details */}
          <div>
            <h3 className="text-[12px] font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">3. Execution Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Agency</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.agency || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Scheme</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.scheme || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Lead Engineer</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.engineer || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Approved By</span>
                <span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.approvedBy || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Status */}
          <div>
            <h3 className="text-[12px] font-black text-emerald-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">4. Current Status</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Physical Status</span>
                <span className="inline-block px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-md text-[13px] font-bold">
                  {viewingProject.physicalStatus || '-'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Detailed Description</span>
                <p className="text-[14px] font-medium text-[var(--color-text-main)] leading-relaxed bg-[var(--color-bg-main)] p-5 rounded-xl border border-cghb-border/50 shadow-sm">
                  {viewingProject.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================================
  // PAGE 1: MAIN DASHBOARD & DIRECTORY
  // ============================================================================
  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- COMMAND CENTER HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cghb-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Project <span className="text-cghb-yellow">Directory</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
            {userRole === ROLES.COMMISSIONER 
              ? "View and monitor registered development sites across the state."
              : "Register and manage approved CGHB development sites."}
          </p>
        </div>
        
        {userRole !== ROLES.COMMISSIONER && (
          <button 
            onClick={() => { setIsFormOpen(!isFormOpen); if(isFormOpen) setEditingId(null); }}
            className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all
              ${isFormOpen ? 'bg-[var(--color-bg-main)] text-[var(--color-text-main)] border border-cghb-border hover:bg-cghb-border/20' : 'bg-cghb-yellow text-black shadow-md shadow-cghb-yellow/10'}`}
          >
            {isFormOpen ? <><X size={16} /> Close Form</> : <><Plus size={16} /> Register Project</>}
          </button>
        )}
      </div>

      {/* --- GENERIC KPI DASHBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-cghb-yellow flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Registered Projects</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">{projects.length}</h3>
          </div>
          <div className="w-12 h-12 bg-cghb-yellow/10 text-cghb-yellow rounded-full flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Active Agencies</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">
              {new Set(projects.map(p => p.agency)).size}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <MapPin size={24} />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Active Mandates</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">100%</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <Stamp size={24} />
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
                      {editingId ? <Edit size={18} /> : <Building2 size={18} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? `Update Project Details: ${editingId}` : 'Project Registration Form'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">Please ensure all details match the official sanctioned documents.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* MASTER GRID: Perfectly symmetrical 4-column layout */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    
                    {/* Row 1 */}
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Project Name</label>
                      <input type="text" required placeholder="e.g., Atal Vihar Phase 2" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Type of Work</label>
                      <input type="text" required placeholder="e.g., Construction" value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Sanction Year</label>
                      <input type="text" required placeholder="e.g., 2025-26" value={formData.sanctionYear} onChange={e => setFormData({...formData, sanctionYear: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>

                    {/* Row 2 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">District</label>
                      <input type="text" placeholder="e.g., Raipur" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">City/Town</label>
                      <input type="text" placeholder="e.g., Naya Raipur" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">GP / Ward Name</label>
                      <input type="text" required placeholder="e.g., Ward 12" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Total Area (Sq. Ft.)</label>
                      <input type="number" placeholder="e.g., 45000" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>

                    {/* Row 3 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Executing Agency</label>
                      <input type="text" required placeholder="e.g., CGHB Urban" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Scheme</label>
                      <select required value={formData.scheme} onChange={e => setFormData({...formData, scheme: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select Scheme...</option>
                        <option value="Atal Vihar Yojana" className="text-black">Atal Vihar Yojana</option>
                        <option value="EWS Housing" className="text-black">EWS Housing</option>
                        <option value="MIG Housing Dev" className="text-black">MIG Housing Dev</option>
                        <option value="Standalone" className="text-black">Standalone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Lead Engineer</label>
                      <select required value={formData.engineer} onChange={e => setFormData({...formData, engineer: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Assign Engineer...</option>
                        <option value="Rajesh Sharma" className="text-black">Rajesh Sharma</option>
                        <option value="Priya Patel" className="text-black">Priya Patel</option>
                        <option value="Amit Kumar" className="text-black">Amit Kumar</option>
                        <option value="Suresh Iyer" className="text-black">Suresh Iyer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Approved By</label>
                      <input type="text" required placeholder="e.g., Board Res." value={formData.approvedBy} onChange={e => setFormData({...formData, approvedBy: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>

                    {/* Row 4 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Physical Status</label>
                      <input type="text" required placeholder="e.g., In Progress" value={formData.physicalStatus} onChange={e => setFormData({...formData, physicalStatus: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Work Description</label>
                      <input type="text" required placeholder="e.g., Construction of 50 LIG Houses" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>

                    {/* Row 5 */}
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Precise Site Address</label>
                      <input type="text" placeholder="Enter exact grid coordinates or address..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>

                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-cghb-border/50">
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
          <input type="text" placeholder="Search projects, districts, or agencies..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1200px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">S.No</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Work Type</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[6%]">Sanc. Yr</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">District</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[17%]">Project Name</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Agency</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Scheme</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[13%]">Description</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Status</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[9%]">Approved By</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[5%]">Modified</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentProjects.map((project, index) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={project.id} className="bg-transparent border-b border-cghb-border/50 hover:bg-cghb-border/5 transition-colors">
                    <td className="px-3 py-3.5 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                    <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.workType}>{project.workType}</td>
                    <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.sanctionYear}>{project.sanctionYear}</td>
                    <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.district}>{project.district}</td>
                    <td className="px-3 py-3.5 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={project.projectName}>{project.projectName}</td>
                    <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.agency}>{project.agency}</td>
                    <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.scheme}>{project.scheme}</td>
                    <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.description}>{project.description}</td>
                    <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.physicalStatus}>{project.physicalStatus}</td>
                    <td className="px-3 py-3.5 text-[11px] font-bold text-[var(--color-text-main)] truncate" title={project.approvedBy}>{project.approvedBy}</td>
                    <td className="px-3 py-3.5 text-[10px] font-medium text-[var(--color-text-muted)] truncate" title={project.lastModified}>{project.lastModified}</td>
                    
                    {/* Actions: 3 Dots Dropdown */}
                    <td className="px-3 py-3.5 text-center relative border-l border-cghb-border/50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveDropdown(activeDropdown === project.id ? null : project.id);
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === project.id && (
                        <div className="absolute right-8 top-6 w-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-50 flex flex-col py-1.5 text-left">
                          <button onClick={() => { handleView(project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                            <Eye size={14} /> View
                          </button>
                          {userRole !== ROLES.COMMISSIONER && (
                            <>
                              <button onClick={() => { handleEdit(project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => { handleDelete(project.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10">
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

          {currentProjects.length === 0 && (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium flex flex-col items-center justify-center gap-3 border-t border-cghb-border/50">
              <AlertCircle size={32} className="text-[var(--color-text-muted)]/30" />
              No projects found matching the criteria.
            </div>
          )}
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredProjects.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedProjects.length)}</strong> of <strong className="text-[var(--color-text-main)]">{sortedProjects.length}</strong>
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

export default CreateProject;