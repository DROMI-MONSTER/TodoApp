import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createTodo, getTodos, updateTodo } from '../api/todo.js';
import LayoutShell from '../components/LayoutShell.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TodoForm from '../components/TodoForm.jsx';
import { useToast } from '../components/ToastProvider.jsx';

const CreateTodo = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editingId = searchParams.get('edit');
    const { success, error: toastError } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const loadTodo = async () => {
            if (!editingId) {
                setEditingTodo(null);
                return;
            }

            try {
                const todos = await getTodos();
                const todo = Array.isArray(todos) ? todos.find((item) => item._id === editingId) : null;
                if (todo) {
                    setEditingTodo(todo);
                } else {
                    setLoadError('The selected todo could not be loaded.');
                }
            } catch (err) {
                setLoadError(err.response?.data?.message || 'Unable to load the selected todo.');
            }
        };

        loadTodo();
    }, [editingId]);

    const handleSubmit = async (payload) => {
        setSubmitting(true);
        setLoadError('');

        try {
            if (editingId && editingTodo) {
                await updateTodo(editingTodo._id, payload);
                success('Todo updated', 'Your task has been refreshed.', 2400);
            } else {
                await createTodo(payload);
                success('Todo created', 'Your new task is ready to track.', 2400);
            }
            navigate('/todos');
        } catch (err) {
            toastError('Unable to save task', err.response?.data?.message || 'Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LayoutShell title="Create Todo">
            <PageHeader
                eyebrow="Workspace"
                title={editingId ? 'Edit todo' : 'Create a new todo'}
                description={editingId ? 'Refine the details of an existing task and keep your flow going.' : 'Capture a task in a calm, focused workspace designed for clarity.'}
                actions={[
                    <button key="cancel" type="button" onClick={() => navigate('/todos')} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>,
                ]}
            />

            {loadError ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{loadError}</div> : null}

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <TodoForm onSubmit={handleSubmit} isSubmitting={submitting} editingTodo={editingTodo} onCancelEdit={() => navigate('/todos')} />
            </div>
        </LayoutShell>
    );
};

export default CreateTodo;
