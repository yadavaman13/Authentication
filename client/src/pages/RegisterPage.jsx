import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { loading, error, handleRegister } = useAuth();
    const navigate = useNavigate();

    async function handleFormSubmit(e) {
        e.preventDefault();
        try {
            await handleRegister({ username, email, password });
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration failed:', err);
        }
    }

    return (
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-white mb-4 text-center">Create Account</h1>

            {error && (
                <div className="mb-4 p-2.5 bg-neutral-800 border border-neutral-700 text-red-400 text-xs rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                <div>
                    <label htmlFor="username" className="block text-xs text-neutral-400 mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                        className="w-full px-3 py-2 bg-black border border-neutral-700 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs text-neutral-400 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-3 py-2 bg-black border border-neutral-700 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs text-neutral-400 mb-1">
                        Password
                    </label>
                    <div className="relative flex items-center">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full pl-3 pr-9 py-2 bg-black border border-neutral-700 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 text-neutral-400 hover:text-white cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full py-2 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-center text-xs text-neutral-400 mt-2">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
