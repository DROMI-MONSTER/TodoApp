import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
    const { login, isAuthenticated, loading, error, setError } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setError(null);
    }, [setError]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            await login({ email: form.email.trim().toLowerCase(), password: form.password });
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const pageHeading = useMemo(() => 'Sign in to your workspace', []);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
            <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="bg-slate-900 px-8 py-12 text-white sm:px-10 lg:px-12">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Todo workspace</p>
                        <h1 className="mt-4 text-3xl font-semibold">{pageHeading}</h1>
                        <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">Keep your plans organized with a calm, professional workspace that stays aligned with your backend session workflow.</p>
                        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-800/70 p-5 text-sm text-slate-300">
                            <p className="font-medium text-white">What you get</p>
                            <ul className="mt-3 space-y-2">
                                <li>• Secure sign-in</li>
                                <li>• Organized task views</li>
                                <li>• Smooth mobile experience</li>
                            </ul>
                        </div>
                    </div>

                    <div className="px-8 py-10 sm:px-10 lg:px-12">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use your email and password to continue.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}
                            <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                            <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" required />
                            <button type="submit" disabled={submitting || loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                                {submitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            New here?{' '}
                            <Link to="/signup" className="font-semibold text-slate-900 hover:underline dark:text-white">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
