import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteTodo, getTodos, updateTodo } from '../api/todo.js';
import EmptyState from '../components/EmptyState.jsx';
import LayoutShell from '../components/LayoutShell.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import StatCard from '../components/StatCard.jsx';
import TodoCard from '../components/TodoCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState('');

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getTodos();
            setTodos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load todos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleDelete = async (todoId) => {
        setUpdatingId(todoId);
        setError('');

        try {
            await deleteTodo(todoId);
            setTodos((current) => current.filter((todo) => todo._id !== todoId));
            success('Todo deleted', 'The task has been removed from your workspace.');
        } catch (err) {
            toastError('Delete failed', err.response?.data?.message || 'Unable to delete the task.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleToggle = async (todo) => {
        setUpdatingId(todo._id);
        setError('');

        try {
            const response = await updateTodo(todo._id, {
                isCompleted: !todo.isCompleted,
                title: todo.title,
                description: todo.description,
                priority: todo.priority,
                tags: todo.tags || [],
                dueDate: todo.dueDate,
            });
            const updatedTodo = response.data?.data;
            setTodos((current) => current.map((entry) => (entry._id === updatedTodo._id ? updatedTodo : entry)));
            success(updatedTodo.isCompleted ? 'Task completed' : 'Task reopened', 'Your progress has been updated.');
        } catch (err) {
            toastError('Update failed', err.response?.data?.message || 'Unable to update the task.');
        } finally {
            setUpdatingId(null);
        }
    };

    const stats = useMemo(() => {
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const pending = todos.length - completed;
        const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0;
        return { completed, pending, total: todos.length, progress };
    }, [todos]);

    const recentTodos = useMemo(() => [...todos].slice(0, 4), [todos]);

    const upcomingDeadlines = useMemo(() => {
        return todos
            .filter((todo) => todo.dueDate)
            .map((todo) => ({ ...todo, dueDateValue: new Date(todo.dueDate) }))
            .sort((a, b) => a.dueDateValue - b.dueDateValue)
            .slice(0, 4);
    }, [todos]);

    const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <LayoutShell title="Dashboard">
            <PageHeader
                eyebrow="Overview"
                title={`Welcome back, ${user?.name || 'there'}`}
                description={`${todayLabel}. Your workspace is ${stats.progress}% complete.`}
                actions={[
                    <Link key="all" to="/todos" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">View all</Link>,
                    <button key="new" type="button" onClick={() => navigate('/create')} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">New todo</button>,
                ]}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total todos" value={stats.total} hint="All tasks tracked" icon="☰" accent="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" />
                <StatCard label="Completed" value={stats.completed} hint="Finished tasks" icon="✓" accent="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" />
                <StatCard label="Pending" value={stats.pending} hint="Still in progress" icon="◌" accent="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" />
                <StatCard label="Completion" value={`${stats.progress}%`} hint="Current momentum" icon="◔" accent="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-6">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Progress snapshot</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A calm overview of the work moving through your board.</p>
                            </div>
                        </div>
                        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Completion rate</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stats.progress}% of your workspace is complete.</p>
                                </div>
                                <div className="text-3xl font-semibold text-slate-900 dark:text-white">{stats.progress}%</div>
                            </div>
                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                <div className="h-full rounded-full bg-slate-900 transition-all dark:bg-slate-100" style={{ width: `${stats.progress}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming deadlines</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Stay ahead of the next milestone.</p>
                            </div>
                            <Link to="/todos" className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">View all</Link>
                        </div>

                        {loading ? (
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {Array.from({ length: 2 }).map((_, index) => <SkeletonCard key={index} />)}
                            </div>
                        ) : upcomingDeadlines.length === 0 ? (
                            <div className="mt-5"><EmptyState title="No upcoming deadlines" description="Add a due date to keep your plan on track." /></div>
                        ) : (
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {upcomingDeadlines.map((todo) => {
                                    const diffDays = Math.ceil((todo.dueDateValue - new Date()) / (1000 * 60 * 60 * 24));
                                    const isOverdue = diffDays < 0;
                                    const isToday = diffDays === 0;
                                    const isSoon = diffDays > 0 && diffDays <= 3;
                                    const badgeClass = isOverdue ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300' : isToday ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300' : isSoon ? 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200';
                                    return (
                                        <div key={todo._id} className={`rounded-2xl border p-4 ${badgeClass}`}>
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-medium">{todo.title}</p>
                                                    <p className="mt-1 text-sm opacity-80">{todo.dueDateValue.toLocaleDateString()}</p>
                                                </div>
                                                <span className="text-xs font-semibold uppercase tracking-[0.24em]">{isOverdue ? 'Overdue' : isToday ? 'Today' : `${diffDays}d left`}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent tasks</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The latest work in your flow.</p>
                            </div>
                            <Link to="/todos" className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">View all</Link>
                        </div>

                        {loading ? (
                            <div className="mt-5 space-y-3"><Loader message="Loading recent tasks..." /></div>
                        ) : recentTodos.length === 0 ? (
                            <div className="mt-5"><EmptyState title="No tasks yet" description="Create a new todo to start building momentum." actionLabel="Create task" onAction={() => navigate('/create')} /></div>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {recentTodos.map((todo) => (
                                    <div key={todo._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{todo.title}</p>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{todo.description || 'No description provided.'}</p>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${todo.isCompleted ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{todo.isCompleted ? 'Completed' : 'Pending'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Workspace actions</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Jump to the main task workspace.</p>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button type="button" onClick={() => navigate('/create')} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">Create new task</button>
                            <Link to="/todos" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Open todos</Link>
                            <Link to="/profile" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Open profile</Link>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your todos</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A compact view of your current list.</p>
                        {error ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{error}</div> : null}
                        {loading ? (
                            <div className="mt-5 space-y-4"><Loader message="Loading your todos..." /></div>
                        ) : todos.length === 0 ? (
                            <div className="mt-5"><EmptyState title="No tasks yet" description="Create a new todo to start building momentum." actionLabel="Create task" onAction={() => navigate('/create')} /></div>
                        ) : (
                            <div className="mt-5 space-y-4">
                                {todos.slice(0, 3).map((todo) => (
                                    <TodoCard key={todo._id} todo={todo} onToggle={handleToggle} onEdit={() => navigate(`/create?edit=${todo._id}`)} onDelete={handleDelete} updatingId={updatingId} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LayoutShell>
    );
};

export default Dashboard;
