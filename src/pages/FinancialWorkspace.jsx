import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Building2, MapPin, IndianRupee, Calendar, 
  UploadCloud, Save, Check, FileText, X, AlertCircle, Plus,
  ClipboardList
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Import the mock data from the other page to keep things synced
import { mockFinancialProjects } from './FinancialProgress'; 

const initialFundReleases = [
  { id: 'FR-101', date: '2026-04-15', amount: 5.00, remarks: 'Initial Mobilization Advance', billFile: 'Mobilization_Bill.pdf' },
  { id: 'FR-102', date: '2026-05-02', amount: 7.00, remarks: 'Plinth Level Completion Payment', billFile: 'Plinth_Payment_Receipt.pdf' },
];

const initialRunningBills = [
  { id: 'RB-101', billingDate: '2026-04-10', paymentDate: '2026-04-14', amount: 4.50, billFile: 'Contractor_RA_Bill_1.pdf' },
];

// Custom Tooltip for the Wavy Graphs to match your UI
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-bg-surface)] border border-cghb-border p-3 rounded-lg shadow-xl">
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-[14px] font-black text-[var(--color-text-main)]">₹{payload[0].value.toFixed(2)} Cr</p>
      </div>
    );
  }
  return null;
};

const FinancialWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find project or fallback
  const project = mockFinancialProjects.find(p => p.id === id) || mockFinancialProjects[0];

  const [totalDeclared, setTotalDeclared] = useState(project.totalDeclared);
  const [isEditingDeclared, setIsEditingDeclared] = useState(false);
  const [tempDeclaredValue, setTempDeclaredValue] = useState(totalDeclared);

  const [releases, setReleases] = useState(initialFundReleases);
  const [runningBills, setRunningBills] = useState(initialRunningBills);
  
  // Form State for Fund Release
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');
  const [releaseAmount, setReleaseAmount] = useState('');
  const [releaseRemarks, setReleaseRemarks] = useState('');
  const [billFile, setBillFile] = useState(null);
  const fileInputRef = useRef(null);

  // Form State for Running Bill
  const [isRbFormOpen, setIsRbFormOpen] = useState(false);
  const [rbBillingDate, setRbBillingDate] = useState('');
  const [rbPaymentDate, setRbPaymentDate] = useState('');
  const [rbAmount, setRbAmount] = useState('');
  const [rbFile, setRbFile] = useState(null);
  const rbFileInputRef = useRef(null);

  const handleBack = () => navigate(-1);

  const handleSaveDeclared = () => {
    setTotalDeclared(Number(tempDeclaredValue));
    setIsEditingDeclared(false);
  };

  // Handlers for Fund Release File
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setBillFile(e.target.files[0]);
    }
  };
  const clearFile = (e) => {
    e.stopPropagation();
    setBillFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handlers for Running Bill File
  const handleRbFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setRbFile(e.target.files[0]);
    }
  };
  const clearRbFile = (e) => {
    e.stopPropagation();
    setRbFile(null);
    if (rbFileInputRef.current) rbFileInputRef.current.value = '';
  };

  const handleAddRelease = (e) => {
    e.preventDefault();
    if (!releaseDate || !releaseAmount || !billFile) return;

    const newRelease = {
      id: `FR-${Date.now()}`,
      date: releaseDate,
      amount: Number(releaseAmount),
      remarks: releaseRemarks,
      billFile: billFile.name
    };

    setReleases([newRelease, ...releases]);
    
    // Reset form
    setReleaseDate('');
    setReleaseAmount('');
    setReleaseRemarks('');
    setBillFile(null);
    setIsFormOpen(false);
  };

  const handleAddRunningBill = (e) => {
    e.preventDefault();
    if (!rbBillingDate || !rbPaymentDate || !rbAmount || !rbFile) return;

    const newRb = {
      id: `RB-${Date.now()}`,
      billingDate: rbBillingDate,
      paymentDate: rbPaymentDate,
      amount: Number(rbAmount),
      billFile: rbFile.name
    };

    setRunningBills([newRb, ...runningBills]);
    
    // Reset form
    setRbBillingDate('');
    setRbPaymentDate('');
    setRbAmount('');
    setRbFile(null);
    setIsRbFormOpen(false);
  };

  const totalReleasedCalc = releases.reduce((sum, r) => sum + r.amount, 0);
  const percentage = totalDeclared > 0 ? Math.round((totalReleasedCalc / totalDeclared) * 100) : 0;

  // Format data for smooth wavy charts
  const fundChartData = [...releases].sort((a, b) => new Date(a.date) - new Date(b.date));
  const rbChartData = [...runningBills].sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate)).map(rb => ({ ...rb, date: rb.paymentDate }));

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-in fade-in duration-300 font-sans relative z-10 space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-cghb-border pb-6">
        <button onClick={handleBack} className="p-2.5 bg-[var(--color-bg-surface)] border border-cghb-border rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-cghb-border/20 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-main)] uppercase">Financial <span className="text-cghb-yellow">Workspace</span></h1>
          <p className="text-[13px] text-[var(--color-text-muted)] font-medium mt-1 flex items-center gap-2">
            <Building2 size={14} className="text-cghb-yellow" /> {project.name} <span className="opacity-50">|</span> <MapPin size={12}/> {project.district}
          </p>
        </div>
      </div>

      {/* TOP SUMMARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Work Order Amount Widget */}
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-cghb-yellow shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">1. Funds Utilized</span>
            {!isEditingDeclared && (
              <button onClick={() => setIsEditingDeclared(true)} className="text-[11px] font-bold text-blue-500 hover:underline">Update Amount</button>
            )}
          </div>
          
          {isEditingDeclared ? (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input 
                  type="number" 
                  step="0.01" 
                  value={tempDeclaredValue} 
                  onChange={(e) => setTempDeclaredValue(e.target.value)}
                  className="w-full h-12 bg-[var(--color-bg-main)] border border-cghb-border rounded-lg pl-9 pr-4 text-[18px] font-black text-[var(--color-text-main)] focus:outline-none focus:border-cghb-yellow transition-all"
                />
              </div>
              <button onClick={handleSaveDeclared} className="h-12 px-5 bg-cghb-yellow text-black font-bold uppercase tracking-wider text-[12px] rounded-lg hover:scale-105 transition-all shadow-md">
                Save
              </button>
            </div>
          ) : (
            <h2 className="text-4xl font-black text-[var(--color-text-main)] flex items-center gap-2">
              <span className="text-cghb-yellow">₹</span>{totalDeclared.toFixed(2)} <span className="text-[16px] text-[var(--color-text-muted)] mt-2">Crores</span>
            </h2>
          )}
        </div>

        {/* Financial Progress Widget */}
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-emerald-500 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">2. Total Allocated Funds Declared</span>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-md text-[11px] font-black">{percentage}% Funded</span>
          </div>
          <h2 className="text-4xl font-black text-emerald-500 mb-4 flex items-center gap-2">
            ₹{totalReleasedCalc.toFixed(2)} <span className="text-[16px] text-[var(--color-text-muted)] mt-2">Crores</span>
          </h2>
          {/* Progress Bar */}
          <div className="w-full bg-[var(--color-bg-main)] rounded-full h-2 overflow-hidden border border-cghb-border/50">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, ease: "easeOut" }} className="bg-emerald-500 h-2 rounded-full" />
          </div>
        </div>

      </div>

      {/* --- GRAPHS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        
        {/* Graph 1: Fund Releases */}
        <div className="glass-panel p-5 rounded-2xl border border-cghb-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-cghb-yellow rounded-full"></div> Fund Release Trend
            </h4>
          </div>
          <div className="h-40 w-full">
            {fundChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorYellow)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[12px] text-[var(--color-text-muted)] font-medium">No release data available</div>
            )}
          </div>
        </div>

        {/* Graph 2: Running Bills */}
        <div className="glass-panel p-5 rounded-2xl border border-cghb-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Running Bill Payments
            </h4>
          </div>
          <div className="h-40 w-full">
            {rbChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rbChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBlue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[12px] text-[var(--color-text-muted)] font-medium">No billing data available</div>
            )}
          </div>
        </div>

      </div>

      {/* FINANCIAL RECORDS HEADER & TOGGLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 border-b border-cghb-border pb-4 gap-4">
        <h3 className="text-lg font-black text-[var(--color-text-main)] uppercase tracking-tight">Financial Records</h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setIsFormOpen(!isFormOpen); setIsRbFormOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all shadow-sm ${isFormOpen ? 'bg-[var(--color-bg-surface)] text-[var(--color-text-main)] border border-cghb-border' : 'bg-cghb-yellow text-black hover:scale-105'}`}
          >
            {isFormOpen ? <><X size={14}/> Cancel Release</> : <><Plus size={14}/> Add New Release</>}
          </button>
          <button 
            onClick={() => { setIsRbFormOpen(!isRbFormOpen); setIsFormOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all shadow-sm ${isRbFormOpen ? 'bg-[var(--color-bg-surface)] text-[var(--color-text-main)] border border-cghb-border' : 'bg-blue-500 text-white hover:scale-105'}`}
          >
            {isRbFormOpen ? <><X size={14}/> Cancel Bill</> : <><ClipboardList size={14}/> Running Bill</>}
          </button>
        </div>
      </div>

      {/* --- FORM 1: FUND RELEASE --- */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form onSubmit={handleAddRelease} className="bg-[var(--color-bg-surface)] p-6 md:p-8 rounded-2xl border border-cghb-yellow/50 shadow-lg mb-6 space-y-6">
              <div className="flex items-center gap-3 mb-2 border-b border-cghb-border/50 pb-4">
                <div className="w-8 h-8 bg-cghb-yellow/10 text-cghb-yellow rounded-lg flex items-center justify-center"><Plus size={16}/></div>
                <h4 className="text-[14px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Log New Fund Release</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Release Date</label>
                  <input type="date" required value={releaseDate} onChange={e => setReleaseDate(e.target.value)} className="w-full h-11 bg-[var(--color-bg-main)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Amount Released (Cr)</label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="number" step="0.01" required placeholder="0.00" value={releaseAmount} onChange={e => setReleaseAmount(e.target.value)} className="w-full h-11 bg-[var(--color-bg-main)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg pl-8 pr-4 focus:outline-none focus:border-cghb-yellow transition-all" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Remarks / Description</label>
                  <input type="text" required placeholder="e.g., Payment for Phase 1 completion..." value={releaseRemarks} onChange={e => setReleaseRemarks(e.target.value)} className="w-full h-11 bg-[var(--color-bg-main)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-cghb-yellow transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Upload Bill / Receipt (PDF)</label>
                  <div className="w-full">
                    {billFile ? (
                      <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-3"><FileText size={18} className="text-emerald-600" /><span className="text-[13px] font-bold text-emerald-700">{billFile.name}</span></div>
                        <button type="button" onClick={clearFile} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded"><X size={16}/></button>
                      </div>
                    ) : (
                      <label className="w-full h-14 border-2 border-dashed border-cghb-border bg-[var(--color-bg-main)] hover:border-cghb-yellow hover:bg-cghb-yellow/5 rounded-lg flex items-center justify-center cursor-pointer transition-all">
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
                        <span className="flex items-center gap-2 text-[12px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider"><UploadCloud size={16}/> Select Official Bill</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-cghb-border/50">
                <button type="submit" disabled={!releaseDate || !releaseAmount || !billFile} className="flex items-center gap-2 px-8 py-3 bg-cghb-yellow text-black rounded-lg text-[13px] font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save size={16}/> Save Release
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FORM 2: RUNNING BILL --- */}
      <AnimatePresence>
        {isRbFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form onSubmit={handleAddRunningBill} className="bg-[var(--color-bg-surface)] p-6 md:p-8 rounded-2xl border border-blue-500/50 shadow-lg mb-6 space-y-6">
              <div className="flex items-center gap-3 mb-2 border-b border-cghb-border/50 pb-4">
                <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center"><ClipboardList size={16}/></div>
                <h4 className="text-[14px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Log Running Bill</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Date of Billing</label>
                  <input type="date" required value={rbBillingDate} onChange={e => setRbBillingDate(e.target.value)} className="w-full h-11 bg-[var(--color-bg-main)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Date of Payment</label>
                  <input type="date" required value={rbPaymentDate} onChange={e => setRbPaymentDate(e.target.value)} className="w-full h-11 bg-[var(--color-bg-main)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg px-4 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Amount (Cr)</label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="number" step="0.01" required placeholder="0.00" value={rbAmount} onChange={e => setRbAmount(e.target.value)} className="w-full h-11 bg-[var(--color-bg-main)] border border-cghb-border text-[13px] text-[var(--color-text-main)] rounded-lg pl-8 pr-4 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Upload Bill Document (PDF)</label>
                  <div className="w-full">
                    {rbFile ? (
                      <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-3"><FileText size={18} className="text-emerald-600" /><span className="text-[13px] font-bold text-emerald-700">{rbFile.name}</span></div>
                        <button type="button" onClick={clearRbFile} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded"><X size={16}/></button>
                      </div>
                    ) : (
                      <label className="w-full h-14 border-2 border-dashed border-cghb-border bg-[var(--color-bg-main)] hover:border-blue-500 hover:bg-blue-500/5 rounded-lg flex items-center justify-center cursor-pointer transition-all">
                        <input type="file" ref={rbFileInputRef} className="hidden" accept=".pdf" onChange={handleRbFileChange} />
                        <span className="flex items-center gap-2 text-[12px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider"><UploadCloud size={16}/> Select Running Bill</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-cghb-border/50">
                <button type="submit" disabled={!rbBillingDate || !rbPaymentDate || !rbAmount || !rbFile} className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg text-[13px] font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save size={16}/> Save Running Bill
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DATA TABLES --- */}
      <div className="space-y-8">
        
        {/* Table 1: Fund Releases */}
        <div>
          <h4 className="text-[13px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-cghb-yellow rounded-full"></div> Fund Release Records
          </h4>
          <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed text-left whitespace-nowrap min-w-[800px]">
                <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider w-[15%]">Release Date</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider w-[20%]">Amount Released</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider w-[40%]">Remarks</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-center w-[25%] border-l border-cghb-border">Attached Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cghb-border/50">
                  <AnimatePresence>
                    {releases.length === 0 ? (
                      <tr><td colSpan="4" className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium">No funds have been released yet.</td></tr>
                    ) : (
                      releases.map((release) => (
                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={release.id} className="hover:bg-cghb-border/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-[13px] font-bold text-[var(--color-text-main)] flex items-center gap-1.5"><Calendar size={14} className="text-[var(--color-text-muted)]"/> {release.date}</div>
                            <div className="text-[10px] font-mono text-[var(--color-text-muted)] mt-1">{release.id}</div>
                          </td>
                          <td className="px-6 py-4 text-[14px] font-black text-emerald-500 font-mono">₹{release.amount.toFixed(2)} Cr</td>
                          <td className="px-6 py-4 text-[13px] font-medium text-[var(--color-text-main)] truncate" title={release.remarks}>{release.remarks}</td>
                          <td className="px-6 py-4 text-center border-l border-cghb-border/50">
                            <button className="mx-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                              <FileText size={14}/> {release.billFile}
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 2: Running Bills */}
        <div>
          <h4 className="text-[13px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Running Bill Records
          </h4>
          <div className="bg-[var(--color-bg-main)] shadow-md rounded-xl border border-cghb-border overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed text-left whitespace-nowrap min-w-[800px]">
                <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-b-2 border-cghb-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider w-[20%]">ID & Dates</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider w-[20%]">Bill Amount</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-center w-[25%] border-l border-cghb-border">Attached Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cghb-border/50">
                  <AnimatePresence>
                    {runningBills.length === 0 ? (
                      <tr><td colSpan="3" className="p-12 text-center text-[var(--color-text-muted)] text-[13px] font-medium">No running bills logged yet.</td></tr>
                    ) : (
                      runningBills.map((rb) => (
                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={rb.id} className="hover:bg-cghb-border/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-[10px] font-mono text-[var(--color-text-muted)] mb-1.5">{rb.id}</div>
                            <div className="text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-1.5 mb-1"><span className="w-12 text-[10px] text-[var(--color-text-muted)] uppercase">Billed:</span> {rb.billingDate}</div>
                            <div className="text-[12px] font-bold text-[var(--color-text-main)] flex items-center gap-1.5"><span className="w-12 text-[10px] text-[var(--color-text-muted)] uppercase">Paid:</span> {rb.paymentDate}</div>
                          </td>
                          <td className="px-6 py-4 text-[14px] font-black text-blue-500 font-mono">₹{rb.amount.toFixed(2)} Cr</td>
                          <td className="px-6 py-4 text-center border-l border-cghb-border/50">
                            <button className="mx-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                              <FileText size={14}/> {rb.billFile}
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default FinancialWorkspace;