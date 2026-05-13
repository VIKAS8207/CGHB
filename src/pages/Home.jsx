import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, FileSignature, HardHat, ShieldCheck, 
  Clock, AlertTriangle, CheckCircle2, TrendingUp, 
  MapPin, Activity, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// --- MOCK DATA ---
const KPI_STATS = [
  { label: "Active Projects", value: "142", trend: "+12%", icon: <Building2 size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Tenders in Pipeline", value: "38", trend: "+5%", icon: <FileSignature size={20} />, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Tech Sanctions Pending", value: "14", trend: "-2%", icon: <ShieldCheck size={20} />, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Live Field Sites", value: "86", trend: "+18%", icon: <HardHat size={20} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const DISTRICT_DISTRIBUTION = [
  { district: 'Raipur', count: 45, max: 50 },
  { district: 'Nava Raipur', count: 32, max: 50 },
  { district: 'Bilaspur', count: 28, max: 50 },
  { district: 'Bastar', count: 18, max: 50 },
  { district: 'Durg', count: 22, max: 50 },
];

const TENDER_HEALTH = [
  { stage: 'NIT Preparation', value: 45, color: 'bg-slate-500' },
  { stage: 'Advertisement Live', value: 20, color: 'bg-blue-500' },
  { stage: 'Rate Approval', value: 15, color: 'bg-orange-500' },
  { stage: 'Executed Agreements', value: 65, color: 'bg-cghb-yellow' },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'site', title: 'Concrete Pour Logged', location: 'Atal Vihar Ph-2', time: '2 hours ago', status: 'verified' },
  { id: 2, type: 'tender', title: 'Rate Approved for NIT-042', location: 'Nava Raipur', time: '4 hours ago', status: 'action' },
  { id: 3, type: 'sanction', title: 'TS Granted: Comm Plaza', location: 'Bilaspur', time: '5 hours ago', status: 'verified' },
  { id: 4, type: 'site', title: 'Material Test Failed (NCR)', location: 'Durg Residential', time: '1 day ago', status: 'alert' },
];

// --- CUSTOM CHART COMPONENTS ---

