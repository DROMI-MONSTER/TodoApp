import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const navItems = [
    { to: '/', label: 'Dashboard', icon: '◫' },
    { to: '/todos', label: 'All Todos', icon: '▤' },
    { to: '/todos/completed', label: 'Completed', icon: '✓' },
    { to: '/todos/pending', label: 'Pending', icon: '◌' },
    { to: '/create', label: 'Create Todo', icon: '+' },
    { to: '/profile', label: 'Profile', icon: '◔' },
    { to: '/settings', label: 'Settings', icon: '⚙' },
];

const LayoutShell = ({ children, title }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [location.pathname]);

    const pageTitle = useMemo(() => title || 'Workspace', [title]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <div className="flex min-h-screen flex-col lg:flex-row">
                <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white/90 backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950/90 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <div className="flex h-full flex-col p-5">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">TodoFlow</p>
                                <h2 className="mt-1 text-lg font-semibold">Workspace</h2>
                            </div>
                            <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" aria-label="Close navigation">
                                ✕
                            </button>
                        </div>

                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === '/'}
                                    className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-sm font-semibold">{user?.name || 'Ready to work'}</p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email || ''}</p>
                            <button type="button" onClick={() => { logout(); navigate('/login'); }} className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                                Sign out
                            </button>
                        </div>
                    </div>
                </aside>

                <div className="flex-1">
                    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
                        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Open navigation">
                                    ☰
                                </button>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{pageTitle}</p>
                                    <h1 className="text-lg font-semibold">{pageTitle}</h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <label className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                    <span>⌕</span>
                                    <input type="search" placeholder="Search" className="w-24 bg-transparent outline-none sm:w-40" />
                                </label>
                                <button type="button" className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Notifications">
                                    🔔
                                </button>
                                <button type="button" onClick={toggleTheme} className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle theme">
                                    {theme === 'dark' ? '☀' : '☾'}
                                </button>
                                <div className="relative">
                                    <button type="button" onClick={() => setProfileOpen((current) => !current)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" aria-expanded={profileOpen} aria-haspopup="menu">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                                            {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-medium">{user?.name || 'User'}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || 'Member'}</p>
                                        </div>
                                    </button>

                                    {profileOpen ? (
                                        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900" role="menu">
                                            <Link to="/profile" className="flex items-center rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Profile</Link>
                                            <Link to="/settings" className="flex items-center rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Settings</Link>
                                            <button type="button" onClick={toggleTheme} className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Toggle theme</button>
                                            <button type="button" onClick={() => { logout(); navigate('/login'); }} className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/40">Logout</button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <Breadcrumbs />
                        </div>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LayoutShell;
