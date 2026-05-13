import { Sun, Moon, Languages, Menu, X } from 'lucide-react';

const Header = ({ isDarkMode, setIsDarkMode, toggleMobileMenu, isMobileMenuOpen }) => {
  return (
    <header className="h-16 lg:h-20 border-b border-cghb-border bg-[var(--color-bg-main)]/80 backdrop-blur-md sticky top-0 z-[100] px-4 lg:px-10 flex items-center justify-between">
      
      {/* MOBILE LEFT: Toggle + Logo */}
      <div className="flex items-center gap-4">
        <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-[var(--color-text-main)]">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* WIDER LOGO CONTAINER */}
        <div className="flex items-center">
          <img 
            /* Dynamic Image Source based on Dark Mode */
            src={isDarkMode ? "/image/CGHBwhite.png" : "/image/CGHBblack.png"} 
            alt="CGHB Logo" 
            className="h-8 lg:h-10 w-auto object-contain transition-opacity duration-300" 
          />
        </div>
      </div>

      {/* UTILITIES: Language & Theme */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-[var(--color-text-muted)] hover:text-cghb-yellow transition-colors">
          <Languages size={20} />
        </button>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-[var(--color-text-muted)] hover:text-cghb-yellow transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User - Hidden on Mobile */}
        <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-cghb-border">
          <p className="text-sm font-black text-[var(--color-text-main)]">Vikas Vishwakarma S.</p>
          <div className="w-10 h-10 rounded-full bg-cghb-yellow/20 border border-cghb-yellow/50 overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=V+V&background=FACC15&color=000" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;