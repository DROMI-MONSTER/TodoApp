import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LayoutShell from '../components/LayoutShell.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getTodos } from '../api/todo.js';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getTodos();
                setTodos(Array.isArray(data) ? data : []);
            } catch {
                setTodos([]);
            }
        };
        load();
    }, []);

    const stats = useMemo(() => {
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const pending = todos.length - completed;
        return { completed, pending, total: todos.length };
    }, [todos]);

    return (
        <LayoutShell title="Profile">
            <PageHeader
                eyebrow="Account"
                title={user?.name || 'Your profile'}
                description="A focused view of your account, session, and workspace activity."
                actions={[
                    <Link key="back" to="/" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Back to dashboard</Link>,
                    <button key="signout" type="button" onClick={() => { logout(); navigate('/login'); }} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">Logout</button>,
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                        {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">Account details</h2>
                    <dl className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                        <div>
                            <dt className="font-medium text-slate-900 dark:text-slate-100">Name</dt>
                            <dd className="mt-1">{user?.name || '—'}</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-slate-900 dark:text-slate-100">Email</dt>
                            <dd className="mt-1">{user?.email || '—'}</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-slate-900 dark:text-slate-100">Role</dt>
                            <dd className="mt-1">{user?.role || 'user'}</dd>
                        </div>
                    </dl>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Session status</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">You are authenticated through the backend session flow. Your access token is stored locally for the current browser session, while the refresh cookie is managed by the server.</p>
                        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                            Active session detected and ready to use.
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Workspace statistics</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Total todos</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{stats.completed}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutShell>
    );
};

export default Profile;
