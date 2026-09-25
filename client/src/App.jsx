import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const DashboardPage = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center">
            <div className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl mb-4">
                {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>

            <h1 className="text-xl font-semibold text-white">
                Welcome, {user?.username || 'Guest'}
            </h1>
            <p className="text-neutral-400 text-sm mt-1 mb-6">
                {user?.email || 'No email available'}
            </p>

            <button
                onClick={handleLogout}
                className="w-full bg-white hover:bg-neutral-200 text-black font-medium py-2 rounded text-sm cursor-pointer"
            >
                Sign Out
            </button>
        </div>
    );
};

const App = () => {
    return (
        <div className="bg-black min-h-screen text-white flex items-center justify-center p-4">
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
};

export default App;
