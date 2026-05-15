import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, UploadCloud, Check, 
  FileText, Trash2, ShieldCheck, Download, 
  ChevronRight, ClipboardCheck, Edit, IndianRupee, 
  CalendarDays, Eye, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// --- MOCK DATABASE ---
const MOCK_PROJECTS = [
  { id: 'PRJ-1042', name: 'Atal Vihar Phase 2', district: 'raipur', districtName: 'Raipur' },
  { id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', district: 'raipur', districtName: 'Raipur' },
  { id: 'PRJ-1044', name: 'Bilaspur MIG Heights', district: 'bilaspur', districtName: 'Bilaspur' },
  { id: 'PRJ-1045', name: 'Bastar Standalone Villas', district: 'bastar', districtName: 'Bastar' },
  { id: 'PRJ-1046', name: 'Durg Residential Complex', district: 'durg', districtName: 'Durg' },
];

const UNIQUE_DISTRICTS = [...new Set(MOCK_PROJECTS.map(p => ({ id: p.district, name: p.districtName })))];

// Initial mock records for the table
const INITIAL_RECORDS = [
  {
    projectId: 'PRJ-1042',
    approvalNo: 'AA/2026/042',
    division: 'Raipur Division',
    scheme: 'Atal Vihar Yojana',
    estCost: '45.50',
    approvalDate: '2026-05-12',
    financialYear: '2026-27',
    fileName: 'AA_AtalVihar_Ph2.pdf'
  }
];

// Deduplicate districts helper
const getUniqueDistricts = (projects) => {
  const unique = [];
  const map = new Map();
  for (const item of projects) {
    if (!map.has(item.district)) {
      map.set(item.district, true);
      unique.push({ id: item.district, name: item.districtName });
    }
  }
  return unique;
};

const AdministrativeApproval = () => {
  const { userRole } = useAuth();
  
  // Selection State (Quick Select Gateway)
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Workspace View State
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  // Records State (Table Data)
  const [records, setRecords] = useState(INITIAL_RECORDS);

  // Form State
  const [formData, setFormData] = useState({
    approvalNo: '',
    division: '',
    scheme: '',
    estCost: '',
    approvalDate: '',
    financialYear: '',
    fileName: ''
  });

  const isCommissioner = userRole === ROLES.COMMISSIONER;

  // Derived Data
  const uniqueDistrictsList = getUniqueDistricts(MOCK_PROJECTS);
  const filteredProjectsForDropdown = selectedDistrict ? MOCK_PROJECTS.filter(p => p.district === selectedDistrict) : [];

  // Auto-fill form if record already exists when workspace opens
  useEffect(() => {
    if (activeWorkspace) {
      const existingRecord = records.find(r => r.projectId === activeWorkspace.id);
      if (existingRecord) {
        setFormData(existingRecord);
      } else {
        setFormData({ approvalNo: '', division: '', scheme: '', estCost: '', approvalDate: '', financialYear: '', fileName: '' });
      }
    }
  }, [activeWorkspace, records]);

  // --- ACTIONS ---
  const handleQuickSelectSubmit = (e) => {
    e.preventDefault();
    const project = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
    if (project) {
      setActiveWorkspace(project);
    }
  };

  const handleBack = () => {
    setActiveWorkspace(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, fileName: e.target.files[0].name }));
    }
  };

  const handleSaveRecord = (e) => {
    e.preventDefault();
    if (!formData.fileName) {
      alert("Please upload the Approval Document before saving.");
      return;
    }

    const newRecord = { ...formData, projectId: activeWorkspace.id };
    
    setRecords(prev => {
      const existsIndex = prev.findIndex(r => r.projectId === activeWorkspace.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newRecord;
        return updated;
      }
      return [...prev, newRecord];
    });

    alert("Administrative Approval record saved successfully!");
  };

  const handleEdit = (projectId) => {
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    if (project) {
      setSelectedDistrict(project.district);
      setSelectedProjectId(projectId);
      setActiveWorkspace(project);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this approval record?")) {
      setRecords(prev => prev.filter(r => r.projectId !== projectId));
      if (activeWorkspace?.id === projectId) {
        setFormData({ approvalNo: '', division: '', scheme: '', estCost: '', approvalDate: '', financialYear: '', fileName: '' });
      }
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      <AnimatePresence mode="wait">
        
        {/* ========================================================= */}
        {/* PAGE 1: GATEWAY & REGISTRY TABLE                          */}
        {/* ========================================================= */}
        {!activeWorkspace ? (
          <motion.div 
            key="page1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* --- HEADER --- */}
            <div className="border-b border-cghb-border pb-4">
              <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase flex items-center gap-3">
                <ClipboardCheck className="text-cghb-yellow" size={28} />
                Administrative <span className="text-cghb-yellow">Approval</span>
              </h1>
              <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
                Upload and verify the official Administrative Approval (AA) documents and maintain the registry.
              </p>
            </div>

            {/* --- TOP SECTION: QUICK SELECT GATEWAY --- */}
            <div className="glass-panel p-6 rounded-xl border-t-4 border-t-cghb-yellow relative overflow-hidden">
              <div className="absolute top-0 right-10 w-64 h-64 bg-cghb-yellow/5 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-8 h-8 bg-cghb-yellow/10 text-cghb-yellow flex items-center justify-center rounded-lg">
                  <ShieldCheck size={16} />
                </div>
                <h2 className="text-[15px] font-bold text-[var(--color-text-main)]">Quick Access Gateway</h2>
              </div>

              <form onSubmit={handleQuickSelectSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end relative z-10">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} /> 1. Filter District
                  </label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedProjectId(''); }}
                    className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors cursor-pointer font-medium shadow-sm"
                  >
                    <option value="" disabled>All Districts...</option>
                    {uniqueDistrictsList.map(dist => (
                      <option key={dist.id} value={dist.id} className="text-black bg-white">{dist.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building2 size={14} /> 2. Target Project
                  </label>
                  <select 
                    required 
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[13px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors cursor-pointer font-medium disabled:opacity-50 shadow-sm"
                  >
                    <option value="" disabled>{selectedDistrict ? "Select Project..." : "Select District First"}</option>
                    {filteredProjectsForDropdown.map(project => (
                      <option key={project.id} value={project.id} className="text-black bg-white">{project.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button 
                    type="submit" 
                    disabled={!selectedProjectId}
                    className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black text-[13px] font-bold uppercase tracking-wider h-10 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Access Approval Data <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </div>

            {/* --- BOTTOM SECTION: MASTER TABLE --- */}
            <div className="bg-[var(--color-bg-main)] shadow-md rounded-lg border border-cghb-border flex flex-col w-full overflow-hidden mt-8">
              <div className="bg-[var(--color-bg-surface)] px-6 py-4 border-b border-cghb-border">
                <h2 className="text-[14px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Administrative Approvals Registry</h2>
              </div>
              
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1200px]">
                  <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b border-cghb-border">
                    <tr>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Approval No.</th>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[18%]">Project Name</th>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Division</th>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[15%]">Scheme</th>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Est. Cost</th>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Apprv. Date</th>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[10%]">Financial</th>
                      <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[10%]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cghb-border/50">
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-[var(--color-text-muted)] text-[13px] font-medium">
                          No administrative approvals found in the registry.
                        </td>
                      </tr>
                    ) : (
                      records.map((record, index) => {
                        const project = MOCK_PROJECTS.find(p => p.id === record.projectId);
                        return (
                          <tr key={index} className="hover:bg-cghb-border/5 transition-colors">
                            <td className="px-4 py-3 text-[12px] font-bold text-[var(--color-text-main)] truncate">{record.approvalNo}</td>
                            <td className="px-4 py-3 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={project?.name}>{project?.name}</td>
                            <td className="px-4 py-3 text-[12px] text-[var(--color-text-muted)] truncate">{record.division}</td>
                            <td className="px-4 py-3 text-[12px] text-[var(--color-text-muted)] truncate">{record.scheme}</td>
                            <td className="px-4 py-3 text-[12px] font-mono text-[var(--color-text-main)]">₹{record.estCost} Cr</td>
                            <td className="px-4 py-3 text-[12px] text-[var(--color-text-muted)]">{record.approvalDate}</td>
                            <td className="px-4 py-3 text-[12px] text-[var(--color-text-muted)]">{record.financialYear}</td>
                            
                            <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                              {/* View Doc Button */}
                              <button className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded transition-colors" title="View Document">
                                <Eye size={16} />
                              </button>
                              
                              {!isCommissioner && (
                                <>
                                  {/* Edit Button */}
                                  <button onClick={() => handleEdit(record.projectId)} className="p-1.5 text-[var(--color-text-muted)] hover:text-cghb-yellow hover:bg-cghb-yellow/10 rounded transition-colors" title="Edit Record">
                                    <Edit size={16} />
                                  </button>
                                  {/* Delete Button */}
                                  <button onClick={() => handleDelete(record.projectId)} className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete Record">
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        ) : (

        /* ========================================================= */
        /* PAGE 2: THE FORM WORKSPACE                                */
        /* ========================================================= */
          <motion.div
            key="page2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* --- WORKSPACE HEADER & BACK BUTTON --- */}
            <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
              <button onClick={handleBack} className="p-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
                  Approval <span className="text-cghb-yellow">Workspace</span>
                </h1>
                <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
                  <Building2 size={14} /> {activeWorkspace.name} <span className="opacity-50">|</span> {activeWorkspace.id}
                </p>
              </div>
            </div>

            {/* --- FORM CONTAINER --- */}
            <div className="glass-panel rounded-lg border border-cghb-border shadow-sm overflow-hidden">
              <div className="bg-[var(--color-bg-surface)] px-6 py-4 border-b border-cghb-border flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-bold text-[var(--color-text-main)] flex items-center gap-2 uppercase tracking-wider">
                    <FileText size={16} className="text-cghb-yellow" /> Approval Details Form
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSaveRecord} className="p-6 md:p-8 bg-[var(--color-bg-main)] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Approval No */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Approval No.</label>
                    <input required type="text" name="approvalNo" value={formData.approvalNo} onChange={handleFormChange} placeholder="e.g. AA/2026/..." disabled={isCommissioner} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors disabled:opacity-50" />
                  </div>
                  
                  {/* Division */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Division</label>
                    <input required type="text" name="division" value={formData.division} onChange={handleFormChange} placeholder="e.g. Raipur Division" disabled={isCommissioner} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors disabled:opacity-50" />
                  </div>

                  {/* Scheme */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Scheme</label>
                    <input required type="text" name="scheme" value={formData.scheme} onChange={handleFormChange} placeholder="e.g. Atal Vihar Yojana" disabled={isCommissioner} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors disabled:opacity-50" />
                  </div>

                  {/* Estimated Cost */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1"><IndianRupee size={12}/> Estimated Cost (In Crores)</label>
                    <input required type="number" step="0.01" name="estCost" value={formData.estCost} onChange={handleFormChange} placeholder="0.00" disabled={isCommissioner} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors disabled:opacity-50" />
                  </div>

                  {/* Approval Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarDays size={12}/> Approval Date</label>
                    <input required type="date" name="approvalDate" value={formData.approvalDate} onChange={handleFormChange} disabled={isCommissioner} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors disabled:opacity-50" />
                  </div>

                  {/* Financial Year */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Financial Year</label>
                    <input required type="text" name="financialYear" value={formData.financialYear} onChange={handleFormChange} placeholder="e.g. 2026-27" disabled={isCommissioner} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-colors disabled:opacity-50" />
                  </div>
                </div>

                {/* Document Upload Area */}
                <div className="pt-4 border-t border-cghb-border/50">
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Sanction Document (PDF)</label>
                  
                  {formData.fileName ? (
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-emerald-600" />
                        <div>
                          <span className="block text-[12px] font-bold text-emerald-700">{formData.fileName}</span>
                          <span className="text-[10px] text-emerald-600/70">Document Ready</span>
                        </div>
                      </div>
                      {!isCommissioner && (
                        <button type="button" onClick={() => setFormData(p => ({...p, fileName: ''}))} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label className="w-full h-24 border-2 border-dashed border-cghb-border hover:border-cghb-yellow bg-[var(--color-bg-surface)] hover:bg-cghb-yellow/5 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group">
                      <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isCommissioner} />
                      <UploadCloud size={20} className="text-[var(--color-text-muted)] group-hover:text-cghb-yellow mb-2" />
                      <span className="text-[12px] font-bold text-[var(--color-text-main)]">Click to upload official document</span>
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                {!isCommissioner && (
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-cghb-yellow text-black px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-sm">
                      <Check size={16} /> Save Approval Record
                    </button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdministrativeApproval;