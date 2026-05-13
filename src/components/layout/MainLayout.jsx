import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme with HTML class for Tailwind v4
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
// ... keep state logic ...

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col">
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <div className="flex flex-1 relative">
        {/* Updated Mobile Overlay - z-index is lower than Header (100) but higher than Sidebar (90) contents if needed */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-[80] lg:hidden backdrop-blur-[2px]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileMenuOpen} 
        />
        
        <main className={`
          flex-1 transition-all duration-300 min-w-0 lg:pl-64 cghb-master-bg
          ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}>
          <div className="p-6 lg:p-10 relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// THIS IS THE LINE THAT WAS LIKELY MISSING:
export default MainLayout;