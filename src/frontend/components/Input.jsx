import { useState } from 'react';

const Input = ({ label, id, error, className = '', type = 'text', ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="w-full">
            {label ? (
                <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {label}
                </label>
            ) : null}
            <div className="relative">
                <input
                    id={id}
                    type={isPassword && showPassword ? 'text' : type}
                    className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''} ${className}`}
                    {...props}
                />
                {isPassword ? (
                    <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                ) : null}
            </div>
            {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
        </div>
    );
};

export default Input;
