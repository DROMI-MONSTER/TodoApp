import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const pathMap = {
    '/': [{ label: 'Dashboard', to: '/' }],
    '/todos': [{ label: 'Dashboard', to: '/' }, { label: 'Todos', to: '/todos' }],
    '/create': [{ label: 'Dashboard', to: '/' }, { label: 'Create Todo', to: '/create' }],
    '/profile': [{ label: 'Dashboard', to: '/' }, { label: 'Profile', to: '/profile' }],
    '/settings': [{ label: 'Dashboard', to: '/' }, { label: 'Settings', to: '/settings' }],
};

const Breadcrumbs = () => {
    const location = useLocation();

    const segments = useMemo(() => {
        const pathname = location.pathname;
        if (pathMap[pathname]) return pathMap[pathname];

        const base = [{ label: 'Dashboard', to: '/' }];
        if (pathname.startsWith('/todos')) {
            const extra = pathname === '/todos' ? 'Todos' : pathname.split('/').filter(Boolean).slice(1).join(' / ');
            return [...base, { label: 'Todos', to: '/todos' }, { label: extra, to: pathname }];
        }

        return base;
    }, [location.pathname]);

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                return (
                    <div key={segment.to} className="flex items-center gap-2">
                        {index > 0 ? <span>/</span> : null}
                        {isLast ? <span className="font-medium text-slate-700 dark:text-slate-200">{segment.label}</span> : <Link to={segment.to} className="transition hover:text-slate-900 dark:hover:text-white">{segment.label}</Link>}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
