import { memo } from 'react';

const TodoCard = memo(function TodoCard({ todo, onToggle, onEdit, onDelete, updatingId, showSelection = false, selected = false, onSelect }) {
    const isUpdating = updatingId === todo._id;

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    {showSelection ? (
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => onSelect(todo._id)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                            aria-label={`Select ${todo.title}`}
                        />
                    ) : null}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className={`text-lg font-semibold ${todo.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                {todo.title}
                            </h3>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600">
                                {todo.priority || 'low'}
                            </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{todo.description || 'No description provided.'}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onToggle(todo)}
                        disabled={isUpdating}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${todo.isCompleted ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        {todo.isCompleted ? 'Completed' : 'Pending'}
                    </button>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {todo.tags?.length ? todo.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {tag}
                    </span>
                )) : null}
            </div>

            <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'}</span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(todo)}
                        className="rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(todo._id)}
                        disabled={isUpdating}
                        className="rounded-lg px-3 py-2 font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
});

export default TodoCard;
