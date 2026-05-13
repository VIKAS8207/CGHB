import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Search, Filter, 
  UploadCloud, Trash2, Plus, Check, FileText, 
  ClipboardList, AlertTriangle, Droplets, Zap, 
  Layers, Hammer, Download, Microscope
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Mock Database for Project Context
const mockProjects = [
  { id: 'PRJ-1042', name: 'Atal Vihar Phase 2', districtName: 'Raipur' },
  { id: 'PRJ-1043', name: 'Nava Raipur EWS Block C', districtName: 'Raipur' },
  { id: 'PRJ-1044', name: 'Bilaspur MIG Heights', districtName: 'Bilaspur' },
];

const OnsiteTesting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const activeProject = mockProjects.find(p => p.id === id) || mockProjects[0];

  // Workspace State
  const [activeTab, setActiveTab] = useState('pourCards');
  const [labDocs, setLabDocs] = useState({
    pourCards: [],
    inspectionChecklists: {
      excavation: [],
      masonry: [],
      plumbing: [],
      electrical: [],
      custom: []
    },
    ncr: []
  });

  // Builder State
  const [newDocName, setNewDocName] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocFile, setNewDocFile] = useState('');

  const handleBack = () => navigate(-1);

  const resetBuilder = () => {
    setNewDocName('');
    setNewDocDesc('');
    setNewDocFile('');
  };

  // --- ACTIONS ---
  const handleAddDocument = (subCategory = null) => {
    if (!newDocName.trim() || !newDocFile) return;

    const newDoc = {
      id: Date.now(),
      name: newDocName,
      desc: newDocDesc,
      file: newDocFile
    };

    if (activeTab === 'inspectionChecklists' && subCategory) {
      setLabDocs(prev => ({
        ...prev,
        inspectionChecklists: {
          ...prev.inspectionChecklists,
          [subCategory]: [...prev.inspectionChecklists[subCategory], newDoc]
        }
      }));
    } else {
      setLabDocs(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newDoc]
      }));
    }

    resetBuilder();
  };

  const handleDeleteDocument = (docId, subCategory = null) => {
    if (activeTab === 'inspectionChecklists' && subCategory) {
      setLabDocs(prev => ({
        ...prev,
        inspectionChecklists: {
          ...prev.inspectionChecklists,
          [subCategory]: prev.inspectionChecklists[subCategory].filter(d => d.id !== docId)
        }
      }));
    } else {
      setLabDocs(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(d => d.id !== docId)
      }));
    }
  };

  const TABS = [
    { id: 'pourCards', label: 'Pour Cards', icon: <Layers size="{16}"/> },
    { id: 'inspectionChecklists', label: 'Stage-wise Inspection', icon: <ClipboardList size="{16}"/> },
    { id: 'ncr', label: 'Non-Conformance Reports (NCR)', icon: <AlertTriangle size="{16}"/> }
  ];

  const CHECKLIST_FIELDS = [
    { id: 'excavation', label: 'Excavation & Foundation', icon: <Hammer size="{14}"/> },
    { id: 'masonry', label: 'Masonry & Plastering', icon: <Layers size="{14}"/> },
    { id: 'plumbing', label: 'Plumbing & Sanity Leakage', icon: <Droplets size="{14}"/> },
    { id: 'electrical', label: 'Electrical Circuit Testing', icon: <Zap size="{14}"/> },
    { id: 'custom', label: 'Other Submissions', icon: <Plus size="{14}"/> }
  ];

  const isCommissioner = userRole === ROLES.COMMISSIONER;

  // Shared Document Row Component to avoid repetition
  const DocumentRow = ({ doc, subCat = null }) => (
    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-transparent">
      <td className="px-4 py-3 text-[13px] font-bold text-[var(--color-text-main)] truncate">{doc.name}</td>
      <td className="px-4 py-3 text-[12px] font-medium text-[var(--color-text-muted)] truncate">{doc.desc}</td>
      <td className="px-4 py-3 text-[12px] font-bold text-blue-500 truncate flex items-center gap-2">
        <FileText size="{14}"/> {doc.file}
      </td>
      <td className="px-4 py-3 text-center border-l border-cghb-border/50">
        {!isCommissioner ? (
          <button onClick={() => handleDeleteDocument(doc.id, subCat)} className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors">
            <Trash2 size="{16}"/>
          </button>
        ) : (
          <button className="text-[var(--color-text-muted)] hover:text-cghb-yellow p-1 transition-colors">
            <Download size="{16}"/>
          </button>
        )}
      </td>
    </motion.tr>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      
      <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
        <button onClick={handleBack} className="p-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
          <ArrowLeft size="{16}"/>
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Onsite <span className="text-cghb-yellow">Testing Lab</span>
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
            <Building2 size="{14}"/> {activeProject.name} <span className="opacity-50">|</span> <Microscope size="{12}" className="text-cghb-yellow"/> Site ID: {activeProject.id}
          </p>
        </div>
      </div>

      
      <div className="flex flex-wrap gap-6 border-b border-cghb-border/50">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); resetBuilder(); }}
            className={`pb-3 text-[13px] font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeLabTab" className="absolute bottom-[-1px] left-0 w-full h-[4px] bg-cghb-yellow rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      
      <div className="space-y-6 mt-4">
        {activeTab !== 'inspectionChecklists' ? (
          /* Standard Builder for Pour Cards and NCR */
          <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border overflow-hidden">
            <table className="w-full text-left table-fixed">
              <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b border-cghb-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase w-[25%]">Report Name</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase w-[40%]">Observations</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase w-[25%]">File</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase text-center w-[10%] border-l border-cghb-border">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cghb-border/50">
                {labDocs[activeTab].map(doc => <DocumentRow key="{doc.id}" doc="{doc}"/>)}
                {!isCommissioner && (
                  <tr className="bg-[var(--color-bg-surface)]">
                    <td className="px-4 py-3"><input type="text" placeholder="Title..." value={newDocName} onChange={e => setNewDocName(e.target.value)} className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[12px] rounded-md px-3 focus:border-cghb-yellow outline-none" /></td>
                    <td className="px-4 py-3"><input type="text" placeholder="Description..." value={newDocDesc} onChange={e => setNewDocDesc(e.target.value)} className="w-full h-9 bg-[var(--color-bg-main)] border border-cghb-border text-[12px] rounded-md px-3 focus:border-cghb-yellow outline-none" /></td>
                    <td className="px-4 py-3">
                      <label className="w-full h-9 border border-dashed border-cghb-border bg-[var(--color-bg-main)] rounded-md flex items-center justify-center text-[11px] font-bold cursor-pointer hover:border-cghb-yellow text-[var(--color-text-muted)]">
                        <input type="file" className="hidden" onChange={e => setNewDocFile(e.target.files[0].name)} />
                        {newDocFile ? <span className="text-emerald-500 truncate px-2">{newDocFile}</span> : 'Select File'}
                      </label>
                    </td>
                    <td className="px-4 py-3 text-center border-l border-cghb-border/50"><button onClick={() => handleAddDocument()} disabled={!newDocName || !newDocFile} className="w-8 h-8 bg-cghb-yellow text-black rounded flex items-center justify-center mx-auto disabled:opacity-50"><Plus size="{16}" strokeWidth="{3}"/></button></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* VERTICAL STAGE-WISE CHECKLISTS */
          <div className="space-y-4">
            {CHECKLIST_FIELDS.map((field) => (
              <div key={field.id} className="glass-panel rounded-xl border border-cghb-border overflow-hidden">
                <div className="bg-[var(--color-bg-surface)] px-4 py-2 border-b border-cghb-border flex items-center gap-2">
                  <div className="text-cghb-yellow">{field.icon}</div>
                  <h3 className="text-[12px] font-black uppercase tracking-wider text-[var(--color-text-main)]">{field.label}</h3>
                </div>
                <table className="w-full text-left table-fixed">
                  <tbody className="divide-y divide-cghb-border/30">
                    {labDocs.inspectionChecklists[field.id].map(doc => <DocumentRow key="{doc.id}" doc="{doc}" subCat="{field.id}"/>)}
                    {!isCommissioner && (
                      <tr className="bg-cghb-border/5">
                        <td className="px-4 py-3 w-[25%]"><input type="text" placeholder="Checklist Name..." onChange={e => setNewDocName(e.target.value)} className="w-full h-8 bg-[var(--color-bg-main)] border border-cghb-border text-[11px] rounded px-2 outline-none" /></td>
                        <td className="px-4 py-3 w-[40%]"><input type="text" placeholder="Remarks..." onChange={e => setNewDocDesc(e.target.value)} className="w-full h-8 bg-[var(--color-bg-main)] border border-cghb-border text-[11px] rounded px-2 outline-none" /></td>
                        <td className="px-4 py-3 w-[25%]">
                          <label className="w-full h-8 border border-dashed border-cghb-border bg-[var(--color-bg-main)] rounded flex items-center justify-center text-[10px] font-bold cursor-pointer text-[var(--color-text-muted)]">
                            <input type="file" className="hidden" onChange={e => setNewDocFile(e.target.files[0].name)} />
                            {newDocFile ? <span className="text-emerald-500 truncate px-2">{newDocFile}</span> : 'Upload'}
                          </label>
                        </td>
                        <td className="px-4 py-3 text-center w-[10%] border-l border-cghb-border/50"><button onClick={() => handleAddDocument(field.id)} className="w-7 h-7 bg-cghb-yellow text-black rounded flex items-center justify-center mx-auto hover:scale-105 transition-transform"><Plus size="{14}" strokeWidth="{3}"/></button></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="glass-panel p-6 rounded-xl border-l-4 border-l-orange-500 bg-orange-500/5 mt-4">
        <h4 className="text-[12px] font-bold text-orange-600 uppercase tracking-widest mb-2">Quality Control Protocol</h4>
        <p className="text-[13px] text-[var(--color-text-main)] font-medium">
          Onsite testing is the primary validator for structural integrity. NCRs must be resolved within 48 hours of filing. All pour cards must be signed by the site engineer before concreting begins.
        </p>
      </div>

    </div>
  );
};

export default OnsiteTesting;