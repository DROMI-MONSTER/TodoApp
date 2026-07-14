import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Signup = () => {
    const { signup, isAuthenticated, loading, error, setError } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess('');

        try {
            await signup({
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                role: form.role,
            });
            setSuccess('Account created. Check your email for verification and then sign in.');
            setForm({ name: '', email: '', password: '', role: 'user' });
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const helperText = useMemo(() => 'Use at least 8 characters with one uppercase letter and one number.', []);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
            <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
                <div className="grid lg:grid-cols-[1fr_1.05fr]">
                    <div className="bg-slate-900 px-8 py-10 text-white sm:px-10 lg:px-12">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Start fresh</p>
                        <h1 className="mt-4 text-3xl font-semibold">Create your account</h1>
                        <p className="mt-4 text-sm leading-7 text-slate-300">Registration uses the backend validation for name, email, password, and role, so the experience stays perfectly aligned with the server.</p>
                        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-800/70 p-5 text-sm text-slate-300">
                            <p className="font-medium text-white">Requirements</p>
                            <ul className="mt-3 space-y-2">
                                <li>• Name between 2 and 50 characters</li>
                                <li>• Valid email address</li>
                                <li>• Password with uppercase and number</li>
                            </ul>
                        </div>
                    </div>

                    <div className="px-8 py-10 sm:px-10 lg:px-12">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Join TodoFlow</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}
                            {success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
                            <Input label="Name" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Alex Morgan" required />
                            <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="alex@example.com" required />
                            <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" required />
                            <div>
                                <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                                    Role
                                </label>
                                <select id="role" name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" disabled={submitting || loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                                {submitting ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-slate-900 hover:underline dark:text-white">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
