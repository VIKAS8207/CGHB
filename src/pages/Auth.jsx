import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Building2, ShieldCheck } from 'lucide-react';

// --- 1. IMPORT YOUR AUTH CONTEXT & ROLES ---
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

const Auth = () => {
  const [view, setView] = useState('login'); // 'login', 'forgot', or 'otp'
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // --- 2. GET setUserRole FROM CONTEXT AND SETUP LOCAL STATE ---
  const { setUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(ROLES.COMMISSIONER); // Default for testing
  
  const navigate = useNavigate();

  // OTP Timer Logic (Only runs when view is 'otp')
  useEffect(() => {
    let interval;
    if (view === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  // --- ACTIONS ---

  // 1. Direct Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // --- 3. SET THE ROLE GLOBALLY BEFORE NAVIGATING ---
    setUserRole(selectedRole); 
    navigate('/dashboard'); 
  };

  // 2. Request Password Reset Link/OTP
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setView('otp'); 
    setTimer(60);
    setCanResend(false);
  };

  // 3. Verify OTP for Password Reset
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setView('login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden font-sans p-6">
      
      {/* --- BACKGROUND LAYER: Engineering Grid & Gradient Orbs --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-cghb-yellow to-orange-200 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[800px] h-[800px] bg-gradient-to-tl from-blue-200 to-emerald-100 rounded-full blur-[120px]"
        />
      </div>

      {/* --- FOREGROUND LAYER: The Layout --- */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* LEFT: Branding & Typography */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-bold uppercase tracking-widest mb-8">
              <ShieldCheck size={16} className="text-cghb-yellow" /> Secure Environment
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-6 drop-shadow-sm">
              SHAPING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                TOMORROW.
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-md">
              The official digital infrastructure for the Chhattisgarh Housing Board. Modern, secure, and built for citizens.
            </p>
          </motion.div>
        </div>

        {/* RIGHT: Frosted Glass Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/70 backdrop-blur-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              
              {/* --- 1. LOGIN VIEW --- */}
              {view === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="w-12 h-12 bg-cghb-yellow text-black flex items-center justify-center rounded-2xl mb-6 shadow-lg shadow-cghb-yellow/30">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
                  <p className="text-slate-500 text-sm font-medium mb-8">Sign in to your CGHB account to continue.</p>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-4">
                      
                      {/* --- 4. NEW DEVELOPMENT TESTING DROPDOWN --- */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Simulate Login As:</label>
                        <select 
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full h-11 bg-white/50 border border-slate-200 text-slate-900 rounded-2xl px-4 focus:outline-none focus:border-cghb-yellow focus:ring-4 focus:ring-cghb-yellow/10 transition-all font-bold cursor-pointer"
                        >
                          <option value={ROLES.COMMISSIONER}>Commissioner (Full Access)</option>
                          <option value={ROLES.DEPT_HEAD}>Department Head (Mid Access)</option>
                          <option value={ROLES.ENGINEER}>Field Engineer (Site Access)</option>
                        </select>
                      </div>
                      
                      {/* Email and Password inputs */}
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                        <input 
                          type="email" required placeholder="user@cghb.gov.in" 
                          className="w-full bg-white/50 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cghb-yellow focus:ring-4 focus:ring-cghb-yellow/10 transition-all font-medium placeholder:text-slate-400" 
                        />
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                        <input 
                          type="password" required placeholder="••••••••" 
                          className="w-full bg-white/50 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cghb-yellow focus:ring-4 focus:ring-cghb-yellow/10 transition-all font-medium placeholder:text-slate-400" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-all" />
                        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Remember me</span>
                      </label>
                      <button type="button" onClick={() => setView('forgot')} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</button>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-4 rounded-2xl mt-8 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20">
                      Secure Login <ArrowRight size={18} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* --- 2. FORGOT PASSWORD VIEW (Enter Email) --- */}
              {view === 'forgot' && (
                <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <button onClick={() => setView('login')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-8">
                    <ArrowLeft size={16} /> Back to Login
                  </button>

                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Reset Password</h2>
                  <p className="text-slate-500 text-sm font-medium mb-8">Enter your email and we'll send a recovery code.</p>

                  <form onSubmit={handleForgotSubmit} className="space-y-6">
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                      <input 
                        type="email" required placeholder="user@cghb.gov.in" 
                        className="w-full bg-white/50 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cghb-yellow focus:ring-4 focus:ring-cghb-yellow/10 transition-all font-medium placeholder:text-slate-400" 
                      />
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl mt-4 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20">
                      Send Instructions
                    </button>
                  </form>
                </motion.div>
              )}

              {/* --- 3. OTP VIEW (Verify & Return to Login) --- */}
              {view === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <button onClick={() => setView('forgot')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-8">
                    <ArrowLeft size={16} /> Back
                  </button>

                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Check your email</h2>
                  <p className="text-slate-500 text-sm font-medium mb-8">We sent a verification code to your inbox.</p>

                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="flex gap-3 sm:gap-4 justify-between">
                      {[1, 2, 3, 4].map((i) => (
                        <input 
                          key={i} type="text" maxLength="1" required
                          className="w-14 h-16 sm:w-16 sm:h-20 text-center text-3xl font-black bg-white/50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:border-cghb-yellow focus:ring-4 focus:ring-cghb-yellow/10 transition-all shadow-inner" 
                        />
                      ))}
                    </div>

                    <div className="text-center font-medium text-sm mt-6">
                      {canResend ? (
                        <p className="text-slate-500">
                          Didn't receive it? <button type="button" onClick={() => { setTimer(60); setCanResend(false); }} className="text-blue-600 font-bold hover:underline">Click to resend</button>
                        </p>
                      ) : (
                        <p className="text-slate-500">
                          Resend code in <span className="text-slate-900 font-bold">00:{timer < 10 ? `0${timer}` : timer}</span>
                        </p>
                      )}
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-cghb-yellow text-black font-black py-4 rounded-2xl mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cghb-yellow/30">
                      Verify & Continue to Login
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;