const CustomBarChart = () => (
  <div className="h-48 flex items-end justify-between gap-2 mt-4 pt-4 border-t border-cghb-border/50 relative">
    {/* Grid Lines */}
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
      {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-cghb-border" />)}
    </div>
    
    {DISTRICT_DISTRIBUTION.map((item, index) => {
      const heightPercentage = (item.count / item.max) * 100;
      return (
        <div key={index} className="flex flex-col items-center flex-1 group z-10">
          <div className="relative w-full max-w-[40px] h-32 flex items-end justify-center">
            {/* Tooltip */}
            <div className="absolute -top-8 bg-[var(--color-bg-surface)] border border-cghb-border text-[var(--color-text-main)] text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg pointer-events-none">
              {item.count} Projects
            </div>
            {/* Bar */}
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${heightPercentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              className="w-full bg-gradient-to-t from-cghb-yellow/20 to-cghb-yellow rounded-t-sm border-t-2 border-cghb-yellow opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] mt-3 uppercase tracking-wider truncate w-full text-center">
            {item.district}
          </span>
        </div>
      );
    })}
  </div>
);

const HorizontalProgress = ({ stage, value, color }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
      <span className="text-[var(--color-text-main)]">{stage}</span>
      <span className="text-[var(--color-text-muted)]">{value} Active</span>
    </div>
    <div className="w-full h-1.5 bg-[var(--color-bg-surface)] rounded-full overflow-hidden border border-cghb-border/50">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(value / 65) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);

// --- MAIN DASHBOARD ---

const Home = () => {
  const { userRole, user } = useAuth();
  
  // Real-time Clock
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 font-sans relative z-10 space-y-6">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-cghb-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-main)] uppercase leading-none">
            Command <span className="text-cghb-yellow">Center</span>
          </h1>
          <p className="text-[13px] font-medium text-[var(--color-text-muted)] mt-2">
            Welcome back, <strong className="text-[var(--color-text-main)]">{user?.name || userRole}</strong>. Here is your operational overview.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[var(--color-bg-surface)] border border-cghb-border px-4 py-2 rounded-lg shadow-sm">
          <Clock size={16} className="text-cghb-yellow" />
          <span className="text-[14px] font-black text-[var(--color-text-main)] font-mono tracking-widest">{time}</span>
        </div>
      </header>

      {/* --- TOP ROW: KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_STATS.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={index} 
            className="glass-panel p-5 rounded-xl border border-cghb-border hover:border-cghb-yellow/50 transition-colors group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none transition-all group-hover:scale-150`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} border border-cghb-border`}>
                {stat.icon}
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                <TrendingUp size={12} /> {stat.trend}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-[var(--color-text-main)]">{stat.value}</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- MIDDLE ROW: CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Distribution Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-cghb-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-[15px] font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-cghb-yellow" /> Regional Distribution
              </h2>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Active residential and commercial zones</p>
            </div>
            <button className="text-[11px] font-bold text-[var(--color-text-muted)] hover:text-cghb-yellow flex items-center gap-1 uppercase tracking-wider transition-colors">
              Full Map <ArrowRight size={12} />
            </button>
          </div>
          <CustomBarChart />
        </div>

        {/* Tender Lifecycle Health */}
        <div className="glass-panel p-6 rounded-xl border border-cghb-border shadow-sm">
          <h2 className="text-[15px] font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2 mb-2">
            <Activity size={16} className="text-blue-500" /> Pipeline Health
          </h2>
          <p className="text-[11px] text-[var(--color-text-muted)] mb-6">Tender and administrative bottlenecks</p>
          
          <div className="flex-1 flex flex-col justify-center space-y-2">
            {TENDER_HEALTH.map((item, idx) => (
              <HorizontalProgress key={idx} stage={item.stage} value={item.value} color={item.color} />
            ))}
          </div>
        </div>

      </div>

      {/* --- BOTTOM ROW: LISTS & ACTIVITY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent System Activity */}
        <div className="glass-panel rounded-xl border border-cghb-border shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[var(--color-bg-surface)] px-6 py-4 border-b border-cghb-border flex justify-between items-center">
            <h2 className="text-[13px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">Live System Feed</h2>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cghb-yellow before:via-cghb-border before:to-transparent">
              {RECENT_ACTIVITY.map((activity, index) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Node */}
                  <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 border-[var(--color-bg-main)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 
                    ${activity.status === 'verified' ? 'bg-emerald-500' : activity.status === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} 
                  />
                  {/* Content Card */}
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] glass-panel p-4 rounded-lg border border-cghb-border group-hover:border-cghb-yellow/50 transition-colors shadow-sm relative">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[13px] font-bold text-[var(--color-text-main)]">{activity.title}</h3>
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{activity.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-[var(--color-text-muted)] flex items-center gap-1 mt-2">
                      <Building2 size={12} /> {activity.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Required / Alerts */}
        <div className="glass-panel rounded-xl border border-cghb-border shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[var(--color-bg-surface)] px-6 py-4 border-b border-cghb-border flex justify-between items-center">
            <h2 className="text-[13px] font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" /> Pending Action Items
            </h2>
          </div>
          <div className="p-0 flex-1 flex flex-col">
            <div className="divide-y divide-cghb-border flex-1">
              {/* Alert Item 1 */}
              <div className="p-5 hover:bg-cghb-border/5 transition-colors flex items-start gap-4 cursor-pointer group">
                <div className="w-8 h-8 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5"><ShieldCheck size={14} /></div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-[var(--color-text-main)] group-hover:text-cghb-yellow transition-colors">Technical Sanction Pending</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1 line-clamp-1">Review BOQ and Drawings for Bastar Standalone Villas.</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-[10px] font-bold uppercase tracking-wider bg-cghb-yellow text-black px-3 py-1.5 rounded shadow-sm hover:scale-105 transition-transform">Review Now</button>
                  </div>
                </div>
              </div>

              {/* Alert Item 2 */}
              <div className="p-5 hover:bg-cghb-border/5 transition-colors flex items-start gap-4 cursor-pointer group">
                <div className="w-8 h-8 rounded bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle size={14} /></div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-[var(--color-text-main)] group-hover:text-cghb-yellow transition-colors">Resolve NCR (Non-Conformance)</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1 line-clamp-1">Concrete grade failed 7-day strength test at Durg Block B.</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-[10px] font-bold uppercase tracking-wider border border-cghb-border text-[var(--color-text-main)] hover:bg-cghb-border/20 px-3 py-1.5 rounded transition-colors">View Report</button>
                  </div>
                </div>
              </div>

              {/* Alert Item 3 */}
              <div className="p-5 hover:bg-cghb-border/5 transition-colors flex items-start gap-4 cursor-pointer group">
                <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5"><FileSignature size={14} /></div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-[var(--color-text-main)] group-hover:text-cghb-yellow transition-colors">Rate Approval Sign-off</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1 line-clamp-1">Finalized contractor rates for Bilaspur Commercial Plaza.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;