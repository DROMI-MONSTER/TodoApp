import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Loader from './components/Loader.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Todos = lazy(() => import('./pages/Todos.jsx'));
const CreateTodo = lazy(() => import('./pages/CreateTodo.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <Suspense fallback={<Loader message="Loading experience..." />}>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/create" element={<CreateTodo />} />
                                    <Route path="/todos/new" element={<Navigate to="/create" replace />} />
                                    <Route path="/todos" element={<Todos />} />
                                    <Route path="/todos/:scope" element={<Todos />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                                </Route>
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
