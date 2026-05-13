import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Search, Filter, 
  UploadCloud, Trash2, Plus, Check, FileText, 
  ShieldCheck, ClipboardList, Ruler, Download
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

const QualityAspect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const activeProject = mockProjects.find(p => p.id === id) || mockProjects[0];

  // Workspace State
  const [activeTab, setActiveTab] = useState('qap');
  const [projectDocs, setProjectDocs] = useState({
    qap: [],
    materialSheets: [],
    drawings: []
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
  const handleAddDocument = () => {
    if (!newDocName.trim() || !newDocFile) return;

    const newDoc = {
      id: Date.now(),
      name: newDocName,
      desc: newDocDesc,
      file: newDocFile
    };

    setProjectDocs(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newDoc]
    }));

    resetBuilder();
  };

  const handleDeleteDocument = (docId) => {
    setProjectDocs(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(d => d.id !== docId)
    }));
  };

  const TABS = [
    { id: 'qap', label: 'Quality Assurance Plan (QAP)', icon: <ShieldCheck size={16} /> },
    { id: 'materialSheets', label: 'Material Specification Sheets', icon: <ClipboardList size={16} /> },
    { id: 'drawings', label: 'Approved Drawings', icon: <Ruler size={16} /> }
  ];

  const isCommissioner = userRole === ROLES.COMMISSIONER;

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
        <button 
          onClick={handleBack}
          className="p-2 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm"
        >
          <ArrowLeft size={16}/>
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">
            Quality <span className="text-cghb-yellow">Aspects</span>
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
            <Building2 size={14}/> {activeProject.name} <span className="opacity-50">|</span> <MapPin size={12} className="text-cghb-yellow"/> {activeProject.districtName}
          </p>
        </div>
      </div>

      {/* --- TAB MENU --- */}
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
              <motion.div layoutId="activeQualityTab" className="absolute bottom-[-1px] left-0 w-full h-[4px] bg-cghb-yellow rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* --- DOCUMENT BUILDER WORKSPACE --- */}
      <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border flex flex-col w-full overflow-hidden mt-2">
        <table className="w-full text-left whitespace-nowrap table-fixed">
          <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
            <tr>
              <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[25%]">Document Title</th>
              <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[40%]">Technical Description</th>
              <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider w-[25%]">Attachment</th>
              <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-wider text-center w-[10%] border-l border-cghb-border">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cghb-border/50">
            {/* List existing files */}
            <AnimatePresence>
              {projectDocs[activeTab].map((doc) => (
                <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={doc.id} className="bg-transparent">
                  <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-text-main)] truncate" title={doc.name}>{doc.name}</td>
                  <td className="px-4 py-4 text-[12px] font-medium text-[var(--color-text-muted)] truncate" title={doc.desc}>{doc.desc}</td>
                  <td className="px-4 py-4 text-[12px] font-bold text-blue-500 truncate flex items-center gap-2">
                    <FileText size={14} /> {doc.file}
                  </td>
                  <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                    {!isCommissioner ? (
                      <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-500 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button className="text-[var(--color-text-muted)] hover:text-cghb-yellow p-1.5 transition-colors">
                        <Download size={16} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {/* Input Row for Engineers */}
            {!isCommissioner && (
              <tr className="bg-[var(--color-bg-surface)]">
                <td className="px-4 py-4">
                  <input 
                    type="text" placeholder="Entry Name..." value={newDocName} onChange={e => setNewDocName(e.target.value)} 
                    className="w-full h-10 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-all" 
                  />
                </td>
                <td className="px-4 py-4">
                  <input 
                    type="text" placeholder="Short description..." value={newDocDesc} onChange={e => setNewDocDesc(e.target.value)} 
                    className="w-full h-10 bg-[var(--color-bg-main)] border border-cghb-border text-[var(--color-text-main)] text-[12px] rounded-lg px-3 focus:outline-none focus:border-cghb-yellow transition-all" 
                  />
                </td>
                <td className="px-4 py-4">
                  <label className="w-full h-10 border border-dashed border-cghb-border bg-[var(--color-bg-main)] rounded-lg flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:border-cghb-yellow hover:text-cghb-yellow text-[var(--color-text-muted)]">
                    <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={(e) => { if (e.target.files.length > 0) setNewDocFile(e.target.files[0].name); }} />
                    {newDocFile ? <span className="flex items-center gap-1.5 text-emerald-500"><Check size={12}/> {newDocFile}</span> : <span className="flex items-center gap-1.5"><UploadCloud size={14}/> Select File</span>}
                  </label>
                </td>
                <td className="px-4 py-4 text-center border-l border-cghb-border/50">
                  <button 
                    onClick={handleAddDocument}
                    disabled={!newDocName.trim() || !newDocFile}
                    className="w-9 h-9 mx-auto flex items-center justify-center bg-cghb-yellow text-black rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {projectDocs[activeTab].length === 0 && isCommissioner && (
          <div className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium border-t border-cghb-border/50">
            No quality records have been uploaded for this category yet.
          </div>
        )}
      </div>

      {/* --- CONTEXT FOOTER --- */}
      <div className="glass-panel p-6 rounded-xl border-l-4 border-l-blue-500 bg-blue-500/5 mt-4">
        <h4 className="text-[12px] font-bold text-blue-600 uppercase tracking-widest mb-2">Quality Standards Active</h4>
        <p className="text-[13px] text-[var(--color-text-main)] font-medium">
          All materials and structural drawings must strictly adhere to the CGHB Standard Specification Manual. Files uploaded here are archived as permanent technical records for the <strong>{activeProject.name}</strong> site.
        </p>
      </div>

    </div>
  );
};

export default QualityAspect;