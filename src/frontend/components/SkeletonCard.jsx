const SkeletonCard = () => (
    <div className="animate-pulse rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
);

export default SkeletonCard;
