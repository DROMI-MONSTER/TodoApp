const StatCard = ({ label, value, hint, icon, accent }) => (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>{icon}</div>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
);

export default StatCard;
