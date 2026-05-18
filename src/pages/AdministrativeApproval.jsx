import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, UploadCloud, Check, 
  FileText, Trash2, Download, 
  ChevronRight, ClipboardCheck, Edit, IndianRupee, 
  CalendarDays, Eye, ArrowLeft,
  MoreVertical, Filter, Search, ChevronLeft, AlertCircle, Plus, LayoutList
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
  { id: 'PRJ-1047', name: 'Korba Commercial Hub', district: 'korba', districtName: 'Korba' },
  { id: 'PRJ-1048', name: 'Raigarh LIG Quarters', district: 'raigarh', districtName: 'Raigarh' },
];

// Initial mock records for the table (Using docs array for multi-upload)
const INITIAL_RECORDS = [
  {
    projectId: 'PRJ-1042', approvalNo: 'AA/2026/042', division: 'Raipur Division', scheme: 'Atal Vihar Yojana', estCost: '45.50', approvalDate: '2026-05-12', financialYear: '2026-27',
    docs: [{ id: 1, name: 'Main AA Sanction', desc: 'Signed by Commissioner', file: 'AA_AtalVihar_Ph2.pdf' }]
  },
  {
    projectId: 'PRJ-1043', approvalNo: 'AA/2026/043', division: 'Raipur Division', scheme: 'EWS Housing', estCost: '120.00', approvalDate: '2026-04-20', financialYear: '2026-27',
    docs: [] // Empty to show "Upload Required"
  },
  {
    projectId: 'PRJ-1044', approvalNo: 'AA/2026/044', division: 'Bilaspur Division', scheme: 'MIG Housing Dev', estCost: '85.25', approvalDate: '2026-03-15', financialYear: '2025-26',
    docs: [{ id: 2, name: 'AA Approval Copy', desc: 'Initial Sanction', file: 'Bilaspur_AA_26.pdf' }]
  },
  {
    projectId: 'PRJ-1045', approvalNo: 'AA/2026/045', division: 'Bastar Division', scheme: 'Standalone', estCost: '12.00', approvalDate: '2026-05-01', financialYear: '2026-27',
    docs: []
  },
  {
    projectId: 'PRJ-1046', approvalNo: 'AA/2026/046', division: 'Durg Division', scheme: 'LIG Housing', estCost: '34.80', approvalDate: '2026-02-10', financialYear: '2025-26',
    docs: [{ id: 3, name: 'Sanction Document', desc: 'Approved via Board', file: 'Durg_Res_AA.pdf' }, { id: 4, name: 'Revised Costing', desc: 'Amendment 1', file: 'Durg_AA_Rev.pdf' }]
  },
  {
    projectId: 'PRJ-1047', approvalNo: 'AA/2026/047', division: 'Korba Division', scheme: 'Smart City Dev', estCost: '210.00', approvalDate: '2026-05-15', financialYear: '2026-27',
    docs: [{ id: 5, name: 'AA Sanction', desc: 'Phase 1 Hub', file: 'Korba_AA_Ph1.pdf' }]
  }
];

// --- INDEPENDENT INPUT ROW FOR MULTI-UPLOAD ---
const InputRow = ({ onSave }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');

  const handleAdd = () => {
    onSave({ name, desc, file: fileName });
    setName(''); setDesc(''); setFileName('');
  };

  return (
    <tr className="bg-[var(--color-bg-surface)]">
      <td className="px-4 py-3">
        <input type="text" placeholder="Enter doc name..." value={name} onChange={e => setName(e.target.value)} className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
      </td>
      <td className="px-4 py-3">
        <input type="text" placeholder="Brief description..." value={desc} onChange={e => setDesc(e.target.value)} className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
      </td>
      <td className="px-4 py-3">
        <label className="w-full h-9 border border-dashed border-cghb-border bg-[var(--color-bg-main)] rounded-lg flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:border-cghb-yellow hover:text-cghb-yellow text-[var(--color-text-muted)] shadow-sm">
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => { if (e.target.files.length > 0) setFileName(e.target.files[0].name); }} />
          {fileName ? <span className="flex items-center gap-1.5 text-emerald-500"><Check size={12}/> {fileName}</span> : <span className="flex items-center gap-1.5"><UploadCloud size={14}/> Select File</span>}
        </label>
      </td>
      <td className="px-4 py-3 text-center border-l border-cghb-border/50">
        <button onClick={handleAdd} disabled={!name.trim() || !fileName} className="w-8 h-8 mx-auto flex items-center justify-center bg-cghb-yellow text-black rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" title="Add Document">
          <Plus size={16} strokeWidth={3} />
        </button>
      </td>
    </tr>
  );
};

