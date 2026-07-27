import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, ChevronLeft, ChevronRight, 
  X, MapPin, Save, Building2, Eye, Edit, Trash2, 
  AlertCircle, Stamp, MoreVertical, UploadCloud, Check, 
  Download, FileText
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Data
const initialProjects = [
  { id: 'PRJ-1042', workType: 'Construction', sanctionYear: '2025-26', municipality: 'Raipur Nagar Nigam', ward: 'Ward 12', projectName: 'Atal Vihar Phase 2', agency: 'CGHB Urban', scheme: 'Atal Vihar Yojana', description: '50 LIG Houses', physicalStatus: 'In Progress', approvedBy: 'Board Resolution', lastModified: '12 May 2026', hasDoc: true },
  { id: 'PRJ-1043', workType: 'Development', sanctionYear: '2025-26', municipality: 'Arang Block', ward: 'GP Sector 3', projectName: 'Nava Raipur EWS Block C', agency: 'SUDA', scheme: 'EWS Housing', description: 'EWS Multi-story Block', physicalStatus: 'Tender Floated', approvedBy: 'State Government', lastModified: '10 May 2026', hasDoc: true },
  { id: 'PRJ-1044', workType: 'Repair/Maintenance', sanctionYear: '2024-25', municipality: 'Bilaspur Nigam', ward: 'Ward 45', projectName: 'Bilaspur MIG Heights', agency: 'CGHB Urban', scheme: 'MIG Housing Dev', description: 'Boundary Wall Repair', physicalStatus: 'Completed', approvedBy: 'Chief Engineer TS', lastModified: '01 May 2026', hasDoc: false },
];

