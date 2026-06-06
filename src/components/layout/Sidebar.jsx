import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, LayoutGrid, Settings, ChevronLeft, ChevronRight, 
  FolderPlus, Users, ClipboardList, HardHat, Files, 
  FileCheck, ChevronDown, LogOut, Activity, PieChart,
  ClipboardCheck
} from 'lucide-react';

// Import Auth Tools
import { useAuth } from '../../context/AuthContext';
import { ROLE_PERMISSIONS, ROLES } from '../../utils/roles';

// Note: Added setIsMobileOpen to props so we can control closing the mobile menu
const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { userRole } = useAuth();

  // Helper function to check if the current user has access to a specific menu key
  const hasAccess = (permissionKey) => {
    if (!ROLE_PERMISSIONS[userRole]) return true;
    
    // Strict check for admin approval (relies entirely on roles.js)
    if (permissionKey === 'administrative-approval') {
      return ROLE_PERMISSIONS[userRole].includes(permissionKey);
    }
    
    // Fallback for work-progress and reports in case they aren't in roles.js yet
    return ROLE_PERMISSIONS[userRole].includes(permissionKey) || 
           ['work-progress', 'reports'].includes(permissionKey);
  };

  const handleLogout = () => {
    navigate('/login'); 
    handleMobileClose();
  };

  // Closes the sidebar ONLY if we are in mobile view
  const handleMobileClose = () => {
    if (isMobileOpen && typeof setIsMobileOpen === 'function') {
      setIsMobileOpen(false);
    }
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
              {userRole ? userRole.replace('_', ' ') : 'LOADING...'}
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

      {/* 2. NAVIGATION LINKS - STRICTLY REORDERED */}
      <nav className={`flex-1 px-4 space-y-1 overflow-x-hidden overflow-y-auto ${isMobileOpen ? 'pt-8' : 'pt-6'}`}>
        
        {/* 1. Dashboard */}
        {hasAccess('dashboard') && (
          <NavItem onClick={handleMobileClose} to="/dashboard" icon={<Home size={18} />} label="Dashboard" active={location.pathname === '/dashboard'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}
        
        {/* 2. Create Project / Projects (Dynamic Label) */}
        {hasAccess('create-project') && (
          <NavItem 
            onClick={handleMobileClose} 
            to="/dashboard/create-project" 
            icon={<FolderPlus size={18} />} 
            label={userRole === ROLES.COMMISSIONER ? 'Projects' : 'Create Project'} 
            active={location.pathname === '/dashboard/create-project'} 
            collapsed={isMobileOpen ? false : isCollapsed} 
          />
        )}

        {/* 3. Administrative Approval */}
        {hasAccess('administrative-approval') && (
          <NavItem onClick={handleMobileClose} to="/dashboard/administrative-approval" icon={<ClipboardCheck size={18} />} label="Administrative Approval" active={location.pathname === '/dashboard/administrative-approval'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {/* 4. Technical Sanction */}
        {hasAccess('technical-sanction') && (
          <NavItem onClick={handleMobileClose} to="/dashboard/technical-sanction" icon={<FileCheck size={18} />} label="Technical Sanction" active={location.pathname === '/dashboard/technical-sanction'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {/* 5. Tender */}
        {hasAccess('tender') && (
          <NavAccordion 
            icon={<ClipboardList size={18} />} label="Tender" collapsed={isMobileOpen ? false : isCollapsed} forceExpand={() => setIsCollapsed(false)} currentPath={location.pathname}
            onLinkClick={handleMobileClose}
            items={[
              { label: 'NIT Approval', to: '/dashboard/tender/nit-approval' },
              { label: 'Advertisement', to: '/dashboard/tender/advertisement' },
              { label: 'Tender Rate Approval', to: '/dashboard/tender/rate-approval' },
            ]}
          />
        )}

        {/* 6. Site Visit */}
        {hasAccess('site-visit') && (
          <NavItem onClick={handleMobileClose} to="/dashboard/site-visit" icon={<HardHat size={18} />} label="Site Visit" active={location.pathname === '/dashboard/site-visit'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {/* 7. Work Progress */}
        {hasAccess('work-progress') && (
          <NavItem onClick={handleMobileClose} to="/dashboard/work-progress" icon={<Activity size={18} />} label="Work Progress" active={location.pathname === '/dashboard/work-progress'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {/* 8. Documentation */}
        {hasAccess('documentation') && (
          <NavItem onClick={handleMobileClose} to="/dashboard/documentation" icon={<Files size={18} />} label="Documentation" active={location.pathname === '/dashboard/documentation'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {/* 9. Schemes */}
        {hasAccess('schemes') && (
          <NavItem onClick={handleMobileClose} to="/dashboard/schemes" icon={<LayoutGrid size={18} />} label="Schemes" active={location.pathname === '/dashboard/schemes'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {/* 10. Engineers */}
        {hasAccess('engineers') && (
          <NavItem onClick={handleMobileClose} to="/dashboard/engineers" icon={<Users size={18} />} label="Engineers" active={location.pathname === '/dashboard/engineers'} collapsed={isMobileOpen ? false : isCollapsed} />
        )}

        {/* 11. Reports */}
        {hasAccess('reports') && (
          <NavAccordion 
            icon={<PieChart size={18} />} label="Reports" collapsed={isMobileOpen ? false : isCollapsed} forceExpand={() => setIsCollapsed(false)} currentPath={location.pathname}
            onLinkClick={handleMobileClose}
            items={[
              { label: 'Site Reports', to: '/dashboard/reports/site' },
              { label: 'Financial Reports', to: '/dashboard/reports/financial' },
              { label: 'Audit Logs', to: '/dashboard/reports/audit' },
            ]}
          />
        )}

      </nav>

      {/* 3. SETTINGS & LOGOUT */}
      <div className="p-4 border-t border-cghb-border mt-2 space-y-1">
        <NavItem 
          onClick={handleMobileClose}
          to="/dashboard/settings" 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={location.pathname === '/dashboard/settings'} 
          collapsed={isMobileOpen ? false : isCollapsed} 
        />
        
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
const NavItem = ({ icon, label, to, active = false, collapsed = false, onClick }) => (
  <Link 
    to={to}
    onClick={onClick}
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
const NavAccordion = ({ icon, label, items, currentPath, collapsed, forceExpand, onLinkClick }) => {
  const isActive = items.some(item => currentPath === item.to);
  const [isOpen, setIsOpen] = useState(isActive);

  const handleToggle = () => {
    if (collapsed) {
      forceExpand();
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
            <div className="pl-4 pr-2 py-1 mt-1 border-l-2 border-cghb-border/50 ml-[22px] space-y-1">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onLinkClick} // Closes sidebar ONLY when a sub-item is clicked
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