import { useEffect, useMemo, useState } from 'react';
import Input from './Input.jsx';

const initialState = {
    title: '',
    description: '',
    priority: 'low',
    tags: '',
    dueDate: '',
};

const TodoForm = ({ onSubmit, isSubmitting, editingTodo, onCancelEdit }) => {
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        if (editingTodo) {
            setForm({
                title: editingTodo.title || '',
                description: editingTodo.description || '',
                priority: editingTodo.priority || 'low',
                tags: editingTodo.tags?.join(', ') || '',
                dueDate: editingTodo.dueDate ? editingTodo.dueDate.slice(0, 10) : '',
            });
        } else {
            setForm(initialState);
        }
    }, [editingTodo]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            title: form.title.trim(),
            description: form.description.trim() || 'No Discription',
            priority: form.priority,
            tags: form.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            dueDate: form.dueDate || undefined,
        };

        onSubmit(payload);
    };

    const formTitle = useMemo(() => (editingTodo ? 'Update todo' : 'Create a todo'), [editingTodo]);

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">{formTitle}</h2>
                    <p className="text-sm text-slate-500">Capture the task details and keep momentum going.</p>
                </div>
                {editingTodo ? (
                    <button type="button" onClick={onCancelEdit} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                        Cancel
                    </button>
                ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Input
                    label="Title"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Design the dashboard"
                    required
                />
                <div className="md:col-span-2">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Add context, notes, or next steps"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                </div>
                <div>
                    <label htmlFor="priority" className="mb-2 block text-sm font-medium text-slate-700">
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <Input label="Tags" id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="work, urgent" />
                <Input label="Due date" id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
            </div>

            <div className="mt-5 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !form.title.trim()}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isSubmitting ? 'Saving...' : editingTodo ? 'Update todo' : 'Create todo'}
                </button>
            </div>
        </form>
    );
};

export default TodoForm;
