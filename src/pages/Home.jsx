import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, FileSignature, ShieldCheck, 
  Clock, AlertTriangle, TrendingUp, 
  Activity, CheckCircle2, MoreHorizontal,
  FolderPlus, HardHat, ClipboardList, FileCheck,
  Hammer, Users, Trees, Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// --- MOCK DATA ---
const DISTRICT_PROJECTS = [
  { name: 'Bilaspur', count: 45, max: 60 },
  { name: 'Korba', count: 32, max: 60 },
  { name: 'Shakthi', count: 18, max: 60 },
  { name: 'Raigad', count: 27, max: 60 }
];

const INVESTMENT_BREAKDOWN = [
  { label: 'Construction', amount: '₹2,100 Cr', percent: 50, icon: <Hammer size={14}/>, color: 'bg-blue-500' },
  { label: 'Development', amount: '₹1,200 Cr', percent: 28, icon: <Trees size={14}/>, color: 'bg-emerald-500' },
  { label: 'Welfare', amount: '₹650 Cr', percent: 15, icon: <Users size={14}/>, color: 'bg-cghb-yellow' },
  { label: 'Hospitality', amount: '₹300 Cr', percent: 7, icon: <Stethoscope size={14}/>, color: 'bg-orange-500' },
];

const TENDER_PIPELINE = [
  { stage: 'NIT Preparation', approved: 24, pending: 6, percent: 80, icon: <FileSignature size={14}/> },
  { stage: 'Advertisement', approved: 15, pending: 10, percent: 60, icon: <Activity size={14}/> },
  { stage: 'Rate Approval', approved: 8, pending: 2, percent: 80, icon: <ShieldCheck size={14}/> },
  { stage: 'Agreements', approved: 45, pending: 5, percent: 90, icon: <CheckCircle2 size={14}/> },
];

const WORK_PROGRESS = [
  { name: 'Atal Vihar Phase 2', progress: 85, target: 'Oct 2026' },
  { name: 'Bilaspur MIG Heights', progress: 60, target: 'Dec 2026' },
  { name: 'Korba EWS Block', progress: 32, target: 'Feb 2027' },
  { name: 'Raigad Commercial', progress: 95, target: 'Jun 2026' },
];

const QUICK_LINKS = [
  { label: 'New Project', icon: <FolderPlus size={24}/> },
  { label: 'Tenders', icon: <ClipboardList size={24}/> },
  { label: 'Site Visit', icon: <HardHat size={24}/> },
  { label: 'Sanctions', icon: <FileCheck size={24}/> },
];

// --- CUSTOM MINI COMPONENTS ---

