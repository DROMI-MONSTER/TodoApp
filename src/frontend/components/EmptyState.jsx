const EmptyState = ({ title, description, actionLabel, onAction }) => (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-700 dark:bg-slate-800 dark:text-slate-300">✦</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        {actionLabel ? (
            <button type="button" onClick={onAction} className="mt-6 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                {actionLabel}
            </button>
        ) : null}
    </div>
);

export default EmptyState;