const AdministrativeApproval = () => {
  const { userRole } = useAuth();
  const isCommissioner = userRole === ROLES.COMMISSIONER;
  
  // States
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fixed Global Dropdown Menu State
  const [dropdownConfig, setDropdownConfig] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Navigation States
  const [editingRecord, setEditingRecord] = useState(null); // Form Page
  const [uploadingRecord, setUploadingRecord] = useState(null); // Upload Workspace Page
  const [viewingRecord, setViewingRecord] = useState(null); // View Page

  // Form State (For editingRecord)
  const [formData, setFormData] = useState({
    approvalNo: '', division: '', scheme: '', estCost: '', approvalDate: '', financialYear: ''
  });

  // --- GLOBALLY CLOSE DROPDOWN ON SCROLL OR CLICK ---
  useEffect(() => {
    const closeDropdown = () => setDropdownConfig(null);
    document.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", closeDropdown, true); 
    return () => {
      document.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", closeDropdown, true);
    };
  }, []);

  // --- ACTIONS ---

  const handleBack = () => {
    setEditingRecord(null);
    setUploadingRecord(null);
    setViewingRecord(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const newRecord = { ...formData, projectId: editingRecord.id, docs: records.find(r => r.projectId === editingRecord.id)?.docs || [] };
    
    setRecords(prev => {
      const existsIndex = prev.findIndex(r => r.projectId === editingRecord.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newRecord;
        return updated;
      }
      return [newRecord, ...prev];
    });
    setEditingRecord(null); // Return to dashboard
  };

  const handleEdit = (projectId) => {
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    const existingRecord = records.find(r => r.projectId === projectId);
    setFormData(existingRecord || { approvalNo: '', division: '', scheme: '', estCost: '', approvalDate: '', financialYear: '' });
    setEditingRecord(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this approval record and all its documents?")) {
      setRecords(prev => prev.filter(r => r.projectId !== projectId));
    }
  };

  const handleAddDocToRecord = (projectId, docData) => {
    const newDoc = { id: Date.now(), ...docData };
    setRecords(prev => prev.map(r => {
      if (r.projectId === projectId) {
        return { ...r, docs: [...r.docs, newDoc] };
      }
      return r;
    }));
  };

  const handleDeleteDocFromRecord = (projectId, docId) => {
    setRecords(prev => prev.map(r => {
      if (r.projectId === projectId) {
        return { ...r, docs: r.docs.filter(d => d.id !== docId) };
      }
      return r;
    }));
  };

  // --- FILTER & PAGINATION ---
  const searchResults = records.filter(r => {
    const proj = MOCK_PROJECTS.find(p => p.id === r.projectId);
    return r.approvalNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
           proj?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           r.division.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage) || 1; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // ============================================================================
  // VIEW 3: MULTI-DOCUMENT UPLOAD WORKSPACE
  // ============================================================================
  if (uploadingRecord) {
    const project = MOCK_PROJECTS.find(p => p.id === uploadingRecord.projectId);
    const activeData = records.find(r => r.projectId === uploadingRecord.projectId);

    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">Document <span className="text-cghb-yellow">Workspace</span></h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <UploadCloud size={14} className="text-cghb-yellow" /> {project?.name} <span className="opacity-50">|</span> {activeData?.approvalNo}
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-bg-main)] shadow-md rounded-lg border border-cghb-border flex flex-col w-full overflow-hidden mt-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap table-fixed min-w-[800px]">
              <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b border-cghb-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider w-[25%]">Document Name</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider w-[40%]">Description</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider w-[25%]">File</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-center w-[10%] border-l border-cghb-border">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cghb-border/50">
                <AnimatePresence>
                  {activeData?.docs.map((doc) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={doc.id} className="bg-transparent hover:bg-cghb-border/5 transition-colors">
                      <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-text-main)] truncate">{doc.name}</td>
                      <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-muted)] truncate">{doc.desc}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-blue-500 truncate cursor-pointer hover:underline flex items-center gap-2">
                        <FileText size={14} /> {doc.file}
                      </td>
                      <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                        <button onClick={() => handleDeleteDocFromRecord(activeData.projectId, doc.id)} className="text-red-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10" title="Remove Document">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {/* Independent Input Row */}
                <InputRow onSave={(doc) => handleAddDocToRecord(activeData.projectId, doc)} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: PROFILE/DETAILS PAGE
  // ============================================================================
  if (viewingRecord) {
    const project = MOCK_PROJECTS.find(p => p.id === viewingRecord.projectId);
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">Approval <span className="text-cghb-yellow">Details</span></h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <LayoutList size={14} className="text-cghb-yellow" /> {project?.name} <span className="opacity-50">|</span> {viewingRecord.approvalNo}
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-xl border border-cghb-border shadow-sm space-y-10">
          <div>
            <h3 className="text-[12px] font-black text-cghb-yellow uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">1. Core Allocation Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Approval No</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingRecord.approvalNo}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Division</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingRecord.division}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Scheme</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingRecord.scheme}</span></div>
              <div><span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Financial Year</span><span className="block text-[14px] font-medium text-[var(--color-text-main)]">{viewingRecord.financialYear}</span></div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Estimated Cost</span>
                <span className="block text-[18px] font-black text-emerald-500">₹{viewingRecord.estCost} Cr</span>
              </div>
              <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-cghb-border/50 shadow-sm md:col-span-2">
                <span className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Approval Date</span>
                <span className="block text-[15px] font-black text-[var(--color-text-main)]">{viewingRecord.approvalDate}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-black text-blue-500 uppercase tracking-widest mb-4 border-b border-cghb-border/50 pb-2">2. Official Documents Attached ({viewingRecord.docs.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {viewingRecord.docs.length === 0 ? (
                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-600 text-[13px] font-bold flex items-center gap-2">
                  <AlertCircle size={16}/> No documents have been uploaded for this approval yet.
                </div>
              ) : (
                viewingRecord.docs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-[var(--color-bg-main)] border border-cghb-border/50 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-500 flex items-center justify-center rounded-lg"><FileText size={18}/></div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[var(--color-text-main)]">{doc.name}</h4>
                        <p className="text-[12px] text-[var(--color-text-muted)]">{doc.desc}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[12px] font-bold text-[var(--color-text-main)] hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm">
                      <Download size={14}/> Download {doc.file}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 1.5: FORM EDIT/CREATE WORKSPACE
  // ============================================================================
  if (editingRecord) {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300 font-sans relative z-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
          <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">Approval <span className="text-cghb-yellow">Registration Form</span></h1>
            <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
              <Building2 size={14} className="text-cghb-yellow" /> {editingRecord.name} <span className="opacity-50">|</span> {editingRecord.id}
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-xl border border-cghb-border shadow-sm overflow-hidden p-8">
          <form onSubmit={handleSaveForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Approval No.</label>
                <input required type="text" name="approvalNo" value={formData.approvalNo} onChange={handleFormChange} placeholder="e.g. AA/2026/..." className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Division</label>
                <input required type="text" name="division" value={formData.division} onChange={handleFormChange} placeholder="e.g. Raipur Division" className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Scheme</label>
                <input required type="text" name="scheme" value={formData.scheme} onChange={handleFormChange} placeholder="e.g. Atal Vihar Yojana" className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1"><IndianRupee size={12}/> Est. Cost (Crores)</label>
                <input required type="number" step="0.01" name="estCost" value={formData.estCost} onChange={handleFormChange} placeholder="0.00" className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Financial Year</label>
                <input required type="text" name="financialYear" value={formData.financialYear} onChange={handleFormChange} placeholder="e.g. 2026-27" className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarDays size={12}/> Approval Date</label>
                <input required type="date" name="approvalDate" value={formData.approvalDate} onChange={handleFormChange} className="w-full h-11 bg-[var(--color-bg-surface)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-cghb-border/50">
              <button type="submit" className="flex items-center gap-2 text-black text-[13px] font-bold uppercase tracking-wider h-11 px-8 rounded-lg transition-all shadow-md bg-cghb-yellow shadow-cghb-yellow/20 hover:scale-[1.02] active:scale-[0.98]">
                <Edit size={16} /> Save Base Record
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PAGE 1: MAIN DASHBOARD & DIRECTORY
  // ============================================================================
  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      <div className="border-b border-cghb-border pb-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase flex items-center gap-3">
          <ClipboardCheck className="text-cghb-yellow" size={28} />
          Administrative <span className="text-cghb-yellow">Approval</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-[13px] font-medium mt-1">
          Upload and verify the official Administrative Approval (AA) documents and maintain the registry.
        </p>
      </div>

      {/* TABLE SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
          <input type="text" placeholder="Search by Apprv No, Division, or Project..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full h-10 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg pl-10 pr-4 text-[13px] text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[13px] font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-text-muted)] transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* MASTER TABLE */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden relative">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left whitespace-nowrap min-w-[1300px]">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
              <tr>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[4%]">S.No</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Approval No.</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[18%]">Project Name</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Division</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[12%]">Scheme</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[8%]">Est. Cost</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider w-[20%] text-center">Sanction Document</th>
                <th className="px-4 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center w-[5%] border-l border-cghb-border">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cghb-border/50">
              <AnimatePresence>
                {currentRecords.length === 0 ? (
                  <tr><td colSpan="8" className="p-8 text-center text-[var(--color-text-muted)] text-[13px] font-medium">No administrative approvals found in the registry.</td></tr>
                ) : (
                  currentRecords.map((record, index) => {
                    const project = MOCK_PROJECTS.find(p => p.id === record.projectId);
                    const hasDocs = record.docs && record.docs.length > 0;

                    return (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={record.projectId} className="hover:bg-cghb-border/5 transition-colors">
                        <td className="px-4 py-4 text-[11px] font-bold text-[var(--color-text-muted)] text-center">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate">{record.approvalNo}</td>
                        <td className="px-4 py-4 text-[12px] font-bold text-[var(--color-text-main)] truncate" title={project?.name}>{project?.name}</td>
                        <td className="px-4 py-4 text-[11px] text-[var(--color-text-muted)] truncate">{record.division}</td>
                        <td className="px-4 py-4 text-[11px] text-[var(--color-text-muted)] truncate">{record.scheme}</td>
                        <td className="px-4 py-4 text-[12px] font-mono font-bold text-emerald-500">₹{record.estCost} Cr</td>
                        
                        {/* Inline Document Action */}
                        <td className="px-4 py-4 text-center">
                          {hasDocs ? (
                            <button className="mx-auto flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20">
                              <Download size={14}/> {record.docs[0].file} {record.docs.length > 1 && `(+${record.docs.length - 1})`}
                            </button>
                          ) : (
                            <span className="mx-auto flex items-center justify-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-orange-500/20 max-w-[120px] uppercase tracking-wider">
                              <AlertCircle size={12}/> Upload Req.
                            </span>
                          )}
                        </td>

                        {/* GLOBAL ACTION BUTTON */}
                        <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (dropdownConfig?.id === record.projectId) {
                                setDropdownConfig(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setDropdownConfig({
                                  id: record.projectId,
                                  top: rect.bottom + 4,
                                  left: rect.left - 130 // Ensures dropdown stays on screen
                                });
                              }
                            }} 
                            className="text-[var(--color-text-muted)] outline-none hover:text-[var(--color-text-main)] p-1 rounded transition-colors hover:bg-cghb-border/20"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* --- ALWAYS VISIBLE PAGINATION --- */}
        <div className="border-t border-cghb-border px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface)]">
          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">
            Viewing <strong className="text-[var(--color-text-main)]">{searchResults.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, searchResults.length)}</strong> of <strong className="text-[var(--color-text-main)]">{searchResults.length}</strong>
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
      {/* This renders strictly outside the table to absolutely prevent clipping and scrollbars */}
      <AnimatePresence>
        {dropdownConfig && (() => {
          const record = records.find(r => r.projectId === dropdownConfig.id);
          if (!record) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: dropdownConfig.top, left: dropdownConfig.left, zIndex: 9999 }}
              className="w-40 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg shadow-2xl flex flex-col py-1.5 text-left"
              onClick={(e) => e.stopPropagation()} // Prevent clicking inside the menu from closing it immediately
            >
              <button onClick={() => { setViewingRecord(record); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-2.5 hover:bg-cghb-border/10">
                <Eye size={14} /> View Details
              </button>
              {!isCommissioner && (
                <>
                  <button onClick={() => { setUploadingRecord(record); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-blue-500 flex items-center gap-2.5 hover:bg-blue-500/10">
                    <UploadCloud size={14} /> Manage Docs
                  </button>
                  <button onClick={() => { handleDelete(record.projectId); setDropdownConfig(null); }} className="px-4 py-2.5 text-[12px] font-bold text-red-500 flex items-center gap-2.5 hover:bg-red-500/10 border-t border-cghb-border/50 mt-1 pt-2.5">
                    <Trash2 size={14} /> Delete Full
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

export default AdministrativeApproval;