const BarChart = () => (
  <div className="flex h-48 items-end justify-around gap-2 mt-6 border-b border-cghb-border/50 pb-2 relative">
    {/* Grid Lines */}
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-cghb-border" />)}
    </div>

    {DISTRICT_PROJECTS.map((item, index) => (
      <div key={index} className="flex flex-col items-center w-full z-10 group">
        {/* Count Label */}
        <span className="text-[12px] font-black text-[var(--color-text-main)] mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
          {item.count}
        </span>
        {/* Bar */}
        <div className="w-full max-w-[48px] h-32 bg-[var(--color-bg-surface)] border border-cghb-border rounded-t-lg relative flex items-end overflow-hidden">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${(item.count / item.max) * 100}%` }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            className="w-full bg-gradient-to-t from-cghb-yellow/40 to-cghb-yellow border-t-2 border-cghb-yellow"
          />
        </div>
        {/* District Label */}
        <span className="text-[10px] font-bold text-[var(--color-text-muted)] mt-3 uppercase tracking-wider text-center">
          {item.name}
        </span>
      </div>
    ))}
  </div>
);

const ProgressBar = ({ value, colorClass = "bg-cghb-yellow" }) => (
  <div className="w-full h-1.5 bg-[var(--color-bg-surface)] border border-cghb-border/50 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }}
      className={`h-full ${colorClass} rounded-full`}
    />
  </div>
);


const Home = () => {
  const { userRole, user } = useAuth();
  
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-main)] uppercase leading-none">
            Dashboard <span className="text-cghb-yellow">Overview</span>
          </h1>
          <p className="text-[13px] font-medium text-[var(--color-text-muted)] mt-2">
            Welcome back, <strong className="text-[var(--color-text-main)]">{user?.name || userRole}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[var(--color-bg-surface)] border border-cghb-border px-4 py-2 rounded-lg shadow-sm">
          <Clock size={16} className="text-cghb-yellow" />
          <span className="text-[14px] font-black text-[var(--color-text-main)] font-mono tracking-widest">{time}</span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN BENTO GRID                                           */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-6">

        {/* --- TOP ROW (2 Columns) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-72">
          
          {/* Top Left: District Distribution Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="lg:col-span-2 glass-panel rounded-lg border border-cghb-border shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start z-10 relative">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cghb-yellow" />
                <h2 className="text-[15px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Projects in each District</h2>
              </div>
              <div className="flex items-center gap-2 bg-[var(--color-bg-main)] border border-cghb-border px-3 py-1 rounded-lg shadow-sm text-[11px] font-bold">
                <span className="text-[var(--color-text-muted)] uppercase tracking-wider">Total Active:</span> <span className="text-[var(--color-text-main)] text-[13px]">122</span>
              </div>
            </div>
            
            <BarChart />
          </motion.div>

          {/* Top Right: Quick Links */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-1 bg-gradient-to-br from-[#F58634] to-[#d97021] rounded-lg shadow-lg p-6 relative overflow-hidden text-white flex flex-col justify-between">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black tracking-tight leading-none mb-1">Quick <span className="text-white/70">Links</span></h2>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 flex-1">
              {QUICK_LINKS.map((link, idx) => (
                <button key={idx} className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-lg flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-sm p-4">
                  <div className="text-white opacity-90">{link.icon}</div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white text-center leading-tight">{link.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>


        {/* --- BOTTOM ROW (3 Columns) - Fixed items-start so they hug content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Bottom Left: Total Investment & Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="glass-panel rounded-lg border border-cghb-border shadow-sm flex flex-col overflow-hidden h-fit">
            <div className="p-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <h3 className="text-[13px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Total Investment</h3>
                </div>
                <MoreHorizontal size={16} className="text-[var(--color-text-muted)]" />
              </div>
              <h2 className="text-5xl font-black text-[var(--color-text-main)] tracking-tighter">₹4,250<span className="text-2xl text-[var(--color-text-muted)]">.00</span></h2>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Crores Allocated</p>
            </div>

            {/* Breakdown List */}
            <div className="bg-[var(--color-bg-main)] border-t border-cghb-border/50 p-6 flex flex-col gap-4">
              {INVESTMENT_BREAKDOWN.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[12px] font-bold text-[var(--color-text-main)]">{item.label}</span>
                      <span className="text-[11px] font-black text-[var(--color-text-muted)]">{item.amount}</span>
                    </div>
                    <ProgressBar value={item.percent} colorClass={item.color} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>


          {/* Bottom Middle: Tender Pipeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-[#111111] rounded-lg shadow-sm p-6 flex flex-col gap-3 relative border border-white/10 text-white h-fit">
            <div className="flex justify-between items-center mb-2 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cghb-yellow" />
                <h3 className="text-[13px] font-bold uppercase tracking-wider">Tender Pipeline</h3>
              </div>
            </div>

            {/* Stacked Pills */}
            <div className="flex flex-col gap-2">
              {TENDER_PIPELINE.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="w-5/12">
                    <p className="text-[11px] font-bold text-white/90 mb-0.5 truncate">{item.stage}</p>
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40">
                      <span className="text-emerald-400">{item.approved} Apprv</span> 
                      <span>•</span> 
                      <span className="text-orange-400">{item.pending} Pend</span>
                    </div>
                  </div>
                  
                  <div className="w-4/12 px-2">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.percent}%` }} className="h-full bg-cghb-yellow rounded-full" />
                    </div>
                  </div>

                  <div className="w-3/12 flex justify-end items-center gap-2">
                    <span className="text-[12px] font-black">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Special Stat block: Total Progress */}
            <div className="mt-2 bg-gradient-to-r from-cghb-yellow/20 to-transparent border border-cghb-yellow/30 rounded-lg p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-white/60 mb-1 uppercase tracking-wider">Total Progress</p>
                <h4 className="text-4xl font-black tracking-tight">72<span className="text-xl text-white/50">%</span></h4>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-cghb-yellow/30 flex items-center justify-center relative bg-cghb-yellow/10">
                <TrendingUp size={20} className="text-cghb-yellow z-10" />
              </div>
            </div>
          </motion.div>


          {/* Bottom Right: Work Progress */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="glass-panel rounded-lg border border-cghb-border shadow-sm p-6 flex flex-col gap-6 h-fit">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <h3 className="text-[13px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Work Progress</h3>
                </div>
                <MoreHorizontal size={16} className="text-[var(--color-text-muted)]" />
              </div>
              
              <div className="flex items-end gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Average Completion</span>
                  <div className="flex items-baseline gap-1">
                    <h2 className="text-6xl font-black text-[var(--color-text-main)] tracking-tighter leading-none">68<span className="text-3xl text-[var(--color-text-muted)]">%</span></h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-4">
              {WORK_PROGRESS.map((proj, idx) => (
                <div key={idx} className="bg-[var(--color-bg-main)] border border-cghb-border rounded-lg p-4 shadow-sm hover:border-cghb-yellow/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-[12px] font-bold text-[var(--color-text-main)] truncate max-w-[180px]">{proj.name}</h4>
                      <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> Target: {proj.target}
                      </p>
                    </div>
                    <span className="text-[13px] font-black text-[var(--color-text-main)]">{proj.progress}%</span>
                  </div>
                  <ProgressBar value={proj.progress} colorClass={proj.progress > 75 ? 'bg-emerald-500' : proj.progress > 40 ? 'bg-blue-500' : 'bg-orange-500'} />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Home;