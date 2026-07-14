import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const getPreferredTheme = () => {
    if (typeof window === 'undefined') return 'light';

    const storedTheme = window.localStorage.getItem('todo-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getPreferredTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        window.localStorage.setItem('todo-theme', theme);
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        setTheme,
        toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
