import React from 'react';
import { LayoutDashboard, Users, Vote, Sparkles, Menu, X, Bell } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        currentView === view
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            GO<span className="text-blue-600">UNION</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Empowering Voices</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={View.MEMBERS} icon={Users} label="Members" />
          <NavItem view={View.VOTING} icon={Vote} label="Voting" />
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Assistance
            </p>
          </div>
          <NavItem view={View.ADVISOR} icon={Sparkles} label="AI Advisor" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@gounion.org</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-900">
            GO<span className="text-blue-600">UNION</span>
          </h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white pt-20 px-4 space-y-2">
             <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
             <NavItem view={View.MEMBERS} icon={Users} label="Members" />
             <NavItem view={View.VOTING} icon={Vote} label="Voting" />
             <NavItem view={View.ADVISOR} icon={Sparkles} label="AI Advisor" />
          </div>
        )}

        {/* Top Bar Desktop */}
        <header className="hidden md:flex bg-white border-b border-gray-200 h-16 px-8 items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentView === View.DASHBOARD && 'Dashboard Overview'}
            {currentView === View.MEMBERS && 'Member Management'}
            {currentView === View.VOTING && 'Voting Center'}
            {currentView === View.ADVISOR && 'AI Legal Advisor'}
          </h2>
          <div className="flex items-center gap-4">
             <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;