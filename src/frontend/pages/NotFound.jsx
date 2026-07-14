import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">404</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">The page you are looking for does not exist or has moved.</p>
            <Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                Go back home
            </Link>
        </div>
    </div>
);

export default NotFound;
