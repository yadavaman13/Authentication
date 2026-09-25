import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const RegisterPage = () => {
    const { loading, handleRegister } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleFormSubmit(e) {
        e.preventDefault();
        await handleRegister({ username, email, password });
        console.log('Registered Successfully');
    }

    return (
        <div>
            <form
                onSubmit={(e) => {
                    handleFormSubmit(e);
                }}
            >
                <input
                    onInput={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    required
                />

                <input
                    onInput={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                />

                <input
                    onInput={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                />

                <button type="submit">Sign Up</button>

                <p>
                    Already have an account ? <Link to="/login">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
