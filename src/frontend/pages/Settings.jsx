import LayoutShell from '../components/LayoutShell.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Settings = () => {
    const { theme, setTheme } = useTheme();

    return (
        <LayoutShell title="Settings">
            <PageHeader eyebrow="Preferences" title="Settings" description="Fine-tune the UI experience while keeping all backend behavior unchanged." />

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode to match your working environment.</p>
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme preference</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Saved locally so your choice persists across visits.</p>
                            </div>
                            <select value={theme} onChange={(event) => setTheme(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Session</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Authentication stays fully managed by the existing backend session flow.</p>
                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Active session detected.
                    </div>
                </div>
            </div>
        </LayoutShell>
    );
};

export default Settings;
