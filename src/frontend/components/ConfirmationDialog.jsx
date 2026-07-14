const ConfirmationDialog = ({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
                    <button type="button" onClick={onConfirm} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