const CreateProject = () => {
  const { userRole } = useAuth(); // Get role for access control
  
  const [projects, setProjects] = useState(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingProject, setViewingProject] = useState(null); 
  
  // Track dropdown with coordinates to render outside overflow-hidden table
  const [activeDropdown, setActiveDropdown] = useState(null);

  // File Upload State
  const [fileName, setFileName] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Form State
  const [formData, setFormData] = useState({
    workType: '', sanctionYear: '', municipality: '', ward: '',
    projectName: '', agency: '', scheme: '', description: '', 
    physicalStatus: '', approvedBy: ''
  });

  // --- ACTIONS ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (editingId) {
      setProjects(projects.map(p => p.id === editingId ? { ...p, ...formData, lastModified: today, hasDoc: fileName !== '' ? true : p.hasDoc } : p));
      setEditingId(null);
    } else {
      const newProject = {
        id: `PRJ-10${projects.length + 45}`,
        ...formData,
        lastModified: today,
        hasDoc: fileName !== ''
      };
      setProjects([newProject, ...projects]);
      setCurrentPage(1);
    }
    
    setFormData({ workType: '', sanctionYear: '', municipality: '', ward: '', projectName: '', agency: '', scheme: '', description: '', physicalStatus: '', approvedBy: '' });
    setFileName('');
    setIsFormOpen(false);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      workType: project.workType || '', sanctionYear: project.sanctionYear || '', municipality: project.municipality || '', ward: project.ward || '',
      projectName: project.projectName || '', agency: project.agency || '', scheme: project.scheme || '', description: project.description || '', 
      physicalStatus: project.physicalStatus || '', approvedBy: project.approvedBy || ''
    });
    setFileName(project.hasDoc ? 'project_document.pdf' : ''); 
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this project record?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleView = (project) => {
    setViewingProject(project);
  };

  // Handle closing fixed dropdown on click outside or scroll
  useEffect(() => {
    const closeDropdown = () => setActiveDropdown(null);
    document.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", closeDropdown, true); 
    return () => {
      document.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", closeDropdown, true);
    };
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredProjects = projects.filter(p => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.agency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => b.id.localeCompare(a.id));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper for derived status styling
  const getDerivedStatusStyle = (hasDoc) => {
    return hasDoc 
      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
      : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
  };

  const getDerivedStatusText = (hasDoc) => {
    return hasDoc ? 'Approved' : 'Waiting for Approval';
  };

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
            onClick={() => { setIsFormOpen(!isFormOpen); if(isFormOpen) { setEditingId(null); setFileName(''); } }}
            className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all
              ${isFormOpen ? 'bg-[var(--color-bg-main)] text-[var(--color-text-main)] border border-cghb-border hover:bg-cghb-border/20' : 'bg-cghb-yellow text-black hover:opacity-90 shadow-md shadow-cghb-yellow/10'}`}
          >
            {isFormOpen ? <><X size={16} /> Close Form</> : <><Plus size={16} /> Register Project</>}
          </button>
        )}
      </div>

      {/* --- KPI DASHBOARD --- */}
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
            <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Approved Projects</p>
            <h3 className="text-3xl font-black text-[var(--color-text-main)]">
                {projects.filter(p => p.hasDoc).length}
            </h3>
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
                  {/* Row 1: Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                  </div>

                  {/* Row 2: Location Data */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Municipality / Block</label>
                      <input type="text" required placeholder="e.g., Raipur Nagar Nigam" value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">GP / Ward Name</label>
                      <input type="text" required placeholder="e.g., Ward 12" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Executing Agency</label>
                      <input type="text" required placeholder="e.g., CGHB Urban" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                  </div>

                  {/* Row 3: Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Work Description</label>
                      <input type="text" required placeholder="e.g., Construction of 50 LIG Houses" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Physical Status</label>
                      <input type="text" required placeholder="e.g., In Progress, Tender Floated" value={formData.physicalStatus} onChange={e => setFormData({...formData, physicalStatus: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>
                  </div>

                  {/* Row 4: Approval & Document */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Approved By</label>
                      <input type="text" required placeholder="e.g., Board Resolution" value={formData.approvedBy} onChange={e => setFormData({...formData, approvedBy: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Project Document (.pdf)</label>
                      <label className={`w-full h-11 border border-dashed rounded-lg flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all shadow-sm ${fileName ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-cghb-border text-[var(--color-text-muted)] bg-[var(--color-bg-surface)] hover:border-cghb-yellow hover:text-cghb-yellow'}`}>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        {fileName ? (
                          <span className="flex items-center gap-2 truncate px-3"><Check size={14} /> {fileName}</span>
                        ) : (
                          <span className="flex items-center gap-2"><UploadCloud size={16} /> Upload Document</span>
                        )}
                      </label>
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
          <input type="text" placeholder="Search projects, municipalities, or agencies..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed text-left whitespace-nowrap relative">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[3%]">S.No</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Work Type</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[6%]">Sanc. Yr</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Municipality</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Project Name</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Agency</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Description</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Status</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%] text-center">Approval</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Modified</th>
                <th className="px-2 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentProjects.map((project, index) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={project.id} className="bg-transparent border-b border-cghb-border/50 last:border-0 hover:bg-cghb-border/5 transition-colors">
                    <td className="px-2 py-3.5 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate">{indexOfFirstItem + index + 1}</td>
                    <td className="px-2 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.workType}>{project.workType}</td>
                    <td className="px-2 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate">{project.sanctionYear}</td>
                    <td className="px-2 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.municipality}>{project.municipality}</td>
                    <td className="px-2 py-3.5 text-[11px] font-bold text-[var(--color-text-main)] truncate" title={project.projectName}>{project.projectName}</td>
                    <td className="px-2 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.agency}>{project.agency}</td>
                    <td className="px-2 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.description}>{project.description}</td>
                    <td className="px-2 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.physicalStatus}>{project.physicalStatus}</td>
                    
                    {/* Derived Approval Status */}
                    <td className="px-2 py-3.5 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getDerivedStatusStyle(project.hasDoc)}`}>
                        {getDerivedStatusText(project.hasDoc)}
                      </span>
                    </td>

                    <td className="px-2 py-3.5 text-[10px] font-medium text-[var(--color-text-muted)] truncate">{project.lastModified}</td>
                    
                    {/* Actions: Fixed Outside Dropdown Trigger */}
                    <td className="px-2 py-3.5 text-center relative border-l border-cghb-border/50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          if (activeDropdown?.id === project.id) {
                            setActiveDropdown(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveDropdown({
                              id: project.id,
                              project: project,
                              x: rect.left - 120, // offset to the left to align right edge
                              y: rect.bottom + 4  // place right under the button
                            });
                          }
                        }} 
                        className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)]"
                      >
                        <MoreVertical size={16} />
                      </button>
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

        {/* --- PAGINATION --- */}
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

      {/* --- FLOATING DROPDOWN RENDERED OUTSIDE (Fixes clipping issue) --- */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed w-36 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-xl z-[200] flex flex-col py-1.5 text-left"
            style={{ top: activeDropdown.y, left: activeDropdown.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => { handleView(activeDropdown.project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
              <Eye size={14} /> View
            </button>
            
            {userRole !== ROLES.COMMISSIONER && (
              <>
                <button onClick={() => { handleEdit(activeDropdown.project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => { handleDelete(activeDropdown.project.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10">
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FORM-STYLE VIEW MODAL --- */}
      <AnimatePresence>
        {viewingProject && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setViewingProject(null)}
          >
            <motion.div 
              initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-bg-main)] border border-cghb-border rounded-2xl shadow-2xl w-full max-w-[1000px] my-auto overflow-hidden relative"
            >
              <div className="flex items-center justify-between mb-2 border-b border-cghb-border/50 p-8 pb-5 bg-[var(--color-bg-surface)]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl border bg-cghb-yellow/10 text-cghb-yellow border-cghb-yellow/20">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">Project Details: {viewingProject.id}</h2>
                    <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">Read-only view of sanctioned project details.</p>
                  </div>
                </div>
                <button onClick={() => setViewingProject(null)} className="p-2 text-[var(--color-text-muted)] hover:bg-cghb-border/20 rounded-full transition-colors self-start">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Row 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Project Name</label>
                    <input type="text" readOnly value={viewingProject.projectName} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Type of Work</label>
                    <input type="text" readOnly value={viewingProject.workType} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Sanction Year</label>
                    <input type="text" readOnly value={viewingProject.sanctionYear} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                </div>

                {/* Row 2: Location Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Municipality / Block</label>
                    <input type="text" readOnly value={viewingProject.municipality} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">GP / Ward Name</label>
                    <input type="text" readOnly value={viewingProject.ward} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Executing Agency</label>
                    <input type="text" readOnly value={viewingProject.agency} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                </div>

                {/* Row 3: Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Scheme</label>
                    <input type="text" readOnly value={viewingProject.scheme} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Work Description</label>
                    <input type="text" readOnly value={viewingProject.description} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Physical Status</label>
                    <input type="text" readOnly value={viewingProject.physicalStatus} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                </div>

                {/* Row 4: Approval Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Approved By</label>
                    <input type="text" readOnly value={viewingProject.approvedBy} className="w-full h-11 bg-[var(--color-bg-surface)]/50 border border-cghb-border/50 text-[var(--color-text-main)] text-[13px] rounded-lg px-4 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Approval Status</label>
                    <div className={`w-full h-11 flex items-center px-4 rounded-lg border font-bold text-[13px] ${getDerivedStatusStyle(viewingProject.hasDoc)}`}>
                       {getDerivedStatusText(viewingProject.hasDoc)}
                    </div>
                  </div>
                </div>

                {/* Optional Document Download Section */}
                <div className="pt-4 mt-2 border-t border-cghb-border/50 flex justify-between items-center">
                  <span className="text-[11px] text-[var(--color-text-muted)] font-medium">Last modified: {viewingProject.lastModified}</span>
                  
                  {viewingProject.hasDoc ? (
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-bg-surface)] border border-cghb-border hover:border-cghb-yellow hover:text-cghb-yellow text-[var(--color-text-main)] text-[13px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm">
                      <Download size={16} /> Download Document
                    </button>
                  ) : (
                    <span className="text-[12px] font-medium text-[var(--color-text-muted)] flex items-center gap-2 bg-[var(--color-bg-surface)] px-4 py-2.5 rounded-lg border border-dashed border-cghb-border/50">
                       <AlertCircle size={14} /> No Document Available
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CreateProject;