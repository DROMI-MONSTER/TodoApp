const Loader = ({ message = 'Loading...' }) => (
    <div className="flex min-h-55 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm">
        <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
            <p className="text-sm font-medium text-slate-600">{message}</p>
        </div>
    </div>
);

export default Loader;
