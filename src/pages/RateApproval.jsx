import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSignature, Search, Filter, MapPin, 
  Plus, Edit, Trash2, Eye, UploadCloud, X, Save, 
  ChevronLeft, ChevronRight, MoreVertical, Download, Check, AlertCircle,
  ArrowLeft, LayoutList, FileText, Building2
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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track dropdown with coordinates to render outside overflow-hidden table
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // View Details State (Full Page)
  const [viewingProject, setViewingProject] = useState(null); 

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileName, setFileName] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Form Data
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setViewingProject(null);
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


  // ============================================================================
  // VIEW 2: PROFILE/DETAILS PAGE
  // ============================================================================
  if (viewingProject) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">Project <span className="text-cghb-yellow">Details</span></h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <LayoutList size={14} className="text-cghb-yellow" /> Project ID: {viewingProject.id} <span className="opacity-50">|</span> {viewingProject.municipality} ({viewingProject.ward})
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-xl border border-cghb-border shadow-sm space-y-10">
          <div>
            <h3 className="text-[12px] font-black text-cghb-yellow uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">1. Core Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-4">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Work Description</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingProject.description}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Project Name</span>
                <span className="block text-[15px] font-bold text-[var(--color-text-main)]">{viewingProject.projectName}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Executing Agency</span>
                <span className="block text-[15px] font-bold text-[var(--color-text-main)]">{viewingProject.agency}</span>
              </div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Work Type</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.workType}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Sanction Year</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.sanctionYear}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Scheme</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.scheme}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Approved By</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.approvedBy}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-black text-emerald-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">2. Official Document Attached</h3>
            <div className="grid grid-cols-1 gap-4">
              {viewingProject.hasDoc ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--color-bg-main)] border border-cghb-border/50 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-lg shrink-0"><FileText size={18}/></div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--color-text-main)]">Project_Document_Copy.pdf</h4>
                      <p className="text-[12px] text-[var(--color-text-muted)]">Official approved project document</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[12px] font-bold text-[var(--color-text-main)] hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm">
                    <Download size={14}/> Download
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-600 text-[13px] font-bold flex items-center gap-2">
                  <AlertCircle size={16}/> No document has been uploaded for this project yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 1: MAIN DASHBOARD & DIRECTORY
  // ============================================================================
  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
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
            <Check size={24} />
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
                      {editingId ? <Edit size={18} /> : <FileSignature size={18} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{editingId ? 'Update Project Details' : 'Register New Project'}</h2>
                      <p className="text-[12px] text-[var(--color-text-muted)] font-medium mt-0.5">{editingId ? `Ref: ${editingId}` : 'Please ensure all details match the official sanctioned documents.'}</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsFormOpen(false); setEditingId(null); setFileName(''); }} className="text-[11px] font-bold text-red-500 uppercase hover:underline flex items-center gap-1">
                    <X size={14} /> Cancel
                  </button>
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
                          <span className="flex items-center gap-2"><UploadCloud size={16} /> Select PDF</span>
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search projects, municipalities, or agencies..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
        
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden relative">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1300px] table-fixed text-left whitespace-nowrap">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">S.No</th>
                {/* PROJECT NAME MOVED HERE */}
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[14%]">Project Name</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Work Type</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Sanc. Yr</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Municipality</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Agency</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[14%]">Description</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Status</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[12%]">Approval</th>
                <th className="px-3 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[6%] border-l border-cghb-border">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentProjects.length === 0 ? (
                  <tr><td colSpan="10" className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium"><Building2 size={32} className="mx-auto mb-3 opacity-30" />No project records found.</td></tr>
                ) : (
                  currentProjects.map((project, index) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={project.id} className="bg-transparent border-b border-cghb-border/50 last:border-0 hover:bg-cghb-border/5 transition-colors">
                      <td className="px-3 py-3.5 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate" title={indexOfFirstItem + index + 1}>{indexOfFirstItem + index + 1}</td>
                      
                      {/* PROJECT NAME DATA MOVED HERE */}
                      <td className="px-3 py-3.5 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={project.projectName}>{project.projectName}</td>
                      
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.workType}>{project.workType}</td>
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate">{project.sanctionYear}</td>
                      
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.municipality}>
                         <span className="flex items-center gap-1"><MapPin size={10} className="text-[var(--color-text-muted)] shrink-0"/>{project.municipality}</span>
                      </td>
                      
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.agency}>{project.agency}</td>
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.description}>{project.description}</td>
                      <td className="px-3 py-3.5 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.physicalStatus}>{project.physicalStatus}</td>
                      
                      {/* STYLISH DOCUMENT BADGES FROM REFERENCE */}
                      <td className="px-3 py-3.5 text-center">
                        {project.hasDoc ? (
                          <span className="mx-auto flex items-center justify-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-lg text-[11px] font-bold border border-emerald-500/20 max-w-[120px] uppercase tracking-wider">
                            <Check size={14}/> Approved
                          </span>
                        ) : (
                          <span className="mx-auto flex items-center justify-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-orange-500/20 max-w-[120px] uppercase tracking-wider">
                            <AlertCircle size={12}/> Pending
                          </span>
                        )}
                      </td>
                      
                      {/* Actions: Fixed Outside Dropdown Trigger */}
                      <td className="px-3 py-3.5 text-center relative border-l border-cghb-border/50">
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
                                top: rect.bottom + 4,
                                left: rect.left - 130 
                              });
                            }
                          }} 
                          className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)] p-1 rounded transition-colors hover:bg-cghb-border/20"
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

      {/* --- GLOBAL FIXED DROPDOWN MENU --- */}
      <AnimatePresence>
        {activeDropdown && (() => {
          const project = projects.find(p => p.id === activeDropdown.id);
          if (!project) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: activeDropdown.top, left: activeDropdown.left, zIndex: 9999 }}
              className="w-40 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-2xl flex flex-col py-1.5 text-left"
              onClick={(e) => e.stopPropagation()} 
            >
              <button onClick={() => { handleView(project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                <Eye size={14} /> View Details
              </button>
              
              {userRole !== ROLES.COMMISSIONER && (
                <>
                  <button onClick={() => { handleEdit(project); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => { handleDelete(project.id); setActiveDropdown(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10 border-t border-cghb-border/50 mt-1 pt-2.5">
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default CreateProject;