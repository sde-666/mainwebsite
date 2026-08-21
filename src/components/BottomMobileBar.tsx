import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, FileText, Bot, Menu, Sparkles } from 'lucide-react';
import { useAiAssistant } from '../context/AiAssistantContext';

export function BottomMobileBar() {
  const location = useLocation();
  const { openAssistant } = useAiAssistant();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'O Level', path: '/o-level', icon: BookOpen },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'Mock Test', path: '/mock-test', icon: GraduationCap },
  ];

  const toggleMobileMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-menu'));
  };

  return (
    <nav 
      aria-label="Mobile Navigation Bar" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-blue-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-blue-600 rounded-full"></span>
              )}
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* AI Guru Instant Assistant Tab */}
        <button
          type="button"
          onClick={() => openAssistant()}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-indigo-600 hover:text-indigo-800 transition-all active:scale-95 cursor-pointer relative"
          aria-label="Open AI Guru Doubt Solver"
        >
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-3 h-3" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight text-indigo-700">AI Guru</span>
        </button>

        {/* Hamburger Menu Trigger */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 hover:text-blue-600 transition-all active:scale-95 cursor-pointer"
          aria-label="Open Full Navigation Menu"
        >
          <Menu className="w-4.5 h-4.5 text-slate-700 stroke-[1.8px]" />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight text-slate-700">Menu</span>
        </button>
      </div>
    </nav>
  );
}
