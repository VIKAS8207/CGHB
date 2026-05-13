import { useState } from 'react';
// 1. Added useNavigate to the imports
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Added Activity and PieChart for the new menu items
import { 
  Home, LayoutGrid, Settings, ChevronLeft, ChevronRight, 
  FolderPlus, Users, ClipboardList, HardHat, Files, 
  FileCheck, ChevronDown, LogOut, Activity, PieChart 
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_PERMISSIONS } from '../../utils/roles';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const { userRole } = useAuth();

  // Helper function to check if the current user has access to a specific menu key
  const hasAccess = (permissionKey) => {
    // If the permission key doesn't exist in roles, default to true for the sake of the new menus
    // Adjust this logic if you add 'work-progress' and 'reports' to your roles.js
    return ROLE_PERMISSIONS[userRole]?.includes(permissionKey) || permissionKey === 'work-progress' || permissionKey === 'reports';
  };

  // Logout Handler
  const handleLogout = () => {
    // You can also clear local storage or reset auth context here in the future
    navigate('/login'); 
  };

  return (
  <aside className={`fixed left-0 top-16 lg:top-20 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] glass-panel border-r flex flex-col transition-all duration-300 ease-in-out z-[90] ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'} ${!isMobileOpen && isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
      
      {/* 1. TOP TOGGLE SECTION */}
      <div className={`hidden lg:flex items-center px-4 py-3 border-b border-cghb-border min-h-[50px] transition-all ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
            <span className="text-[10px] font-black tracking-[0.3em] text-[var(--color-text-muted)] uppercase">
              Menu
            </span>
            <span className="px-2 py-0.5 rounded bg-cghb-yellow/20 text-cghb-yellow border border-cghb-yellow/30 text-[9px] font-black uppercase tracking-widest">
              {userRole.replace('_', ' ')}
            </span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-cghb-border/20 text-[var(--color-text-muted)] hover:text-cghb-yellow transition-all"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className={`flex-1 px-4 space-y-1 overflow-x-hidden overflow-y-auto ${isMobileOpen ? 'pt-8' : 'pt-6'}`}>
        
        {hasAccess('dashboard') && (
          <NavItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" active={location.pathname === '/dashboard'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}
        
        {hasAccess('create-project') && (
          <NavItem to="/dashboard/create-project" icon={<FolderPlus size={18} />} label="Create Project" active={location.pathname === '/dashboard/create-project'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {hasAccess('engineers') && (
          <NavItem to="/dashboard/engineers" icon={<Users size={18} />} label="Engineers" active={location.pathname === '/dashboard/engineers'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}
        
        {hasAccess('tender') && (
          <NavAccordion icon={<ClipboardList size={18} />} label="Tender" collapsed={isMobileOpen ? false : isCollapsed} forceExpand={() => setIsCollapsed(false)} currentPath={location.pathname}
            items={[
              { label: 'NIT Approval', to: '/dashboard/tender/nit-approval' },
              { label: 'Advertisement', to: '/dashboard/tender/advertisement' },
              { label: 'Tender Float', to: '/dashboard/tender/float' },
              { label: 'Tender Rate Approval', to: '/dashboard/tender/rate-approval' },
              { label: 'Tender Agreement', to: '/dashboard/tender/agreement' },
            ]}
          />
        )}

        {hasAccess('site-visit') && (
          <NavItem to="/dashboard/site-visit" icon={<HardHat size={18} />} label="Site Visit" active={location.pathname === '/dashboard/site-visit'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {hasAccess('documentation') && (
          <NavItem to="/dashboard/documentation" icon={<Files size={18} />} label="Documentation" active={location.pathname === '/dashboard/documentation'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {hasAccess('schemes') && (
          <NavItem to="/dashboard/schemes" icon={<LayoutGrid size={18} />} label="Schemes" active={location.pathname === '/dashboard/schemes'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {hasAccess('technical-sanction') && (
          <NavItem to="/dashboard/technical-sanction" icon={<FileCheck size={18} />} label="Technical Sanction" active={location.pathname === '/dashboard/technical-sanction'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {hasAccess('work-progress') && (
          <NavItem to="/dashboard/work-progress" icon={<Activity size={18} />} label="Work Progress" active={location.pathname === '/dashboard/work-progress'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {hasAccess('reports') && (
          <NavAccordion icon={<PieChart size={18} />} label="Reports" collapsed={isMobileOpen ? false : isCollapsed} forceExpand={() => setIsCollapsed(false)} currentPath={location.pathname}
            items={[
              { label: 'Site Reports', to: '/dashboard/reports/site' },
              { label: 'Financial Reports', to: '/dashboard/reports/financial' },
              { label: 'Audit Logs', to: '/dashboard/reports/audit' },
            ]}
          />
        )}

      </nav>

      {/* 3. SETTINGS & LOGOUT */}
      {/* Wrapped in a space-y-1 to keep spacing consistent */}
      <div className="p-4 border-t border-cghb-border mt-2 space-y-1">
        <NavItem 
          to="/dashboard/settings" 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={location.pathname === '/dashboard/settings'} 
          collapsed={isMobileOpen ? false : isCollapsed} 
        />
        
        {/* --- LOGOUT BUTTON --- */}
        <button 
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all relative group overflow-hidden
            text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500
          `}
        >
          <div className="min-w-[24px] flex justify-center shrink-0">
            <LogOut size={18} />
          </div>
          <span className={`
            text-[13px] font-bold whitespace-nowrap transition-all duration-300
            ${(isMobileOpen ? false : isCollapsed) ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}
          `}>
            Logout
          </span>
        </button>

      </div>
    </aside>
  );
};

// --- SINGLE LINK COMPONENT ---
const NavItem = ({ icon, label, to, active = false, collapsed = false }) => (
  <Link 
    to={to}
    className={`
      flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all relative group overflow-hidden
      ${active 
        ? 'bg-cghb-yellow text-black font-bold shadow-sm' 
        : 'text-[var(--color-text-muted)] hover:bg-cghb-border/20 hover:text-[var(--color-text-main)]'}
    `}
  >
    <div className="min-w-[24px] flex justify-center shrink-0">{icon}</div>
    <span className={`
      text-[13px] font-bold whitespace-nowrap transition-all duration-300
      ${collapsed ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}
    `}>
      {label}
    </span>
  </Link>
);

// --- ACCORDION COMPONENT FOR SUB-MENUS ---
const NavAccordion = ({ icon, label, items, currentPath, collapsed, forceExpand }) => {
  // Check if any child route is currently active
  const isActive = items.some(item => currentPath === item.to);
  const [isOpen, setIsOpen] = useState(isActive);

  const handleToggle = () => {
    if (collapsed) {
      forceExpand(); // Expands the sidebar automatically if collapsed
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="flex flex-col">
      <button 
        onClick={handleToggle}
        className={`
          flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all group overflow-hidden w-full
          ${isActive && !isOpen
            ? 'bg-cghb-yellow/10 text-[var(--color-text-main)] font-bold' 
            : 'text-[var(--color-text-muted)] hover:bg-cghb-border/20 hover:text-[var(--color-text-main)]'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-[24px] flex justify-center shrink-0">{icon}</div>
          <span className={`
            text-[13px] font-bold whitespace-nowrap transition-all duration-300
            ${collapsed ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}
          `}>
            {label}
          </span>
        </div>
        
        {!collapsed && (
          <ChevronDown 
            size={14} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>

      {/* Expandable Menu Items */}
      <AnimatePresence>
        {isOpen && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Left border tree-view styling. REDUCED pl-9 to pl-4 for closer gap */}
            <div className="pl-4 pr-2 py-1 mt-1 border-l-2 border-cghb-border/50 ml-[22px] space-y-1">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    block text-[12px] font-bold py-1.5 px-3 rounded-md transition-all
                    ${currentPath === item.to 
                      ? 'bg-cghb-yellow text-black' 
                      : 'text-[var(--color-text-muted)] hover:bg-cghb-border/10 hover:text-[var(--color-text-main)]'}
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;