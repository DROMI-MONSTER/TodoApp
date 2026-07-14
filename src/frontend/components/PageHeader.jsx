const PageHeader = ({ eyebrow, title, description, actions }) => (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
);

export default PageHeader;
