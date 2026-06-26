import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, ChevronLeft, ChevronRight, 
  X, MapPin, Save, Building2, Eye, Edit, Trash2, AlertCircle, MoreVertical, LayoutList, ArrowLeft, Check
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Data updated to the new schema
const initialProjects = [
  { id: 'PRJ-1042', isSubProject: false, parentProjectId: '', projectName: 'Atal Vihar Phase 2', subProjectName: '', agreementNo: 'AGR-2025-01', creationDate: '2025-01-15', dueDate: '2026-12-31', workType: 'Construction', sanctionYear: '2025-26', district: 'Raipur', city: 'Naya Raipur', ward: 'Ward 12', area: '45000', contractor: 'R.K. Builders', scheme: 'Atal Vihar Yojana', assistantEngineer: 'Rajesh Sharma', subEngineer: 'Vikram Singh', housingGroups: ['LIG'], status: 'Active' },
  { id: 'PRJ-1043', isSubProject: true, parentProjectId: 'PRJ-1042', projectName: 'Atal Vihar Phase 2', subProjectName: 'Block C Extension', agreementNo: 'AGR-2025-14', creationDate: '2025-03-10', dueDate: '2026-06-30', workType: 'Development', sanctionYear: '2025-26', district: 'Raipur', city: 'Naya Raipur', ward: 'Ward 12', area: '12000', contractor: 'SUDA Infra', scheme: 'Atal Vihar Yojana', assistantEngineer: 'Priya Patel', subEngineer: 'Amit Kumar', housingGroups: ['LIG', 'SEG'], status: 'Active' },
  { id: 'PRJ-1044', isSubProject: false, parentProjectId: '', projectName: 'Bilaspur MIG Heights', subProjectName: '', agreementNo: 'AGR-2024-88', creationDate: '2024-11-05', dueDate: '2025-10-31', workType: 'Construction', sanctionYear: '2024-25', district: 'Bilaspur', city: 'Bilaspur City', ward: 'Ward 45', area: '15000', contractor: 'CGHB Urban', scheme: 'MIG Housing Dev', assistantEngineer: 'Suresh Iyer', subEngineer: 'Neha Gupta', housingGroups: ['CRMIG', 'JMIG'], status: 'Active' },
];

