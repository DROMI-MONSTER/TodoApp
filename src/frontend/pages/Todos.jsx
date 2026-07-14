import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteTodo, getTodos, updateTodo } from '../api/todo.js';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LayoutShell from '../components/LayoutShell.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TodoCard from '../components/TodoCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';

const Todos = () => {
    const { scope } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState(() => window.localStorage.getItem('todo-view-mode') || 'grid');
    const [selectedIds, setSelectedIds] = useState([]);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getTodos();
            setTodos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load your todos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    useEffect(() => {
        window.localStorage.setItem('todo-view-mode', viewMode);
    }, [viewMode]);

    const visibleTodos = useMemo(() => {
        const scoped = scope === 'completed' ? todos.filter((todo) => todo.isCompleted) : scope === 'pending' ? todos.filter((todo) => !todo.isCompleted) : todos;

        return scoped.filter((todo) => {
            const haystack = `${todo.title} ${todo.description} ${todo.priority || ''}`.toLowerCase();
            return haystack.includes(search.toLowerCase()) && (filter === 'all' || filter === todo.priority || filter === (todo.isCompleted ? 'completed' : 'pending'));
        });
    }, [filter, scope, search, todos]);

    const handleDelete = async (todoId) => {
        setUpdatingId(todoId);
        try {
            await deleteTodo(todoId);
            setTodos((current) => current.filter((todo) => todo._id !== todoId));
            setSelectedIds((current) => current.filter((id) => id !== todoId));
            success('Todo deleted', 'The task has been removed from your workspace.');
        } catch (err) {
            toastError('Delete failed', err.response?.data?.message || 'Unable to delete the task.');
        } finally {
            setUpdatingId(null);
            setPendingDeleteId(null);
        }
    };

    const handleToggle = async (todo) => {
        setUpdatingId(todo._id);
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

    const toggleSelection = (todoId) => {
        setSelectedIds((current) => (current.includes(todoId) ? current.filter((id) => id !== todoId) : [...current, todoId]));
    };

    const handleBulkComplete = async () => {
        if (!selectedIds.length) return;
        setUpdatingId('bulk');

        try {
            const updates = await Promise.all(selectedIds.map((id) => {
                const todo = todos.find((item) => item._id === id);
                return updateTodo(id, {
                    isCompleted: true,
                    title: todo.title,
                    description: todo.description,
                    priority: todo.priority,
                    tags: todo.tags || [],
                    dueDate: todo.dueDate,
                });
            }));
            const refreshed = updates.map((response) => response.data?.data).filter(Boolean);
            setTodos((current) => current.map((todo) => {
                const match = refreshed.find((item) => item._id === todo._id);
                return match ? match : todo;
            }));
            setSelectedIds([]);
            success('Tasks completed', `${refreshed.length} selected tasks are now complete.`);
        } catch (err) {
            toastError('Bulk update failed', err.response?.data?.message || 'Unable to update selected tasks.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <LayoutShell title="Todos">
            <PageHeader
                eyebrow="Operations"
                title={scope === 'completed' ? 'Completed todos' : scope === 'pending' ? 'Pending todos' : 'All todos'}
                description={`Showing ${visibleTodos.length} task${visibleTodos.length === 1 ? '' : 's'} for ${user?.name || 'your workspace'}.`}
                actions={[
                    <button key="create" type="button" onClick={() => navigate('/create')} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">New todo</button>,
                    <button key="refresh" type="button" onClick={fetchTodos} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Refresh</button>,
                ]}
            />

            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                        <span>⌕</span>
                        <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent outline-none sm:w-64" placeholder="Search tasks" />
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {selectedIds.length ? (
                            <button type="button" onClick={handleBulkComplete} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">Complete selected ({selectedIds.length})</button>
                        ) : null}
                        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                            <option value="all">All priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <select value={scope || 'all'} onChange={(event) => navigate(`/todos/${event.target.value === 'all' ? '' : event.target.value}`)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                            <option value="all">All tasks</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                        <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
                            <button type="button" onClick={() => setViewMode('grid')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${viewMode === 'grid' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>Grid</button>
                            <button type="button" onClick={() => setViewMode('list')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${viewMode === 'list' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>List</button>
                        </div>
                    </div>
                </div>

                {error ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{error}</div> : null}

                {loading ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => <Loader key={index} message="" />)}
                    </div>
                ) : visibleTodos.length === 0 ? (
                    <div className="mt-6"><EmptyState title="Nothing to show here" description="Try changing your filter or create a new task to see it appear here." actionLabel="Create task" onAction={() => navigate('/create')} /></div>
                ) : (
                    <div className={`mt-6 ${viewMode === 'grid' ? 'grid gap-4 xl:grid-cols-2' : 'space-y-4'}`}>
                        {visibleTodos.map((todo) => (
                            <TodoCard key={todo._id} todo={todo} onToggle={handleToggle} onEdit={() => navigate(`/create?edit=${todo._id}`)} onDelete={() => setPendingDeleteId(todo._id)} updatingId={updatingId} showSelection selected={selectedIds.includes(todo._id)} onSelect={toggleSelection} />
                        ))}
                    </div>
                )}
            </div>
            <ConfirmationDialog open={Boolean(pendingDeleteId)} title="Delete todo" description="This action cannot be undone. The task will be removed from your workspace." confirmLabel="Delete" onConfirm={() => handleDelete(pendingDeleteId)} onCancel={() => setPendingDeleteId(null)} />
        </LayoutShell>
    );
};

export default Todos;
