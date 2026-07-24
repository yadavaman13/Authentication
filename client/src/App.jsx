import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthContext } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const DashboardPage = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden text-center">
      <div className="relative z-10 space-y-6">
        <div className="w-20 h-20 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center mx-auto shadow-lg text-white font-bold text-3xl">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome, {user?.username || "Guest"}!
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            {user?.email || "No email available"}
          </p>
        </div>

        <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-xl text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Security Status
          </h2>
          <p className="text-neutral-200 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
            Authenticated & Verified
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white hover:bg-neutral-200 text-black font-medium py-3 rounded-xl transition-all duration-300 transform active:scale-[0.98] focus:outline-none"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className='bg-[#0A0A0A] min-h-screen w-full flex items-center justify-center font-sans text-white p-4 selection:bg-indigo-500 selection:text-white'>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App