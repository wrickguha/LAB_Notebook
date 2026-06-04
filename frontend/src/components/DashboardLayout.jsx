import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Layers,
  Beaker,
  CheckSquare,
  Share2,
  Calculator,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  User,
  X,
  FileText
} from 'lucide-react';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const { logout, user, notifications, markNotificationsAsRead, searchQuery, setSearchQuery } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', name: 'Projects', icon: Layers },
    { id: 'notebook', name: 'Lab Notebook', icon: Beaker },
    { id: 'resources', name: 'Resource Sharing', icon: Share2 },
    { id: 'calculators', name: 'Calculators', icon: Calculator },
    { id: 'papers', name: 'Research Papers', icon: BookOpen },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings & Logs', icon: Settings },
  ];

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.name : 'Workspace';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:relative
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/85">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20 text-white font-extrabold text-lg">
              L
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                LAB<span className="text-blue-600 font-medium">Notebook</span>
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 rounded text-slate-400 hover:bg-slate-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all group ${
                  isActive
                    ? 'bg-blue-50 border-l-2 border-blue-600 text-blue-650'
                    : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-4.5 w-4.5 mr-3 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                }`} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Panel */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button 
              onClick={logout}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-500 hover:text-red-650 py-2 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 z-30">
          
          <div className="flex items-center gap-3 flex-1">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md text-slate-650 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <h1 className="text-base sm:text-lg font-bold text-slate-900 hidden sm:block">
              {getPageTitle()}
            </h1>

            {/* Global Search Bar */}
            <div className="relative max-w-xs w-full ml-4 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
              <input
                type="text"
                placeholder="Search experiments, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 hover:border-slate-300 rounded-xl py-1.5 pl-9 pr-4 text-xs font-medium text-slate-600 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right utility items */}
          <div className="flex items-center gap-4">
            
            {/* Search Input for Mobile/Tablet */}
            <div className="relative md:hidden max-w-[150px] sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-2 text-xs font-medium text-slate-600"
              />
            </div>

            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 relative transition-colors shadow-sm"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white font-extrabold text-[8px] h-4 w-4 rounded-full flex items-center justify-center border border-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="font-bold text-xs text-slate-800">Research Notifications</span>
                      <button 
                        onClick={markNotificationsAsRead}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-2.5 rounded-xl border text-xs flex gap-2.5 transition-all ${
                              notif.read ? 'bg-slate-50/50 border-slate-100' : 'bg-blue-50/20 border-blue-100 shadow-sm'
                            }`}
                          >
                            <span className="mt-0.5">🔔</span>
                            <div>
                              <div className="font-bold text-slate-800">{notif.title}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</div>
                              <span className="text-[9px] text-slate-400 mt-1 block">{notif.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs font-semibold text-slate-700 hidden lg:inline">{user.name.split(' ')[1]}</span>
              </button>

              {/* Profile dropdown */}
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs text-slate-750">
                    <div className="p-3 border-b border-slate-100">
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-450">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => { setActiveTab('settings'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg font-medium text-slate-650 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5" />
                        My Profile Settings
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium text-slate-650 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Content Render Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 grid-bg">
          {children}
        </main>
      </div>

    </div>
  );
}
