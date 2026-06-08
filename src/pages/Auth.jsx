import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Building2, ShieldCheck, ChevronDown } from 'lucide-react';

// --- IMPORT YOUR AUTH CONTEXT & ROLES ---
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

// Smart mapping: Connects specific UI titles to core system access levels
const ROLE_OPTIONS = [
  // Full Access Group (Maps to ROLES.COMMISSIONER)
  { id: 'comm_1', label: 'Commissioner (Full Access)', baseRole: ROLES.COMMISSIONER },
  { id: 'comm_2', label: 'Additional Commissioner (Full Access)', baseRole: ROLES.COMMISSIONER },
  { id: 'comm_3', label: 'Deputy Commissioner (Full Access)', baseRole: ROLES.COMMISSIONER },
  
  // Mid Level Access Group (Maps to ROLES.DEPT_HEAD)
  { id: 'mid_1', label: 'Divisional Incharge (Mid Access)', baseRole: ROLES.DEPT_HEAD },
  { id: 'mid_2', label: 'Executive Engineer (EE) (Mid Access)', baseRole: ROLES.DEPT_HEAD },
  
  // Low Level Access Group (Maps to ROLES.ENGINEER)
  { id: 'low_1', label: 'Assistant Engineer (AE) (Site Access)', baseRole: ROLES.ENGINEER },
  { id: 'low_2', label: 'Sub Engineer (SE) (Site Access)', baseRole: ROLES.ENGINEER },
];

const Auth = () => {
  const [view, setView] = useState('login'); // 'login', 'forgot', or 'otp'
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Auth Context & State
  const { setUserRole } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState(ROLE_OPTIONS[0].id); // Default to Commissioner
  
  const navigate = useNavigate();

  // OTP State & Refs
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const otpRefs = useRef([]);

  // OTP Timer Logic
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Find the mapped system role based on the user's specific dropdown selection
    const selectedOption = ROLE_OPTIONS.find(opt => opt.id === selectedRoleId);
    setUserRole(selectedOption.baseRole); 
    navigate('/dashboard'); 
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setView('otp'); 
    setTimer(60);
    setCanResend(false);
    setOtpValues(['', '', '', '']); // Reset OTP fields
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setView('login');
  };

  // --- OTP AUTO-ADVANCE LOGIC ---
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Only allow numbers

    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1); // Only take the last typed character
    setOtpValues(newOtp);

    // Move to next input if value exists
    if (value && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center relative overflow-hidden font-sans p-6">
      
      {/* --- BACKGROUND LAYER: Secure & Professional Tone --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        
        {/* Subdued professional gradient orbs */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-slate-400 to-blue-200 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[800px] h-[800px] bg-gradient-to-tl from-slate-300 to-slate-200 rounded-full blur-[120px]"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 text-xs font-bold uppercase tracking-widest mb-8">
              <ShieldCheck size={16} className="text-[#F58634]" /> Official Government Portal
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-6 drop-shadow-sm">
              SHAPING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
                TOMORROW.
              </span>
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl font-medium max-w-md">
              The central digital infrastructure for the Chhattisgarh Housing Board. Secure, accountable, and transparent.
            </p>
          </motion.div>
        </div>

        {/* RIGHT: Frosted Glass Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-10 rounded-lg relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              
              {/* --- 1. LOGIN VIEW --- */}
              {view === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="w-12 h-12 bg-[#F58634] text-white flex items-center justify-center rounded-lg mb-6 shadow-md shadow-orange-500/20">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure Login</h2>
                  <p className="text-slate-500 text-sm font-medium mb-8">Access your assigned administrative workspace.</p>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-4">
                      
                      {/* --- CUSTOMIZED ROLE DROPDOWN --- */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Administrative Designation:</label>
                        <div className="relative">
                          <select 
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            className="w-full h-11 bg-white border border-slate-300 text-slate-900 rounded-none px-4 appearance-none focus:outline-none focus:border-[#F58634] hover:border-[#F58634] focus:ring-1 focus:ring-[#F58634] transition-colors font-bold cursor-pointer text-sm"
                          >
                            {ROLE_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {/* Custom perfectly aligned dropdown arrow */}
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronDown size={18} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Email Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address:</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                          <input 
                            type="email" required placeholder="user@cghb.gov.in" 
                            className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-[#F58634] focus:ring-1 focus:ring-[#F58634] transition-all font-medium placeholder:text-slate-400 text-sm" 
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password:</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                          <input 
                            type="password" required placeholder="••••••••" 
                            className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-[#F58634] focus:ring-1 focus:ring-[#F58634] transition-all font-medium placeholder:text-slate-400 text-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#F58634] focus:ring-[#F58634] transition-all" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                      </label>
                      <button type="button" onClick={() => setView('forgot')} className="text-sm font-bold text-[#F58634] hover:text-orange-700 transition-colors">Forgot password?</button>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-3.5 rounded-lg mt-8 hover:bg-black transition-all shadow-md">
                      Authenticate <ArrowRight size={18} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* --- 2. FORGOT PASSWORD VIEW --- */}
              {view === 'forgot' && (
                <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <button onClick={() => setView('login')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
                    <ArrowLeft size={16} /> Back to Login
                  </button>

                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Reset Password</h2>
                  <p className="text-slate-500 text-sm font-medium mb-8">Enter your official email to receive a recovery code.</p>

                  <form onSubmit={handleForgotSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registered Email:</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                        <input 
                          type="email" required placeholder="user@cghb.gov.in" 
                          className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-[#F58634] focus:ring-1 focus:ring-[#F58634] transition-all font-medium placeholder:text-slate-400 text-sm" 
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-3.5 rounded-lg mt-4 hover:bg-black transition-all shadow-md">
                      Send Instructions
                    </button>
                  </form>
                </motion.div>
              )}

              {/* --- 3. OTP VIEW --- */}
              {view === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <button onClick={() => setView('forgot')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
                    <ArrowLeft size={16} /> Back
                  </button>

                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Verify Identity</h2>
                  <p className="text-slate-500 text-sm font-medium mb-8">Enter the 4-digit security code sent to your email.</p>

                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="flex gap-3 sm:gap-4 justify-between">
                      {[0, 1, 2, 3].map((index) => (
                        <input 
                          key={index} 
                          type="text" 
                          maxLength="1" 
                          required
                          ref={(el) => (otpRefs.current[index] = el)}
                          value={otpValues[index]}
                          onChange={(e) => handleOtpChange(index, e)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-14 h-16 sm:w-16 sm:h-16 text-center text-2xl font-black bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-[#F58634] focus:ring-2 focus:ring-[#F58634]/20 transition-all shadow-sm" 
                        />
                      ))}
                    </div>

                    <div className="text-center font-medium text-sm mt-6">
                      {canResend ? (
                        <p className="text-slate-600">
                          Didn't receive it? <button type="button" onClick={() => { setTimer(60); setCanResend(false); }} className="text-[#F58634] font-bold hover:underline">Click to resend</button>
                        </p>
                      ) : (
                        <p className="text-slate-600">
                          Resend code in <span className="text-slate-900 font-bold">00:{timer < 10 ? `0${timer}` : timer}</span>
                        </p>
                      )}
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-3.5 rounded-lg mt-8 hover:bg-black transition-all shadow-md">
                      Verify & Continue
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