const CreateProject = () => {
  const { userRole } = useAuth(); // Get role for access control
  
  const [projects, setProjects] = useState(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingProject, setViewingProject] = useState(null); 
  
  // Track which 3-dot dropdown is currently open
  const [dropdownConfig, setDropdownConfig] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Form State
  const [formData, setFormData] = useState({
    isSubProject: false,
    parentProjectId: '',
    projectName: '',
    subProjectName: '',
    agreementNo: '',
    creationDate: '',
    dueDate: '',
    workType: '',
    sanctionYear: '',
    district: '',
    city: '',
    ward: '',
    area: '',
    contractor: '',
    scheme: '',
    assistantEngineer: '',
    subEngineer: '',
    housingGroups: []
  });

  // Housing Group Options
  const HOUSING_GROUPS = [
    { id: 'HIG', label: 'HIG (High Income Group)' },
    { id: 'MIG', label: 'MIG (Middle Income Group)' },
    { id: 'LIG', label: 'LIG (Low Income Group)' },
    { id: 'EWS', label: 'EWS (Economically Weaker Section)' },
    { id: 'Others', label: 'Others' }
  ];

  // --- ACTIONS ---
  const handleCheckboxChange = (groupId) => {
    setFormData(prev => {
      const groups = prev.housingGroups.includes(groupId)
        ? prev.housingGroups.filter(g => g !== groupId)
        : [...prev.housingGroups, groupId];
      return { ...prev, housingGroups: groups };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auto-fill parent project name if sub-project is selected
    let finalProjectName = formData.projectName;
    if (formData.isSubProject && formData.parentProjectId) {
      const parent = projects.find(p => p.id === formData.parentProjectId);
      if (parent) finalProjectName = parent.projectName;
    }

    if (editingId) {
      setProjects(projects.map(p => p.id === editingId ? { ...p, ...formData, projectName: finalProjectName } : p));
      setEditingId(null);
    } else {
      const newProject = {
        id: `PRJ-10${projects.length + 45}`,
        ...formData,
        projectName: finalProjectName,
        status: 'Active'
      };
      setProjects([newProject, ...projects]);
      setCurrentPage(1);
    }
    
    // Reset Form
    setFormData({ 
      isSubProject: false, parentProjectId: '', projectName: '', subProjectName: '', agreementNo: '', creationDate: '', 
      dueDate: '', workType: '', sanctionYear: '', district: '', city: '', ward: '', area: '', contractor: '', scheme: '', 
      assistantEngineer: '', subEngineer: '', housingGroups: [] 
    });
    setIsFormOpen(false);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      isSubProject: project.isSubProject || false,
      parentProjectId: project.parentProjectId || '',
      projectName: project.projectName || '',
      subProjectName: project.subProjectName || '',
      agreementNo: project.agreementNo || '',
      creationDate: project.creationDate || '',
      dueDate: project.dueDate || '',
      workType: project.workType || '',
      sanctionYear: project.sanctionYear || '',
      district: project.district || '',
      city: project.city || '',
      ward: project.ward || '',
      area: project.area || '',
      contractor: project.contractor || '',
      scheme: project.scheme || '',
      assistantEngineer: project.assistantEngineer || '',
      subEngineer: project.subEngineer || '',
      housingGroups: project.housingGroups || []
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this project record? This action cannot be undone.")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  // Close dropdown on click outside or scroll
  useEffect(() => {
    const closeDropdown = () => setDropdownConfig(null);
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
    p.subProjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contractor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => b.id.localeCompare(a.id));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Derived list of Main Projects for the Dropdown
  const mainProjectsList = projects.filter(p => !p.isSubProject);

  // ============================================================================
  // PAGE 2: DETAILED VIEW PAGE
  // ============================================================================
  if (viewingProject) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
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
              <LayoutList size={14} className="text-cghb-yellow" /> 
              {viewingProject.isSubProject ? `${viewingProject.projectName} - ${viewingProject.subProjectName}` : viewingProject.projectName} 
              <span className="opacity-50">|</span> {viewingProject.id}
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-xl border border-cghb-border shadow-sm space-y-10">
          <div>
            <h3 className="text-[12px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">1. Master Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Project Name</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingProject.projectName || '-'}</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Sub Project Name</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingProject.isSubProject ? viewingProject.subProjectName : '-'}</span>
              </div>
              
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Agreement No</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.agreementNo || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Creation Date</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.creationDate || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Due Date</span><span className="block text-[14px] font-medium text-orange-500">{viewingProject.dueDate || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Type of Work</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.workType || '-'}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-black text-cghb-yellow uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">2. Location & Layout Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Sanction Year</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.sanctionYear || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">District</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.district || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">City / Town</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.city || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">GP / Ward</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.ward || '-'}</span></div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-4">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Area (Sq.Ft)</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingProject.area ? `${viewingProject.area} Sq.Ft` : '-'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">3. Execution & Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Contractor</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.contractor || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Scheme</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.scheme || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Assistant Engineer</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.assistantEngineer || '-'}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Sub Engineer</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingProject.subEngineer || '-'}</span></div>
              
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-4 mt-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Housing Groups Included</span>
                <div className="flex flex-wrap gap-2">
                  {viewingProject.housingGroups?.length > 0 ? (
                    viewingProject.housingGroups.map(group => (
                      <span key={group} className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md text-[12px] font-bold">
                        {HOUSING_GROUPS.find(hg => hg.id === group)?.label || group}
                      </span>
                    ))
                  ) : (
                    <span className="text-[13px] text-[var(--color-text-muted)]">- None Selected -</span>
                  )}
                </div>
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

      {/* --- FORM ENGINE --- */}
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* Row 1: Project Type & Identification (Merged Seamlessly) */}
                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6 items-end pb-2">
                      
                      {/* Project Type Toggle */}
                      <div className="flex flex-col gap-2">
                        <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5 ml-1">Project Type</label>
                        <div className="flex items-center gap-4 h-11">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${!formData.isSubProject ? 'border-cghb-yellow' : 'border-cghb-border group-hover:border-cghb-yellow/50'}`}>
                              {!formData.isSubProject && <div className="w-2 h-2 bg-cghb-yellow rounded-full" />}
                            </div>
                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">Main Project</span>
                            <input type="radio" name="projectType" className="hidden" checked={!formData.isSubProject} onChange={() => setFormData({...formData, isSubProject: false, parentProjectId: '', subProjectName: ''})} />
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${formData.isSubProject ? 'border-cghb-yellow' : 'border-cghb-border group-hover:border-cghb-yellow/50'}`}>
                              {formData.isSubProject && <div className="w-2 h-2 bg-cghb-yellow rounded-full" />}
                            </div>
                            <span className="text-[13px] font-bold text-[var(--color-text-main)]">Sub Project</span>
                            <input type="radio" name="projectType" className="hidden" checked={formData.isSubProject} onChange={() => setFormData({...formData, isSubProject: true, projectName: ''})} />
                          </label>
                        </div>
                      </div>

                      {/* Dynamic Identification Fields */}
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {!formData.isSubProject ? (
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Project Name</label>
                            <input type="text" required placeholder="e.g., Atal Vihar Phase 2" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Select Main Project</label>
                              <select required value={formData.parentProjectId} onChange={e => setFormData({...formData, parentProjectId: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm cursor-pointer">
                                <option value="" disabled>Select parent project...</option>
                                {mainProjectsList.map(p => (
                                  <option key={p.id} value={p.id} className="text-black">{p.projectName}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Sub Project Name</label>
                              <input type="text" required placeholder="e.g., Block C Extension" value={formData.subProjectName} onChange={e => setFormData({...formData, subProjectName: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow focus:ring-1 focus:ring-cghb-yellow transition-all shadow-sm" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Agreement No.</label>
                      <input type="text" required placeholder="e.g., AGR-101" value={formData.agreementNo} onChange={e => setFormData({...formData, agreementNo: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Date of Creation</label>
                      <input type="date" required value={formData.creationDate} onChange={e => setFormData({...formData, creationDate: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Due Date</label>
                      <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Type of Work</label>
                      <input type="text" required placeholder="e.g., Construction" value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>

                    {/* Row 3 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Sanction Year</label>
                      <input type="text" required placeholder="e.g., 2025-26" value={formData.sanctionYear} onChange={e => setFormData({...formData, sanctionYear: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">District</label>
                      <input type="text" required placeholder="e.g., Raipur" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">City/Town</label>
                      <input type="text" required placeholder="e.g., Naya Raipur" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">GP / Ward Name</label>
                      <input type="text" required placeholder="e.g., Ward 12" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>

                    {/* Row 4 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Total Area (Sq. Ft.)</label>
                      <input type="number" required placeholder="e.g., 45000" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Name of Contractor</label>
                      <input type="text" required placeholder="e.g., CGHB Urban" value={formData.contractor} onChange={e => setFormData({...formData, contractor: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Scheme</label>
                      <select required value={formData.scheme} onChange={e => setFormData({...formData, scheme: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select Scheme...</option>
                        <option value="Atal Vihar Yojana" className="text-black">Atal Vihar Yojana</option>
                        <option value="EWS Housing" className="text-black">EWS Housing</option>
                        <option value="MIG Housing Dev" className="text-black">MIG Housing Dev</option>
                        <option value="Standalone" className="text-black">Standalone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Assistant Engineer</label>
                      <select required value={formData.assistantEngineer} onChange={e => setFormData({...formData, assistantEngineer: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Assign Assistant Engineer...</option>
                        <option value="Rajesh Sharma" className="text-black">Rajesh Sharma</option>
                        <option value="Priya Patel" className="text-black">Priya Patel</option>
                        <option value="Suresh Iyer" className="text-black">Suresh Iyer</option>
                      </select>
                    </div>

                    {/* Row 5 */}
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 ml-1">Sub Engineer</label>
                      <select required value={formData.subEngineer} onChange={e => setFormData({...formData, subEngineer: e.target.value})} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Assign Sub Engineer...</option>
                        <option value="Vikram Singh" className="text-black">Vikram Singh</option>
                        <option value="Amit Kumar" className="text-black">Amit Kumar</option>
                        <option value="Neha Gupta" className="text-black">Neha Gupta</option>
                      </select>
                    </div>

                    {/* Housing Groups Checkboxes (Seamless Integration) */}
                    <div className="md:col-span-3 pt-1">
                      <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 ml-1">Housing Groups (Select Multiple)</label>
                      <div className="flex flex-wrap gap-x-6 gap-y-3 pl-1">
                        {HOUSING_GROUPS.map(group => (
                          <label key={group.id} className="flex items-center gap-2.5 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors ${formData.housingGroups.includes(group.id) ? 'bg-cghb-yellow border-cghb-yellow text-black' : 'border-cghb-border bg-[var(--color-bg-main)] group-hover:border-cghb-yellow/50'}`}>
                              {formData.housingGroups.includes(group.id) && <Check size={12} strokeWidth={4} />}
                            </div>
                            <span className="text-[12px] font-bold text-[var(--color-text-main)] select-none" title={group.label}>{group.id}</span>
                            {/* Hidden checkbox that triggers the state update */}
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={formData.housingGroups.includes(group.id)} 
                              onChange={() => handleCheckboxChange(group.id)} 
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-cghb-border/50 mt-4">
                    <button type="submit" className={`flex items-center gap-2 text-black text-[13px] font-bold uppercase tracking-wider h-11 px-8 rounded-lg transition-all shadow-md ${editingId ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-cghb-yellow shadow-cghb-yellow/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                      <Save size={16} /> {editingId ? 'Save Changes' : 'Create Project'}
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
          <input type="text" placeholder="Search projects or contractors..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden relative">
        <div className="w-full overflow-x-auto">
          {/* Calibrated minimum width to prevent desktop scrollbars */}
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1000px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[16%]">Name of Project</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[14%]">Sub Project</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[9%]">Created Date</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[9%]">Due Date</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Contractor Name</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[11%]">Scheme</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[11%]">Engineer Assigned</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[9%] text-center">Status</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%] border-l border-cghb-border">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentProjects.length === 0 ? (
                  <tr><td colSpan="10" className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium"><AlertCircle size={32} className="mx-auto mb-3 opacity-30"/> No projects found.</td></tr>
                ) : (
                  currentProjects.map((project, index) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={project.id} className="bg-transparent hover:bg-cghb-border/5 transition-colors">
                      <td className="px-4 py-4 text-center text-[11px] font-bold text-[var(--color-text-muted)] truncate">{indexOfFirstItem + index + 1}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={project.projectName}>{project.projectName}</td>
                      <td className="px-4 py-4 text-[11px] font-medium text-[var(--color-text-muted)] truncate" title={project.subProjectName}>{project.isSubProject ? project.subProjectName : '-'}</td>
                      <td className="px-4 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate">{project.creationDate}</td>
                      <td className="px-4 py-4 text-[11px] font-bold text-orange-500 truncate">{project.dueDate}</td>
                      <td className="px-4 py-4 text-[11px] font-bold text-[var(--color-text-main)] truncate" title={project.contractor}>{project.contractor}</td>
                      <td className="px-4 py-4 text-[11px] font-medium text-[var(--color-text-main)] truncate" title={project.scheme}>{project.scheme}</td>
                      <td className="px-4 py-4 text-[11px] font-bold text-[var(--color-text-main)] truncate" title={project.assistantEngineer}>{project.assistantEngineer}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">{project.status}</span>
                      </td>
                      
                      {/* Actions: Global Dropdown Trigger */}
                      <td className="px-4 py-4 text-center relative border-l border-cghb-border/50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            if (dropdownConfig?.id === project.id) {
                              setDropdownConfig(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setDropdownConfig({
                                id: project.id,
                                top: rect.bottom + 4,
                                left: rect.right - 140 
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

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{filteredProjects.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedProjects.length)}</strong> of <strong className="text-[var(--color-text-main)]">{sortedProjects.length}</strong>
          </span>
          <div className="flex gap-1.5">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20"><ChevronLeft size={14} /></button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx} onClick={() => paginate(idx + 1)} className={`h-8 w-8 flex items-center justify-center rounded-md text-[12px] font-bold transition-all ${currentPage === idx + 1 ? 'bg-cghb-yellow text-black shadow-sm' : 'border border-cghb-border text-[var(--color-text-main)] hover:bg-cghb-border/10'}`}>{idx + 1}</button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 px-2.5 border border-cghb-border rounded-md flex items-center justify-center text-[var(--color-text-muted)] disabled:opacity-50 transition-colors hover:bg-cghb-border/20"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* --- GLOBAL FIXED DROPDOWN MENU --- */}
      <AnimatePresence>
        {dropdownConfig && (() => {
          const project = projects.find(p => p.id === dropdownConfig.id);
          if (!project) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: dropdownConfig.top, left: dropdownConfig.left, zIndex: 9999 }}
              className="w-36 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-2xl flex flex-col py-1.5 text-left"
              onClick={(e) => e.stopPropagation()} 
            >
              <button onClick={() => { handleView(project); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                <Eye size={14} /> View Details
              </button>
              {userRole !== ROLES.COMMISSIONER && (
                <>
                  <button onClick={() => { handleEdit(project); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                    <Edit size={14} /> Edit Project
                  </button>
                  <button onClick={() => { handleDelete(project.id); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10 border-t border-cghb-border/50 mt-1 pt-2.5">
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