import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Layers,
  NotebookPen,
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
  ShieldCheck,
  Plus,
  Sparkles,
  Command,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const {
    logout,
    user,
    notifications,
    markNotificationsAsRead,
    markNotificationAsRead,
    searchQuery,
    setSearchQuery,
    calendarStatus,
    calendarEvents,
    connectCalendar,
    disconnectCalendar,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
  } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadNotifCount = (notifications || []).filter((n) => !n.read).length;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const menuSections = [
    {
      title: "CORE WORKSPACE",
      items: [
        { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
        { id: "projects", name: "Research Projects", icon: Layers },
        { id: "notebook", name: "Lab Notebook", icon: NotebookPen },
      ],
    },
    {
      title: "SCIENTIFIC TOOLS",
      items: [
        { id: "resources", name: "Resource Sharing", icon: Share2 },
        { id: "calculators", name: "Scientific Calculators", icon: Calculator },
        { id: "papers", name: "Research Papers", icon: BookOpen },
      ],
    },
    {
      title: "INTELLIGENCE & ADMIN",
      items: [
        { id: "analytics", name: "Bench Analytics", icon: BarChart3 },
        { id: "settings", name: "Settings & Logs", icon: Settings },
      ],
    },
  ];

  const getActiveTitle = () => {
    for (const section of menuSections) {
      const match = section.items.find((i) => i.id === activeTab);
      if (match) return match.name;
    }
    return "Research Space";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 antialiased font-sans selection:bg-teal-500 selection:text-white">
      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 shadow-sm
          ${sidebarCollapsed ? "w-20" : "w-64"} 
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:relative
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-150">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 shadow-md shadow-teal-500/20 text-white font-extrabold text-lg tracking-tight">
              I
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base tracking-tight text-slate-900 truncate">
                  Inveniq
                  <span className="text-teal-600 font-semibold">Lab</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 font-semibold tracking-wider">
                  RESEARCH ERP
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 rounded text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button (Expanded) */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => {
                setActiveTab("notebook");
                setMobileSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-2 text-xs font-bold shadow-sm shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Lab Entry</span>
            </button>
          </div>
        )}

        {/* Sidebar Navigation Items with Categorization */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-2.5 pb-1 text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={`w-full flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold tracking-normal transition-all relative group focus-ring cursor-pointer ${
                      isActive
                        ? "text-teal-700 font-bold bg-teal-50/80 shadow-xs"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-teal-600 rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <item.icon
                      className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                        isActive
                          ? "text-teal-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      } ${sidebarCollapsed ? "mx-auto" : "mr-3"}`}
                    />

                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left truncate">
                        {item.name}
                      </span>
                    )}

                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isActive
                            ? "bg-teal-100 text-teal-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Workspace Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navigation Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          {/* Left: Mobile trigger & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">
                Workspace
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-bold text-slate-900 flex items-center gap-2">
                {getActiveTitle()}
              </span>
            </div>
          </div>

          {/* Right: Search, Compliance Tag, Notifications, User */}
          <div className="flex items-center gap-3">
            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 relative transition-colors shadow-xs cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white font-extrabold text-[8px] h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          Lab Notifications
                        </span>
                        {unreadNotifCount > 0 && (
                          <span className="text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.2 rounded-full">
                            {unreadNotifCount} new
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={markNotificationsAsRead}
                        className="text-[10px] text-teal-600 hover:text-teal-700 font-bold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 no-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">
                          No notifications currently
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 rounded-xl border text-xs flex gap-2.5 transition-all ${
                              notif.read
                                ? "bg-slate-50/50 border-slate-100"
                                : "bg-teal-50/30 border-teal-150 shadow-xs"
                            }`}
                          >
                            <div className="h-6 w-6 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                              🔬
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-900 truncate">
                                {notif.title}
                              </div>
                              <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                                {notif.message}
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                                {notif.createdAt
                                  ? new Date(notif.createdAt).toLocaleString()
                                  : ""}
                              </span>
                              {!notif.read && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    markNotificationAsRead(notif.id)
                                  }
                                  className="text-[10px] text-teal-700 font-bold mt-1 cursor-pointer"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setCalendarOpen(!calendarOpen);
                  setNotificationsOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 relative transition-colors shadow-xs cursor-pointer"
                aria-label="View calendar"
              >
                <CalendarDays className="w-4 h-4" />
              </button>

              {/* Calendar Popover */}
              {calendarOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCalendarOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-teal-600" />
                        <span className="font-bold text-xs text-slate-900">
                          Lab Calendar
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCalendarOpen(false)}
                        className="text-[10px] text-teal-600 hover:text-teal-700 font-bold cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    {/* Calendar Content */}
                    <div className="mt-3">
                      {!calendarStatus.connected ? (
                        <button
                          type="button"
                          onClick={connectCalendar}
                          className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Connect Google Calendar
                        </button>
                      ) : (
                        <>
                          <div className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl p-3">
                            <span className="text-[10px] font-semibold text-teal-700 truncate">
                              {calendarStatus.email ||
                                "Google Calendar connected"}
                            </span>
                            <button
                              type="button"
                              onClick={disconnectCalendar}
                              className="text-[10px] text-rose-600 font-bold cursor-pointer"
                            >
                              Disconnect
                            </button>
                          </div>
                          <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                            {calendarEvents.length === 0 && (
                              <p className="text-xs text-slate-400 text-center py-4">
                                No upcoming events
                              </p>
                            )}
                            {calendarEvents.map((event) => (
                              <div
                                key={event.id}
                                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                              >
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {event.summary || "Untitled event"}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  {event.start?.dateTime
                                    ? new Date(
                                        event.start.dateTime,
                                      ).toLocaleString()
                                    : event.start?.date}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const summary = window.prompt(
                                        "Event title",
                                        event.summary || "",
                                      );
                                      if (summary)
                                        updateCalendarEvent(event.id, {
                                          summary,
                                          start: event.start.dateTime,
                                          end: event.end.dateTime,
                                        });
                                    }}
                                    className="text-[10px] text-teal-700 font-bold cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteCalendarEvent(event.id)
                                    }
                                    className="text-[10px] text-rose-600 font-bold cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const summary = window.prompt("Event title");
                              if (summary) {
                                const start = new Date(Date.now() + 3600000);
                                createCalendarEvent({
                                  summary,
                                  start: start.toISOString(),
                                  end: new Date(
                                    start.getTime() + 3600000,
                                  ).toISOString(),
                                });
                              }
                            }}
                            className="w-full mt-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Create Event
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar User Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-teal-200">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 hidden md:inline">
                  {user?.name
                    ? user.name.split(" ")[0] || user.name
                    : "Scientist"}
                </span>
              </button>

              {/* Profile dropdown */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs text-slate-700">
                    <div className="p-3 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {user?.email}
                      </p>
                      <p className="text-[9px] font-mono text-teal-600 font-semibold mt-1 truncate">
                        {user?.institution || "Genomics Lab"}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("settings");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Scientist Profile Settings
                      </button>
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
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

        {/* Main Content Render Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
